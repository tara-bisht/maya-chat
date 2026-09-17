import { describe, expect, it } from "vitest";
import {
  formatModelsSummary,
  highlightedPlan,
  parseCheckoutFlash,
  parsePlanReason,
  planReasonHeading,
  priceLabel,
} from "./present";

describe("parsePlanReason", () => {
  it("keeps known paywall reasons", () => {
    expect(parsePlanReason("locked-agent")).toBe("locked-agent");
    expect(parsePlanReason("quota")).toBe("quota");
    expect(parsePlanReason("studio-cap")).toBe("studio-cap");
    expect(parsePlanReason("studio-private")).toBe("studio-private");
    expect(parsePlanReason("locked-voice")).toBe("locked-voice");
  });

  it("drops unknown or missing reasons", () => {
    expect(parsePlanReason("seats")).toBeNull();
    expect(parsePlanReason("")).toBeNull();
    expect(parsePlanReason(null)).toBeNull();
    expect(parsePlanReason(undefined)).toBeNull();
  });
});

describe("planReasonHeading", () => {
  it("names the wall the user just hit", () => {
    expect(planReasonHeading("locked-agent")).toBe("That agent needs Plus.");
    expect(planReasonHeading("quota")).toBe("Out of credits.");
    expect(planReasonHeading("studio-cap")).toBe("Agent limit reached.");
    expect(planReasonHeading("studio-private")).toBe(
      "Private agents are Plus.",
    );
    expect(planReasonHeading("locked-voice")).toBe("That model is locked.");
    expect(planReasonHeading(null)).toBeNull();
  });
});

describe("highlightedPlan", () => {
  it("lights only the plan the user can buy", () => {
    expect(highlightedPlan("free")).toBe("plus");
    expect(highlightedPlan("plus")).toBe("pro");
    expect(highlightedPlan("pro")).toBeNull();
  });
});

describe("parseCheckoutFlash", () => {
  it("keeps success and canceled", () => {
    expect(parseCheckoutFlash("success")).toBe("success");
    expect(parseCheckoutFlash("canceled")).toBe("canceled");
    expect(parseCheckoutFlash("paid")).toBeNull();
  });
});

describe("priceLabel", () => {
  it("prints whole dollars without cents", () => {
    expect(priceLabel(0)).toBe("$0");
    expect(priceLabel(900)).toBe("$9");
    expect(priceLabel(1900)).toBe("$19");
  });

  it("keeps cents when they matter", () => {
    expect(priceLabel(950)).toBe("$9.50");
  });
});

describe("formatModelsSummary", () => {
  it("returns dash for empty model list", () => {
    expect(formatModelsSummary([])).toBe("—");
  });

  it("joins small model lists with dots", () => {
    expect(formatModelsSummary(["gpt", "claude"])).toBe("gpt · claude");
  });

  it("returns free summary when more than 10 models on free plan", () => {
    const list = Array.from({ length: 15 }, (_, i) => `model-${i}`);
    expect(formatModelsSummary(list, "free")).toBe(
      "50+ models across 10 top labs (under $20/1M output tokens)",
    );
  });

  it("returns paid summary when more than 10 models on plus/pro plan", () => {
    const list = Array.from({ length: 15 }, (_, i) => `model-${i}`);
    expect(formatModelsSummary(list, "plus")).toBe(
      "All 50+ models including frontier models (GPT-6 Astra, Claude Fable 5.1, Opus 5)",
    );
  });
});

