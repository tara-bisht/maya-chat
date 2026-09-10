import { COMPANY, type CostumeId } from "@/lib/company";

/** Jump links shared by the lobby header and footer. */
export const LOBBY_NAV = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/#house", label: "How it works" },
  { href: "/#studio", label: "Create an agent" },
  { href: "/#seats", label: "Plans" },
] as const;

const TITLE_LEAD = "Give your AI a ";
const TITLE_MARK = "personality.";

export const HERO = {
  titleLead: TITLE_LEAD,
  titleMark: TITLE_MARK,
  title: `${TITLE_LEAD}${TITLE_MARK}`,
  body: "Not a sterile chatbot. Cast a character with a point of view — or write one. Name, backstory, tone. Built for the job in front of you.",
  lineup: "Start with a voice. Or write yours.",
  sticker: "Write yours in Studio",
} as const;

export type HeroScene = {
  id: string;
  shortName: string;
  costume: CostumeId;
  avatar: string;
  freeTier: boolean;
  kicker: string;
  quote: string;
  prompt: string;
};

function companyPlayer(shortName: string) {
  const player = COMPANY.find((entry) => entry.shortName === shortName);
  if (!player) {
    throw new Error(`Unknown company player: ${shortName}`);
  }
  return player;
}

const MARCUS = companyPlayer("Marcus");
const PRIYA = companyPlayer("Dr. Priya");
const ALEX = companyPlayer("Alex");

/** Scripted House-window turns for the lobby hero. Marketing copy, not prompts. */
export const HERO_SCENES: HeroScene[] = [
  {
    id: "marcus",
    shortName: MARCUS.shortName,
    costume: MARCUS.costume,
    avatar: MARCUS.avatar,
    freeTier: MARCUS.freeTier,
    kicker: "Mindset",
    quote:
      "Delay is fear in a nicer shirt. The work is yours; the mood is not. Twenty ugly minutes. Now.",
    prompt: "I keep putting off the thing that actually matters.",
  },
  {
    id: "priya",
    shortName: PRIYA.shortName,
    costume: PRIYA.costume,
    avatar: PRIYA.avatar,
    freeTier: PRIYA.freeTier,
    kicker: "Learning",
    quote:
      "Outer function, inner function — I do like a close approach. Differentiate the outside, multiply by the inside. Your move: d/dx of sin(x²).",
    prompt: "Walk me through the chain rule without the textbook voice.",
  },
  {
    id: "alex",
    shortName: ALEX.shortName,
    costume: ALEX.costume,
    avatar: ALEX.avatar,
    freeTier: ALEX.freeTier,
    kicker: "Code",
    quote:
      "You are not shipping 800 lines tonight. Split the migration. If prod pages me it will be the “also cleaned up the logger” hunk.",
    prompt: "This PR is 800 lines and I need it tonight.",
  },
];

export const COMPANY_KICKER = {
  kicker: "Featured",
  title: "Start with a voice",
  body: "A few we already wrote. Borrow one tonight. Then open Studio and make the one you actually need.",
} as const;

export type NightScene = {
  id: string;
  costume: CostumeId;
  player: string;
  kicker: string;
  title: string;
  body: string;
};

export const NIGHTS: NightScene[] = [
  {
    id: "maths",
    costume: "priya",
    player: "Dr. Priya",
    kicker: "Learning",
    title: "When you are learning maths",
    body: "You need pedagogical rigor, an interactive breakdown, and a little banter — not a cold formula dump.",
  },
  {
    id: "advice",
    costume: "nonna",
    player: "Nonna Maria",
    kicker: "Wellbeing",
    title: "When you need advice",
    body: "You need fierce care or a stoic roast — not a canned corporate disclaimer.",
  },
  {
    id: "code",
    costume: "alex",
    player: "Alex",
    kicker: "Productivity",
    title: "When the PR is on fire",
    body: "You need production edge cases from someone who has been on call too long — not a cheerful autocomplete.",
  },
];

export const NIGHTS_KICKER = {
  kicker: "Scenes",
  title: "Different moments, different personalities",
  body: "A proof, a pep talk, and a production fire do not share a voice. If none of these fit, you write one.",
} as const;

export const HOUSE_KICKER = {
  kicker: "How it works",
  title: "Three steps",
  body: "Pick a voice or write one. Chat. They keep the thread.",
} as const;

export const HOUSE_STEPS = [
  {
    n: "01",
    title: "Pick or create",
    body: "Start from a featured character, or open Studio and write your own — name, backstory, tone.",
  },
  {
    n: "02",
    title: "Chat",
    body: "They stay in character. The app chrome does not impersonate them. Yours will not either.",
  },
  {
    n: "03",
    title: "They remember",
    body: "Plus and Pro keep private memory per agent. Free keeps the latest stretch of the thread. Pick the model they speak through.",
  },
] as const;

export const STUDIO = {
  kicker: "Create an agent",
  title: "Write the personality",
  body: "Name, tagline, costume, backstory. Warmth, directness, humor. Language presets include Hinglish and Hindi — real Devanagari. This is the platform, not a side door.",
  cap: "Free: 3 public · Plus: 10 · Pro: unlimited",
  fields: [
    { label: "Name", value: "Yours" },
    { label: "Tagline", value: "One line they would actually say" },
    { label: "Language", value: "Global English · Hinglish · Hindi" },
    { label: "Tone", value: "Warmth · Directness · Humor" },
  ],
} as const;

/**
 * Seed seat copy. Source of truth at runtime is `public.plans` /
 * `public.plan_models` (PR4). Do not scatter these numbers in JSX.
 */
export type SeatCtaKind = "acid" | "ghost";

export type Seat = {
  id: "free" | "plus" | "pro";
  name: string;
  price: string;
  cadence: string;
  stamp: string;
  stampTone: "cream" | "stub";
  cta: { href: "/login"; label: string; kind: SeatCtaKind };
  bullets: string[];
  models: string[];
};

export const SEATS: Seat[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "No bill",
    stamp: "Included",
    stampTone: "cream",
    cta: { href: "/login", label: "Get started", kind: "acid" },
    bullets: [
      "50 messages a day",
      "Starter voices + 3 of yours, public",
      "No vector memory",
      "No tools",
    ],
    models: ["qwen-flash", "gemini-flash", "grok-fast"],
  },
  {
    id: "plus",
    name: "Plus",
    price: "$9",
    cadence: "/ month · $90 / year",
    stamp: "Plus",
    stampTone: "stub",
    cta: { href: "/login", label: "Sign in", kind: "ghost" },
    bullets: [
      "200 messages a day",
      "Every featured voice",
      "10 custom agents, public or private",
      "Private per-agent memory",
      "Memory saver, math solver",
    ],
    models: ["qwen-flash", "gemini-flash", "grok-fast", "deepseek", "qwen", "grok", "gpt"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    cadence: "/ month · $190 / year",
    stamp: "Pro",
    stampTone: "stub",
    cta: { href: "/login", label: "Sign in", kind: "ghost" },
    bullets: [
      "Unlimited messages",
      "Every featured voice",
      "Unlimited custom agents, public or private",
      "Private per-agent memory",
      "Plus tools, and web search",
    ],
    models: [
      "qwen-flash",
      "gemini-flash",
      "grok-fast",
      "deepseek",
      "qwen",
      "grok",
      "gpt",
      "claude",
      "kimi",
    ],
  },
];

export const SEATS_KICKER = {
  kicker: "Pricing",
  title: "Plans",
  body: "Free lets you start and build. Plus opens the full wall and private characters. Pro is unlimited Studio.",
} as const;

export const SEATS_FOOTNOTE =
  "Plans follow the catalog. Prices and models can move without a deploy.";

export const NOTES = [
  {
    q: "Can I make my own agent?",
    a: "Yes. That is the point. Name, tagline, costume, backstory, tone. Free keeps three public. Plus gets ten, public or private. Pro is unlimited.",
  },
  {
    q: "What can I do on Free?",
    a: "Talk to a starter voice, then write three public characters of your own. Fifty messages a day. Models: qwen-flash, gemini-flash, and grok-fast. No memory, no private agents, no tools. Then upgrade, or come back tomorrow.",
  },
  {
    q: "Do they remember me?",
    a: "Plus and Pro keep private memory per agent. One character does not hear what you told another. Free keeps the last stretch of the thread only.",
  },
  {
    q: "Hindi and Hinglish?",
    a: "First-class. Custom agents get language presets. Devanagari is real type.",
  },
  {
    q: "Which models?",
    a: "The model is the instrument, not the character. Free: Gemini Flash and Grok Fast. Plus adds DeepSeek, Qwen, Grok, and GPT. Pro adds Claude and Kimi.",
  },
] as const;

export const FOOTER = {
  wordmark: "Maya",
  tagline:
    "Opinionated AI — yours, or one we already wrote. Not a helpdesk. Not a copilot.",
} as const;
