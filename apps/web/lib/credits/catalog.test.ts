import { describe, expect, it } from "vitest";
import type { CatalogModel } from "./catalog";
import { pickVoice, voiceThroughLabel } from "./catalog";

function model(
  partial: Partial<CatalogModel> & Pick<CatalogModel, "id" | "allowed" | "minPlan">,
): CatalogModel {
  return {
    displayName: partial.displayName ?? partial.id,
    provider: partial.provider ?? "xai",
    sortOrder: partial.sortOrder ?? 1,
    estimatedCreditsPerTurn: partial.estimatedCreditsPerTurn ?? 16,
    ...partial,
  };
}

describe("pickVoice", () => {
  it("selects an allowed alias", () => {
    expect(
      pickVoice(model({ id: "deepseek", allowed: true, minPlan: "plus" })),
    ).toEqual({ ok: true, modelId: "deepseek" });
  });

  it("does not select a locked Claude row; stamps Pro", () => {
    const claude = model({
      id: "claude",
      displayName: "Claude",
      allowed: false,
      minPlan: "pro",
    });
    expect(pickVoice(claude)).toEqual({
      ok: false,
      reason: "forbidden_model",
      model: claude,
    });
    expect(claude.minPlan).toBe("pro");
  });
});

describe("voiceThroughLabel", () => {
  it("uses the house chrome string", () => {
    expect(voiceThroughLabel("qwen-flash")).toBe("Voice through qwen-flash");
  });
});
