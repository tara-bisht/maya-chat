import type { CreditBalance, MayaPlan } from "@maya/shared";

export type CatalogModel = {
  id: string;
  displayName: string;
  provider: string;
  sortOrder: number;
  allowed: boolean;
  minPlan: MayaPlan;
  estimatedCreditsPerTurn: number;
};

export type ModelsPayload = {
  defaultModelId: string;
  selectedModelId: string;
  credits: CreditBalance;
  models: CatalogModel[];
};

export type VoicePick =
  | { ok: true; modelId: string }
  | { ok: false; reason: "forbidden_model"; model: CatalogModel };

export function pickVoice(model: CatalogModel): VoicePick {
  if (model.allowed) {
    return { ok: true, modelId: model.id };
  }
  return { ok: false, reason: "forbidden_model", model };
}

export function voiceThroughLabel(alias: string): string {
  return `Voice through ${alias}`;
}
