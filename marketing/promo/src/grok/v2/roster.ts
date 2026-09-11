import {COMPANY, type Player} from '../company';
import {colors} from '../theme';

export type StampTone = 'free' | 'plus' | 'house' | 'next-bill';

export type WallCard = {
  id: string;
  shortName: string;
  tagline: string;
  category: string;
  color: string;
  avatar?: string;
  stamp: StampTone;
  tilt: number;
};

const COSTUME_CYCLE = [
  colors.costume.marcus,
  colors.costume.priya,
  colors.costume.alex,
  colors.costume.nonna,
  colors.costume.viktor,
  colors.costume.valerian,
  colors.costume.barnaby,
  colors.costume.ren,
  colors.costume.custom,
  colors.costume.jules,
  colors.costume.meera,
  colors.costume.kenji,
  colors.costume.sofia,
] as const;

export const COMING_SOON: WallCard[] = [
  {
    id: 'jules',
    shortName: 'Jules',
    tagline: 'That ending was a cop-out and you know it. Sit down. We are talking about the cut.',
    category: 'lifestyle',
    color: colors.costume.jules,
    avatar: 'avatars/jules-cinephile.jpg',
    stamp: 'next-bill',
    tilt: -2.4,
  },
  {
    id: 'meera',
    shortName: 'Meera',
    tagline: "I will bleed on this draft. Then I'll tell you why sentence three is the real lede.",
    category: 'learning',
    color: colors.costume.meera,
    avatar: 'avatars/meera-editor.jpg',
    stamp: 'next-bill',
    tilt: 2.1,
  },
  {
    id: 'kenji',
    shortName: 'Kenji',
    tagline: "Walk me through it like I'm the panel that already hates take-home tests.",
    category: 'productivity',
    color: colors.costume.kenji,
    avatar: 'avatars/kenji-panel.jpg',
    stamp: 'next-bill',
    tilt: -1.4,
  },
  {
    id: 'sofia',
    shortName: 'Sofia',
    tagline: "Your emergency fund is a shopping bag. Let's talk about money like adults, not a TED talk.",
    category: 'learning',
    color: colors.costume.sofia,
    avatar: 'avatars/sofia-economist.jpg',
    stamp: 'next-bill',
    tilt: 2.6,
  },
];

export const RHEA: WallCard = {
  id: 'rhea',
  shortName: 'Rhea',
  tagline: "You hired a spine. I don't do pep talks.",
  category: 'custom',
  color: colors.costume.custom,
  stamp: 'house',
  tilt: -1.8,
};

const HOUSE_SEEDS: Array<[string, string, string]> = [
  ['Lina', 'Walk me through it like I skipped the lecture.', 'learning'],
  ['Otto', 'Your outline is a stall. Write the ugly paragraph.', 'learning'],
  ['Sable', 'Compounding is boring. That is the point. Leave it.', 'learning'],
  ['Noor', 'Stay with the question. Do not decorate it.', 'philosophy'],
  ['Cass', 'Your feelings are data. They are not a plan.', 'philosophy'],
  ['Ellis', 'We can sit with the weight. We will not perform it.', 'philosophy'],
  ['Dev', 'If prod pages you it will be the cleanup hunk.', 'productivity'],
  ['Hana', 'The ticket is the work. Slack is the costume.', 'productivity'],
  ['Ivo', 'Twenty minutes. Camera off. Then you talk.', 'productivity'],
  ['Mira', 'Eat something with a name. Then we open the tab.', 'wellbeing'],
  ['Paolo', 'You cannot out-optimize a skipped meal.', 'wellbeing'],
  ['Jun', 'Sleep is not a reward. It is the shift.', 'wellbeing'],
  ['Tess', 'You left the sun to argue with a glowing slab.', 'lifestyle'],
  ['Rafi', 'The plot hole is in act two and you felt it.', 'lifestyle'],
  ['Gita', 'Wear the thing. The closet is not a museum.', 'lifestyle'],
  ['Niko', 'Show me the proof, not the vibe.', 'learning'],
  ['Asha', 'Hinglish is allowed. Pretending you are a paper is not.', 'learning'],
  ['Bo', 'The lemma is hiding in the example you skipped.', 'learning'],
  ['Yves', 'Doubt is not a personality. Pick a side for ten minutes.', 'philosophy'],
  ['Kira', 'The couch is a psy-op. Stand up.', 'productivity'],
];

function tiltFor(index: number): number {
  const bag = [-2.8, 2.2, -1.6, 3.1, -2.1, 1.4, 2.6, -3.0];
  return bag[index % bag.length];
}

function houseWall(): WallCard[] {
  const cards: WallCard[] = [];
  for (let i = 0; i < 88; i++) {
    const seed = HOUSE_SEEDS[i % HOUSE_SEEDS.length];
    const cycle = Math.floor(i / HOUSE_SEEDS.length);
    const shortName = cycle === 0 ? seed[0] : `${seed[0]} ${'KMBRNTL'[cycle]}`;
    cards.push({
      id: `house-${i}`,
      shortName,
      tagline: seed[1],
      category: seed[2],
      color: COSTUME_CYCLE[i % COSTUME_CYCLE.length],
      stamp: 'house',
      tilt: tiltFor(i),
    });
  }
  return cards;
}

export const FEATURED: WallCard[] = COMPANY.map((player) => ({
  id: player.id,
  shortName: player.shortName,
  tagline: player.tagline,
  category: player.category,
  color: player.color,
  avatar: player.avatar,
  stamp: player.freeTier ? 'free' : 'plus',
  tilt: player.tilt,
}));

export const WALL: WallCard[] = [...FEATURED, ...COMING_SOON, ...houseWall()];

export function playerCard(player: Player): WallCard {
  return {
    id: player.id,
    shortName: player.shortName,
    tagline: player.tagline,
    category: player.category,
    color: player.color,
    avatar: player.avatar,
    stamp: player.freeTier ? 'free' : 'plus',
    tilt: player.tilt,
  };
}

export const CATEGORIES = [
  'learning',
  'philosophy',
  'productivity',
  'wellbeing',
  'lifestyle',
] as const;
