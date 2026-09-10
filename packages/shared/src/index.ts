export const MAYA_PLANS = ["free", "plus", "pro"] as const;
export type MayaPlan = (typeof MAYA_PLANS)[number];

export const AGENT_CATEGORIES = [
  "learning",
  "philosophy",
  "productivity",
  "wellbeing",
  "lifestyle",
  "custom",
] as const;
export type AgentCategory = (typeof AGENT_CATEGORIES)[number];
