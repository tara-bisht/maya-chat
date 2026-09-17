import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/dropped", () => ({ logDropped: vi.fn() }));
vi.mock("@/lib/credits/load", () => ({
  loadCatalogModels: vi.fn(async () => ({
    defaultModelId: "qwen-flash",
    models: [
      {
        id: "qwen-flash",
        displayName: "Qwen Flash",
        provider: "qwen",
        sortOrder: 0,
        allowed: true,
        minPlan: "free",
        estimatedCreditsPerTurn: 1,
      },
    ],
  })),
}));

import type { HouseAgentRow } from "./columns";
import { loadHouse } from "./load";

const OWNER_ID = "5663e1d2-9f55-48b5-9c84-c3bae6cc2e0f";
const CUSTOM_ID = "f610b3c2-e88b-4fce-b08f-736300039a48";
const CURATED_ID = "00000000-0000-0000-0000-000000000001";
const PROMPT_DENIED = {
  data: null,
  error: {
    code: "42501",
    message: "permission denied for function chat_agent_prompt",
  },
};

function customRow(): HouseAgentRow {
  return {
    id: CUSTOM_ID,
    user_id: OWNER_ID,
    name: "Krishan",
    tagline: "Charioteer energy.",
    avatar_url: null,
    category: "custom",
    is_curated: false,
    is_host: false,
    is_public: false,
    free_tier: false,
    language_preset: "hinglish",
    tone_settings: { warmth: 0.8, directness: 0.9, humor: 0 },
    tools_enabled: ["memory_saver"],
    costume_id: "alex",
    archived_at: null,
  };
}

function curatedRow(): HouseAgentRow {
  return {
    id: CURATED_ID,
    user_id: null,
    name: "Marcus",
    tagline: "Direct.",
    avatar_url: null,
    category: "productivity",
    is_curated: true,
    is_host: false,
    is_public: true,
    free_tier: true,
    language_preset: "en",
    tone_settings: { warmth: 0.1, directness: 1, humor: 0.85 },
    tools_enabled: ["memory_saver"],
    costume_id: "marcus",
    archived_at: null,
  };
}

function thenable(result: { data: unknown; error: null }) {
  const builder: Record<string, unknown> = {};
  const self = () => builder;
  builder.select = self;
  builder.eq = self;
  builder.or = self;
  builder.order = self;
  builder.limit = self;
  builder.maybeSingle = () => Promise.resolve(result);
  builder.then = (
    resolve: (value: unknown) => unknown,
    reject: (reason: unknown) => unknown,
  ) => Promise.resolve(result).then(resolve, reject);
  return builder;
}

function houseClient(input: {
  agent: HouseAgentRow;
  sheet?: { data: { system_prompt: string } | null; error: unknown };
}) {
  const rpc = vi.fn(async (name: string) => {
    if (name === "chat_agent_prompt") {
      return PROMPT_DENIED;
    }
    if (name === "own_custom_agent_sheet") {
      return (
        input.sheet ?? {
          data: { system_prompt: "Calm, unhurried, occasionally devastating." },
          error: null,
        }
      );
    }
    if (name === "credit_balance") {
      return { data: null, error: null };
    }
    throw new Error(name);
  });

  const from = vi.fn((table: string) => {
    if (table === "agents") {
      const builder = thenable({ data: [input.agent], error: null });
      builder.maybeSingle = () =>
        Promise.resolve({ data: input.agent, error: null });
      return builder;
    }
    if (table === "entitlements") {
      return thenable({ data: { plan: "plus" }, error: null });
    }
    if (table === "conversations") {
      return thenable({ data: [], error: null });
    }
    if (table === "profiles") {
      return thenable({
        data: { display_name: "Tara", preferred_model_id: null },
        error: null,
      });
    }
    if (table === "agent_roster") {
      return thenable({ data: [], error: null });
    }
    throw new Error(table);
  });

  return { from, rpc };
}

describe("loadHouse", () => {
  it("loads an owned custom agent via own_custom_agent_sheet when chat_agent_prompt is denied", async () => {
    const supabase = houseClient({ agent: customRow() });
    const loaded = await loadHouse(supabase as never, {
      userId: OWNER_ID,
      agentId: CUSTOM_ID,
    });

    expect(loaded.ok).toBe(true);
    if (!loaded.ok) {
      return;
    }
    expect(loaded.house.agent.backstory).toBe(
      "Calm, unhurried, occasionally devastating.",
    );
    expect(loaded.house.agent.canEdit).toBe(true);
    expect(supabase.rpc).toHaveBeenCalledWith("own_custom_agent_sheet", {
      p_id: CUSTOM_ID,
    });
    expect(supabase.rpc).not.toHaveBeenCalledWith(
      "chat_agent_prompt",
      expect.anything(),
    );
  });

  it("does not fetch a prompt for a curated seat", async () => {
    const supabase = houseClient({ agent: curatedRow() });
    const loaded = await loadHouse(supabase as never, {
      userId: OWNER_ID,
      agentId: CURATED_ID,
    });

    expect(loaded.ok).toBe(true);
    if (!loaded.ok) {
      return;
    }
    expect(loaded.house.agent.backstory).toBeNull();
    expect(supabase.rpc).not.toHaveBeenCalledWith(
      "own_custom_agent_sheet",
      expect.anything(),
    );
    expect(supabase.rpc).not.toHaveBeenCalledWith(
      "chat_agent_prompt",
      expect.anything(),
    );
  });
});
