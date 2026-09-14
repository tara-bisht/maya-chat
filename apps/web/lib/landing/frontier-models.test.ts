import { describe, expect, it } from "vitest";
import {
  FRONTIER_MODELS_SHOWCASE,
  getActiveFrontierModels,
} from "./frontier-models";

describe("frontier-models showcase config", () => {
  it("exports a non-empty list of frontier models", () => {
    expect(FRONTIER_MODELS_SHOWCASE.length).toBeGreaterThanOrEqual(4);
  });

  it("filters and sorts enabled models", () => {
    const active = getActiveFrontierModels();
    expect(active.length).toBeGreaterThan(0);
    for (let i = 0; i < active.length - 1; i++) {
      expect(active[i].sortOrder).toBeLessThanOrEqual(active[i + 1].sortOrder);
    }
  });

  it("contains key frontier providers (Anthropic, OpenAI, Google)", () => {
    const providers = new Set(FRONTIER_MODELS_SHOWCASE.map((m) => m.provider));
    expect(providers.has("Anthropic")).toBe(true);
    expect(providers.has("OpenAI")).toBe(true);
    expect(providers.has("Google")).toBe(true);
  });
});
