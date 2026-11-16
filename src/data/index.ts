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
  /** One sentence, used on the floating preview card. */
  description: string;
  /** Two-character serif mark used when a brand icon is not available. */
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
  overline: "Personal index",
  volume: "Vol. 01",
  tagline:
    "I design and build web interfaces for a living. Everything else I care about is filed below.",
  location: "Kolkata, India",
  based: "Based in Kolkata. Working everywhere.",
  coordinates: "22.5726° N · 88.3639° E",
  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  email: "contact@harsh-shah.me",
  status: "Available for select work",
  descriptors: [
    "building quiet interfaces",
    "listening in lossless",
    "losing to roguelikes",
    "collecting keyboards",
  ],
  footerNote: "No cookies. No trackers. One page.",
};

export const groups: LinkGroup[] = [
  {
    id: "work",
    label: "Work",
    items: [
      {
        id: "portfolio",
        name: "Portfolio",
        meta: "harsh-shah.me",
        href: "https://harsh-shah.me",
        description: "Selected work, case studies, and a few things that never shipped.",
        glyph: "h.",
        orbit: { ring: 0, angle: -90 },
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
        id: "writing",
        name: "Writing",
        meta: "notes",
        href: "https://harsh-shah.me/notes",
        description: "Long-form notes on interfaces, tooling, and taste.",
        glyph: "nt",
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
        description: "Short posts about design, tooling, and whatever is on the bench.",
        glyph: "x",
        brand: "x",
        orbit: { ring: 0, angle: 90 },
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
        id: "instagram",
        name: "Instagram",
        meta: "@harsh.shah",
        href: "https://www.instagram.com/harsh.shah",
        description: "Photos from walks, desks, and bad weather.",
        glyph: "ig",
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
    ],
  },
];

export const allLinks = groups.flatMap((group) => group.items);
export const orbitLinks = allLinks.filter((link) => link.orbit);

export const now = [
  {
    id: "listening",
    label: "Listening",
    value: "Nils Frahm",
    meta: "All Melody · on repeat",
  },
  {
    id: "playing",
    label: "Playing",
    value: "Hades II",
    meta: "run 41 · still going",
  },
  {
    id: "building",
    label: "Building",
    value: "A small RSS reader",
    meta: "private beta · very private",
  },
] as const;
