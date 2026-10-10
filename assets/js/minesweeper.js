/* ==========================================================================
   Minesweeper — a browser port of github.com/AnasGhazi/Minesweeper
   (C++/CLI + Windows Forms). Same boards, sprites, sounds and rules:
   reactive face, flag counter, 999s timer, flood fill, game-over reveal
   and a top-5 leaderboard per difficulty (kept in this browser).
   Web additions: the first click is always safe, the face restarts at any
   time, and touch players can long-press or use flag mode to flag.
   ========================================================================== */
(() => {
  "use strict";

  // [cols, rows, original cell size in px, mines] — straight from MyForm's constructor.
  const MODES = {
    easy: { label: "Easy", cols: 9, rows: 9, cell: 52, mines: 10 },
    medium: { label: "Medium", cols: 16, rows: 16, cell: 40, mines: 40 },
    death: { label: "DEATH", cols: 30, rows: 16, cell: 30, mines: 99 },
  };
  const ASSETS = "assets/minesweeper/";
  const MIN_CELL = 22;

  const store = {
    get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const pad3 = (n) => (n >= 0 ? String(Math.min(n, 999)).padStart(3, "0") : String(n));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  function mount(root) {
    root.innerHTML = `
      <div class="ms">
        <div class="ms__bar">
          <div class="ms__modes" role="group" aria-label="Difficulty">${Object.entries(MODES)
            .map(([id, m]) => `<button type="button" class="ms__btn lbl" data-mode="${id}">${m.label}</button>`)
            .join("")}</div>
          <div class="ms__opts">
            <button type="button" class="ms__btn lbl" data-flagmode aria-pressed="false">flag mode</button>
            <button type="button" class="ms__btn lbl" data-sound aria-pressed="false">sound off</button>
          </div>
        </div>
        <div class="ms__stage">
          <div class="ms__win">
            <div class="ms__head">
              <img class="ms__back" src="${ASSETS}back.png" alt="">
              <output class="ms__lcd ms__flags" aria-label="Mines left">000</output>
              <button type="button" class="ms__face" aria-label="New game"></button>
              <output class="ms__lcd ms__time" aria-label="Seconds">000</output>
            </div>
            <div class="ms__grid" role="grid" aria-label="Minefield"></div>
          </div>
        </div>
        <div class="ms__foot">
          <p class="ms__hint lbl">left-click to reveal · right-click or long-press to flag · click the face for a new board</p>
          <div class="ms__board">
            <p class="lbl ms__board-title"></p>
            <ol class="ms__scores"></ol>
            <form class="ms__name" hidden>
              <label class="lbl" for="ms-name">new best time — your name</label>
              <div><input id="ms-name" maxlength="16" value="Anonymous" autocomplete="nickname"><button type="submit" class="ms__btn lbl">submit</button></div>
            </form>
          </div>
        </div>
      </div>`;

    const $ = (s) => root.querySelector(s);
    const stage = $(".ms__stage"), win = $(".ms__win"), grid = $(".ms__grid");
    const face = $(".ms__face"), flagsOut = $(".ms__flags"), timeOut = $(".ms__time");
    const modeBtns = [...root.querySelectorAll("[data-mode]")];
    const flagBtn = $("[data-flagmode]"), soundBtn = $("[data-sound]");
    const nameForm = $(".ms__name"), nameInput = $("#ms-name");

    let mode = store.get("ms-mode", "easy");
    if (!MODES[mode]) mode = "easy";
    let sound = store.get("ms-sound", false);
    let flagMode = false;
    let cells, mined, opened, flags, over, started, seconds, timer, pendingTime;

    /* ---- sound ---- */
    const play = (name) => {
      if (!sound) return;
      const a = new Audio(ASSETS + name + ".m4a");
      a.volume = 0.5;
      a.play().catch(() => {});
    };
    const syncSound = () => {
      soundBtn.textContent = sound ? "sound on" : "sound off";
      soundBtn.setAttribute("aria-pressed", sound);
    };

    /* ---- board ---- */
    const M = () => MODES[mode];
    const idx = (r, c) => r * M().cols + c;
    const neighbours = (i) => {
      const { cols, rows } = M(), r = Math.floor(i / cols), c = i % cols, out = [];
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push(idx(rr, cc));
        }
      return out;
    };

    function setFace(name) { face.style.backgroundImage = `url("${ASSETS}${name}.png")`; }

    function fit() {
      const { cols, rows, cell } = M();
      const avail = stage.clientWidth - 2;
      const size = Math.max(MIN_CELL, Math.min(cell, Math.floor(avail / (cols + 2))));
      win.style.setProperty("--c", size + "px");
      win.style.setProperty("--cols", cols);
      win.style.setProperty("--rows", rows);
    }

    function newGame() {
      const { cols, rows, mines } = M();
      clearInterval(timer);
      cells = []; mined = null; opened = 0; flags = 0; over = false; started = false; seconds = 0;
      grid.innerHTML = "";
      const frag = document.createDocumentFragment();
      for (let i = 0; i < cols * rows; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ms__c";
        b.dataset.i = i;
        b.setAttribute("aria-label", `row ${Math.floor(i / cols) + 1}, column ${(i % cols) + 1}`);
        frag.append(b);
        cells.push({ el: b, mine: false, adj: 0, open: false, flag: false });
      }
      grid.append(frag);
      flagsOut.textContent = pad3(mines);
      timeOut.textContent = pad3(0);
      setFace("happy");
      nameForm.hidden = true;
      modeBtns.forEach((b) => b.setAttribute("aria-pressed", b.dataset.mode === mode));
      fit();
      renderScores();
    }

    // Mines go down on the first reveal so the opening click (and its neighbours) are safe.
    function layMines(safe) {
      const { mines } = M();
      const banned = new Set([safe, ...neighbours(safe)]);
      if (cells.length - banned.size < mines) {
        banned.clear();
        banned.add(safe);
      }
      let placed = 0;
      while (placed < mines) {
        const i = Math.floor(Math.random() * cells.length);
        if (cells[i].mine || banned.has(i)) continue;
        cells[i].mine = true;
        placed++;
      }
      cells.forEach((c, i) => { c.adj = neighbours(i).filter((n) => cells[n].mine).length; });
      mined = true;
    }

    function startClock() {
      if (started) return;
      started = true;
      timer = setInterval(() => {
        if (seconds < 999) seconds++;
        timeOut.textContent = pad3(seconds);
      }, 1000);
    }

    function show(i) {
      const c = cells[i];
      c.open = true;
      c.el.className = "ms__c is-open " + (c.adj ? "n" + c.adj : "n0");
      c.el.setAttribute("aria-label", c.adj ? `${c.adj} mines nearby` : "empty");
      opened++;
    }

    function reveal(i) {
      const c = cells[i];
      if (over || c.open || c.flag) return;
      if (!mined) layMines(i);
      startClock();
      if (c.mine) return lose(i);
      // Iterative flood fill (the original recursed through expose_adj).
      const stack = [i];
      while (stack.length) {
        const k = stack.pop(), cell = cells[k];
        if (cell.open || cell.flag || cell.mine) continue;
        show(k);
        if (cell.adj === 0) neighbours(k).forEach((n) => { if (!cells[n].open) stack.push(n); });
      }
      play("expose_cell");
      if (opened === cells.length - M().mines) winGame();
    }

    function toggleFlag(i) {
      const c = cells[i];
      if (over || c.open) return;
      startClock();
      c.flag = !c.flag;
      flags += c.flag ? 1 : -1;
      c.el.classList.toggle("is-flag", c.flag);
      c.el.setAttribute("aria-label", c.flag ? "flagged" : "hidden");
      flagsOut.textContent = pad3(M().mines - flags);
    }

    function lose(i) {
      over = true;
      clearInterval(timer);
      setFace("dead");
      // As in game_over(): every mine is shown, the one you hit in red, flagged mines crossed out.
      cells.forEach((c, k) => {
        if (!c.mine) return;
        c.el.className = "ms__c is-open " + (k === i ? "mr" : c.flag ? "mx" : "m");
      });
      play("game_over");
    }

    function winGame() {
      over = true;
      clearInterval(timer);
      setFace("win");
      play("win");
      const list = scores();
      if (list.length < 5 || seconds < list[list.length - 1].time) {
        pendingTime = seconds;
        nameForm.hidden = false;
        nameInput.select();
      }
    }

    /* ---- leaderboard (top 5 per difficulty, this browser only) ---- */
    const scores = () => store.get("ms-lb-" + mode, []);
    function renderScores() {
      const list = scores();
      $(".ms__board-title").textContent = `best times · ${M().label}`;
      $(".ms__scores").innerHTML = list.length
        ? list.map((s) => `<li><span>${esc(s.name)}</span><span>${pad3(s.time)}s</span></li>`).join("")
        : `<li class="ms__empty"><span>no wins yet</span><span>—</span></li>`;
    }
    nameForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const list = scores();
      list.push({ name: nameInput.value.trim() || "Anonymous", time: pendingTime });
      list.sort((a, b) => a.time - b.time);
      store.set("ms-lb-" + mode, list.slice(0, 5));
      nameForm.hidden = true;
      renderScores();
    });

    /* ---- input ---- */
    const cellIndex = (e) => {
      const b = e.target.closest(".ms__c");
      return b ? +b.dataset.i : -1;
    };
    let press = null;

    grid.addEventListener("pointerdown", (e) => {
      if (over || cellIndex(e) < 0) return;
      setFace("scared");
      if (e.pointerType !== "mouse") {
        const i = cellIndex(e);
        press = { i, done: false, t: setTimeout(() => { press.done = true; toggleFlag(i); navigator.vibrate?.(15); }, 420) };
      }
    });
    const release = () => {
      if (!over) setFace("happy");
      if (press && !press.done) clearTimeout(press.t);
    };
    addEventListener("pointerup", release);
    addEventListener("pointercancel", release);
    grid.addEventListener("pointerleave", () => { if (press && !press.done) clearTimeout(press.t); });

    grid.addEventListener("click", (e) => {
      const i = cellIndex(e);
      if (i < 0) return;
      if (press?.done) { press = null; return; }
      press = null;
      flagMode ? toggleFlag(i) : reveal(i);
    });
    grid.addEventListener("contextmenu", (e) => {
      const i = cellIndex(e);
      if (i < 0) return;
      e.preventDefault();
      if (press?.done) return;
      toggleFlag(i);
    });
    grid.addEventListener("keydown", (e) => {
      const i = cellIndex(e);
      if (i >= 0 && (e.key === "f" || e.key === "F")) { e.preventDefault(); toggleFlag(i); }
    });

    face.addEventListener("click", newGame);
    modeBtns.forEach((b) => b.addEventListener("click", () => {
      mode = b.dataset.mode;
      store.set("ms-mode", mode);
      play("start");
      newGame();
    }));
    flagBtn.addEventListener("click", () => {
      flagMode = !flagMode;
      flagBtn.setAttribute("aria-pressed", flagMode);
    });
    soundBtn.addEventListener("click", () => {
      sound = !sound;
      store.set("ms-sound", sound);
      syncSound();
      play("start");
    });
    addEventListener("resize", fit);

    syncSound();
    newGame();
  }

  window.Games = Object.assign(window.Games || {}, { minesweeper: mount });
})();
