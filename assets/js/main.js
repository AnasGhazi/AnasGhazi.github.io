/* ==========================================================================
   Ghazi. — site behaviour
   Renders every page from content.js, then wires up the intro, page
   transitions, clocks, theme, menu, carousel, filters and lightbox.
   ========================================================================== */
(() => {
  "use strict";

  const S = window.SITE;
  const root = document.documentElement;
  const page = root.dataset.page;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad2 = (n) => String(n).padStart(2, "0");
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const storage = (type) => ({
    get: (k) => { try { return window[type].getItem(k); } catch { return null; } },
    set: (k, v) => { try { window[type].setItem(k, v); } catch {} },
    del: (k) => { try { window[type].removeItem(k); } catch {} },
  });
  const local = storage("localStorage");
  const session = storage("sessionStorage");

  /* ---------- media ---------- */

  // Any image or video that fails to load is swapped for a labelled placeholder.
  const ph = (src, cls = "fill", r = "") =>
    `<div class="ph ${cls}"${r ? ` style="--r:${r}"` : ""}><span class="ph__mark"></span>` +
    `<span class="lbl ph__label">${src ? `add ${esc(src)}` : "no media yet"}</span></div>`;

  window.phFail = (el) => {
    if (!el || !el.isConnected) return;
    const src = el.tagName === "VIDEO" ? $("source", el)?.getAttribute("src") : el.getAttribute("src");
    const t = document.createElement("template");
    t.innerHTML = ph(src, el.classList.contains("fill") ? "fill" : "", el.dataset.r || "");
    el.replaceWith(t.content.firstElementChild);
  };

  const img = (src, { alt = "", cls = "fill", r = "", eager = false, focus = "" } = {}) =>
    src
      ? `<img class="${cls}" src="${esc(src)}"${focus ? ` style="object-position:${esc(focus)}"` : ""} alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${r ? ` data-r="${r}"` : ""} onerror="phFail(this)">`
      : ph(src, cls, r);

  const vid = (src, { poster = "" } = {}) =>
    src
      ? `<video class="fill" muted loop playsinline autoplay preload="auto"${poster ? ` poster="${esc(poster)}"` : ""} onloadedmetadata="this.parentNode.style.setProperty('--va', this.videoWidth + ' / ' + this.videoHeight)"><source src="${esc(src)}" onerror="phFail(this.parentNode)"></video>`
      : ph(src);

  // YouTube / Vimeo links become embeds; anything else is treated as a video file.
  const embed = (url, poster) => {
    const allow = 'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"';
    let m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return `<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}?rel=0" title="Video" ${allow}></iframe>`;
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return `<iframe src="https://player.vimeo.com/video/${m[1]}?dnt=1" title="Video" ${allow}></iframe>`;
    // Local demos play muted on a loop, with controls, at their own aspect ratio.
    return `<video class="fill" controls muted autoplay loop playsinline preload="metadata"${poster ? ` poster="${esc(poster)}"` : ""} onloadedmetadata="this.parentNode.style.setProperty('--va', this.videoWidth + ' / ' + this.videoHeight)"><source src="${esc(url)}" onerror="phFail(this.parentNode)"></video>`;
  };

  /* ---------- small templates ---------- */

  const NAV = [["home", "index.html"], ["works", "works.html"], ["pm", "pm.html"], ["about", "about.html"], ["contact", "contact.html"]];
  const current = page === "work" ? "works" : page;
  const workUrl = (p) => `work.html?p=${encodeURIComponent(p.slug)}`;
  const linkFor = (p) => workUrl(p) + (p.game ? "#play" : "");
  const ctaFor = (p) => (p.game ? "play now" : "learn more");
  const playBadge = (p) =>
    p.game
      ? `<span class="play" aria-hidden="true"><img class="play__face" src="assets/minesweeper/happy.png" alt=""><span><span class="play__t">play now</span><span class="lbl">playable in your browser</span></span></span>`
      : "";

  const roll = (t) => `<span class="roll" data-text="${esc(t)}"><span>${esc(t)}</span></span>`;
  const btn = (t, href, cls = "") => `<a class="btn ${cls}" href="${href}" data-text="${esc(t)}"><span>${esc(t)}</span></a>`;
  const tags = (list = []) => `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  const facts = (rows = []) =>
    `<dl class="facts">${rows.map(([k, v]) => `<div><dt class="lbl muted">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
  const socials = () =>
    S.socials
      .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener"><span>${esc(s.label)}</span><span aria-hidden="true">↗</span></a></li>`)
      .join("");
  const head = (kicker, title, tag = "h2", cls = "h-xl") =>
    `<div class="sec-head" data-reveal><p class="lbl kicker">${esc(kicker)}</p>` +
    `<${tag}${cls ? ` class="${cls}"` : ""}><span class="mask"><span>${esc(title)}</span></span></${tag}></div>`;
  const section = (inner, cls = "sec") => `<section class="${cls}"><div class="g"><div class="frame">${inner}</div></div></section>`;

  // A project's cover: its looping video if it has one (poster = cover), else the cover image.
  // `play` picks who starts it: "data-inview" (plays while on screen) or the showcase's own logic.
  const coverMedia = (p, play = "data-inview") =>
    p.coverVideo
      ? `<video class="fill" muted loop playsinline preload="none"${p.cover ? ` poster="${esc(p.cover)}"` : ""} ${play}><source src="${esc(p.coverVideo)}" onerror="phFail(this.parentNode)"></video>`
      : img(p.cover, { alt: p.title });
  const liveLabel = "visit site ↗";

  const card = (p, i) => `
    <article class="card" data-cat="${esc(p.category)}">
      <a class="card__media${p.coverStyle === "comic" ? " comic" : ""}" href="${linkFor(p)}" data-cursor="${p.game ? "play" : "view"}" tabindex="-1" aria-hidden="true">${coverMedia(p)}${playBadge(p)}</a>
      <div class="card__body">
        <div class="card__row lbl"><span>${pad2(i + 1)}</span><span>${esc(p.year)}</span></div>
        <h3 class="card__title">${esc(p.title)}</h3>
        <p class="card__type">${esc(p.type)}</p>
        ${tags(p.tags)}
        <div class="card__ctas">
          ${btn(ctaFor(p), linkFor(p), "btn--sm" + (p.game ? " btn--play" : ""))}
          ${p.live ? `<a class="btn btn--sm" href="${esc(p.live)}" target="_blank" rel="noopener" data-text="${liveLabel}"><span>${liveLabel}</span></a>` : ""}
        </div>
      </div>
    </article>`;

  const badge = () => `
    <svg class="badge" viewBox="0 0 200 200" aria-hidden="true">
      <defs><path id="badge-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs>
      <g class="spin"><text><textPath href="#badge-path" textLength="486" lengthAdjust="spacing">${esc(S.badgeText)}</textPath></text></g>
      <circle cx="100" cy="100" r="44"/><circle class="dot" cx="100" cy="100" r="7"/>
    </svg>`;

  // Home "selected works": pinned panel with thumbnails, the active project's card, and the
  // cut-out figure whose TV screen plays the active cover.
  const showcaseHtml = (list) => `
    <section class="show" style="--n:${list.length}" aria-label="Selected works">
      <div class="show__pin">
        <div class="show__grid">
          <div class="show__head" data-reveal>
            <div><div><p class="lbl kicker">selected</p><h2 class="h-xl"><span class="mask"><span>works.</span></span></h2></div>
            <p class="lbl show__count"><span data-show-count>01</span> / ${pad2(list.length)}</p></div>
          </div>
          <ol class="show__thumbs">${list
            .map((p, i) => `<li><button class="show__thumb${p.coverStyle === "comic" ? " comic" : ""}" type="button" data-show="${i}" aria-label="Show ${esc(p.title)}">${img(p.cover, { alt: "" })}${p.game ? `<span class="show__playtag lbl">▶ play</span>` : ""}</button></li>`)
            .join("")}</ol>
          <div class="show__card">${list
            .map((p, i) => `
            <div class="show__slide" data-slide="${i}">
              <div class="show__info">
                <div class="show__top"><h3 class="show__title"><span>${esc(p.title)}</span></h3><span class="lbl show__type">${esc(p.type)}</span></div>
                ${tags(p.tags)}
                <div class="show__links">
                  ${p.live ? `<a class="show__more" href="${esc(p.live)}" target="_blank" rel="noopener">${roll(liveLabel)}</a>` : ""}
                  <a class="show__more" href="${linkFor(p)}">${roll(ctaFor(p) + " >")}</a>
                </div>
              </div>
              <a class="show__media${p.coverStyle === "comic" ? " comic" : ""}" href="${linkFor(p)}" data-cursor="${p.game ? "play" : "view"}" tabindex="-1" aria-hidden="true">${coverMedia(p, "data-show-video")}${playBadge(p)}</a>
            </div>`)
            .join("")}</div>
          <div class="show__figure">
            <img class="show__fig" src="${esc(S.figure)}" alt="${esc(S.fullName)} holding an old television" onerror="this.parentNode.remove()">
            ${list.map((p, i) => (p.cover ? `<img class="tv" data-tv="${i}" src="${esc(p.cover)}" alt="" loading="lazy" onerror="this.remove()">` : "")).join("")}
            <span class="tv tv--lines" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </section>`;

  // Media tile on a services row: a looping video, a still, or a project's cover.
  // Videos load nothing until scrolled into view (see inview()).
  const svcMedia = (s) => {
    const p = s.project ? S.projects.find((x) => x.slug === s.project) : null;
    const href = s.link || (p ? linkFor(p) : "");
    const focus = s.focus ? ` style="object-position:${esc(s.focus)}"` : "";
    const inner = s.video
      ? `<video class="fill" muted loop playsinline preload="none" data-inview${s.poster ? ` poster="${esc(s.poster)}"` : ""}${focus}><source src="${esc(s.video)}" onerror="phFail(this.parentNode)"></video>`
      : img(s.image || p?.cover, { alt: "", focus: s.focus });
    const cls = `svc__media${p?.coverStyle === "comic" && !s.video && !s.image ? " comic" : ""}`;
    return href
      ? `<a class="${cls}" href="${esc(href)}" data-cursor="${p?.game ? "play" : "view"}" aria-label="${esc(p ? `${ctaFor(p)}: ${p.title}` : `more on ${s.title}`)}">${inner}${p ? playBadge(p) : ""}</a>`
      : `<div class="${cls}">${inner}</div>`;
  };

  // "want to chat?": copy + button beside a photo, then a full-bleed video strip.
  // A page can pass its own image (and focus) to swap the photo for that page only.
  const chat = (over = {}) => {
    const c = { ...S.chat, ...over };
    return `
      <section class="sec chat-sec">
        <div class="g"><div class="frame">
          ${head("want to", "chat?")}
          <div class="chat">
            <div class="chat__text" data-reveal="fade"><p>${esc(c.text)}</p>${btn("contact me", "contact.html")}</div>
            <div class="chat__img">${img(c.image, { alt: `${S.fullName} at an event`, focus: c.imageFocus })}</div>
          </div>
        </div></div>
        ${c.video ? `<div class="chat__band"><video class="fill" muted loop playsinline preload="none" data-inview aria-hidden="true"><source src="${esc(c.video)}" onerror="phFail(this.parentNode)"></video></div>` : ""}
      </section>`;
  };

  /* ---------- pages ---------- */

  const pages = {
    home() {
      const letters = [...S.wordmark].map((ch, i) => `<span style="--i:${i}" aria-hidden="true">${esc(ch)}</span>`).join("");
      const featured = S.projects.filter((p) => p.featured);
      const list = featured.length ? featured : S.projects;
      const band = `<span>view all works</span><span class="sep">/</span>`.repeat(8);
      return `
        <section class="hero">
          <div class="g hero__media">
            <div class="hero__video">${vid(S.hero.video, { poster: S.hero.poster })}</div>
            <div class="hero__portrait">
              <div>${img(S.hero.portrait, { alt: S.fullName, eager: true, focus: S.hero.portraitFocus })}</div>
              <h1 class="hero__name" aria-label="${esc(S.fullName)}">${letters}</h1>
            </div>
          </div>
          <div class="g hero__bottom">
            <ul class="hero__roles">${S.roles.map((r, i) => `<li style="--i:${i}">${esc(r)}</li>`).join("")}</ul>
            <div class="hero__intro">
              <p class="lbl kicker">hello.</p>
              <p class="hero__lead">${esc(S.intro?.text)}</p>
              ${S.intro?.link ? `<a class="hero__more lbl" href="${esc(S.intro.link.url)}">${roll(S.intro.link.label + " →")}</a>` : ""}
            </div>
            <div class="hero__badge">${badge()}</div>
          </div>
        </section>
        ${showcaseHtml(list)}
        ${section(`
          ${head("selected", "works.").replace("</div>", `${img(S.figure, { alt: "", cls: "show-m__fig" })}</div>`)}
          <div class="carousel" data-reveal="fade">
            <div class="track">${list.map(card).join("")}</div>
            <div class="carousel__nav">
              <span class="carousel__count lbl" data-count></span>
              <div><button class="arrow" type="button" data-prev aria-label="Previous project">←</button><button class="arrow" type="button" data-next aria-label="Next project">→</button></div>
            </div>
          </div>`, "sec show-m")}
        <div class="g"><div class="frame"><a class="band" href="works.html" aria-label="View all works"><div class="marquee" aria-hidden="true"><div>${band}</div><div>${band}</div></div></a></div></div>
        <section class="sec svcs-sec">
          <div class="g"><div class="frame">${head("what i do", "services.")}</div></div>
          <div class="svcs">${S.services
            .map((s, i) => `
            <article class="svc">
              <p class="lbl svc__n">${pad2(i + 1)}</p>
              <h3 class="svc__t" data-reveal><span class="mask"><span>${esc(s.title)}</span></span></h3>
              <ul class="lbl svc__items" data-reveal="fade">${s.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
              ${svcMedia(s)}
            </article>`)
            .join("")}</div>
        </section>
        ${chat()}`;
    },

    works() {
      const count = (id) => (id === "all" ? S.projects.length : S.projects.filter((p) => p.category === id).length);
      const filters = [{ id: "all", label: "All" }, ...S.categories]
        .map((c) => `<button class="filter lbl" type="button" data-filter="${esc(c.id)}" aria-pressed="${c.id === "all"}">${esc(c.label)}<sup>${count(c.id)}</sup></button>`)
        .join("");
      return (
        section(`${head("all", "works.", "h1", "")}<div class="filters">${filters}</div><div class="wgrid">${S.projects.map(card).join("")}</div>`, "page-head") +
        chat()
      );
    },

    work() {
      const slug = new URLSearchParams(location.search).get("p");
      const idx = Math.max(0, S.projects.findIndex((p) => p.slug === slug));
      const p = S.projects[idx];
      const next = S.projects[(idx + 1) % S.projects.length];
      const cat = S.categories.find((c) => c.id === p.category)?.label || p.category;
      const ratios = ["4 / 5", "3 / 2", "1 / 1", "2 / 3", "3 / 2", "4 / 5"];
      document.title = `${p.title} — ${S.wordmark}`;
      return (
        section(`
          <div class="sec-head" data-reveal>
            <a class="back lbl" href="works.html">${roll("← all works")}</a>
            <p class="lbl kicker">${esc(p.type)}</p>
            <h1><span class="mask"><span>${esc(p.title)}</span></span></h1>
          </div>
          <div class="meta">
            <div><span class="lbl muted">year</span><span>${esc(p.year)}</span></div>
            <div><span class="lbl muted">category</span><span>${esc(cat)}</span></div>
            <div><span class="lbl muted">type</span><span>${esc(p.type)}</span></div>
            <div><span class="lbl muted">tags</span>${tags(p.tags)}</div>
          </div>
          ${p.game
            ? `<div class="player player--game" id="play" data-game="${esc(p.game)}"></div>`
            : `<div class="player">${p.video ? embed(p.video, p.poster || p.cover) : img(p.cover, { alt: p.title, eager: true })}</div>`}
          <div class="story">
            <p class="story__lead" data-reveal="fade">${esc(p.summary)}</p>
            <div class="story__body" data-reveal="fade">
              <div>${(p.description || []).map((t) => `<p>${esc(t)}</p>`).join("")}</div>
              ${p.credits?.length ? `<div><span class="lbl muted">details</span>${facts(p.credits)}</div>` : ""}
              ${p.links?.length ? `<div class="links">${p.links.map((l) => `<a class="btn btn--sm" href="${esc(l.url)}" target="_blank" rel="noopener" data-text="${esc(l.label)} ↗"><span>${esc(l.label)} ↗</span></a>`).join("")}</div>` : ""}
            </div>
          </div>
          ${p.gallery?.length ? `<div class="gallery" data-n="${p.gallery.length}">${p.gallery
            .map((src, i) => `<button class="gallery__item" type="button" data-cursor="view" aria-label="Enlarge image ${i + 1}">${img(src, { alt: `${p.title} — ${i + 1}`, cls: "", r: ratios[i % ratios.length] })}</button>`)
            .join("")}</div>` : ""}
          ${S.projects.length > 1 ? `<a class="next" href="${workUrl(next)}"><div><p class="lbl muted">next project</p><h2>${esc(next.title)}</h2></div><span class="next__arrow" aria-hidden="true">→</span></a>` : ""}`,
          "page-head"
        ) + chat()
      );
    },

    pm() {
      const d = S.pm;
      const related = S.projects.filter((p) => p.category === "pm" || p.slug === "unity-game-mvp");
      document.title = `project management — ${S.wordmark}`;
      return (
        section(`
          ${head("project", "management.", "h1", "")}
          <p class="pm-lead" data-reveal="fade">${esc(d.lead)}</p>
          <div class="stats">${d.stats
            .map(([n, l]) => `<div class="stat" data-reveal="fade"><span class="stat__n">${esc(n)}</span><span class="lbl">${esc(l)}</span></div>`)
            .join("")}</div>`, "page-head") +
        section(`
          ${head("the", "roles.")}
          ${d.roles
            .map((r) => `
            <article class="role">
              <header class="role__head" data-reveal="fade"><p class="lbl muted">${esc(r.period)}</p><h3>${esc(r.title)}</h3><p>${esc(r.company)}</p></header>
              <div class="role__body">${r.clients
                .map((c) => `
                <div class="client" data-reveal="fade">
                  <h4>${esc(c.name)}</h4>
                  <p class="lbl muted">${esc(c.note)}</p>
                  ${c.intro ? `<p class="client__intro">${esc(c.intro)}</p>` : ""}
                  <ul class="client__items">${c.items.map(([t, x]) => `<li><strong>${esc(t)}</strong><span>${esc(x)}</span></li>`).join("")}</ul>
                </div>`)
                .join("")}</div>
            </article>`)
            .join("")}`) +
        section(`
          ${head("how i run", "delivery.")}
          <div class="practices">${d.practices
            .map(([t, x], i) => `<div class="practice" data-reveal="fade"><p class="lbl">${pad2(i + 1)}</p><h3>${esc(t)}</h3><p>${esc(x)}</p></div>`)
            .join("")}</div>`) +
        section(`
          ${head("core", "skills.")}
          <div class="pm-skills" data-reveal="fade">${tags(d.skills)}</div>
          <ol class="timeline">${d.education.map(([y, t, x]) => `<li data-reveal="fade"><span class="lbl">${esc(y)}</span><h3>${esc(t)}</h3><p>${esc(x)}</p></li>`).join("")}</ol>`) +
        section(`${head("pm", "projects.")}<div class="wgrid">${related.map(card).join("")}</div>`) +
        chat()
      );
    },

    about() {
      const a = S.about;
      const x = a.experience;
      // Each word of the tagline darkens as it scrolls up the screen (see fillWords()).
      const words = a.tagline.split(" ").map((w) => `<span>${esc(w)}</span>`).join(" ");
      return (
        `<section class="ab-hero g">
          <div class="ab-hero__word" data-reveal><p class="lbl kicker">${esc(a.kicker)}</p><h1><span class="mask"><span>${esc(a.title)}</span></span></h1></div>
          <div class="ab-hero__img">${img(a.heroImage, { alt: S.fullName, eager: true, focus: a.heroFocus })}</div>
        </section>
        <section class="ab-me g">
          <div class="ab-me__left">
            <div data-reveal><p class="lbl kicker">${esc(a.greeting)}</p><h2><span class="mask"><span>This is me.</span></span></h2></div>
            <div class="ab-me__img">${img(a.meImage, { alt: `${S.fullName} walking into the sea at sunrise`, focus: a.meFocus })}</div>
          </div>
          <div class="ab-me__right">
            <p class="ab-tag" data-fill>${words}</p>
            <div class="ab-body" data-reveal="fade">${a.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}${btn("get in touch", "contact.html")}</div>
          </div>
        </section>
        <section class="ab-xp g">
          <ol class="ab-xp__list">${x.roles
            .map((r) => `
            <li class="xp" data-reveal="fade">
              <span class="xp__when">${esc(r.period)}</span>
              <div>
                <h3>${esc(r.title)}</h3>
                <p class="xp__meta">${r.url ? `<a class="xp__co" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.company)}</a>` : `<span class="xp__co">${esc(r.company)}</span>`}${[r.place, r.type].filter(Boolean).map((m) => `<span class="xp__sep">·</span><span>${esc(m)}</span>`).join("")}</p>
              </div>
            </li>`)
            .join("")}</ol>
          <div class="ab-xp__side">
            <div data-reveal><p class="lbl kicker">${esc(x.kicker)}</p><h2><span class="mask"><span>${esc(x.title)}</span></span></h2></div>
            <div class="ab-xp__img">${img(x.image, { alt: S.fullName, focus: x.focus })}</div>
          </div>
        </section>` +
        chat(a.chat)
      );
    },

    contact() {
      const home = S.clocks[0];
      return section(`
        ${head("say", "hello.", "h1", "")}
        <div class="mail"><a href="mailto:${esc(S.email)}">${esc(S.email)}</a><button class="btn btn--sm" type="button" data-copy="${esc(S.email)}" data-text="copy email"><span>copy email</span></button></div>
        <div class="contact">
          <form class="form" novalidate>
            <label class="field"><span class="lbl muted">your name</span><input name="name" required autocomplete="name" placeholder="Your name"></label>
            <label class="field"><span class="lbl muted">email</span><input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label>
            <label class="field"><span class="lbl muted">message</span><textarea name="message" rows="5" required placeholder="Tell me about your project…"></textarea></label>
            <div class="form__foot"><button class="btn" type="submit" data-text="send message"><span>send message</span></button><span class="lbl" data-status role="status"></span></div>
          </form>
          <div class="contact__side">
            ${home ? `<div><p class="lbl muted">local time · ${esc(home.city)}</p><time class="contact__time" data-tz="${esc(home.tz)}">--:--:--</time></div>` : ""}
            <div><p class="lbl muted">elsewhere</p><ul class="ftr__links">${socials()}</ul></div>
          </div>
        </div>`, "page-head sec--last");
    },
  };

  /* ---------- site chrome ---------- */

  function chrome(main) {
    const clocks = S.clocks
      .map((c, i) => `<span class="clock${i === 0 ? " clock--home" : ""}"><span>${esc(c.city)}</span><time data-tz="${esc(c.tz)}">--:--:--</time><span class="tz">${esc(c.label)}</span></span><span class="sep">/</span>`)
      .join("");
    const navLinks = NAV.map(([label, href], i) =>
      `<li><a href="${href}" style="--i:${i}"${label === current ? ' aria-current="page"' : ""}><span class="lbl">${pad2(i + 1)}</span>${esc(label)}</a></li>`
    ).join("");

    document.body.insertAdjacentHTML("afterbegin", `
      <a class="sr-only" href="#main">Skip to content</a>
      <div class="bg-grid" aria-hidden="true"></div>
      <div class="grain" aria-hidden="true"></div>
      <header class="hdr g">
        <a class="hdr__logo" href="index.html" aria-label="${esc(S.fullName)} — home">${esc(S.wordmark)}</a>
        <div class="hdr__clocks lbl" aria-hidden="true"><div class="marquee"><div>${clocks}</div><div>${clocks}</div></div></div>
        <div class="hdr__end"><button class="theme-btn lbl" type="button" data-theme-toggle><span class="roll"><span></span></span><span class="theme-btn__box" aria-hidden="true"></span></button></div>
      </header>
      <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span><b></b></span></button>
      <nav class="menu" id="menu" aria-label="Main">
        <ul class="menu__list">${navLinks}</ul>
        <div class="menu__foot lbl"><a href="mailto:${esc(S.email)}">${esc(S.email)}</a><div>${S.socials.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join("")}</div></div>
      </nav>`);

    // Footer: full-width page links, then the framed columns and the wordmark, with the
    // clay Pikachu sitting on its full stop.
    const word = [...S.wordmark];
    const last = word.pop() || "";
    main.insertAdjacentHTML("afterend", `
      <footer class="ftr">
        <nav class="ftr__nav" aria-label="Footer">${NAV.slice(1)
          .map(([l, h]) => `<a href="${h}"${l === current ? ' aria-current="page"' : ""}>${roll(l)}</a>`)
          .join("")}</nav>
        <div class="g"><div class="frame">
          <div class="ftr__cols">
            <div class="ftr__col"><p class="lbl">elsewhere</p><ul class="ftr__social">${S.socials
              .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}<span aria-hidden="true">→</span></a></li>`)
              .join("")}</ul></div>
            <div class="ftr__col"><p class="lbl">colophon</p><div class="ftr__legal lbl"><p>© ${new Date().getFullYear()} ${esc(S.fullName)}. All rights reserved.</p><button class="to-top" type="button">${roll("back to top ↑")}</button></div></div>
          </div>
          <div class="ftr__word" aria-hidden="true"><span>${esc(word.join(""))}<span class="ftr__dot">${esc(last)}${S.mascot ? `<img class="ftr__pika" src="${esc(S.mascot)}" alt="" loading="lazy" onerror="this.remove()">` : ""}</span></span></div>
        </div></div>
      </footer>`);
  }

  /* ---------- behaviours ---------- */

  const formatters = new Map();
  function tick() {
    const now = new Date();
    $$("[data-tz]").forEach((el) => {
      const tz = el.dataset.tz;
      if (!formatters.has(tz)) {
        try {
          formatters.set(tz, new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }));
        } catch {
          formatters.set(tz, null);
        }
      }
      const f = formatters.get(tz);
      el.textContent = f ? f.format(now) : "--:--:--";
    });
  }

  function theme() {
    const button = $("[data-theme-toggle]");
    const label = $(".roll", button);
    const sysDark = matchMedia("(prefers-color-scheme: dark)");
    const mode = () => root.dataset.theme || (sysDark.matches ? "dark" : "light");
    const sync = () => {
      const m = mode();
      const text = m === "dark" ? "Dark" : "Light";
      button.dataset.mode = m;
      label.dataset.text = text;
      label.firstElementChild.textContent = text;
      button.setAttribute("aria-label", `Switch to ${m === "dark" ? "light" : "dark"} mode`);
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.content = getComputedStyle(root).getPropertyValue("--paper").trim();
    };
    button.addEventListener("click", () => {
      root.dataset.theme = mode() === "dark" ? "light" : "dark";
      local.set("theme", root.dataset.theme);
      sync();
    });
    sysDark.addEventListener?.("change", sync);
    sync();
  }

  function menu() {
    const button = $(".menu-btn");
    const set = (open) => {
      root.classList.toggle("menu-open", open);
      button.setAttribute("aria-expanded", open);
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    button.addEventListener("click", () => set(!root.classList.contains("menu-open")));
    addEventListener("keydown", (e) => e.key === "Escape" && set(false));
  }

  function reveal() {
    const els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("is-in"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  // Muted loops that only play while on screen. With reduced motion they stay on their poster.
  function inview() {
    const vids = $$("video[data-inview]");
    if (!vids.length || reduce || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => (en.isIntersecting ? en.target.play().catch(() => {}) : en.target.pause())),
      { rootMargin: "120px 0px" }
    );
    vids.forEach((v) => io.observe(v));
  }

  function parallax() {
    const els = $$("[data-parallax]");
    if (!els.length || reduce) return;
    let queued = false;
    const run = () => {
      queued = false;
      const vh = innerHeight;
      els.forEach((el) => {
        const box = el.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        const p = (box.top + box.height / 2 - vh / 2) / (vh + box.height);
        el.style.transform = `translate3d(0, ${(p * -14).toFixed(2)}%, 0) scale(1.2)`;
      });
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    run();
  }

  function carousel() {
    const c = $(".carousel");
    if (!c) return;
    const track = $(".track", c);
    const cards = $$(".card", track);
    const [prev, next, count] = [$("[data-prev]", c), $("[data-next]", c), $("[data-count]", c)];
    const step = () => cards[0]?.getBoundingClientRect().width || track.clientWidth;
    const update = () => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      const i = atEnd ? cards.length : Math.round(track.scrollLeft / step()) + 1;
      count.textContent = `${pad2(i)} / ${pad2(cards.length)}`;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = atEnd;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
    next.addEventListener("click", () => track.scrollBy({ left: step() }));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    addEventListener("resize", update);
    update();
  }

  function showcase() {
    const s = $(".show");
    if (!s) return;
    const slides = $$(".show__slide", s);
    const thumbs = $$(".show__thumb", s);
    const tvs = $$("img.tv", s);
    const list = $(".show__thumbs", s);
    const fig = $(".show__figure", s);
    const count = $("[data-show-count]", s);
    const vids = slides.map((el) => $("video[data-show-video]", el));
    let cur = -1, settle, onScreen = false;
    const syncVideo = () =>
      vids.forEach((v, k) => { if (!v) return; if (onScreen && k === cur && !reduce) v.play().catch(() => {}); else v.pause(); });

    const set = (i) => {
      if (i === cur) return;
      const prev = cur;
      cur = i;
      slides.forEach((el, k) => { el.classList.toggle("on", k === i); el.classList.toggle("was", k === prev); });
      thumbs.forEach((el, k) => { el.classList.toggle("on", k === i); el.setAttribute("aria-current", k === i); });
      tvs.forEach((el) => el.classList.toggle("on", +el.dataset.tv === i));
      count.textContent = pad2(i + 1);
      const li = thumbs[i].parentElement;
      list.scrollTo({ top: Math.max(0, li.offsetTop + li.offsetHeight - list.clientHeight), behavior: reduce ? "auto" : "smooth" });
      if (fig) { fig.classList.remove("flick"); void fig.offsetWidth; fig.classList.add("flick"); }
      clearTimeout(settle);
      settle = setTimeout(() => slides.forEach((el) => el.classList.remove("was")), 1100);
      syncVideo();
    };

    // Projects change only on click; scrolling past the panel is a normal scroll.
    thumbs.forEach((b, i) => b.addEventListener("click", () => set(i)));
    set(0);
    if (vids.some(Boolean) && "IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; syncVideo(); }, { threshold: 0.15 }).observe(s);
    }

    // The figure slides in from the right once a fifth of the panel is on screen.
    if (fig) {
      if (!("IntersectionObserver" in window)) return fig.classList.add("in");
      const io = new IntersectionObserver(
        ([en]) => { if (en.isIntersecting) { fig.classList.add("in"); io.disconnect(); } },
        { threshold: 0.2 }
      );
      io.observe(s);
    }
  }

  // Words in a [data-fill] line go from faint to full ink, one after another, as the line
  // travels from the bottom of the screen to about its middle.
  function fillWords() {
    const els = $$("[data-fill]");
    if (!els.length) return;
    if (reduce) return els.forEach((el) => el.classList.add("filled"));
    const run = () => {
      const vh = innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const words = el.children;
        const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.45)));
        [...words].forEach((w, i) => w.style.setProperty("--f", Math.min(1, Math.max(0, p * words.length - i)).toFixed(3)));
      });
    };
    let queued = false;
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    run();
  }

  // The frame lines in the space above each section draw downward as it scrolls in: none when its
  // top is at the bottom of the screen, fully drawn by the time it reaches the middle.
  function growLines() {
    const frames = $$(".sec > .g > .frame, .page-head > .g > .frame");
    if (!frames.length || reduce) return;
    const last = new WeakMap();
    const run = () => {
      const vh = innerHeight;
      frames.forEach((f) => {
        const top = f.getBoundingClientRect().top;
        const g = Math.min(1, Math.max(0, (vh - top) / (vh * 0.5)));
        const v = g.toFixed(3);
        if (last.get(f) !== v) { last.set(f, v); f.style.setProperty("--g", v); }
      });
    };
    let queued = false;
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    run();
  }

  function filters() {
    const buttons = $$("[data-filter]");
    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        const f = b.dataset.filter;
        buttons.forEach((x) => x.setAttribute("aria-pressed", x === b));
        $$(".wgrid .card").forEach((c) => c.classList.toggle("hide", f !== "all" && c.dataset.cat !== f));
      })
    );
  }

  function lightbox() {
    const items = $$(".gallery__item");
    if (!items.length) return;
    const lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = `
      <div class="lb__top"><span class="lbl" data-lb-count></span><button type="button" class="lbl" data-lb-close>close ✕</button></div>
      <div class="lb__stage"><img alt=""></div>
      <div class="lb__bot"><button type="button" class="lbl" data-lb-prev>← prev</button><button type="button" class="lbl" data-lb-next>next →</button></div>`;
    document.body.append(lb);

    const view = $("img", lb);
    const counter = $("[data-lb-count]", lb);
    let list = [], i = 0, opener = null;
    const show = () => {
      view.src = list[i].currentSrc || list[i].src;
      view.alt = list[i].alt;
      counter.textContent = `${pad2(i + 1)} / ${pad2(list.length)}`;
    };
    const open = (image) => {
      list = $$(".gallery__item img");
      i = list.indexOf(image);
      if (i < 0) return;
      opener = document.activeElement;
      show();
      lb.classList.add("open");
      root.classList.add("lock");
      $("[data-lb-close]", lb).focus();
    };
    const close = () => {
      lb.classList.remove("open");
      root.classList.remove("lock");
      opener?.focus();
    };
    const go = (d) => { i = (i + d + list.length) % list.length; show(); };

    items.forEach((b) => b.addEventListener("click", () => { const im = $("img", b); if (im) open(im); }));
    $("[data-lb-close]", lb).addEventListener("click", close);
    $("[data-lb-prev]", lb).addEventListener("click", () => go(-1));
    $("[data-lb-next]", lb).addEventListener("click", () => go(1));
    $(".lb__stage", lb).addEventListener("click", (e) => e.target === e.currentTarget && close());
    addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
  }

  function forms() {
    $$("[data-copy]").forEach((b) => {
      const set = (t) => { b.dataset.text = t; b.firstElementChild.textContent = t; };
      b.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(b.dataset.copy);
          set("copied ✓");
        } catch {
          location.href = `mailto:${b.dataset.copy}`;
        }
        setTimeout(() => set("copy email"), 2000);
      });
    });

    const form = $(".form");
    if (!form) return;
    const status = $("[data-status]", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      if (!S.formEndpoint) {
        const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;
        location.href = `mailto:${S.email}?subject=${encodeURIComponent(`Hello from ${data.get("name")}`)}&body=${encodeURIComponent(body)}`;
        return;
      }
      status.textContent = "sending…";
      try {
        const res = await fetch(S.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        status.textContent = "sent — thank you!";
      } catch {
        status.textContent = "couldn't send — please email me instead";
      }
    });
  }

  function cursor() {
    if (reduce || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const c = document.createElement("div");
    c.className = "cursor lbl";
    c.setAttribute("aria-hidden", "true");
    document.body.append(c);
    let x = -200, y = -200, tx = x, ty = y;
    addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target.closest?.("[data-cursor]");
      c.classList.toggle("on", !!t);
      if (t && c.textContent !== t.dataset.cursor) c.textContent = t.dataset.cursor;
    }, { passive: true });
    document.addEventListener("pointerleave", () => c.classList.remove("on"));
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- intro + page transitions ---------- */

  const curtain = $(".curtain");

  function uncover(done) {
    curtain.classList.add("up");
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("covered")));
    setTimeout(done, 300);
  }

  function intro(done) {
    const box = document.createElement("div");
    box.className = "curtain__intro";
    box.innerHTML = `<div class="curtain__word">${esc(S.wordmark)}</div><div class="curtain__bar"></div>` +
      `<div class="curtain__count"><span data-n>000</span><span class="lbl">${esc(S.roles.join(" / "))}</span></div>`;
    curtain.append(box);
    const n = $("[data-n]", box);
    const bar = $(".curtain__bar", box);
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / 1800);
      const e = 1 - Math.pow(1 - p, 3);
      n.textContent = String(Math.round(e * 100)).padStart(3, "0");
      bar.style.transform = `scaleX(${e})`;
      if (p < 1) return requestAnimationFrame(step);
      setTimeout(() => {
        box.classList.add("out");
        setTimeout(() => { uncover(done); setTimeout(() => box.remove(), 1500); }, 300);
      }, 250);
    };
    requestAnimationFrame(step);
  }

  function transitions() {
    $$(".curtain i").forEach((el, i) => el.style.setProperty("--i", i));
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.protocol !== location.protocol || url.host !== location.host) return;
      if (url.hash && url.pathname === location.pathname && url.search === location.search) return;
      e.preventDefault();
      session.set("pt", "1");
      curtain.classList.remove("up");
      root.classList.add("covered");
      setTimeout(() => { location.href = url.href; }, 800);
    });
    addEventListener("pageshow", (e) => {
      if (e.persisted) { root.classList.remove("covered", "menu-open"); session.del("pt"); }
    });
  }

  function start() {
    const go = () => root.classList.add("go");
    if (!root.classList.contains("covered")) return requestAnimationFrame(go);
    session.del("pt");
    if (page === "home" && !session.get("intro") && !reduce) {
      session.set("intro", "1");
      intro(go);
    } else {
      uncover(go);
    }
  }

  /* ---------- boot ---------- */

  const main = $("main");
  if (!S || !pages[page]) {
    root.classList.remove("covered");
    main.innerHTML = `<p style="padding:2rem">Couldn't load content.js — check it for a typo (a missing comma or quote).</p>`;
    return;
  }

  if (page !== "home" && page !== "work") document.title = `${page} — ${S.wordmark}`;
  else if (page === "home") document.title = `${S.wordmark} — ${S.fullName}`;
  $('meta[name="description"]')?.setAttribute("content", S.description);

  main.innerHTML = pages[page]();
  // Interactive embeds (e.g. the playable Minesweeper on its project page).
  $$("[data-game]").forEach((el) => window.Games?.[el.dataset.game]?.(el));
  if (location.hash.length > 1) requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" }));
  chrome(main);
  theme();
  menu();
  tick();
  setInterval(tick, 1000);
  reveal();
  inview();
  parallax();
  carousel();
  showcase();
  fillWords();
  growLines();
  filters();
  lightbox();
  forms();
  cursor();
  transitions();
  $(".to-top")?.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  start();
})();
