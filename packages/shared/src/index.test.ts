import { describe, expect, it } from "vitest";
import { AGENT_CATEGORIES, MAYA_PLANS } from "./index";

describe("@maya/shared", () => {
  it("locks the three plans", () => {
    expect(MAYA_PLANS).toEqual(["free", "plus", "pro"]);
  });

  it("locks agent categories including wellbeing and lifestyle", () => {
    expect(AGENT_CATEGORIES).toContain("wellbeing");
    expect(AGENT_CATEGORIES).toContain("lifestyle");
    expect(AGENT_CATEGORIES).not.toContain("friendship");
  });
});
