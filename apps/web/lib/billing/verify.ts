import type Stripe from "stripe";

export function verifyStripeSignature(input: {
  stripe: Stripe;
  rawBody: string;
  signature: string | null;
  secret: string;
}): { ok: true; event: Stripe.Event } | { ok: false } {
  if (!input.signature) {
    return { ok: false };
  }
  try {
    const event = input.stripe.webhooks.constructEvent(
      input.rawBody,
      input.signature,
      input.secret,
    );
    return { ok: true, event };
  } catch {
    return { ok: false };
  }
}
