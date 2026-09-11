import { CHARACTERS, COLORS } from '../constants/theme';

// Uniform question asked across every demo chat.
export const USER_Q = 'I keep procrastinating on my thesis. Help?';

// Bland reply from the sterile app (scene 1).
export const STERILE_REPLY_LINES = [
  'Here are 5 tips for beating procrastination:',
  '1. Make a schedule.',
  '2. Remove distractions.',
  '3. Take regular breaks.',
  '4. Stay positive.',
  '5. Try your best.',
];

// In-voice replies for the personality montage + switch (scene 2-3).
export const DEMO_REPLIES: Record<string, string> = {
  marcus:
    'Your thesis is not the problem. Your habits are. Butt in chair. Phone in another room. Write 200 ugly words. Now.',
  nonna:
    'Procrastinating? You look like a skeleton! Eat something first, tesoro — then Nonna sits right here while you write.',
  viktor:
    'PROCRASTINATION IS A PSY-OP! They WANT you on the couch! Drop and give me 20 — then 20 minutes of writing. MOVE!',
  priya:
    'Ooh — a thesis that approaches done but never arrives? Sounds like an asymptote, cutie. Let us integrate it one page at a time.',
  barnaby:
    'You stare at the glowing slab for eight hours and write nothing, and I am the irrational one? Fascinating.',
};

export interface ExploreAgent {
  avatar: string;
  name: string;
  soon?: boolean;
}

export interface ExploreRow {
  label: string;
  body: string;
  agents: ExploreAgent[];
}

// Category rows mirror apps/web/lib/marketplace/bill.ts.
export const EXPLORE_ROWS: ExploreRow[] = [
  {
    label: 'LEARNING',
    body: 'Proofs, drafts, and money.',
    agents: [
      { avatar: 'avatars/dr-priya-stem.jpg', name: 'Dr. Priya' },
      { avatar: 'avatars/valerian-polymath.jpg', name: 'Valerian' },
      { avatar: 'avatars/sofia-economist.jpg', name: 'Sofia', soon: true },
      { avatar: 'avatars/meera-editor.jpg', name: 'Meera', soon: true },
    ],
  },
  {
    label: 'PHILOSOPHY',
    body: 'A roast, then the dichotomy.',
    agents: [
      { avatar: 'avatars/marcus-stoic.jpg', name: 'Marcus' },
      { avatar: 'avatars/ren-philosopher.jpg', name: 'Ren' },
    ],
  },
  {
    label: 'PRODUCTIVITY',
    body: 'The PR is on fire.',
    agents: [
      { avatar: 'avatars/alex-tech-lead.jpg', name: 'Alex' },
      { avatar: 'avatars/viktor-drill-sergeant.jpg', name: 'Viktor' },
      { avatar: 'avatars/kenji-panel.jpg', name: 'Kenji', soon: true },
    ],
  },
  {
    label: 'WELLBEING',
    body: 'Sit down. Eat. Then we talk.',
    agents: [{ avatar: 'avatars/nonna-maria.jpg', name: 'Nonna Maria' }],
  },
  {
    label: 'LIFESTYLE',
    body: 'A cat and a cinephile.',
    agents: [
      { avatar: 'avatars/barnaby-cat.jpg', name: 'Barnaby' },
      { avatar: 'avatars/jules-cinephile.jpg', name: 'Jules', soon: true },
    ],
  },
];

export const MONTAGE_ORDER = ['nonna', 'viktor', 'priya', 'barnaby'];

export function characterById(id: string) {
  const found = CHARACTERS.find((c) => c.id === id);
  if (!found) throw new Error(`unknown character ${id}`);
  return found;
}

export const STERILE = {
  window: '#EDEDEA',
  header: '#FFFFFF',
  ink: '#2B2B2B',
  sub: '#8A8A8A',
  userBubble: '#2F7CF6',
  agentBubble: '#FFFFFF',
  border: '#D8D8D4',
};

export const CUSTOM_COSTUME = COLORS.stub;
