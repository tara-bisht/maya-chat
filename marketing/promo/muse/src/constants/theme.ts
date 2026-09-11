export const COLORS = {
  night: '#14110F',
  cream: '#F6EFE4',
  creamDim: '#E4D8C8',
  inkSoft: '#B7A99A',
  rule: '#3A342E',
  acid: '#FF4D2E',
  acidHover: '#E03A1C',
  onAcid: '#14110F',
  stub: '#D6F25C',
  onStub: '#14110F',
  codeWell: '#0C0A09',
  onCode: '#E4D8C8',
  costumes: {
    marcus: '#1F5A3C', // moss
    priya: '#9B1B4E', // magenta
    alex: '#3A2418', // espresso
    nonna: '#B33A1C', // tomato
    viktor: '#4A6324', // olive
    valerian: '#24306E', // indigo
    barnaby: '#8A3F16', // tawny
    ren: '#3A4A58', // slate
  },
} as const;

export type CostumeKey = keyof typeof COLORS.costumes;

export const FONTS = {
  display: '"Fraunces", Georgia, serif',
  sans: '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"IBM Plex Mono", Menlo, Monaco, Consolas, monospace',
};

export interface CharacterRosterItem {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  category: string;
  costume: CostumeKey;
  avatar: string;
  freeTier: boolean;
  tilt: number;
}

// Taglines from apps/web/lib/company.ts. Poster tilts from docs/DESIGN.md.
export const CHARACTERS: CharacterRosterItem[] = [
  {
    id: 'marcus',
    name: 'Marcus (The Savage Stoic)',
    shortName: 'Marcus',
    tagline:
      "Your feelings are valid, but your excuses are pathetic. Let's fix your mindset.",
    category: 'PHILOSOPHY',
    costume: 'marcus',
    avatar: 'avatars/marcus-stoic.jpg',
    freeTier: true,
    tilt: -2.8,
  },
  {
    id: 'priya',
    name: 'Dr. Priya (Flirty STEM Prof)',
    shortName: 'Dr. Priya',
    tagline:
      "Are you an asymptote? Because I find myself getting arbitrarily close to you... Now let's integrate this function.",
    category: 'LEARNING',
    costume: 'priya',
    avatar: 'avatars/dr-priya-stem.jpg',
    freeTier: true,
    tilt: 2.4,
  },
  {
    id: 'alex',
    name: 'Alex (Exhausted 10x Tech Lead)',
    shortName: 'Alex',
    tagline:
      "I've had 4 espressos, 2 outages, and your PR just gave me a 5th headache. Let's fix this before prod dies.",
    category: 'PRODUCTIVITY',
    costume: 'alex',
    avatar: 'avatars/alex-tech-lead.jpg',
    freeTier: false,
    tilt: -1.6,
  },
  {
    id: 'nonna',
    name: 'Nonna Maria (Fierce Italian Grandma)',
    shortName: 'Nonna Maria',
    tagline:
      'You look like a skeleton! You work 14 hours and forgot to eat lunch? Sit down, let Nonna fix your life.',
    category: 'WELLBEING',
    costume: 'nonna',
    avatar: 'avatars/nonna-maria.jpg',
    freeTier: false,
    tilt: 3.2,
  },
  {
    id: 'viktor',
    name: 'Viktor (Tin-Foil Drill Sergeant)',
    shortName: 'Viktor',
    tagline:
      'They WANT you on the couch! Procrastination is a psy-op! Drop and give me 20!',
    category: 'PRODUCTIVITY',
    costume: 'viktor',
    avatar: 'avatars/viktor-drill-sergeant.jpg',
    freeTier: false,
    tilt: -2.2,
  },
  {
    id: 'valerian',
    name: 'Valerian (The Cosmic Polymath)',
    shortName: 'Valerian',
    tagline:
      'The cosmos breathes in entropy; your wealth grows in compounding tides. Let me sing the mathematics to you.',
    category: 'LEARNING',
    costume: 'valerian',
    avatar: 'avatars/valerian-polymath.jpg',
    freeTier: false,
    tilt: 1.8,
  },
  {
    id: 'barnaby',
    name: 'Barnaby (The Cynical Apartment Cat)',
    shortName: 'Barnaby',
    tagline:
      "You leave the warm cave for eight hours to stare at a glowing slab, and you think I'M the irrational one?",
    category: 'LIFESTYLE',
    costume: 'barnaby',
    avatar: 'avatars/barnaby-cat.jpg',
    freeTier: false,
    tilt: -3.1,
  },
  {
    id: 'ren',
    name: 'Ren (The Shy Metaphysician)',
    shortName: 'Ren',
    tagline:
      "I... um, was just re-reading Kierkegaard. But if you want to talk about why being alive feels so heavy... I'm here.",
    category: 'PHILOSOPHY',
    costume: 'ren',
    avatar: 'avatars/ren-philosopher.jpg',
    freeTier: false,
    tilt: 2.1,
  },
];
