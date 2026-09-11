import type { MayaPlan } from "@maya/shared";

export const PLAN_REASONS = [
  "locked-agent",
  "quota",
  "studio-cap",
  "studio-private",
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
      return "That voice needs Plus.";
    case "quota":
      return "Out of credits.";
    case "studio-cap":
      return "Agent limit reached.";
    case "studio-private":
      return "Private agents are Plus.";
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

export function priceLabel(monthlyCents: number): string {
  const dollars = monthlyCents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}
