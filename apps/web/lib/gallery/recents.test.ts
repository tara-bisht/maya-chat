import { describe, expect, it } from "vitest";
import { COMPANY } from "@/lib/company";
import { houseHref } from "@/lib/house/href";
import {
  relativeLabel,
  threadTitle,
  toRecentChats,
  type RecentAgent,
  type RecentConversation,
} from "./recents";

const MARCUS = COMPANY[0];
const PRIYA = COMPANY[1];
const NOW = Date.parse("2026-09-10T12:00:00.000Z");

function agent(
  player: (typeof COMPANY)[number],
  overrides: Partial<RecentAgent> = {},
): RecentAgent {
  return {
    id: player.id,
    shortName: player.shortName,
    costume: player.costume,
    avatar: player.avatar,
    ...overrides,
  };
}

function row(
  overrides: Partial<RecentConversation> & Pick<RecentConversation, "id" | "agent_id">,
): RecentConversation {
  return {
    title: "A real thread",
    updated_at: "2026-09-10T11:00:00.000Z",
    messageCount: 1,
    ...overrides,
  };
}

describe("threadTitle", () => {
  it("falls back to New chat when empty", () => {
    expect(threadTitle("")).toBe("New chat");
    expect(threadTitle("   ")).toBe("New chat");
    expect(threadTitle("Roast the excuses")).toBe("Roast the excuses");
  });
});

describe("relativeLabel", () => {
  it("uses short units under a week", () => {
    expect(relativeLabel("2026-09-10T12:00:00.000Z", NOW)).toBe("just now");
    expect(relativeLabel("2026-09-10T11:50:00.000Z", NOW)).toBe("10m");
    expect(relativeLabel("2026-09-10T09:00:00.000Z", NOW)).toBe("3h");
    expect(relativeLabel("2026-09-08T12:00:00.000Z", NOW)).toBe("2d");
  });
});

describe("toRecentChats", () => {
  const agents = new Map<string, RecentAgent>([
    [MARCUS.id, agent(MARCUS)],
    [PRIYA.id, agent(PRIYA)],
  ]);

  it("keeps one live thread per agent, newest first, and skips unknown agents", () => {
    const conversations: RecentConversation[] = [
      row({
        id: "c-new",
        agent_id: MARCUS.id,
        title: "Newer",
        updated_at: "2026-09-10T11:00:00.000Z",
      }),
      row({
        id: "c-ghost",
        agent_id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
        title: "Ghost",
      }),
      row({
        id: "c-priya",
        agent_id: PRIYA.id,
        title: "",
        updated_at: "2026-09-10T10:00:00.000Z",
      }),
      ...Array.from({ length: 10 }, (_, index) =>
        row({
          id: `extra-${index}`,
          agent_id: MARCUS.id,
          title: `Extra ${index}`,
        }),
      ),
    ];

    const recents = toRecentChats(conversations, agents, { nowMs: NOW, limit: 8 });

    expect(recents).toHaveLength(2);
    expect(recents[0]).toMatchObject({
      conversationId: "c-new",
      agentId: MARCUS.id,
      agentName: "Marcus",
      title: "Newer",
      href: houseHref(MARCUS.id, "c-new"),
      relativeLabel: "1h",
    });
    expect(recents[1]).toMatchObject({
      conversationId: "c-priya",
      title: "New chat",
      href: houseHref(PRIYA.id, "c-priya"),
    });
    expect(recents.some((item) => item.conversationId === "c-ghost")).toBe(false);
    expect(recents.some((item) => item.conversationId.startsWith("extra-"))).toBe(
      false,
    );
  });

  it("does not let a newer empty thread hide an older live thread", () => {
    const recents = toRecentChats(
      [
        row({
          id: "c-empty",
          agent_id: MARCUS.id,
          title: "Empty",
          updated_at: "2026-09-10T11:30:00.000Z",
          messageCount: 0,
        }),
        row({
          id: "c-live",
          agent_id: MARCUS.id,
          title: "Still here",
          updated_at: "2026-09-10T10:00:00.000Z",
          messageCount: 2,
        }),
        row({
          id: "c-priya",
          agent_id: PRIYA.id,
          title: "Priya live",
          updated_at: "2026-09-10T09:00:00.000Z",
        }),
      ],
      agents,
      { nowMs: NOW, limit: 8 },
    );

    expect(recents.map((item) => item.conversationId)).toEqual([
      "c-live",
      "c-priya",
    ]);
  });

  it("caps at unique agents, not conversations", () => {
    const crowd = new Map<string, RecentAgent>();
    const conversations: RecentConversation[] = [];
    for (let index = 0; index < 10; index += 1) {
      const id = `agent-${index}`;
      crowd.set(id, {
        id,
        shortName: `Agent ${index}`,
        costume: "marcus",
        avatar: "",
      });
      conversations.push(
        row({
          id: `c-${index}`,
          agent_id: id,
          title: `Thread ${index}`,
        }),
      );
    }

    const recents = toRecentChats(conversations, crowd, {
      nowMs: NOW,
      limit: 8,
    });

    expect(recents).toHaveLength(8);
    expect(recents.map((item) => item.agentId)).toEqual(
      Array.from({ length: 8 }, (_, index) => `agent-${index}`),
    );
  });

  it("skips conversations with zero messages", () => {
    const recents = toRecentChats(
      [
        row({
          id: "c-empty",
          agent_id: MARCUS.id,
          title: "",
          messageCount: 0,
        }),
        row({
          id: "c-live",
          agent_id: MARCUS.id,
          title: "A real thread",
          messageCount: 2,
        }),
      ],
      agents,
      { nowMs: NOW, limit: 8 },
    );

    expect(recents.map((item) => item.conversationId)).toEqual(["c-live"]);
  });
});
