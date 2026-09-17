import { NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@maya/database/service";
import { processStripeEvent } from "@/lib/billing/apply";
import { verifyStripeSignature } from "@/lib/billing/verify";
import { getStripe, stripeWebhookSecretFromEnv } from "@/lib/stripe/client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let secret: string;
  try {
    secret = stripeWebhookSecretFromEnv();
  } catch {
    return NextResponse.json({ error: "dropped" }, { status: 500 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "dropped" }, { status: 500 });
  }

  const verified = verifyStripeSignature({
    stripe,
    rawBody: await request.text(),
    signature: request.headers.get("stripe-signature"),
    secret,
  });
  if (!verified.ok) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const event = verified.event;

  const result = await processStripeEvent(createServiceSupabaseClient(), {
    id: event.id,
    type: event.type,
    data: { object: event.data.object as unknown as Record<string, unknown> },
  });

  if (result === "dropped") {
    return NextResponse.json({ error: "dropped" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, result });
}
