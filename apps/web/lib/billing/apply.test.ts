import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/dropped", () => ({ logDropped: vi.fn() }));

import { processStripeEvent } from "./apply";

function serviceClient(options: {
  insertError?: { code?: string; message: string } | null;
  plans?: Array<{
    id: string;
    stripe_price_id_monthly: string | null;
    stripe_price_id_yearly: string | null;
  }>;
  userId?: string | null;
  updateError?: { message: string } | null;
}) {
  const insert = vi.fn().mockResolvedValue({
    error: options.insertError ?? null,
  });
  const update = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: options.updateError ?? null }),
  });
  const maybeSingle = vi.fn().mockResolvedValue({
    data: options.userId ? { user_id: options.userId } : null,
    error: null,
  });
  const from = vi.fn().mockImplementation((table: string) => {
    if (table === "stripe_events") {
      return { insert };
    }
    if (table === "plans") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: options.plans ?? [
              {
                id: "plus",
                stripe_price_id_monthly: "price_plus_m",
                stripe_price_id_yearly: null,
              },
            ],
            error: null,
          }),
        }),
      };
    }
    if (table === "entitlements") {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ maybeSingle }),
        }),
        update,
      };
    }
    throw new Error(table);
  });
  return { from, insert, update };
}

const plusSession = {
  id: "evt_1",
  type: "checkout.session.completed",
  data: {
    object: {
      customer: "cus_1",
      subscription: "sub_1",
      metadata: { userId: "11111111-1111-4111-8111-111111111111", planId: "plus" },
      client_reference_id: "11111111-1111-4111-8111-111111111111",
    },
  },
};

describe("processStripeEvent", () => {
  it("applies a plus checkout to entitlements", async () => {
    const supabase = serviceClient({});
    await expect(
      processStripeEvent(supabase as never, plusSession),
    ).resolves.toBe("applied");
    expect(supabase.insert).toHaveBeenCalledWith({
      id: "evt_1",
      type: "checkout.session.completed",
    });
    expect(supabase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        plan: "plus",
        status: "active",
        source: "stripe",
        stripe_customer_id: "cus_1",
        stripe_subscription_id: "sub_1",
      }),
    );
  });

  it("is a no-op on replay", async () => {
    const supabase = serviceClient({
      insertError: { code: "23505", message: "duplicate" },
    });
    await expect(
      processStripeEvent(supabase as never, plusSession),
    ).resolves.toBe("duplicate");
    expect(supabase.update).not.toHaveBeenCalled();
  });

  it("maps a deleted subscription to free", async () => {
    const supabase = serviceClient({
      userId: "11111111-1111-4111-8111-111111111111",
    });
    await expect(
      processStripeEvent(supabase as never, {
        id: "evt_2",
        type: "customer.subscription.deleted",
        data: {
          object: {
            id: "sub_1",
            customer: "cus_1",
            status: "canceled",
            items: { data: [{ price: { id: "price_plus_m" } }] },
          },
        },
      }),
    ).resolves.toBe("applied");
    expect(supabase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        plan: "free",
        status: "canceled",
        stripe_subscription_id: null,
      }),
    );
  });

  it("ignores unknown event types", async () => {
    const supabase = serviceClient({});
    await expect(
      processStripeEvent(supabase as never, {
        id: "evt_3",
        type: "invoice.paid",
        data: { object: {} },
      }),
    ).resolves.toBe("ignored");
    expect(supabase.insert).not.toHaveBeenCalled();
  });

  it("ignores an unknown price", async () => {
    const supabase = serviceClient({});
    await expect(
      processStripeEvent(supabase as never, {
        id: "evt_4",
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_1",
            customer: "cus_1",
            status: "active",
            metadata: { userId: "11111111-1111-4111-8111-111111111111" },
            items: { data: [{ price: { id: "price_unknown" } }] },
          },
        },
      }),
    ).resolves.toBe("ignored");
  });
});
