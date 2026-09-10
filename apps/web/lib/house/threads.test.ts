import { describe, expect, it } from "vitest";
import { COMPANY } from "@/lib/company";
import { OPEN_NIGHT_TITLE } from "@maya/shared";
import { buildCast, displayThreadTitle, latestByAgent, threadsForAgent } from "./threads";
import type { HouseAgentRow } from "./columns";

const MARCUS = COMPANY[0];
const PRIYA = COMPANY[1];

function agent(overrides: Partial<HouseAgentRow> = {}): HouseAgentRow {
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
    tone_settings: {},
    tools_enabled: [],
    costume_id: "marcus",
    archived_at: null,
    ...overrides,
  };
}

describe("displayThreadTitle", () => {
  it("falls back to the default thread title when empty", () => {
    expect(displayThreadTitle("")).toBe(OPEN_NIGHT_TITLE);
    expect(displayThreadTitle("   ")).toBe(OPEN_NIGHT_TITLE);
    expect(displayThreadTitle("Roast the excuses")).toBe("Roast the excuses");
  });
});

describe("thread grouping", () => {
  const rows = [
    {
      id: "c1",
      agent_id: MARCUS.id,
      title: "Newer Marcus",
      updated_at: "2026-09-10T12:00:00.000Z",
    },
    {
      id: "c0",
      agent_id: MARCUS.id,
      title: "Older Marcus",
      updated_at: "2026-09-10T08:00:00.000Z",
    },
    {
      id: "p1",
      agent_id: PRIYA.id,
      title: "",
      updated_at: "2026-09-10T11:00:00.000Z",
    },
  ];

  it("lists an agent's threads in the given order", () => {
    expect(threadsForAgent(rows, MARCUS.id).map((thread) => thread.id)).toEqual([
      "c1",
      "c0",
    ]);
  });

  it("keeps the first row per agent as latest", () => {
    const latest = latestByAgent(rows);
    expect(latest.get(MARCUS.id)?.id).toBe("c1");
    expect(latest.get(PRIYA.id)?.title).toBe(OPEN_NIGHT_TITLE);
  });
});

describe("buildCast", () => {
  it("puts the company first, then the viewer's live custom roles", () => {
    const custom: HouseAgentRow = agent({
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      user_id: "user-1",
      name: "Auntie Ji",
      is_curated: false,
      is_public: false,
      free_tier: false,
      costume_id: "custom",
      category: "custom",
    });
    const archived: HouseAgentRow = {
      ...custom,
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      archived_at: "2026-09-10T00:00:00.000Z",
      name: "Ghost",
    };
    const cast = buildCast({
      agents: [agent({ id: PRIYA.id, costume_id: "priya" }), agent(), custom, archived],
      viewerId: "user-1",
      conversations: [
        {
          id: "c1",
          agent_id: MARCUS.id,
          title: "Night one",
          updated_at: "2026-09-10T12:00:00.000Z",
        },
      ],
      activeAgentId: MARCUS.id,
    });

    expect(cast.map((member) => member.shortName)).toEqual([
      "Marcus",
      "Dr. Priya",
      "Auntie Ji",
    ]);
    expect(cast[0]?.latestTitle).toBe("Night one");
    expect(cast[1]?.latestTitle).toBeNull();
  });
});
