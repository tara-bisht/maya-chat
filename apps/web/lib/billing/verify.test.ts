import { describe, expect, it, vi } from "vitest";
import { verifyStripeSignature } from "./verify";

describe("verifyStripeSignature", () => {
  it("returns ok:false without a signature", () => {
    const constructEvent = vi.fn();
    expect(
      verifyStripeSignature({
        stripe: { webhooks: { constructEvent } } as never,
        rawBody: "{}",
        signature: null,
        secret: "whsec",
      }),
    ).toEqual({ ok: false });
    expect(constructEvent).not.toHaveBeenCalled();
  });

  it("returns ok:false when constructEvent throws", () => {
    const constructEvent = vi.fn(() => {
      throw new Error("bad sig");
    });
    expect(
      verifyStripeSignature({
        stripe: { webhooks: { constructEvent } } as never,
        rawBody: "{}",
        signature: "t=1,v1=nope",
        secret: "whsec",
      }),
    ).toEqual({ ok: false });
  });

  it("returns the event when the signature is valid", () => {
    const event = { id: "evt_1", type: "checkout.session.completed" };
    const constructEvent = vi.fn(() => event);
    expect(
      verifyStripeSignature({
        stripe: { webhooks: { constructEvent } } as never,
        rawBody: "{}",
        signature: "t=1,v1=ok",
        secret: "whsec",
      }),
    ).toEqual({ ok: true, event });
  });
});
