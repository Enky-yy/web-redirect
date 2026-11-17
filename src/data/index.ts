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
  /** Bare handle, used to build the handle@platform label in the contact panel. */
  handle?: string;
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
    "AI/ML undergraduate in Varanasi. The short list: my work, my code, my profiles, and what I play and listen to.",
  location: "Varanasi, India",
  based: "Based in Varanasi. Working everywhere.",
  coordinates: "25.3176° N · 82.9739° E",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  email: "lets-talk@harsh-shah.me",
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
        id: "github",
        name: "GitHub",
        meta: "@Enky-yy",
        handle: "Enky-yy",
        href: "https://github.com/Enky-yy",
        description: "Code, side projects, and half-finished ideas kept in public.",
        glyph: "gh",
        brand: "github",
        orbit: { ring: 1, angle: 168 },
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
        meta: "@harshshah_15",
        handle: "harshshah_15",
        href: "https://x.com/harshshah_15",
        description: "Short posts about models, tooling, and whatever is on the bench.",
        glyph: "x",
        brand: "x",
        orbit: { ring: 0, angle: 90 },
      },
      {
        id: "instagram",
        name: "Instagram",
        meta: "@harshshah_15",
        handle: "harshshah_15",
        href: "https://www.instagram.com/harshshah_15",
        description: "Photos from walks, desks, and bad weather.",
        glyph: "ig",
      },
      {
        id: "discord",
        name: "Discord",
        meta: "jMqggTnBHm@discord",
        handle: "jMqggTnBHm",
        href: "https://discord.gg/jMqggTnBHm",
        description: "The server where I actually reply, mostly after midnight.",
        glyph: "dc",
        brand: "discord",
        orbit: { ring: 2, angle: -52 },
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
        meta: "steam/id/enky-yy",
        handle: "enky-yy",
        href: "https://steamcommunity.com/id/enky-yy",
        description: "Roguelikes, strategy, and whatever happened to be on sale.",
        glyph: "st",
        brand: "steam",
        orbit: { ring: 1, angle: -12 },
      },
      {
        id: "spotify",
        name: "Spotify",
        meta: "31a6z…@spotify",
        handle: "31a6z…",
        href: "https://open.spotify.com/user/31a6znop46v7sbg2hpgy2bysrs6m",
        description: "Lossless, late night, and heavier on ambient than the recap suggests.",
        glyph: "sp",
        brand: "spotify",
        orbit: { ring: 2, angle: 128 },
      },
    ],
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
