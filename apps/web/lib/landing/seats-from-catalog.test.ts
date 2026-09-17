import { describe, expect, it } from "vitest";
import {
  FALLBACK_CATALOG,
  FALLBACK_SEATS,
  formatUsdFromCents,
  seatsFromCatalog,
} from "./seats-from-catalog";

describe("formatUsdFromCents", () => {
  it("formats whole dollars without decimals", () => {
    expect(formatUsdFromCents(0)).toBe("$0");
    expect(formatUsdFromCents(900)).toBe("$9");
    expect(formatUsdFromCents(1900)).toBe("$19");
  });
});

describe("seatsFromCatalog", () => {
  it("maps seed catalog to credit-true Free / Plus / Pro tickets", () => {
    const [free, plus, pro] = seatsFromCatalog(FALLBACK_CATALOG);
    expect(free?.price).toBe("$0");
    expect(free?.cadence).toBe("No bill");
    expect(free?.bullets[0]).toBe("1,500 credits a day");
    expect(free?.bullets).toContain("Every featured agent");
    expect(free?.bullets).toContain(
      "Unlimited custom agents, public or private",
    );
    expect(free?.bullets.join(" ")).not.toMatch(/messages/i);
    expect(free?.models).toContain("gpt");
    expect(free?.models).toContain("claude");
    expect(free?.models).toContain("deepseek");
    expect(free?.models).not.toContain("gpt-6-astra");
    expect(free?.models).not.toContain("claude-fable-5-1");

    expect(plus?.price).toBe("$9");
    expect(plus?.cadence).toBe("/ month · $90 / year");
    expect(plus?.bullets).toContain("Every featured agent");
    expect(plus?.bullets).toContain(
      "Unlimited custom agents, public or private",
    );
    expect(plus?.models).toContain("deepseek");
    expect(plus?.models).toContain("gpt-6-astra");
    expect(plus?.models).toContain("claude-fable-5-1");
    expect(plus?.models).toHaveLength(57);

    expect(pro?.price).toBe("$19");
    expect(pro?.bullets[0]).toBe("9,000 credits a day");
    expect(pro?.bullets).toContain("Every featured agent");
    expect(pro?.bullets).toContain(
      "Unlimited custom agents, public or private",
    );
    expect(pro?.bullets.join(" ")).not.toMatch(/unlimited messages/i);
    expect(pro?.models).toContain("claude");
    expect(pro?.models).toContain("gpt-6-astra");
    expect(pro?.models).toContain("claude-fable-5-1");
    expect(pro?.models).toHaveLength(57);
  });

  it("adds a Plus model when plan_models grows", () => {
    const seats = seatsFromCatalog({
      ...FALLBACK_CATALOG,
      models: [
        ...FALLBACK_CATALOG.models,
        { id: "llama-extra", sort_order: 999, is_enabled: true },
      ],
      planModels: [
        ...FALLBACK_CATALOG.planModels,
        { plan_id: "plus", model_id: "llama-extra" },
      ],
    });
    const plus = seats.find((seat) => seat.id === "plus");
    expect(plus?.models).toContain("llama-extra");
    expect(plus?.models).toHaveLength(FALLBACK_CATALOG.models.length + 1);
  });
});

describe("FALLBACK_SEATS", () => {
  it("never claims a message cap", () => {
    const copy = FALLBACK_SEATS.flatMap((seat) => seat.bullets).join(" ");
    expect(copy).not.toMatch(/50 messages/i);
    expect(copy).not.toMatch(/unlimited messages/i);
  });
});
