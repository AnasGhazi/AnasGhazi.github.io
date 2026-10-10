/* ==========================================================================
   SITE CONTENT
   Everything you'll want to edit lives in this one file: text, links,
   projects and media paths. Drop your files into /media using the paths
   below (or change the paths) and the site picks them up automatically.
   Any media file that's missing shows a labelled placeholder instead.
   ========================================================================== */

window.SITE = {
  wordmark: "Ghazi.",
  fullName: "Anas Ghazi",
  description: "Anas Ghazi — developer, project manager, QA and game developer based in Karachi.",
  email: "anasyushkun@gmail.com",

  // The list under the hero on the home page.
  roles: ["Developer", "Project Manager", "QA", "Game Dev"],

  // The long box beside the roles on the home page.
  intro: {
    text: "I'm Ghazi. For years I've lived between the code and the deadline — building real-time apps, breaking them on purpose before users can and steering teams to ship them on time. This is a home for that work: the products, the tests and the games in between.",
    link: { label: "more about me", url: "about.html" },
  },

  // Words that spin around the badge in the hero.
  badgeText: "build · ship · test · play · ",

  // Header clock marquee. The first city is highlighted as "home".
  clocks: [
    { city: "Karachi", tz: "Asia/Karachi", label: "PKT" },
    { city: "Dubai", tz: "Asia/Dubai", label: "GST" },
    { city: "London", tz: "Europe/London", label: "UK" },
    { city: "New York", tz: "America/New_York", label: "ET" },
    { city: "Los Angeles", tz: "America/Los_Angeles", label: "PT" },
    { city: "Tokyo", tz: "Asia/Tokyo", label: "JST" },
    { city: "Sydney", tz: "Australia/Sydney", label: "AET" },
  ],

  socials: [
    { label: "GitHub", url: "https://github.com/AnasGhazi" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/anas-ghazi-355703295" },
  ],

  // Optional: paste a Formspree (or similar) endpoint to make the contact
  // form send directly. Left empty, the form opens the visitor's mail app.
  formEndpoint: "",

  hero: {
    video: "media/hero.mp4",          // short, muted, looping reel
    poster: "media/hero-poster.jpg",  // still shown while the video loads
    portrait: "media/hero-portrait.jpg", // tall image beside the video; the wordmark sits in its sky
    portraitFocus: "50% 75%",            // which part of the portrait stays in view (x% y%)
  },

  // The cut-out figure that stands beside the "selected works" showcase.
  // The active project plays on the TV screen it's holding.
  figure: "media/figure.png",

  // Cut-out (transparent PNG/WebP) that sits on the full stop of the big footer wordmark.
  mascot: "media/pikachu.webp",

  // The "want to chat?" block at the bottom of every page: copy and photo,
  // then a full-width looping video strip. `imageFocus` picks which part stays in view.
  chat: {
    text: "Got a role, a project or an idea worth building? I'd love to hear about it.",
    image: "media/chat/event.jpg",
    imageFocus: "50% 50%",
    video: "media/chat/crossing.mp4",
  },

  about: {
    // Top of the page: "the developer." beside a photo.
    kicker: "the",
    title: "developer.",
    heroImage: "media/about/developer.jpg",
    heroFocus: "35% 40%",
    // "This is me." column and the tagline + story beside it.
    greeting: "Hi, I'm Ghazi!",
    meImage: "media/about/me.jpg",
    meFocus: "47% 60%",
    tagline: "Your friendly neighbourhood engineer.",
    paragraphs: [
      "I grew up in Gilgit, in the mountains of northern Pakistan, and these days I call Karachi home. Long before I wrote any code, I spent my time behind a camera — shooting short films and photographs of the people and places around me, and learning that the story is usually hiding in the small details. That habit followed me into Computer Science, where I started out making games, and somewhere between building a level and watching it fall apart, I got far more curious about why things break than about the things themselves.",
      "That curiosity turned into QA — breaking software on purpose so real people wouldn't have to — and QA slowly turned into project management, because the surest way to stop things breaking is to plan them properly in the first place. Now I spend most of my days keeping teams, clients and timelines pointed in the same direction, but I never really stopped building. When I'm not running a sprint, I'm usually tinkering on something of my own or out somewhere with a camera. Some habits you don't grow out of.",
    ],

    // Swaps the "want to chat?" photo on this page only (the other pages use chat.image).
    chat: { image: "media/chat/about-chat.jpg", imageFocus: "50% 50%" },

    // Work experience: a list of roles beside a heading and a photo.
    // `url` (optional) underlines the company and links to it.
    experience: {
      kicker: "experience",
      title: "I'm very wise.",
      image: "media/about/wise.jpg",
      focus: "72% 60%",
      roles: [
        { period: "Jan 2026 — Present", title: "Project Manager", company: "JBS Americas & Europe", url: "", place: "Karachi", type: "Full-time" },
        { period: "Summer 2024", title: "Scrum Master Intern", company: "M-Labs", url: "", place: "Remote / Karachi", type: "Internship" },
        { period: "Summer 2023", title: "SQA Intern", company: "NSTP NUST", url: "", place: "Islamabad", type: "Internship" },
      ],
    },
  },

  // The "pm" tab: project management experience, straight from the resume.
  pm: {
    lead: "Project Manager at JBS Americas & Europe. I run delivery on a six-product AI automation portfolio for a US insurance brokerage and lead a compliance-grade Salesforce integration for Pacer Financial — comfortable owning both the client relationship and the technical delivery, end to end.",
    stats: [
      ["6", "AI products owned end to end for one client"],
      ["$41B", "AUM asset manager on the Salesforce integration"],
      ["4 wks", "to ship a Unity MVP as Scrum Master"],
      ["2", "enterprise clients, running in parallel"],
    ],
    roles: [
      {
        title: "Project Manager",
        company: "JBS Americas & Europe",
        period: "Jan 2026 — Present",
        clients: [
          {
            name: "Infinite Risk Management and Insurance Solutions",
            note: "Insurance brokerage portfolio · 6 projects",
            intro: "Owned end-to-end delivery of six products for a US-based insurance brokerage — from customer needs discovery and requirements definition through launch and post-delivery support.",
            items: [
              ["Marketing Synopsis Tool", "Directed a competitive-intelligence product that synthesised competitor quotes pulled from emails, benchmarked them against client-defined KPIs and generated customer-ready comparison reports."],
              ["Loss Runs App", "Identified a recurring customer pain point in manual report workflows and scoped an AI-automated solution with triggered client follow-ups, covering both BOR and non-BOR pipelines."],
              ["AI Email Logger", "Partnered with engineering to translate the client's business workflow into product requirements for parsing insurance claims from email and logging them to the correct system objects."],
              ["AI Dialler & TLO Scraper", "Oversaw lead-qualification and lead-generation tools, aligning scope with downstream business impact."],
              ["Insurance Brokerage Website", "Led delivery of a client-facing Next.js website, aligning development with brand and business requirements."],
            ],
          },
          {
            name: "Pacer Financial",
            note: "Enterprise Salesforce Agentforce integration & mentorship",
            intro: "",
            items: [
              ["Compliance-grade integration", "Lead a team of data engineers delivering an integration for a $41B AUM asset manager, translating client requirements into rules-based system logic and bridging technical and non-technical stakeholders."],
              ["Mentorship", "Coach an intern in JBS's graduate training programme on business analysis and PM fundamentals."],
            ],
          },
        ],
      },
      {
        title: "Scrum Master Intern",
        company: "M-Labs · Remote / Karachi",
        period: "Summer 2024",
        clients: [
          {
            name: "Unity game MVP",
            note: "Team of 4 · 4-week timeline",
            intro: "",
            items: [
              ["Scope & delivery", "Led a team of four to scope and deliver a Unity-based game MVP within a four-week timeline, managing prioritisation and the daily delivery rhythm."],
              ["Sprints & backlog", "Owned sprint planning and backlog management in Jira and ClickUp across the full development cycle."],
              ["Ceremonies", "Facilitated daily stand-ups and retrospectives to keep the team unblocked and on schedule."],
            ],
          },
        ],
      },
    ],
    practices: [
      ["discovery", "Customer needs discovery and requirements definition, before a line of scope is committed."],
      ["weekly syncs", "Stakeholder syncs every week to surface blockers and re-prioritise the backlog against business value."],
      ["SLA tracking", "SLA documentation across every client account — commitments, response times and post-delivery maintenance."],
      ["proposals", "Client-facing proposals that turn discovery findings into deliverables, timelines and cost estimates."],
      ["R&D", "Scoping and solution discovery for new automation opportunities, testing feasibility before requirements are final."],
      ["tooling", "Project plans and tickets in ClickUp and Jira; tracking in Excel."],
    ],
    skills: [
      "Product & Requirements Definition", "Market & Competitive Analysis", "Stakeholder Management",
      "Cross-Functional Team Leadership", "Data-Driven Prioritisation", "Agile / Scrum", "ClickUp", "Jira", "SQL & ML Fundamentals",
    ],
    education: [
      ["2026", "BS Computer Science", "FAST NUCES"],
      ["2025", "Machine Learning Specialization", "DeepLearning.AI · Stanford Online"],
    ],
  },

  // The "services." rows on the home page. Each row's tile on the right shows:
  //   video: a muted loop (plays while on screen)  ·  image: a still
  //   project: a project's slug, to show its cover (and "play now" if it's a game)
  // `link` makes the tile clickable; `focus` picks which part stays in view (x% y%).
  services: [
    {
      title: "development",
      items: ["real-time web apps", "front end & APIs", "AI & LLM integrations", "android (kotlin)"],
      video: "media/services/dev-mockup.mp4", // this site, playing on a laptop
      poster: "media/services/dev-mockup-poster.jpg",
      link: "works.html",
    },
    {
      title: "project management",
      items: ["end-to-end delivery", "requirements & scoping", "agile / scrum", "stakeholder management"],
      video: "media/services/projmgmt.mp4",
      poster: "media/services/projmgmt-poster.jpg",
      focus: "50% 60%",
      link: "pm.html",
    },
    {
      title: "quality assurance",
      items: ["test automation", "playwright & selenium", "regression testing", "release quality"],
      project: "test-automation",
    },
    {
      title: "game development",
      items: ["unity prototypes", "c++ games", "rapid MVPs", "playtesting"],
      project: "minesweeper", // links straight to the playable port
    },
  ],

  // Category filters on the works page. `id` matches a project's `category`.
  categories: [
    { id: "dev", label: "Development" },
    { id: "pm", label: "Project Management" },
    { id: "qa", label: "QA" },
    { id: "games", label: "Games" },
  ],

  /* ------------------------------------------------------------------------
     PROJECTS
     - slug:     used in the URL (work.html?p=slug) and the media folder name
     - featured: true shows it in the home page showcase
     - video:    a YouTube/Vimeo link OR a local file like "media/works/x/film.mp4"
     - links:    buttons on the project page (GitHub, live site…)
     - gallery:  list of images shown on the project page (click to enlarge)
     ------------------------------------------------------------------------ */
  projects: [
    {
      slug: "minesweeper",
      title: "Minesweeper",
      type: "Desktop game · play it here",
      year: "2023",
      category: "games",
      featured: true,
      game: "minesweeper", // swaps the cover for a playable web port on the project page
      coverStyle: "comic", // high-contrast black & white with halftone grain, to match the TV photo
      tags: ["C++/CLI", "Windows Forms", "OOP"],
      cover: "media/works/minesweeper/cover.jpg",
      summary: "A remake of classic Windows Minesweeper in C++/CLI — ported to the browser so you can play it right here.",
      description: [
        "Three classic difficulties up to the 30 × 16 “DEATH” board, a reactive face, mine counter and timer, recursive flood fill, sound effects and a top-5 leaderboard per difficulty saved to disk.",
        "Under the hood, an abstract Cell class with Mined and Unmined subclasses lets the board call expose() polymorphically on every cell.",
      ],
      credits: [["Role", "Design & development"], ["Stack", "C++/CLI, Windows Forms, .NET Framework"]],
      links: [{ label: "GitHub", url: "https://github.com/AnasGhazi/Minesweeper" }],
      gallery: ["media/works/minesweeper/01.jpg", "media/works/minesweeper/02.jpg"],
    },
    {
      slug: "shuttle",
      title: "Shuttle",
      type: "Real-time web app",
      year: "2026",
      category: "dev",
      featured: true,
      tags: ["Node.js", "Socket.IO", "Redis", "WebRTC"],
      cover: "media/works/shuttle/cover.jpg",
      summary: "Send text and files between devices on the same Wi-Fi. No login, no install — open it on two devices and they're on the same court.",
      description: [
        "Devices on one network share a public IP, so Shuttle uses it to group them into a “court” automatically. Text syncs live through the server and is kept in Redis for 30 minutes; a Lua script versions every write so simultaneous edits converge.",
        "Files never touch the server. They stream device-to-device over WebRTC data channels in 64 KB chunks with backpressure, so large files don't exhaust memory. Four-digit court codes join devices that aren't grouped automatically, like IPv4 and IPv6 clients on the same Wi-Fi.",
      ],
      credits: [["Role", "Design & development"], ["Stack", "Node.js, Express, Socket.IO, Redis, WebRTC"], ["Tests", "node:test unit + integration"]],
      links: [{ label: "GitHub", url: "https://github.com/AnasGhazi/shuttle" }],
      gallery: ["media/works/shuttle/01.jpg", "media/works/shuttle/02.jpg", "media/works/shuttle/03.jpg", "media/works/shuttle/04.jpg"],
    },
    {
      slug: "phisher-zero",
      title: "Phisher Zero",
      type: "Final year project · AI security",
      year: "2026",
      category: "dev",
      featured: true,
      tags: ["Python", "FastAPI", "DistilBERT", "Gemini", "Chrome extension"],
      cover: "media/works/phisher-zero/cover.jpg",
      video: "media/works/phisher-zero/demo.mp4", // 47s cut of the full demo: two phishing catches and a safe email
      poster: "media/works/phisher-zero/demo-poster.jpg",
      summary: "A multi-agent phishing detector: a FastAPI backend that scores emails and URLs, and a Chrome extension that scans the page you're on.",
      description: [
        "Four agents run on every request. An NLP agent scores the email text with a fine-tuned DistilBERT model, falling back to Gemini. A URL agent combines lexical heuristics with a VirusTotal lookup. An ensemble agent weighs the signals into a safe / suspicious / phishing verdict.",
        "Finally an explainer agent turns the numbers into a plain-language summary and recommended action. The Manifest V3 extension reads the active tab, sends it to the backend and shows each agent's result as its own card.",
      ],
      credits: [["Role", "Final year project, FAST NUCES"], ["Backend", "Python, FastAPI, Transformers, LangChain"], ["Frontend", "Chrome extension (MV3), Tailwind"]],
      links: [{ label: "GitHub", url: "https://github.com/AnasGhazi/phisher_zero" }],
      gallery: ["media/works/phisher-zero/01.jpg", "media/works/phisher-zero/02.jpg", "media/works/phisher-zero/03.jpg", "media/works/phisher-zero/04.jpg"],
    },
    {
      slug: "polaroid-camera",
      title: "Polaroid Camera",
      type: "Android app",
      year: "2026",
      category: "dev",
      featured: true,
      tags: ["Kotlin", "Android", "CameraX", "Film simulation"],
      cover: "media/works/polaroid-camera/cover.jpg",
      summary: "Cameowra: a retro instant camera for Android, where every shot comes out as a graded, framed Polaroid.",
      description: [
        "Where my old camera habit meets code. The viewfinder is styled like a vintage camera body, with swipeable rotary dials for shutter speed (1/30–1/2000), ISO (100–3200), manual focus, exposure compensation and a self-timer, plus flash and front/back camera switching.",
        "A filter badge cycles through eleven Fujifilm-style film simulations — Provia, Velvia, Astia, Classic Chrome, Classic Neg, Eterna and more — applied as Hald CLUTs. Each frame is cropped square, graded, vignetted and dropped into a white Polaroid border, with shutter, dial and timer sounds and a built-in gallery to browse and delete shots.",
      ],
      credits: [["Role", "Design & development"], ["Stack", "Kotlin, Android, CameraX"], ["Film looks", "11 Hald CLUT simulations"]],
      links: [{ label: "GitHub", url: "https://github.com/AnasGhazi/polaroid_camera_app" }],
      gallery: ["media/works/polaroid-camera/01.jpg", "media/works/polaroid-camera/02.jpg", "media/works/polaroid-camera/03.jpg", "media/works/polaroid-camera/04.jpg"],
    },
    {
      slug: "ai-automation-portfolio",
      title: "AI Automation Portfolio",
      type: "Project management · 6 products",
      year: "2026",
      category: "pm",
      featured: true,
      tags: ["Delivery", "Requirements", "AI automation", "ClickUp"],
      cover: "media/works/ai-automation-portfolio/cover.jpg",
      summary: "End-to-end delivery of six AI products for Infinite Risk Management and Insurance Solutions, a US insurance brokerage.",
      description: [
        "I own delivery from customer discovery and requirements through launch and post-delivery support. The portfolio includes a Marketing Synopsis tool that benchmarks competitor quotes pulled from email against client KPIs, a Loss Runs app that automates report workflows with triggered follow-ups, an AI Email Logger that parses claims into the right system objects, an AI Dialler and TLO Scraper for lead qualification, and a Next.js brokerage website.",
        "Week to week that means stakeholder syncs to surface blockers and re-prioritise the backlog, SLA tracking across every client account, R&D on new automation opportunities, and proposals that turn discovery into deliverables, timelines and cost estimates.",
      ],
      credits: [["Role", "Project Manager, JBS Americas & Europe"], ["Client", "Infinite Risk Management & Insurance Solutions"], ["Tools", "ClickUp, Excel SLA tracking"]],
      links: [],
      gallery: [],
    },
    {
      slug: "salesforce-agentforce",
      title: "Salesforce Agentforce Integration",
      type: "Project management · Enterprise",
      year: "2026",
      category: "pm",
      featured: false,
      tags: ["Salesforce", "Compliance", "Team lead"],
      cover: "media/works/salesforce-agentforce/cover.jpg",
      summary: "A compliance-grade Salesforce Agentforce integration for Pacer Financial, a $41B AUM asset manager.",
      description: [
        "I lead a team of data engineers, translating the client's requirements into rules-based system logic and bridging the technical and non-technical sides of the project.",
        "Alongside it I coach an intern in JBS's graduate training programme on business analysis and project management fundamentals.",
      ],
      credits: [["Role", "Project Manager, JBS Americas & Europe"], ["Client", "Pacer Financial"], ["Team", "Data engineers + graduate intern"]],
      links: [],
      gallery: [],
    },
    {
      slug: "test-automation",
      title: "Test Automation",
      type: "QA · End-to-end testing",
      year: "2023–25",
      category: "qa",
      featured: true,
      tags: ["Playwright", "Selenium", "Pytest", "C#"],
      cover: "media/works/test-automation/cover.jpg",
      summary: "Automated end-to-end suites that check real user journeys before release.",
      description: [
        "As an SQA intern at NSTP NUST I was embedded in a product startup, building automated suites in Selenium (C# and Python) and running regression and functional testing across release cycles with the dev team.",
        "Since then: a Playwright + Pytest suite covering registration and login on the Parabank demo bank, and a Selenium + pytest-html project that drives a live browser game and produces self-contained HTML reports.",
      ],
      credits: [["Role", "QA / test automation"], ["Stack", "Playwright, Selenium, Pytest, pytest-html, C#"]],
      links: [
        { label: "Parabank suite", url: "https://github.com/AnasGhazi/Parabank_test_automation" },
        { label: "Selenium project", url: "https://github.com/AnasGhazi/Cookie_Clicker_Automated_with_Selenium" },
      ],
      gallery: [],
    },
    {
      slug: "unity-game-mvp",
      title: "Unity Game MVP",
      type: "Game development · Scrum",
      year: "2024",
      category: "games",
      featured: false,
      tags: ["Unity", "Scrum", "Jira"],
      cover: "media/works/unity-game-mvp/cover.jpg",
      summary: "Led a team of four to scope and ship a Unity game MVP in four weeks at M-Labs.",
      description: [
        "As Scrum Master I owned sprint planning and the backlog in Jira and ClickUp, ran daily stand-ups and retrospectives, and kept prioritisation tight enough to get a playable MVP out inside a four-week window.",
      ],
      credits: [["Role", "Scrum Master Intern, M-Labs"], ["Team", "Team of 4"], ["Tools", "Unity, Jira, ClickUp"]],
      links: [],
      gallery: [],
    },
    {
      slug: "jarvis",
      title: "J.A.R.V.I.S.",
      type: "AI assistant web app",
      year: "2024",
      category: "dev",
      featured: false,
      tags: ["React", "Vite", "Tailwind", "Gemini"],
      cover: "media/works/jarvis/cover.jpg",
      summary: "An Iron Man–inspired AI assistant built with React and Google's Gemini API.",
      description: ["A responsive chat interface with typing animation and in-session memory, talking to Gemini for context-aware answers."],
      credits: [["Role", "Design & development"], ["Stack", "React, Vite, Tailwind CSS, Gemini API"]],
      links: [{ label: "GitHub", url: "https://github.com/AnasGhazi/jarvisGPT" }],
      gallery: ["media/works/jarvis/01.jpg", "media/works/jarvis/02.jpg"],
    },
    {
      slug: "furyswipes",
      title: "FurySwipes",
      type: "Mobile-first web app",
      year: "2025",
      category: "dev",
      featured: false,
      tags: ["React", "TypeScript", "Gemini"],
      cover: "media/works/furyswipes/cover.jpg",
      summary: "Type any topic and get a deck of ten AI-generated trivia cards to flip and swipe through.",
      description: ["Each card shows a question on a colour gradient; tap to flip it to the answer, drag it sideways to skip. Built with React 19 and framer-motion, with decks generated by Gemini 2.5 Flash."],
      credits: [["Role", "Design & development"], ["Stack", "React, TypeScript, Vite, framer-motion, Gemini API"]],
      links: [{ label: "GitHub", url: "https://github.com/AnasGhazi/furyswipes_factapp" }],
      gallery: ["media/works/furyswipes/01.jpg", "media/works/furyswipes/02.jpg", "media/works/furyswipes/03.jpg", "media/works/furyswipes/04.jpg"],
    },
  ],
};
