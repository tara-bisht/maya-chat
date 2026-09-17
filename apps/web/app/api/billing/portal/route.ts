import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { billingError } from "@/lib/billing/errors";
import { getBillingAppUrl, getStripe } from "@/lib/stripe/client";
import { logDropped } from "@/lib/supabase/dropped";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return billingError("unauthorized", 401);
  }

  const supabase = await createClient();
  const entitlement = await supabase
    .from("entitlements")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (entitlement.error) {
    logDropped("portal", { entitlement: entitlement.error });
    return billingError("dropped", 500);
  }

  const customerId = entitlement.data?.stripe_customer_id;
  if (!customerId) {
    return billingError("no_customer", 409);
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return billingError("dropped", 500);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${getBillingAppUrl()}/plan`,
  });

  if (!session.url) {
    return billingError("dropped", 500);
  }

  return NextResponse.json({ url: session.url });
}
