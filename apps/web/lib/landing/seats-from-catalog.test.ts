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
    expect(free?.bullets.join(" ")).not.toMatch(/messages/i);
    expect(free?.models).toEqual(["qwen-flash", "gemini-flash", "grok-fast"]);

    expect(plus?.price).toBe("$9");
    expect(plus?.cadence).toBe("/ month · $90 / year");
    expect(plus?.models).toContain("deepseek");
    expect(plus?.models).not.toContain("claude");

    expect(pro?.price).toBe("$19");
    expect(pro?.bullets[0]).toBe("9,000 credits a day");
    expect(pro?.bullets.join(" ")).not.toMatch(/unlimited messages/i);
    expect(pro?.models).toContain("claude");
  });

  it("adds a Plus model when plan_models grows", () => {
    const seats = seatsFromCatalog({
      ...FALLBACK_CATALOG,
      models: [
        ...FALLBACK_CATALOG.models,
        { id: "llama-3", sort_order: 35, is_enabled: true },
      ],
      planModels: [
        ...FALLBACK_CATALOG.planModels,
        { plan_id: "plus", model_id: "llama-3" },
      ],
    });
    const plus = seats.find((seat) => seat.id === "plus");
    expect(plus?.models).toContain("llama-3");
    expect(plus?.models).toEqual([
      "qwen-flash",
      "gemini-flash",
      "grok-fast",
      "deepseek",
      "llama-3",
      "qwen",
      "grok",
      "gpt",
    ]);
  });
});

describe("FALLBACK_SEATS", () => {
  it("never claims a message cap", () => {
    const copy = FALLBACK_SEATS.flatMap((seat) => seat.bullets).join(" ");
    expect(copy).not.toMatch(/50 messages/i);
    expect(copy).not.toMatch(/unlimited messages/i);
  });
});
