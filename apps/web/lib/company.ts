import type { CostumeId } from "@maya/shared";

export type { CostumeId };

export const COMING_SOON_COSTUME_IDS = [
  "jules",
  "meera",
  "kenji",
  "sofia",
] as const;

export type ComingSoonCostumeId = (typeof COMING_SOON_COSTUME_IDS)[number];
export type PosterCostumeId = CostumeId | ComingSoonCostumeId;

export type CompanyPlayer = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  costume: CostumeId;
  avatar: string;
  freeTier: boolean;
};

export const MAYA_HOST: CompanyPlayer = {
  id: "00000000-0000-0000-0000-000000000000",
  slug: "maya",
  name: "Maya (Resident House Host)",
  shortName: "Maya",
  tagline:
    "Welcome to the theater. Tell me what's on your mind, and I'll match you with the right persona or help you think it through.",
  category: "lifestyle",
  costume: "maya",
  avatar: "/avatars/maya-host.svg",
  freeTier: true,
};

/** Marketing/playbill copy. Runtime catalog still comes from `public.agents`. */
export const COMPANY: CompanyPlayer[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "marcus-01",
    name: "Marcus (The Savage Stoic)",
    shortName: "Marcus",
    tagline:
      "Your feelings are valid, but your excuses are pathetic. Let's fix your mindset.",
    category: "philosophy",
    costume: "marcus",
    avatar: "/avatars/marcus-stoic.jpg",
    freeTier: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "priya-02",
    name: "Dr. Priya (Flirty STEM Prof)",
    shortName: "Dr. Priya",
    tagline:
      "Are you an asymptote? Because I find myself getting arbitrarily close to you... Now let's integrate this function.",
    category: "learning",
    costume: "priya",
    avatar: "/avatars/dr-priya-stem.jpg",
    freeTier: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "alex-03",
    name: "Alex (Exhausted 10x Tech Lead)",
    shortName: "Alex",
    tagline:
      "I've had 4 espressos, 2 outages, and your PR just gave me a 5th headache. Let's fix this before prod dies.",
    category: "productivity",
    costume: "alex",
    avatar: "/avatars/alex-tech-lead.jpg",
    freeTier: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    slug: "nonna-04",
    name: "Nonna Maria (Fierce Italian Grandma)",
    shortName: "Nonna Maria",
    tagline:
      "You look like a skeleton! You work 14 hours and forgot to eat lunch? Sit down, let Nonna fix your life.",
    category: "wellbeing",
    costume: "nonna",
    avatar: "/avatars/nonna-maria.jpg",
    freeTier: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    slug: "viktor-05",
    name: "Viktor (Tin-Foil Drill Sergeant)",
    shortName: "Viktor",
    tagline:
      "They WANT you on the couch! Procrastination is a psy-op! Drop and give me 20!",
    category: "productivity",
    costume: "viktor",
    avatar: "/avatars/viktor-drill-sergeant.jpg",
    freeTier: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    slug: "valerian-06",
    name: "Valerian (The Cosmic Polymath)",
    shortName: "Valerian",
    tagline:
      "The cosmos breathes in entropy; your wealth grows in compounding tides. Let me sing the mathematics to you.",
    category: "learning",
    costume: "valerian",
    avatar: "/avatars/valerian-polymath.jpg",
    freeTier: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    slug: "barnaby-07",
    name: "Barnaby (The Cynical Apartment Cat)",
    shortName: "Barnaby",
    tagline:
      "You leave the warm cave for eight hours to stare at a glowing slab, and you think I'M the irrational one?",
    category: "lifestyle",
    costume: "barnaby",
    avatar: "/avatars/barnaby-cat.jpg",
    freeTier: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    slug: "ren-08",
    name: "Ren (The Shy Metaphysician)",
    shortName: "Ren",
    tagline:
      "I... um, was just re-reading Kierkegaard. But if you want to talk about why being alive feels so heavy... I'm here.",
    category: "philosophy",
    costume: "ren",
    avatar: "/avatars/ren-philosopher.jpg",
    freeTier: false,
  },
];

export const COSTUME_CLASS: Record<PosterCostumeId, string> = {
  maya: "bg-costume-maya",
  marcus: "bg-costume-marcus",
  priya: "bg-costume-priya",
  alex: "bg-costume-alex",
  nonna: "bg-costume-nonna",
  viktor: "bg-costume-viktor",
  valerian: "bg-costume-valerian",
  barnaby: "bg-costume-barnaby",
  ren: "bg-costume-ren",
  custom: "bg-costume-custom",
  jules: "bg-costume-jules",
  meera: "bg-costume-meera",
  kenji: "bg-costume-kenji",
  sofia: "bg-costume-sofia",
};

/** Full class strings so Tailwind emits the 90% costume wash. */
export const COSTUME_WASH_CLASS: Record<PosterCostumeId, string> = {
  maya: "bg-costume-maya/90",
  marcus: "bg-costume-marcus/90",
  priya: "bg-costume-priya/90",
  alex: "bg-costume-alex/90",
  nonna: "bg-costume-nonna/90",
  viktor: "bg-costume-viktor/90",
  valerian: "bg-costume-valerian/90",
  barnaby: "bg-costume-barnaby/90",
  ren: "bg-costume-ren/90",
  custom: "bg-costume-custom/90",
  jules: "bg-costume-jules/90",
  meera: "bg-costume-meera/90",
  kenji: "bg-costume-kenji/90",
  sofia: "bg-costume-sofia/90",
};
