import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getBillingAppUrl,
  stripeSecretFromEnv,
  stripeWebhookSecretFromEnv,
} from "./client";

describe("stripe env", () => {
  it("throws without the secret key", () => {
    expect(() => stripeSecretFromEnv({})).toThrow(
      "Missing required environment variable STRIPE_SECRET_KEY",
    );
  });

  it("throws without the webhook secret", () => {
    expect(() => stripeWebhookSecretFromEnv({})).toThrow(
      "Missing required environment variable STRIPE_WEBHOOK_SECRET",
    );
  });

  it("defaults the app URL", () => {
    expect(getBillingAppUrl({})).toBe("http://localhost:3000");
    expect(getBillingAppUrl({ NEXT_PUBLIC_APP_URL: "https://maya.test/" })).toBe(
      "https://maya.test",
    );
  });
});
