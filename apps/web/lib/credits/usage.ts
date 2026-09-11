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

export function costUsdFromUsage(
  usage: UsageLike | undefined,
  providerMetadata: unknown,
): number | null {
  const rawCost = usage?.raw ? finiteNumber(usage.raw.cost) : null;
  if (rawCost != null && rawCost >= 0) {
    return rawCost;
  }

  if (providerMetadata && typeof providerMetadata === "object") {
    const record = providerMetadata as Record<string, unknown>;
    for (const key of ["openrouter", "openai"]) {
      const nested = record[key];
      if (nested && typeof nested === "object") {
        const cost = finiteNumber((nested as Record<string, unknown>).cost);
        if (cost != null && cost >= 0) {
          return cost;
        }
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
