import { describe, expect, it } from "vitest";
import {
  entitlementPatchFromSubscription,
  parseCheckoutPlan,
  planIdForPriceId,
  planTicketCta,
  unixToIso,
} from "./billing";

const PLANS = [
  {
    id: "free",
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
  },
  {
    id: "plus",
    stripe_price_id_monthly: "price_plus_m",
    stripe_price_id_yearly: "price_plus_y",
  },
  {
    id: "pro",
    stripe_price_id_monthly: "price_pro_m",
    stripe_price_id_yearly: null,
  },
] as const;

describe("parseCheckoutPlan", () => {
  it("accepts plus and pro", () => {
    expect(parseCheckoutPlan({ planId: "plus" })).toEqual({
      ok: true,
      data: { planId: "plus" },
    });
    expect(parseCheckoutPlan({ planId: "pro" }).ok).toBe(true);
  });

  it("rejects free and junk", () => {
    expect(parseCheckoutPlan({ planId: "free" }).ok).toBe(false);
    expect(parseCheckoutPlan({ planId: "PLUS" }).ok).toBe(false);
    expect(parseCheckoutPlan({})).toEqual({ ok: false });
  });
});

describe("planIdForPriceId", () => {
  it("maps monthly and yearly ids", () => {
    expect(planIdForPriceId("price_plus_m", PLANS)).toBe("plus");
    expect(planIdForPriceId("price_plus_y", PLANS)).toBe("plus");
    expect(planIdForPriceId("price_pro_m", PLANS)).toBe("pro");
  });

  it("returns null for unknown prices", () => {
    expect(planIdForPriceId("price_nope", PLANS)).toBeNull();
    expect(planIdForPriceId("", PLANS)).toBeNull();
  });
});

describe("entitlementPatchFromSubscription", () => {
  it("upgrades from a plus price", () => {
    expect(
      entitlementPatchFromSubscription(
        {
          status: "active",
          priceIds: ["price_plus_m"],
          customerId: "cus_1",
          subscriptionId: "sub_1",
          periodEnd: "2026-10-01T00:00:00.000Z",
        },
        PLANS,
      ),
    ).toEqual({
      plan: "plus",
      status: "active",
      source: "stripe",
      stripe_customer_id: "cus_1",
      stripe_subscription_id: "sub_1",
      current_period_end: "2026-10-01T00:00:00.000Z",
    });
  });

  it("keeps the paid plan on past_due", () => {
    const patch = entitlementPatchFromSubscription(
      {
        status: "past_due",
        priceIds: ["price_pro_m"],
        customerId: "cus_1",
        subscriptionId: "sub_1",
        periodEnd: null,
      },
      PLANS,
    );
    expect(patch?.plan).toBe("pro");
    expect(patch?.status).toBe("past_due");
  });

  it("returns free on canceled", () => {
    expect(
      entitlementPatchFromSubscription(
        {
          status: "canceled",
          priceIds: ["price_plus_m"],
          customerId: "cus_1",
          subscriptionId: "sub_1",
          periodEnd: null,
        },
        PLANS,
      ),
    ).toMatchObject({
      plan: "free",
      status: "canceled",
      stripe_subscription_id: null,
      stripe_customer_id: "cus_1",
    });
  });

  it("skips unknown prices and incomplete status", () => {
    expect(
      entitlementPatchFromSubscription(
        {
          status: "active",
          priceIds: ["price_unknown"],
          customerId: "cus_1",
          subscriptionId: "sub_1",
          periodEnd: null,
        },
        PLANS,
      ),
    ).toBeNull();
    expect(
      entitlementPatchFromSubscription(
        {
          status: "incomplete",
          priceIds: ["price_plus_m"],
          customerId: "cus_1",
          subscriptionId: "sub_1",
          periodEnd: null,
        },
        PLANS,
      ),
    ).toBeNull();
  });

  it("prefers metadata plan when the price is missing", () => {
    expect(
      entitlementPatchFromSubscription(
        {
          status: "active",
          priceIds: [],
          customerId: "cus_1",
          subscriptionId: "sub_1",
          periodEnd: null,
          metadataPlanId: "pro",
        },
        PLANS,
      )?.plan,
    ).toBe("pro");
  });
});

describe("planTicketCta", () => {
  it("offers checkout when the user is not subscribed", () => {
    expect(
      planTicketCta({
        id: "plus",
        current: false,
        subscribed: false,
        highlighted: true,
      }),
    ).toEqual({ kind: "checkout", label: "Get Plus" });
    expect(
      planTicketCta({
        id: "pro",
        current: false,
        subscribed: false,
        highlighted: false,
      }),
    ).toEqual({ kind: "checkout", label: "Get Pro" });
    expect(
      planTicketCta({
        id: "free",
        current: true,
        subscribed: false,
        highlighted: false,
      }),
    ).toBeNull();
  });

  it("sends subscribers to the portal instead of a second checkout", () => {
    expect(
      planTicketCta({
        id: "plus",
        current: true,
        subscribed: true,
        highlighted: false,
      }),
    ).toEqual({ kind: "portal", label: "Manage plan" });
    expect(
      planTicketCta({
        id: "pro",
        current: false,
        subscribed: true,
        highlighted: true,
      }),
    ).toEqual({ kind: "portal", label: "Upgrade" });
    expect(
      planTicketCta({
        id: "plus",
        current: false,
        subscribed: true,
        highlighted: false,
      }),
    ).toBeNull();
  });
});

describe("unixToIso", () => {
  it("converts unix seconds", () => {
    expect(unixToIso(1_704_067_200)).toBe("2024-01-01T00:00:00.000Z");
  });

  it("rejects junk", () => {
    expect(unixToIso(null)).toBeNull();
    expect(unixToIso("1704067200")).toBeNull();
    expect(unixToIso(0)).toBeNull();
  });
});
