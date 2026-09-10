import { describe, expect, it } from "vitest";
import { COMPANY } from "@/lib/company";
import type { HouseAgentRow } from "./columns";
import { toHouseAgent } from "./public-agent";

const MARCUS = COMPANY[0];

function row(overrides: Partial<HouseAgentRow> = {}): HouseAgentRow {
  return {
    id: MARCUS.id,
    user_id: null,
    name: MARCUS.name,
    tagline: MARCUS.tagline,
    avatar_url: MARCUS.avatar,
    category: MARCUS.category,
    is_curated: true,
    is_public: true,
    free_tier: true,
    language_preset: "en",
    tone_settings: { warmth: 0.1, directness: 1, humor: 0.85 },
    tools_enabled: ["memory_saver"],
    costume_id: "marcus",
    archived_at: null,
    ...overrides,
  };
}

describe("toHouseAgent", () => {
  it("lets Free talk to Marcus and never attaches a curated prompt", () => {
    const agent = toHouseAgent({
      row: row(),
      viewerId: "user-1",
      planId: "free",
      backstory: "SECRET PROMPT",
    });
    expect(agent.canChat).toBe(true);
    expect(agent.canEdit).toBe(false);
    expect(agent.backstory).toBeNull();
    expect(agent.shortName).toBe("Marcus");
    expect(agent.costume).toBe("marcus");
  });

  it("blocks Free on a Plus player but still describes them", () => {
    const agent = toHouseAgent({
      row: row({
        id: COMPANY[2].id,
        name: COMPANY[2].name,
        free_tier: false,
        costume_id: "alex",
      }),
      viewerId: "user-1",
      planId: "free",
      backstory: null,
    });
    expect(agent.canChat).toBe(false);
    expect(agent.shortName).toBe("Alex");
  });

  it("shows backstory only for the owner of a custom role", () => {
    const custom = row({
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      user_id: "user-1",
      name: "Auntie Ji",
      is_curated: false,
      is_public: false,
      free_tier: false,
      costume_id: "nonna",
      category: "custom",
    });
    const owner = toHouseAgent({
      row: custom,
      viewerId: "user-1",
      planId: "plus",
      backstory: "Feed them first.",
    });
    const stranger = toHouseAgent({
      row: custom,
      viewerId: "user-2",
      planId: "pro",
      backstory: "Feed them first.",
    });
    expect(owner.canEdit).toBe(true);
    expect(owner.canChat).toBe(true);
    expect(owner.backstory).toBe("Feed them first.");
    expect(owner.costume).toBe("nonna");
    expect(stranger.canEdit).toBe(false);
    expect(stranger.backstory).toBeNull();
    expect(stranger.canChat).toBe(false);
  });
});
