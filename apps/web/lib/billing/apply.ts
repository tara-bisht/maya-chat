import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import {
  entitlementPatchFromSubscription,
  isUuid,
  type EntitlementPatch,
  type StripePriceRow,
} from "@maya/shared";
import { logDropped } from "@/lib/supabase/dropped";
import {
  customerIdFromObject,
  metadataPlanId,
  metadataUserId,
  periodEndFromSubscription,
  priceIdsFromSubscription,
  stringField,
  type StripeLikeEvent,
} from "./stripe-object";

const HANDLED = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export type ProcessStripeResult = "applied" | "duplicate" | "ignored" | "dropped";

async function loadPriceRows(
  service: SupabaseClient<Database>,
): Promise<StripePriceRow[] | null> {
  const result = await service
    .from("plans")
    .select("id, stripe_price_id_monthly, stripe_price_id_yearly")
    .eq("is_active", true);
  if (result.error) {
    logDropped("loadPriceRows", { plans: result.error });
    return null;
  }
  return (result.data ?? []) as StripePriceRow[];
}

async function resolveUserId(
  service: SupabaseClient<Database>,
  object: Record<string, unknown>,
): Promise<string | null> {
  const hinted = metadataUserId(object);
  if (hinted && isUuid(hinted)) {
    return hinted;
  }
  const customerId = customerIdFromObject(object);
  if (!customerId) {
    return null;
  }
  const row = await service
    .from("entitlements")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (row.error) {
    logDropped("resolveUserId", { entitlement: row.error });
    return null;
  }
  return row.data?.user_id ?? null;
}

async function writeEntitlement(
  service: SupabaseClient<Database>,
  userId: string,
  patch: EntitlementPatch,
): Promise<boolean> {
  const result = await service
    .from("entitlements")
    .update({
      plan: patch.plan,
      status: patch.status,
      source: patch.source,
      stripe_customer_id: patch.stripe_customer_id,
      stripe_subscription_id: patch.stripe_subscription_id,
      current_period_end: patch.current_period_end,
    })
    .eq("user_id", userId);
  if (result.error) {
    logDropped("writeEntitlement", { update: result.error });
    return false;
  }
  return true;
}

function patchFromObject(
  type: string,
  object: Record<string, unknown>,
  plans: StripePriceRow[],
): EntitlementPatch | null {
  if (type === "checkout.session.completed") {
    const planHint = metadataPlanId(object);
    const customerId = customerIdFromObject(object);
    const subscriptionId = stringField(object, "subscription");
    if (
      (planHint === "plus" || planHint === "pro") &&
      customerId
    ) {
      return {
        plan: planHint,
        status: "active",
        source: "stripe",
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        current_period_end: null,
      };
    }
    return entitlementPatchFromSubscription(
      {
        status: "active",
        priceIds: priceIdsFromSubscription(object),
        customerId,
        subscriptionId,
        periodEnd: null,
        metadataPlanId: planHint,
      },
      plans,
    );
  }

  if (type === "customer.subscription.deleted") {
    return entitlementPatchFromSubscription(
      {
        status: "canceled",
        priceIds: priceIdsFromSubscription(object),
        customerId: customerIdFromObject(object),
        subscriptionId: stringField(object, "id"),
        periodEnd: periodEndFromSubscription(object),
        metadataPlanId: metadataPlanId(object),
      },
      plans,
    );
  }

  return entitlementPatchFromSubscription(
    {
      status: stringField(object, "status"),
      priceIds: priceIdsFromSubscription(object),
      customerId: customerIdFromObject(object),
      subscriptionId: stringField(object, "id"),
      periodEnd: periodEndFromSubscription(object),
      metadataPlanId: metadataPlanId(object),
    },
    plans,
  );
}

export async function processStripeEvent(
  service: SupabaseClient<Database>,
  event: StripeLikeEvent,
): Promise<ProcessStripeResult> {
  if (!HANDLED.has(event.type)) {
    return "ignored";
  }

  const claimed = await service.from("stripe_events").insert({
    id: event.id,
    type: event.type,
  });
  if (claimed.error) {
    if (claimed.error.code === "23505") {
      return "duplicate";
    }
    logDropped("processStripeEvent", { claim: claimed.error });
    return "dropped";
  }

  const object = event.data.object;
  const plans = await loadPriceRows(service);
  if (!plans) {
    return "dropped";
  }

  const patch = patchFromObject(event.type, object, plans);
  if (!patch) {
    return "ignored";
  }

  const userId = await resolveUserId(service, object);
  if (!userId) {
    return "ignored";
  }

  const wrote = await writeEntitlement(service, userId, patch);
  return wrote ? "applied" : "dropped";
}
