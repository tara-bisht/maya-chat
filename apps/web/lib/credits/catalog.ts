import { LAB_PROVIDERS, type CreditBalance, type MayaPlan } from "@maya/shared";

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

export function modelLabel(alias: string): string {
  return `Model: ${alias}`;
}

export type LabGroup = {
  provider: string;
  displayName: string;
  rank: number;
  models: CatalogModel[];
};

export function filterCatalogModels(
  models: CatalogModel[],
  search: string,
): CatalogModel[] {
  const query = search.trim().toLowerCase();
  if (!query) {
    return models;
  }
  return models.filter((item) => {
    const nameMatch = (item.displayName ?? "").toLowerCase().includes(query);
    const idMatch = (item.id ?? "").toLowerCase().includes(query);
    const providerMatch = (item.provider ?? "").toLowerCase().includes(query);
    return nameMatch || idMatch || providerMatch;
  });
}

export function groupCatalogModelsByLab(
  models: CatalogModel[],
  labProviders: readonly { id: string; displayName: string; rank: number }[] = LAB_PROVIDERS,
): LabGroup[] {
  const labMap = new Map(
    labProviders.map((p) => [p.id.toLowerCase(), p] as const),
  );

  const groupsMap = new Map<string, CatalogModel[]>();
  for (const model of models) {
    const key = model.provider.toLowerCase();
    const existing = groupsMap.get(key);
    if (existing) {
      existing.push(model);
    } else {
      groupsMap.set(key, [model]);
    }
  }

  const groups: LabGroup[] = Array.from(groupsMap.entries()).map(
    ([providerKey, groupModels]) => {
      const lab = labMap.get(providerKey);
      return {
        provider: providerKey,
        displayName: (lab?.displayName ?? providerKey).toUpperCase(),
        rank: lab?.rank ?? 999,
        models: groupModels,
      };
    },
  );

  groups.sort((a, b) => {
    if (a.rank !== b.rank) {
      return a.rank - b.rank;
    }
    return a.displayName.localeCompare(b.displayName);
  });

  return groups;
}

