import {playerById} from './company';

export const HERO = {
  titleLead: 'AI with a ',
  titleMark: 'personality.',
  body: 'Not another sterile chatbot. Talk to our resident cast of opinionated AI characters — or write your own in the Studio with custom backstory, tone, and tools.',
} as const;

export const HOOK_LINES = [
  'That’s a great question!',
  'As an AI, I can’t have a point of view.',
  '1. Break it into smaller steps.',
  '2. Try a timer.',
  '3. Be kind to yourself.',
  'I hope this helps!',
] as const;

export const PROMPT = 'I keep putting off the thing that actually matters.';

export const NIGHTS = [
  {
    player: playerById('marcus'),
    quote: 'Delay is fear in a nicer shirt. The work is yours; the mood is not. Twenty ugly minutes. Now.',
  },
  {
    player: playerById('nonna'),
    quote: 'You think the work loves you because you starve for it? Sit. Then you start. Not before.',
  },
  {
    player: playerById('barnaby'),
    quote: 'You have been circling this bowl for three days. Either eat it or knock it over.',
  },
] as const;

export const STUDIO = {
  kicker: 'Create an agent',
  title: 'Write the personality',
  fields: [
    {label: 'Name', value: 'Yours'},
    {label: 'Tagline', value: 'One line they would actually say'},
    {label: 'Language', value: 'Global English · Hinglish · Hindi'},
    {label: 'Tone', value: 'Warmth · Directness · Humor'},
  ],
} as const;

export const HOUSE_OPEN = {
  kicker: 'Tonight',
  title: 'The house is open.',
  body: 'Pick a voice, or write the one you actually need.',
  cta: 'Create an agent',
} as const;

export const WALL = {
  kicker: 'Featured',
  title: 'Start with a voice',
  body: 'A few we already wrote. Borrow one tonight. Then open Studio and make the one you actually need.',
} as const;

export const USUAL = {
  kicker: 'Scenes',
  title: 'Same question. Different night.',
  body: 'A generic chatbot hedges. A character answers.',
} as const;
