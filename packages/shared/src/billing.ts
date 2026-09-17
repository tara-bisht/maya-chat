import { z } from "zod";
import type { MayaPlan } from "./plans";
import { parseMayaPlan, type EntitlementStatus } from "./profile";

export const checkoutPlanSchema = z.object({
  planId: z.enum(["plus", "pro"]),
});

export type CheckoutPlan = z.infer<typeof checkoutPlanSchema>;

export type ParseCheckoutPlanResult =
  | { ok: true; data: CheckoutPlan }
  | { ok: false };

export function parseCheckoutPlan(input: unknown): ParseCheckoutPlanResult {
  const parsed = checkoutPlanSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false };
  }
  return { ok: true, data: parsed.data };
}

export type StripePriceRow = {
  id: string;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
};

export function planIdForPriceId(
  priceId: string,
  plans: readonly StripePriceRow[],
): MayaPlan | null {
  if (!priceId) {
    return null;
  }
  for (const row of plans) {
    if (
      row.stripe_price_id_monthly === priceId ||
      row.stripe_price_id_yearly === priceId
    ) {
      const id = parseMayaPlan(row.id);
      if (id === "plus" || id === "pro") {
        return id;
      }
    }
  }
  return null;
}

export function entitlementStatusFromStripe(
  status: string | null | undefined,
): EntitlementStatus | null {
  if (
    status === "active" ||
    status === "trialing" ||
    status === "paused"
  ) {
    return "active";
  }
  if (status === "past_due" || status === "unpaid") {
    return "past_due";
  }
  if (
    status === "canceled" ||
    status === "incomplete_expired" ||
    status === "unpaid_canceled"
  ) {
    return "canceled";
  }
  return null;
}

export type EntitlementPatch = {
  plan: MayaPlan;
  status: EntitlementStatus;
  source: "stripe";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
};

export type SubscriptionApplyInput = {
  status: string | null | undefined;
  priceIds: readonly string[];
  customerId: string | null;
  subscriptionId: string | null;
  periodEnd: string | null;
  metadataPlanId?: string | null;
};

export function entitlementPatchFromSubscription(
  input: SubscriptionApplyInput,
  plans: readonly StripePriceRow[],
): EntitlementPatch | null {
  const status = entitlementStatusFromStripe(input.status);
  if (!status) {
    return null;
  }

  if (status === "canceled") {
    return {
      plan: "free",
      status: "canceled",
      source: "stripe",
      stripe_customer_id: input.customerId,
      stripe_subscription_id: null,
      current_period_end: input.periodEnd,
    };
  }

  let plan: MayaPlan | null = null;
  const meta = parseMayaPlan(input.metadataPlanId);
  if (meta === "plus" || meta === "pro") {
    plan = meta;
  }
  if (!plan) {
    for (const priceId of input.priceIds) {
      plan = planIdForPriceId(priceId, plans);
      if (plan) {
        break;
      }
    }
  }
  if (!plan) {
    return null;
  }

  return {
    plan,
    status,
    source: "stripe",
    stripe_customer_id: input.customerId,
    stripe_subscription_id: input.subscriptionId,
    current_period_end: input.periodEnd,
  };
}

export function unixToIso(seconds: unknown): string | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds <= 0) {
    return null;
  }
  return new Date(seconds * 1000).toISOString();
}

export type PlanTicketCta = {
  kind: "checkout" | "portal";
  label: string;
};

export function planTicketCta(input: {
  id: MayaPlan;
  current: boolean;
  subscribed: boolean;
  highlighted: boolean;
}): PlanTicketCta | null {
  if (input.id === "free") {
    return null;
  }
  if (input.subscribed) {
    if (input.current) {
      return { kind: "portal", label: "Manage plan" };
    }
    if (input.highlighted) {
      return { kind: "portal", label: "Upgrade" };
    }
    return null;
  }
  return {
    kind: "checkout",
    label: input.id === "pro" ? "Get Pro" : "Get Plus",
  };
}
