import type { MayaPlan } from "@maya/shared";

export const PLAN_REASONS = [
  "locked-agent",
  "quota",
  "studio-cap",
  "studio-private",
  "locked-voice",
] as const;

export type PlanReason = (typeof PLAN_REASONS)[number];

export function parsePlanReason(
  value: string | null | undefined,
): PlanReason | null {
  if (!value) {
    return null;
  }
  return (PLAN_REASONS as readonly string[]).includes(value)
    ? (value as PlanReason)
    : null;
}

export function planReasonHeading(reason: PlanReason | null): string | null {
  switch (reason) {
    case "locked-agent":
      return "That agent needs Plus.";
    case "quota":
      return "Out of credits.";
    case "studio-cap":
      return "Agent limit reached.";
    case "studio-private":
      return "Private agents are Plus.";
    case "locked-voice":
      return "That model is locked.";
    default:
      return null;
  }
}

/** Acid highlight goes only on the plan the user can buy. */
export function highlightedPlan(current: MayaPlan): MayaPlan | null {
  if (current === "free") {
    return "plus";
  }
  if (current === "plus") {
    return "pro";
  }
  return null;
}

export function parseCheckoutFlash(
  value: string | null | undefined,
): "success" | "canceled" | null {
  if (value === "success" || value === "canceled") {
    return value;
  }
  return null;
}

export function priceLabel(monthlyCents: number): string {
  const dollars = monthlyCents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

export function formatModelsSummary(
  models: readonly string[],
  planId?: string,
): string {
  if (models.length === 0) {
    return "—";
  }
  if (models.length > 10) {
    if (planId === "free") {
      return "50+ models across 10 top labs (under $20/1M output tokens)";
    }
    return "All 50+ models including frontier models (GPT-6 Astra, Claude Fable 5.1, Opus 5)";
  }
  return models.join(" · ");
}

