# Ghazi. — portfolio

A static site (plain HTML/CSS/JS, no build step).

## Preview locally

```sh
cd ~/Desktop/ghazi
npx http-server -p 8000 -c-1
```
Then open http://localhost:8000. Use this rather than double-clicking the HTML file or running
`python3 -m http.server`: videos need a server that can stream byte ranges to seek and loop properly,
and YouTube embeds don't play from `file://`.

## Editing

**All text, links and projects live in `content.js`.** You shouldn't need to touch the HTML.

- `roles`, `intro`, `about`: the copy on each page
- `services`: the rows on the home page. Each tile shows a `video`, an `image`, or a `project`'s cover
  (a game project links straight to its playable version).
- `clocks`: the header marquee. The first city is highlighted as home.
- `chat`: the "want to chat?" block at the bottom of each page: copy, photo (`imageFocus` moves the crop) and the video strip
- `mascot`: the transparent cut-out (the clay Pikachu) standing beside the big footer wordmark
- `socials`, `email`: links in the menu, footer and contact page
- `projects`: one entry per piece of work. Set `featured: true` to show it in the home carousel.
  `video` takes a YouTube or Vimeo link, or a local file like `media/works/<slug>/film.mp4`.
- `pm`: everything on the project management page (pm.html): lead, stats, roles, practices, skills
- `game: "minesweeper"` on a project swaps its cover for the playable port (assets/js/minesweeper.js)
- `formEndpoint`: paste a [Formspree](https://formspree.io) URL to make the contact form send directly.
  Left empty, it opens the visitor's mail app.

Colours are the two variables at the top of `assets/css/style.css`: `--paper` and `--ink`.
Dark mode swaps them.

## Adding media

Put files at the paths listed in `content.js`. Anything that's missing shows a striped placeholder
that names the file it's waiting for, so you can see what's left to add.

```
media/
  hero.mp4            short muted loop, shown uncropped at its own aspect ratio
  hero-poster.jpg     still from the reel
  pikachu.webp        footer mascot cut-out (transparent)
  hero-portrait.jpg   tall image beside the reel; the wordmark sits in its sky (move the crop with hero.portraitFocus)
  about/              developer.jpg beside "the developer.", me.jpg under "This is me.", wise.jpg beside the experience list
  chat/               event.jpg beside "want to chat?", crossing.mp4 strip beneath it
  services/           service tile videos + posters (dev-mockup.mp4 is this site on a laptop)
  works/<slug>/
    cover.jpg         card + project page image (4:5 crops nicely)
    01.jpg, 02.jpg…   gallery images, any aspect ratio
```

Export images at about 2000px on the long edge (JPG quality 80, or WebP) so pages stay fast.

## Publishing

It's a static folder, so any static host works. Drag the folder onto
[Netlify Drop](https://app.netlify.com/drop), or push it to GitHub and enable GitHub Pages or Vercel.
