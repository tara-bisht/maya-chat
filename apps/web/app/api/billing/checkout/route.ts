import { NextResponse } from "next/server";
import { parseCheckoutPlan } from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { billingError } from "@/lib/billing/errors";
import { getBillingAppUrl, getStripe } from "@/lib/stripe/client";
import { createServiceSupabaseClient } from "@maya/database/service";
import { logDropped } from "@/lib/supabase/dropped";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return billingError("unauthorized", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return billingError("invalid", 400);
  }

  const parsed = parseCheckoutPlan(body);
  if (!parsed.ok) {
    return billingError("invalid", 400);
  }

  const supabase = await createClient();
  const [entitlement, plan] = await Promise.all([
    supabase
      .from("entitlements")
      .select("plan, stripe_customer_id, stripe_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("plans")
      .select("id, stripe_price_id_monthly")
      .eq("id", parsed.data.planId)
      .maybeSingle(),
  ]);

  if (entitlement.error || plan.error) {
    logDropped("checkout", {
      entitlement: entitlement.error,
      plan: plan.error,
    });
    return billingError("dropped", 500);
  }

  if (entitlement.data?.stripe_subscription_id) {
    return billingError("subscribed", 409);
  }

  const priceId = plan.data?.stripe_price_id_monthly;
  if (!priceId) {
    return billingError("unpriced", 503);
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return billingError("dropped", 500);
  }

  let customerId = entitlement.data?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    const service = createServiceSupabaseClient();
    const saved = await service
      .from("entitlements")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id);
    if (saved.error) {
      logDropped("checkout", { customer: saved.error });
    }
  }

  const appUrl = getBillingAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/plan?checkout=success`,
    cancel_url: `${appUrl}/plan?checkout=canceled`,
    metadata: { userId: user.id, planId: parsed.data.planId },
    subscription_data: {
      metadata: { userId: user.id, planId: parsed.data.planId },
    },
  });

  if (!session.url) {
    return billingError("dropped", 500);
  }

  return NextResponse.json({ url: session.url });
}
