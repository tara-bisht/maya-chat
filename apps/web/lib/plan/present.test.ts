import { describe, expect, it } from "vitest";
import {
  highlightedPlan,
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
    expect(planReasonHeading("locked-agent")).toBe("That voice needs Plus.");
    expect(planReasonHeading("quota")).toBe("Out of credits.");
    expect(planReasonHeading("studio-cap")).toBe("Agent limit reached.");
    expect(planReasonHeading("studio-private")).toBe(
      "Private agents are Plus.",
    );
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
