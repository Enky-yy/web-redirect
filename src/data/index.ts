export type Brand = "x" | "github" | "steam" | "spotify" | "discord";

export type OrbitPlacement = {
  ring: 0 | 1 | 2;
  /** Position along the ellipse, in degrees. -90 is the top. */
  angle: number;
};

export type LinkItem = {
  id: string;
  name: string;
  /** Small mono line shown on the right of an index row. */
  meta: string;
  href: string;
  /** One sentence, used in the readout and the note column. */
  description: string;
  /** Two-character mark used when a brand icon is not available. */
  glyph: string;
  brand?: Brand;
  orbit?: OrbitPlacement;
};

export type LinkGroup = {
  id: string;
  label: string;
  items: LinkItem[];
};

/**
 * Everything on the page is driven from this file.
 * Replace the placeholder URLs and handles with your own — nothing else needs to change.
 */
export const profile = {
  name: "Harsh Shah",
  monogram: "h.",
  overline: "Link index",
  volume: "Vol. 01",
  tagline:
    "AI/ML undergraduate in Varanasi. Everything I link to — work, notes, profiles, play — filed on one page.",
  location: "Varanasi, India",
  based: "Based in Varanasi. Working everywhere.",
  coordinates: "25.3176° N · 82.9739° E",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  email: "contact@harsh-shah.me",
  whatsapp: "",
  status: "Open to internships",
  descriptors: [
    "building AI/ML pipelines",
    "wiring agents together",
    "reading about LLMs",
    "shipping open source",
  ],
  footerNote: "No cookies. No trackers. Just links.",
};

const site = "https://harsh-shah.is-a.dev";

const direct: LinkItem[] = [
  {
    id: "mail",
    name: "Mail",
    meta: "contact@harsh-shah.me",
    href: "mailto:contact@harsh-shah.me",
    description: "The fastest way to reach me. Replies usually land within two days.",
    glyph: "ml",
  },
  ...(profile.whatsapp
    ? [
        {
          id: "whatsapp",
          name: "WhatsApp",
          meta: "direct message",
          href: profile.whatsapp,
          description: "For quick questions, or when email feels too slow.",
          glyph: "wa",
        } satisfies LinkItem,
      ]
    : []),
  {
    id: "guestbook",
    name: "Guestbook",
    meta: "/guestbook",
    href: `${site}/guestbook`,
    description: "Leave a note. I read all of them, eventually.",
    glyph: "gb",
  },
  {
    id: "contact",
    name: "Contact",
    meta: "/contact",
    href: `${site}/contact`,
    description: "Everything you need if you would rather not use mail.",
    glyph: "ct",
  },
];

export const groups: LinkGroup[] = [
  {
    id: "work",
    label: "Work",
    items: [
      {
        id: "portfolio",
        name: "Portfolio",
        meta: "harsh-shah.is-a.dev",
        href: site,
        description: "The home page: selected work, notes, and everything in between.",
        glyph: "hs",
        orbit: { ring: 0, angle: -90 },
      },
      {
        id: "about",
        name: "About",
        meta: "/about",
        href: `${site}/about`,
        description: "The longer version: what I am studying, building, and looking for.",
        glyph: "ab",
      },
      {
        id: "projects",
        name: "Projects",
        meta: "/projects",
        href: `${site}/projects`,
        description: "Things I have built, including the ones that never shipped.",
        glyph: "pr",
      },
      {
        id: "blog",
        name: "Blog",
        meta: "/blog",
        href: `${site}/blog`,
        description: "Notes on machine learning, tooling, and whatever is on the bench.",
        glyph: "bl",
      },
      {
        id: "resume",
        name: "Resume",
        meta: "resume.pdf",
        href: `${site}/resume.pdf`,
        description: "One page, current as of this month. PDF, opens in a tab.",
        glyph: "cv",
      },
      {
        id: "github",
        name: "GitHub",
        meta: "@harsh-shah",
        href: "https://github.com/harsh-shah",
        description: "Code, side projects, and half-finished ideas kept in public.",
        glyph: "gh",
        brand: "github",
        orbit: { ring: 1, angle: 168 },
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        meta: "in/harsh-shah",
        href: "https://www.linkedin.com/in/harsh-shah",
        description: "The professional cut, kept reasonably tidy.",
        glyph: "in",
      },
      {
        id: "huggingface",
        name: "Hugging Face",
        meta: "@harshshah",
        href: "https://huggingface.co/harshshah",
        description: "Models, datasets, and spaces I have pushed out in public.",
        glyph: "hf",
      },
      {
        id: "kaggle",
        name: "Kaggle",
        meta: "@harshshah",
        href: "https://www.kaggle.com/harshshah",
        description: "Notebooks, competitions, and the leaderboards I did not win.",
        glyph: "kg",
      },
    ],
  },
  {
    id: "social",
    label: "Social",
    items: [
      {
        id: "x",
        name: "X",
        meta: "@harshshah",
        href: "https://x.com/harshshah",
        description: "Short posts about models, tooling, and whatever is on the bench.",
        glyph: "x",
        brand: "x",
        orbit: { ring: 0, angle: 90 },
      },
      {
        id: "instagram",
        name: "Instagram",
        meta: "@harsh.shah",
        href: "https://www.instagram.com/harsh.shah",
        description: "Photos from walks, desks, and bad weather.",
        glyph: "ig",
      },
      {
        id: "threads",
        name: "Threads",
        meta: "@harsh.shah",
        href: "https://www.threads.net/@harsh.shah",
        description: "Shorter thoughts than the blog, less noise than X.",
        glyph: "th",
      },
      {
        id: "discord",
        name: "Discord",
        meta: "server",
        href: "https://discord.gg/harshshah",
        description: "The server where I actually reply, mostly after midnight.",
        glyph: "dc",
        brand: "discord",
        orbit: { ring: 2, angle: -52 },
      },
      {
        id: "telegram",
        name: "Telegram",
        meta: "@harshshah",
        href: "https://t.me/harshshah",
        description: "Fast messages, fewer notifications, no feed.",
        glyph: "tg",
      },
      {
        id: "bluesky",
        name: "Bluesky",
        meta: "@harshshah",
        href: "https://bsky.app/profile/harshshah",
        description: "The quieter timeline, mostly links and build logs.",
        glyph: "bs",
      },
      {
        id: "reddit",
        name: "Reddit",
        meta: "u/harshshah",
        href: "https://www.reddit.com/user/harshshah",
        description: "Mostly reading. Occasionally answering questions about GPUs.",
        glyph: "rd",
      },
    ],
  },
  {
    id: "play",
    label: "Play",
    items: [
      {
        id: "steam",
        name: "Steam",
        meta: "steam/id/harshshah",
        href: "https://steamcommunity.com/id/harshshah",
        description: "Roguelikes, strategy, and whatever happened to be on sale.",
        glyph: "st",
        brand: "steam",
        orbit: { ring: 1, angle: -12 },
      },
      {
        id: "spotify",
        name: "Spotify",
        meta: "user/harshshah",
        href: "https://open.spotify.com/user/harshshah",
        description: "Lossless, late night, and heavier on ambient than the recap suggests.",
        glyph: "sp",
        brand: "spotify",
        orbit: { ring: 2, angle: 128 },
      },
      {
        id: "youtube",
        name: "YouTube",
        meta: "@harshshah",
        href: "https://www.youtube.com/@harshshah",
        description: "Talks, demos, and the occasional build video.",
        glyph: "yt",
      },
      {
        id: "letterboxd",
        name: "Letterboxd",
        meta: "@harshshah",
        href: "https://letterboxd.com/harshshah",
        description: "A running list of films watched, rated, and argued about.",
        glyph: "lb",
      },
    ],
  },
  {
    id: "direct",
    label: "Direct",
    items: direct,
  },
];

export const allLinks = groups.flatMap((group) => group.items);
export const orbitLinks = allLinks.filter((link) => link.orbit);

export const stack = [
  "AI/ML pipelines",
  "Agentic automation",
  "LLM evaluation",
  "RAG systems",
  "Python",
  "PyTorch",
  "LangGraph",
  "Open source",
] as const;
