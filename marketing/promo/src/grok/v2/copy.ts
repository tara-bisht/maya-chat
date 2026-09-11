export const PROMPT = 'I keep putting off the thing that actually matters.';

export const STERILE_REPLY = [
  "That's a great question!",
  "As an AI, I can't have a point of view.",
  '1. Break it into smaller steps.',
  '2. Try a timer.',
  '3. Be kind to yourself.',
  'I hope this helps!',
] as const;

export const STERILE_KICKER = 'Every chatbot. Same voice.';

export const SMASH_LINE = 'Not this.';

export const SAME_NIGHT = {
  kicker: 'Chat',
  title: 'Same question. Different night.',
} as const;

export const NIGHT_REPLIES = {
  marcus:
    'Delay is fear in a nicer shirt. The work is yours; the mood is not. Twenty ugly minutes. Now.',
  nonna:
    'You think the work loves you because you starve for it? Sit. Then you start. Not before.',
  barnaby:
    'You have been circling this bowl for three days. Either eat it or knock it over.',
  rhea: 'You already know the work. You opened me so I would say it out loud. Ten minutes. Timer on. Go.',
} as const;

export const EXPLORE = {
  kicker: 'Explore',
  title: '100s of characters.',
  body: 'Learning · Philosophy · Productivity · Wellbeing · Lifestyle',
  count: '100s',
} as const;

export const CATEGORY_SPOTS = [
  {id: 'learning', label: 'Learning', example: 'Dr. Priya', line: 'STEM without the textbook voice.'},
  {id: 'philosophy', label: 'Philosophy', example: 'Marcus', line: 'A roast, then the dichotomy.'},
  {id: 'productivity', label: 'Productivity', example: 'Alex', line: 'The PR is on fire.'},
  {id: 'wellbeing', label: 'Wellbeing', example: 'Nonna Maria', line: 'Sit down. Eat. Then we talk.'},
  {id: 'lifestyle', label: 'Lifestyle', example: 'Barnaby', line: 'A cat who thinks you are the joke.'},
] as const;

export const STUDIO = {
  kicker: 'Create an agent',
  title: 'Write the personality.',
  name: 'Rhea',
  tagline: "You hired a spine. I don't do pep talks.",
  language: 'Global English',
  backstory:
    'A former stage director who now coaches people who already know what to do and still will not start.',
  warmth: 0.35,
  directness: 0.92,
  humor: 0.28,
  save: 'Create agent',
} as const;

export const FINALE = {
  kicker: 'Free',
  title: 'Try it free.',
  body: 'Marcus and Dr. Priya are already on the wall. Write three public characters of your own. No card tonight.',
  cta: 'getmaya.chat',
} as const;
