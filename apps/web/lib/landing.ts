import { COMPANY, type CostumeId } from "@/lib/company";

/** Jump links shared by the lobby header and footer. */
export const LOBBY_NAV = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/#house", label: "How it works" },
  { href: "/#studio", label: "Create an agent" },
  { href: "/#seats", label: "Plans" },
] as const;

const TITLE_LEAD = "AI with a ";
const TITLE_MARK = "personality.";

export const HERO = {
  titleLead: TITLE_LEAD,
  titleMark: TITLE_MARK,
  title: `${TITLE_LEAD}${TITLE_MARK}`,
  body: "Not another sterile chatbot. Talk to our resident cast of opinionated AI characters — or write your own in the Studio with custom backstory, tone, and tools.",
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
  sticker: string;
};

function companyPlayer(shortName: string) {
  const player = COMPANY.find((entry) => entry.shortName === shortName);
  if (!player) {
    throw new Error(`Unknown company player: ${shortName}`);
  }
  return player;
}

function heroScene(
  shortName: string,
  kicker: string,
  prompt: string,
  quote: string,
  sticker: string,
): HeroScene {
  const player = companyPlayer(shortName);
  return {
    id: player.costume,
    shortName: player.shortName,
    costume: player.costume,
    avatar: player.avatar,
    freeTier: player.freeTier,
    kicker,
    quote,
    prompt,
    sticker,
  };
}

/** Scripted House-window turns for the lobby hero. Marketing copy, not prompts. */
export const HERO_SCENES: HeroScene[] = [
  heroScene(
    "Marcus",
    "Mindset",
    "I keep putting off the thing that actually matters.",
    "Delay is fear in a nicer shirt. The work is yours; the mood is not. Twenty ugly minutes. Now.",
    "Twenty minutes",
  ),
  heroScene(
    "Dr. Priya",
    "Learning",
    "Walk me through the chain rule without the textbook voice.",
    "Outer function, inner function — I do like a close approach. Differentiate the outside, multiply by the inside. Your move: d/dx of sin(x²).",
    "Chain rule",
  ),
  heroScene(
    "Alex",
    "Code",
    "This PR is 800 lines and I need it tonight.",
    "You are not shipping 800 lines tonight. Split the migration. If prod pages me it will be the “also cleaned up the logger” hunk.",
    "Split it",
  ),
  heroScene(
    "Nonna Maria",
    "Wellbeing",
    "I skipped lunch again.",
    "Sit. I made sauce. You think the work will love you back if you starve? Eat. Then we talk.",
    "Sit. Eat.",
  ),
  heroScene(
    "Viktor",
    "Drill",
    "I froze again and watched a video instead.",
    "That couch is a psy-op. Drop and give me twenty. Then the ugly minutes. Not a third recap.",
    "Drop and give 20",
  ),
  heroScene(
    "Valerian",
    "Cosmos",
    "Explain compounding without the TED Talk.",
    "The cosmos breathes in entropy. Your money does the opposite if you stop poking it. Leave it. Time is the instrument.",
    "Leave it",
  ),
  heroScene(
    "Barnaby",
    "Cat",
    "I had a long day.",
    "You left the warm cave to stare at a glowing slab. I slept in the sun. Guess who won.",
    "I slept",
  ),
  heroScene(
    "Ren",
    "Philosophy",
    "Why does being alive feel so heavy tonight?",
    "I was re-reading Kierkegaard. The weight is not a defect. Stay. We can sit with it.",
    "Stay",
  ),
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
  prompt: string;
  quote: string;
};

export const NIGHTS: NightScene[] = [
  {
    id: "maths",
    costume: "priya",
    player: "Dr. Priya",
    kicker: "Learning",
    title: "When you are learning maths",
    body: "You need pedagogical rigor, an interactive breakdown, and a little banter — not a cold formula dump.",
    prompt: "d/dx of sin(x²)?",
    quote: "Outside, then inside. Your move.",
  },
  {
    id: "advice",
    costume: "nonna",
    player: "Nonna Maria",
    kicker: "Wellbeing",
    title: "When you need advice",
    body: "You need fierce care or a stoic roast — not a canned corporate disclaimer.",
    prompt: "I skipped lunch again.",
    quote: "Sit. Eat. Then we talk.",
  },
  {
    id: "code",
    costume: "alex",
    player: "Alex",
    kicker: "Productivity",
    title: "When the PR is on fire",
    body: "You need production edge cases from someone who has been on call too long — not a cheerful autocomplete.",
    prompt: "This PR is 800 lines.",
    quote: "Split it. Prod will not wait.",
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
    pills: ["Name", "Backstory", "Tone"],
  },
  {
    n: "02",
    title: "Chat",
    body: "They stay in character. The app chrome does not impersonate them. Yours will not either.",
    pills: ["In character", "Chrome stays yours"],
  },
  {
    n: "03",
    title: "They remember",
    body: "Plus and Pro keep private memory per agent. Free keeps the latest stretch of the thread. Pick the model they speak through.",
    pills: ["Per-agent memory", "Pick the model"],
  },
] as const;

export type UsualNight = {
  player: string;
  costume: CostumeId;
  quote: string;
};

export type UsualPrompt = {
  id: string;
  label: string;
  prompt: string;
  leftover: {
    stamp: string;
    lines: readonly string[];
  };
  nights: readonly UsualNight[];
};

function usualNight(
  shortName: string,
  quote: string,
): UsualNight {
  const player = companyPlayer(shortName);
  return {
    player: player.shortName,
    costume: player.costume,
    quote,
  };
}

export const USUAL = {
  title: "Same question. Different night.",
  body: "A generic chatbot hedges. A character answers. Same prompt, four rooms.",
  leftoverName: "Assistant",
  prompts: [
    {
      id: "delay",
      label: "Putting it off",
      prompt: "I keep putting off the thing that actually matters.",
      leftover: {
        stamp: "The usual",
        lines: [
          "That’s a great question!",
          "As an AI, I can’t have a point of view.",
          "1. Break it into smaller steps.",
          "2. Try a timer.",
          "3. Be kind to yourself.",
          "I hope this helps!",
        ],
      },
      nights: [
        usualNight(
          "Marcus",
          "Delay is fear in a nicer shirt. The work is yours; the mood is not. Twenty ugly minutes. Now.",
        ),
        usualNight(
          "Nonna Maria",
          "You think the work loves you because you starve for it? Sit. Then you start. Not before.",
        ),
        usualNight(
          "Barnaby",
          "You have been circling this bowl for three days. Either eat it or knock it over.",
        ),
      ],
    },
    {
      id: "lunch",
      label: "Skipped lunch",
      prompt: "I skipped lunch again.",
      leftover: {
        stamp: "The usual",
        lines: [
          "It’s important to maintain a healthy work-life balance.",
          "You might consider setting a reminder, meal-prepping, or taking a short break.",
          "Remember, self-care looks different for everyone!",
          "I hope this helps!",
        ],
      },
      nights: [
        usualNight(
          "Marcus",
          "Hunger is not a personality. Eat. Then do the thing you were avoiding by not eating.",
        ),
        usualNight(
          "Nonna Maria",
          "Sit. I made sauce. A skeleton cannot finish a day. Eat, then we talk.",
        ),
        usualNight(
          "Barnaby",
          "You forgot to fill your own bowl and you want sympathy from the one who lives in it. Hilarious.",
        ),
      ],
    },
    {
      id: "pr",
      label: "Huge PR",
      prompt: "This PR is 800 lines and I need it tonight.",
      leftover: {
        stamp: "The usual",
        lines: [
          "Great question! Large pull requests can be challenging.",
          "1. Break the change into smaller PRs.",
          "2. Add tests.",
          "3. Request a review.",
          "Let me know if you’d like a checklist!",
        ],
      },
      nights: [
        usualNight(
          "Marcus",
          "You are not a hero for shipping a novel. Split it. Pride is not a merge strategy.",
        ),
        usualNight(
          "Nonna Maria",
          "800 lines? You cooked a feast and you want to eat it in one sitting. No. Courses.",
        ),
        usualNight(
          "Barnaby",
          "You wrote a novel, called it a diff, and now you want a medal. Split it or sleep on the floor.",
        ),
      ],
    },
  ],
} as const satisfies {
  title: string;
  body: string;
  leftoverName: string;
  prompts: readonly UsualPrompt[];
};

export const HOUSE_OPEN = {
  kicker: "Tonight",
  title: "The house is open.",
  body: "Pick a voice, or write the one you actually need.",
  cta: { href: "/#studio", label: "Create an agent" },
  secondary: { href: "/#seats", label: "See plans" },
  stamp: "Tonight · write a voice",
} as const;

export const STUDIO = {
  kicker: "Create an agent",
  title: "Write the personality",
  body: "Name, tagline, costume, backstory. Warmth, directness, humor. Language presets include Hinglish and Hindi — real Devanagari. Create characters with genuine point of view, right on the platform.",
  cap: "Free: 3 public · Plus: 10 · Pro: unlimited",
  fields: [
    { label: "Name", value: "Yours" },
    { label: "Tagline", value: "One line they would actually say" },
    { label: "Language", value: "Global English · Hinglish · Hindi" },
    { label: "Tone", value: "Warmth · Directness · Humor" },
  ],
} as const;

/**
 * Fallback seat copy when the catalog cannot load. Runtime source of truth
 * is `public.plans` / `public.plan_models` via `loadPublicSeats`.
 */
export type { Seat, SeatCtaKind } from "./landing/seats-from-catalog";
export { FALLBACK_SEATS as SEATS } from "./landing/seats-from-catalog";

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
    a: "Talk to our featured starter characters (Marcus and Dr. Priya), then write three public characters of your own in Studio. Credits reset 00:00 UTC. Models follow the catalog on Plans. No memory, no private agents, no tools. Then upgrade, or come back tomorrow.",
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
    a: "The model is the instrument, not the character. Free, Plus, and Pro unlock different voices. Plans lists the current catalog.",
  },
] as const;

export const FOOTER = {
  wordmark: "Maya",
  tagline:
    "Opinionated AI — yours, or one we already wrote. Not a helpdesk. Not a copilot.",
} as const;
