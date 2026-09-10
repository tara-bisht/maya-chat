import type { CostumeId } from "@/lib/company";

/** Jump links shared by the lobby header and footer. */
export const LOBBY_NAV = [
  { href: "#company", label: "Company" },
  { href: "#house", label: "The house" },
  { href: "#studio", label: "Studio" },
  { href: "#seats", label: "Seats" },
] as const;

export const HERO = {
  title: "Talk to someone with a point of view.",
  body: "Don't talk to a boring AI chatbot. Eight players, zero generic answers — math with a flirt, stoicism with a roast, code review from someone who has been on call too long.",
  lineup: "Tonight's lineup. Choose a player, or cast your own in the Studio.",
  sticker: "Marcus + Priya on Free",
} as const;

export const COMPANY_KICKER = {
  kicker: "The lineup",
  title: "Tonight's company",
  body: "Two players on Free. Six stamped Plus. Studio is where you cast your own.",
} as const;

export type NightScene = {
  id: string;
  costume: CostumeId;
  player: string;
  kicker: string;
  title: string;
  body: string;
  tilt: number;
};

export const NIGHTS: NightScene[] = [
  {
    id: "maths",
    costume: "priya",
    player: "Dr. Priya",
    kicker: "Learning",
    title: "When you are learning maths",
    body: "You need pedagogical rigor, an interactive breakdown, and a little banter — not a cold formula dump.",
    tilt: -2.4,
  },
  {
    id: "advice",
    costume: "nonna",
    player: "Nonna Maria",
    kicker: "Wellbeing",
    title: "When you need advice",
    body: "You need fierce care or a stoic roast — not a canned corporate disclaimer.",
    tilt: 2.2,
  },
  {
    id: "code",
    costume: "alex",
    player: "Alex",
    kicker: "Productivity",
    title: "When the PR is on fire",
    body: "You need production edge cases from someone who has been on call too long — not a cheerful autocomplete.",
    tilt: -1.7,
  },
];

export const HOUSE_STEPS = [
  {
    n: "01",
    title: "Pick a player",
    body: "Eight on the wall tonight. Marcus and Dr. Priya are already in. The rest of the company plays Plus.",
  },
  {
    n: "02",
    title: "Talk",
    body: "Attributed dialogue on night paper. Costume wash on their turn. They stay in character. Chrome does not impersonate them.",
  },
  {
    n: "03",
    title: "They remember",
    body: "Plus and Pro keep private memory per player. Free is the last stretch of the thread. Pick the instrument with “Voice through {alias}.”",
  },
] as const;

export const STUDIO = {
  kicker: "Casting notes",
  title: "Cast your own",
  body: "Name, tagline, costume, backstory. Warmth, directness, humor. Language presets include Hinglish and Hindi — real Devanagari, not a costume.",
  cap: "Plus: 5 · Pro: unlimited · Free: none",
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
  tilt: number;
};

export const SEATS: Seat[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "No bill",
    stamp: "In tonight",
    stampTone: "cream",
    cta: { href: "/login", label: "Get a wristband", kind: "acid" },
    bullets: [
      "50 messages a day",
      "Marcus + Dr. Priya",
      "No custom players",
      "No vector memory",
      "No tools",
    ],
    models: ["gemini-flash", "grok-fast"],
    tilt: -1.4,
  },
  {
    id: "plus",
    name: "Plus",
    price: "$9",
    cadence: "/ month · $90 / year",
    stamp: "Plus",
    stampTone: "stub",
    cta: { href: "/login", label: "Wristband check", kind: "ghost" },
    bullets: [
      "200 messages a day",
      "All eight players",
      "5 custom players",
      "Private per-agent memory",
      "Memory saver, math solver",
    ],
    models: ["gemini-flash", "grok-fast", "deepseek", "qwen", "grok", "gpt"],
    tilt: 1.2,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    cadence: "/ month · $190 / year",
    stamp: "Pro",
    stampTone: "stub",
    cta: { href: "/login", label: "Wristband check", kind: "ghost" },
    bullets: [
      "Unlimited messages",
      "All eight players",
      "Unlimited custom players",
      "Private per-agent memory",
      "Plus tools, and web search",
    ],
    models: [
      "gemini-flash",
      "grok-fast",
      "deepseek",
      "qwen",
      "grok",
      "gpt",
      "claude",
      "kimi",
    ],
    tilt: -0.8,
  },
];

export const SEATS_FOOTNOTE =
  "Seats follow the catalog. Prices and voices can move without a deploy.";

export const NOTES = [
  {
    q: "What can I do on Free?",
    a: "Marcus and Dr. Priya. Fifty lines a day. Voices: gemini-flash and grok-fast. No memory, no custom players, no tools. Daily curtain, then a better seat or tomorrow.",
  },
  {
    q: "Do they remember me?",
    a: "Plus and Pro keep private episodic memory per player. Marcus does not hear what you told Nonna. Free keeps the last stretch of the thread only.",
  },
  {
    q: "Can I make my own player?",
    a: "Studio is on Plus (five roles) and Pro (unlimited). Free stays with the company. Tone sliders overlay custom players only — curated prompts stay locked.",
  },
  {
    q: "Hindi and Hinglish?",
    a: "First-class. Custom players get language presets. Devanagari is real type, not a pattern on the wall.",
  },
  {
    q: "Which models? What is “voice through”?",
    a: "The model is the instrument, not the character. You pick “Voice through grok-fast.” Free: Gemini Flash and Grok Fast. Plus adds DeepSeek, Qwen, Grok, and GPT. Pro adds Claude and Kimi. The catalog is the bill.",
  },
] as const;

export const FOOTER = {
  wordmark: "Maya",
  tagline:
    "A touring company for opinionated AI. Not a helpdesk. Not a copilot.",
} as const;
