import { describe, expect, it } from "vitest";
import type { CatalogModel } from "./catalog";
import {
  filterCatalogModels,
  groupCatalogModelsByLab,
  modelLabel,
  pickVoice,
} from "./catalog";

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

describe("modelLabel", () => {
  it("names the control the way other AI apps do", () => {
    expect(modelLabel("qwen-flash")).toBe("Model: qwen-flash");
  });
});

describe("filterCatalogModels", () => {
  const models: CatalogModel[] = [
    model({
      id: "openai/gpt-4o",
      displayName: "GPT-4o",
      provider: "openai",
      allowed: true,
      minPlan: "free",
    }),
    model({
      id: "anthropic/claude-3-5-sonnet",
      displayName: "Claude 3.5 Sonnet",
      provider: "anthropic",
      allowed: true,
      minPlan: "plus",
    }),
    model({
      id: "google/gemini-2-flash",
      displayName: "Gemini 2.0 Flash",
      provider: "google",
      allowed: true,
      minPlan: "free",
    }),
    model({
      id: "deepseek/deepseek-r1",
      displayName: "DeepSeek R1",
      provider: "deepseek",
      allowed: true,
      minPlan: "free",
    }),
  ];

  it("returns all models when search query is blank", () => {
    expect(filterCatalogModels(models, "")).toHaveLength(4);
    expect(filterCatalogModels(models, "   ")).toHaveLength(4);
  });

  it("filters case-insensitively by displayName", () => {
    const matched = filterCatalogModels(models, "sonnet");
    expect(matched).toHaveLength(1);
    expect(matched[0]?.id).toBe("anthropic/claude-3-5-sonnet");
  });

  it("filters case-insensitively by id", () => {
    const matched = filterCatalogModels(models, "gpt-4o");
    expect(matched).toHaveLength(1);
    expect(matched[0]?.displayName).toBe("GPT-4o");
  });

  it("filters case-insensitively by provider", () => {
    const matched = filterCatalogModels(models, "deepseek");
    expect(matched).toHaveLength(1);
    expect(matched[0]?.id).toBe("deepseek/deepseek-r1");
  });

  it("returns empty when no model matches", () => {
    expect(filterCatalogModels(models, "nonexistent-xyz")).toHaveLength(0);
  });
});

describe("groupCatalogModelsByLab", () => {
  const models: CatalogModel[] = [
    model({
      id: "qwen/qwen-2.5-72b",
      displayName: "Qwen 2.5 72B",
      provider: "qwen",
      allowed: true,
      minPlan: "plus",
    }),
    model({
      id: "anthropic/claude-3-5-sonnet",
      displayName: "Claude 3.5 Sonnet",
      provider: "anthropic",
      allowed: true,
      minPlan: "plus",
    }),
    model({
      id: "openai/gpt-4o",
      displayName: "GPT-4o",
      provider: "openai",
      allowed: true,
      minPlan: "free",
    }),
    model({
      id: "openai/gpt-4o-mini",
      displayName: "GPT-4o Mini",
      provider: "openai",
      allowed: true,
      minPlan: "free",
    }),
  ];

  it("groups models by provider and orders by LAB_PROVIDERS popularity rank", () => {
    const groups = groupCatalogModelsByLab(models);
    expect(groups.map((g) => g.provider)).toEqual(["openai", "anthropic", "qwen"]);
    expect(groups[0]?.displayName).toBe("OPENAI");
    expect(groups[0]?.models).toHaveLength(2);
    expect(groups[1]?.displayName).toBe("ANTHROPIC");
    expect(groups[1]?.models).toHaveLength(1);
    expect(groups[2]?.displayName).toBe("QWEN");
    expect(groups[2]?.models).toHaveLength(1);
  });
});

