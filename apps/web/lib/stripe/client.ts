import "server-only";

import Stripe from "stripe";

let client: Stripe | undefined;

export function stripeSecretFromEnv(
  env: NodeJS.Dict<string> = process.env,
): string {
  const secretKey = env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing required environment variable STRIPE_SECRET_KEY");
  }
  return secretKey;
}

export function stripeWebhookSecretFromEnv(
  env: NodeJS.Dict<string> = process.env,
): string {
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error(
      "Missing required environment variable STRIPE_WEBHOOK_SECRET",
    );
  }
  return webhookSecret;
}

export function getBillingAppUrl(
  env: NodeJS.Dict<string> = process.env,
): string {
  return (env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function getStripe(env: NodeJS.Dict<string> = process.env): Stripe {
  if (!client) {
    client = new Stripe(stripeSecretFromEnv(env));
  }
  return client;
}
