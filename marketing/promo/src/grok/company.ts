import {colors} from './theme';

export type CostumeId = keyof typeof colors.costume;

export type Player = {
  id: CostumeId;
  shortName: string;
  tagline: string;
  category: string;
  costume: CostumeId;
  color: string;
  avatar: string;
  freeTier: boolean;
  tilt: number;
};

export const COMPANY: Player[] = [
  {
    id: 'marcus',
    shortName: 'Marcus',
    tagline: 'Your feelings are valid, but your excuses are pathetic. Let\'s fix your mindset.',
    category: 'philosophy',
    costume: 'marcus',
    color: colors.costume.marcus,
    avatar: 'avatars/marcus-stoic.jpg',
    freeTier: true,
    tilt: -2.8,
  },
  {
    id: 'priya',
    shortName: 'Dr. Priya',
    tagline:
      'Are you an asymptote? Because I find myself getting arbitrarily close to you... Now let\'s integrate this function.',
    category: 'learning',
    costume: 'priya',
    color: colors.costume.priya,
    avatar: 'avatars/dr-priya-stem.jpg',
    freeTier: true,
    tilt: 2.4,
  },
  {
    id: 'alex',
    shortName: 'Alex',
    tagline:
      'I\'ve had 4 espressos, 2 outages, and your PR just gave me a 5th headache. Let\'s fix this before prod dies.',
    category: 'productivity',
    costume: 'alex',
    color: colors.costume.alex,
    avatar: 'avatars/alex-tech-lead.jpg',
    freeTier: false,
    tilt: -1.6,
  },
  {
    id: 'nonna',
    shortName: 'Nonna Maria',
    tagline: 'You look like a skeleton! You work 14 hours and forgot to eat lunch? Sit down, let Nonna fix your life.',
    category: 'wellbeing',
    costume: 'nonna',
    color: colors.costume.nonna,
    avatar: 'avatars/nonna-maria.jpg',
    freeTier: false,
    tilt: 3.2,
  },
  {
    id: 'viktor',
    shortName: 'Viktor',
    tagline: 'They WANT you on the couch! Procrastination is a psy-op! Drop and give me 20!',
    category: 'productivity',
    costume: 'viktor',
    color: colors.costume.viktor,
    avatar: 'avatars/viktor-drill-sergeant.jpg',
    freeTier: false,
    tilt: -2.2,
  },
  {
    id: 'valerian',
    shortName: 'Valerian',
    tagline:
      'The cosmos breathes in entropy; your wealth grows in compounding tides. Let me sing the mathematics to you.',
    category: 'learning',
    costume: 'valerian',
    color: colors.costume.valerian,
    avatar: 'avatars/valerian-polymath.jpg',
    freeTier: false,
    tilt: 1.8,
  },
  {
    id: 'barnaby',
    shortName: 'Barnaby',
    tagline:
      'You leave the warm cave for eight hours to stare at a glowing slab, and you think I\'M the irrational one?',
    category: 'lifestyle',
    costume: 'barnaby',
    color: colors.costume.barnaby,
    avatar: 'avatars/barnaby-cat.jpg',
    freeTier: false,
    tilt: -3.1,
  },
  {
    id: 'ren',
    shortName: 'Ren',
    tagline: 'I... um, was just re-reading Kierkegaard. But if you want to talk about why being alive feels so heavy... I\'m here.',
    category: 'philosophy',
    costume: 'ren',
    color: colors.costume.ren,
    avatar: 'avatars/ren-philosopher.jpg',
    freeTier: false,
    tilt: 2.1,
  },
];

export function playerById(id: CostumeId): Player {
  const found = COMPANY.find((entry) => entry.id === id);
  if (!found) {
    throw new Error(`Unknown player: ${id}`);
  }
  return found;
}
