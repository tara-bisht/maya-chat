export type FrontierModelTier = "Free" | "Plus" | "Pro";

export type FrontierModelCard = {
  id: string; // Matches catalog model alias (e.g. 'claude', 'gpt', 'gemini-flash', 'grok', 'deepseek', 'qwen-flash')
  displayName: string;
  provider: "Anthropic" | "OpenAI" | "Google" | "xAI" | "DeepSeek" | "Qwen";
  headline: string;
  tagline: string;
  description: string;
  tier: FrontierModelTier;
  contextWindow: string;
  speedRating: "Instant" | "Rapid" | "Thoughtful";
  strengths: string[];
  featured?: boolean;
  enabled: boolean;
  sortOrder: number;
};

/**
 * Configurable list of frontier models showcased on the landing page.
 * Admins/engineers can adjust badges, highlights, and sort order here.
 */
export const FRONTIER_MODELS_SHOWCASE: readonly FrontierModelCard[] = [
  {
    id: "claude",
    displayName: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    headline: "Hybrid Reasoning & Persona Nuance",
    tagline: "Highest fidelity roleplay, subtle tone shifts, and zero breaking character.",
    description:
      "Anthropic's flagship intelligence delivers immaculate persona fidelity, profound emotional nuance, and step-by-step reasoning for deep creative dialogues.",
    tier: "Pro",
    contextWindow: "200k",
    speedRating: "Rapid",
    strengths: ["Persona Fidelity", "Subtle Tone", "System Design"],
    featured: true,
    enabled: true,
    sortOrder: 1,
  },
  {
    id: "gpt",
    displayName: "GPT-4o / GPT-5.4",
    provider: "OpenAI",
    headline: "Frontier General Intelligence",
    tagline: "Unrivaled broad world knowledge and versatile instruction following.",
    description:
      "The global benchmark for general intelligence, excelling across complex mathematical proofs, structural logic, and multilingual eloquence.",
    tier: "Pro",
    contextWindow: "128k",
    speedRating: "Rapid",
    strengths: ["Broad Knowledge", "LaTeX & Logic", "Structured Output"],
    featured: true,
    enabled: true,
    sortOrder: 2,
  },
  {
    id: "gemini-flash",
    displayName: "Gemini 2.5 Flash",
    provider: "Google",
    headline: "Ultra-Fast Multimodal Intellect",
    tagline: "Sub-second responsiveness paired with massive context retention.",
    description:
      "Engineered for conversational speed without sacrificing depth. Absorbs sprawling historical context while maintaining witty, high-tempo banter.",
    tier: "Plus",
    contextWindow: "1M",
    speedRating: "Instant",
    strengths: ["Low Latency", "1M Context", "Quick Banter"],
    featured: false,
    enabled: true,
    sortOrder: 3,
  },
  {
    id: "grok",
    displayName: "Grok 4.5",
    provider: "xAI",
    headline: "Unfiltered Wit & Candid Perspective",
    tagline: "Sharp, humorous observations that cut through corporate platitudes.",
    description:
      "Brings punchy, fearless energy to philosophical roasts, drill sergeant challenges, and candid creative sparring without robotic filters.",
    tier: "Pro",
    contextWindow: "128k",
    speedRating: "Rapid",
    strengths: ["Unfiltered Wit", "Real-Time Edge", "Sharp Roasts"],
    featured: false,
    enabled: true,
    sortOrder: 4,
  },
  {
    id: "deepseek",
    displayName: "DeepSeek V3",
    provider: "DeepSeek",
    headline: "Open Frontier Mathematical Rigor",
    tagline: "Elite algorithmic reasoning and deep technical precision.",
    description:
      "World-class open-architecture model that powers rigorous symbolic mathematics, code synthesis, and deep analytical problem breakdown.",
    tier: "Plus",
    contextWindow: "64k",
    speedRating: "Rapid",
    strengths: ["Math Proofs", "Algorithmic Code", "Technical Depth"],
    featured: false,
    enabled: true,
    sortOrder: 5,
  },
  {
    id: "qwen-flash",
    displayName: "Qwen 3.8 Flash",
    provider: "Qwen",
    headline: "Accessible Everyday Intelligence",
    tagline: "High-efficiency open intelligence available to every guest.",
    description:
      "The responsive default engine powering free tier conversations, ensuring every guest enjoys thoughtful, articulate interactions from turn one.",
    tier: "Free",
    contextWindow: "32k",
    speedRating: "Instant",
    strengths: ["Daily Chat", "Free Access", "Responsive"],
    featured: false,
    enabled: true,
    sortOrder: 6,
  },
];

export function getActiveFrontierModels(): FrontierModelCard[] {
  return [...FRONTIER_MODELS_SHOWCASE]
    .filter((model) => model.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
