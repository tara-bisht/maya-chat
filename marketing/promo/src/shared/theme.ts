import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadPlexMono } from '@remotion/google-fonts/IBMPlexMono';

const frauncesItalic = loadFraunces('italic', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

const frauncesNormal = loadFraunces('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

const bricolage = loadBricolage('normal', {
  weights: ['400', '600', '700', '800'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

const plexMono = loadPlexMono('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

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
  terracotta: '#B33A1C',
  overlay: 'rgba(20, 17, 15, 0.6)',
  costumes: {
    marcus: '#1F5A3C', // moss
    priya: '#9B1B4E', // magenta
    alex: '#3A2418', // espresso
    nonna: '#B33A1C', // tomato
    viktor: '#4A6324', // olive
    valerian: '#24306E', // indigo
    barnaby: '#8A3F16', // tawny
    ren: '#3A4A58', // slate
    custom: '#5C4636', // custom / warm earth
    jules: '#4A1638', // velvet
    meera: '#1A3F3A', // pine
    kenji: '#2E2450', // dusk
    sofia: '#7A4A12', // brass
  },
} as const;

export const colors = {
  ...COLORS,
  costume: COLORS.costumes,
} as const;

export type CostumeKey = keyof typeof COLORS.costumes;
export type CostumeId = CostumeKey;

export const FONTS = {
  display: `${frauncesItalic.fontFamily}, Georgia, serif`,
  sans: `${bricolage.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  mono: `${plexMono.fontFamily}, Menlo, Monaco, Consolas, monospace`,
};

export const fontDisplay = FONTS.display;
export const fontSans = FONTS.sans;
export const fontMono = FONTS.mono;

export const radii = {
  sm: 4,
  md: 10,
  lg: 14,
} as const;

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;

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

// Canonical taglines from apps/web/lib/company.ts and apps/web/lib/marketplace/bill.ts.
// Tilts from docs/DESIGN.md.
export const CHARACTERS: CharacterRosterItem[] = [
  {
    id: 'marcus',
    name: 'Marcus (The Savage Stoic)',
    shortName: 'Marcus',
    tagline: "Your feelings are valid, but your excuses are pathetic. Let's fix your mindset.",
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
    tagline: "Are you an asymptote? Because I find myself getting arbitrarily close to you... Now let's integrate this function.",
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
    tagline: "I've had 4 espressos, 2 outages, and your PR just gave me a 5th headache. Let's fix this before prod dies.",
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
    tagline: 'You look like a skeleton! You work 14 hours and forgot to eat lunch? Sit down, let Nonna fix your life.',
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
    tagline: 'They WANT you on the couch! Procrastination is a psy-op! Drop and give me 20!',
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
    tagline: 'The cosmos breathes in entropy; your wealth grows in compounding tides. Let me sing the mathematics to you.',
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
    tagline: "You leave the warm cave for eight hours to stare at a glowing slab, and you think I'M the irrational one?",
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
    tagline: "I... um, was just re-reading Kierkegaard. But if you want to talk about why being alive feels so heavy... I'm here.",
    category: 'PHILOSOPHY',
    costume: 'ren',
    avatar: 'avatars/ren-philosopher.jpg',
    freeTier: false,
    tilt: 2.1,
  },
  {
    id: 'jules',
    name: 'Jules (The Arthouse Cinephile)',
    shortName: 'Jules',
    tagline: "That ending was a cop-out and you know it. Sit down. We're talking about the cut.",
    category: 'LIFESTYLE',
    costume: 'jules',
    avatar: 'avatars/jules-cinephile.jpg',
    freeTier: false,
    tilt: -2.4,
  },
  {
    id: 'meera',
    name: 'Meera (The Ruthless Copy Editor)',
    shortName: 'Meera',
    tagline: "I will bleed on this draft. Then I'll tell you why sentence three is the real lede.",
    category: 'LEARNING',
    costume: 'meera',
    avatar: 'avatars/meera-editor.jpg',
    freeTier: false,
    tilt: 2.1,
  },
  {
    id: 'kenji',
    name: 'Kenji (The Mock Interviewer)',
    shortName: 'Kenji',
    tagline: "Walk me through it like I'm the panel that already hates take-home tests.",
    category: 'PRODUCTIVITY',
    costume: 'kenji',
    avatar: 'avatars/kenji-panel.jpg',
    freeTier: false,
    tilt: -1.4,
  },
  {
    id: 'sofia',
    name: 'Sofia (The Cynical Economist)',
    shortName: 'Sofia',
    tagline: "Your emergency fund is a shopping bag. Let's talk about money like adults, not a TED talk.",
    category: 'LEARNING',
    costume: 'sofia',
    avatar: 'avatars/sofia-economist.jpg',
    freeTier: false,
    tilt: 2.6,
  },
];

export function getCharacter(id: string): CharacterRosterItem | undefined {
  return CHARACTERS.find((c) => c.id === id);
}
