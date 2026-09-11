import "server-only";

import { creditsFromRates, creditsFromUsd } from "@maya/shared";
import type { PlanModelRow } from "@/lib/chat/load-context";

type UsageLike = {
  inputTokens?: number | undefined;
  outputTokens?: number | undefined;
  totalTokens?: number | undefined;
  raw?: Record<string, unknown> | undefined;
};

function finiteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function costFromProviderBag(value: unknown): number | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const record = value as Record<string, unknown>;
  const direct = finiteNumber(record.cost);
  if (direct != null && direct >= 0) {
    return direct;
  }
  const nested = record.usage;
  if (nested && typeof nested === "object") {
    const usageCost = finiteNumber((nested as Record<string, unknown>).cost);
    if (usageCost != null && usageCost >= 0) {
      return usageCost;
    }
  }
  return null;
}

export function costUsdFromUsage(
  usage: UsageLike | undefined,
  providerMetadata: unknown,
): number | null {
  const rawCost = costFromProviderBag(usage?.raw);
  if (rawCost != null) {
    return rawCost;
  }

  if (providerMetadata && typeof providerMetadata === "object") {
    const record = providerMetadata as Record<string, unknown>;
    for (const key of ["openrouter", "openai"]) {
      const nestedCost = costFromProviderBag(record[key]);
      if (nestedCost != null) {
        return nestedCost;
      }
    }
  }

  return null;
}

export function settleCreditsFromUsage(input: {
  usage: UsageLike | undefined;
  providerMetadata: unknown;
  model: PlanModelRow;
  creditScale: number;
  reservedCredits: number;
}): { credits: number; promptTokens: number; completionTokens: number; costUsd: number | null } {
  const promptTokens = Math.max(0, Math.trunc(input.usage?.inputTokens ?? 0));
  const completionTokens = Math.max(
    0,
    Math.trunc(input.usage?.outputTokens ?? 0),
  );
  const costUsd = costUsdFromUsage(input.usage, input.providerMetadata);

  if (costUsd != null && costUsd > 0) {
    return {
      credits: creditsFromUsd(costUsd, input.creditScale),
      promptTokens,
      completionTokens,
      costUsd,
    };
  }

  // Explicit $0 from the gateway. Do not fall through to catalog rates
  // (that overcharges a free/zero-cost model). Floor at min_turn_credits.
  if (costUsd === 0) {
    return {
      credits: Math.max(1, input.model.minTurnCredits),
      promptTokens,
      completionTokens,
      costUsd: 0,
    };
  }

  if (promptTokens > 0 || completionTokens > 0) {
    return {
      credits: creditsFromRates({
        promptTokens,
        completionTokens,
        inputUsdPerMillion: input.model.inputUsdPerMillion,
        outputUsdPerMillion: input.model.outputUsdPerMillion,
        scale: input.creditScale,
        minTurnCredits: input.model.minTurnCredits,
      }),
      promptTokens,
      completionTokens,
      costUsd,
    };
  }

  return {
    credits: Math.max(input.model.minTurnCredits, input.reservedCredits),
    promptTokens,
    completionTokens,
    costUsd,
  };
}
