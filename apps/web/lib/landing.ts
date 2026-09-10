import type { CostumeId } from "@/lib/company";

/** Jump links shared by the lobby header and footer. */
export const LOBBY_NAV = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/#house", label: "How it works" },
  { href: "/#studio", label: "Create an agent" },
  { href: "/#seats", label: "Plans" },
] as const;

export const HERO = {
  title: "Talk to someone with a point of view.",
  body: "Don't talk to a boring AI chatbot. Eight agents, zero generic answers — math with a flirt, stoicism with a roast, code review from someone who has been on call too long.",
  lineup: "Choose an agent, or create your own.",
  sticker: "Marcus + Priya on Free",
} as const;

export const COMPANY_KICKER = {
  kicker: "The agents",
  title: "Meet the lineup",
  body: "Two agents on Free. Six need Plus. Create your own in Studio.",
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

export const HOUSE_STEPS = [
  {
    n: "01",
    title: "Pick an agent",
    body: "Eight featured agents. Marcus and Dr. Priya are free. The others need Plus.",
  },
  {
    n: "02",
    title: "Chat",
    body: "They stay in character. The app chrome does not impersonate them.",
  },
  {
    n: "03",
    title: "They remember",
    body: "Plus and Pro keep private memory per agent. Free keeps the latest stretch of the thread. Pick the model they speak through.",
  },
] as const;

export const STUDIO = {
  kicker: "Create an agent",
  title: "Your own character",
  body: "Name, tagline, color, backstory. Warmth, directness, humor. Language presets include Hinglish and Hindi — real Devanagari.",
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
      "Marcus + Dr. Priya",
      "3 public custom agents",
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
      "All eight agents",
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
      "All eight agents",
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

export const SEATS_FOOTNOTE =
  "Plans follow the catalog. Prices and models can move without a deploy.";

export const NOTES = [
  {
    q: "What can I do on Free?",
    a: "Marcus and Dr. Priya. Fifty messages a day. Models: qwen-flash, gemini-flash, and grok-fast. Three public custom agents. No memory, no private agents, no tools. Then upgrade, or come back tomorrow.",
  },
  {
    q: "Do they remember me?",
    a: "Plus and Pro keep private memory per agent. Marcus does not hear what you told Nonna. Free keeps the last stretch of the thread only.",
  },
  {
    q: "Can I make my own agent?",
    a: "Free can create three public agents. Plus gets ten, public or private. Pro is unlimited. Tone sliders apply to custom agents only — curated prompts stay locked.",
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
    "Opinionated AI characters. Not a helpdesk. Not a copilot.",
} as const;
