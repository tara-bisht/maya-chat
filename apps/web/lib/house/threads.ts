import { OPEN_NIGHT_TITLE, parseCostumeId } from "@maya/shared";
import { COMPANY } from "@/lib/company";
import { houseHref } from "./href";
import type { HouseAgentRow } from "./columns";
import { avatarFor, shortNameFor } from "./public-agent";
import type {
  CastMember,
  HouseRecent,
  RosterMember,
  ThreadSummary,
} from "./types";

export const HOUSE_RECENTS_LIMIT = 40;
export const ROSTER_PORTRAIT_LIMIT = 8;

export type ConversationRow = {
  id: string;
  agent_id: string;
  title: string;
  updated_at: string;
  messageCount: number;
};

export type ConversationQueryRow = {
  id: string;
  agent_id: string;
  title: string;
  updated_at: string;
  model_id?: string | null;
  host_route?: string | null;
  messages?: unknown;
};

export function messageCountFromEmbed(messages: unknown): number {
  if (!Array.isArray(messages) || messages.length === 0) {
    return 0;
  }
  const first = messages[0];
  if (!first || typeof first !== "object" || !("count" in first)) {
    return 0;
  }
  const count = first.count;
  return typeof count === "number" && Number.isFinite(count) ? count : 0;
}

export function toConversationRow(row: ConversationQueryRow): ConversationRow {
  return {
    id: row.id,
    agent_id: row.agent_id,
    title: row.title,
    updated_at: row.updated_at,
    messageCount: messageCountFromEmbed(row.messages),
  };
}

function hasMessages(row: ConversationRow): boolean {
  return row.messageCount > 0;
}

const COMPANY_ORDER = new Map(
  COMPANY.map((player, index) => [player.id, index]),
);

export function displayThreadTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed || OPEN_NIGHT_TITLE;
}

export function toThreadSummary(row: ConversationRow): ThreadSummary {
  return {
    id: row.id,
    title: displayThreadTitle(row.title),
    updatedAt: row.updated_at,
  };
}

export function threadsForAgent(
  rows: ConversationRow[],
  agentId: string,
): ThreadSummary[] {
  return rows
    .filter((row) => row.agent_id === agentId && hasMessages(row))
    .map(toThreadSummary);
}

export function latestByAgent(
  rows: ConversationRow[],
): Map<string, ThreadSummary> {
  const latest = new Map<string, ThreadSummary>();
  for (const row of rows) {
    if (!hasMessages(row)) {
      continue;
    }
    if (!latest.has(row.agent_id)) {
      latest.set(row.agent_id, toThreadSummary(row));
    }
  }
  return latest;
}

export function buildCast(input: {
  agents: HouseAgentRow[];
  viewerId: string;
  conversations: ConversationRow[];
  activeAgentId: string;
}): CastMember[] {
  const latest = latestByAgent(input.conversations);
  const live = input.agents.filter((agent) => {
    if (agent.archived_at) {
      return false;
    }
    if (agent.is_curated) {
      return true;
    }
    return agent.user_id === input.viewerId || agent.id === input.activeAgentId;
  });

  const curated = live
    .filter((agent) => agent.is_curated)
    .sort(
      (a, b) =>
        (COMPANY_ORDER.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
        (COMPANY_ORDER.get(b.id) ?? Number.MAX_SAFE_INTEGER),
    );
  const custom = live.filter((agent) => !agent.is_curated);
  const ordered = [...curated, ...custom];

  return ordered.map((agent) => {
    const thread = latest.get(agent.id);
    return {
      id: agent.id,
      shortName: shortNameFor(agent),
      costume: parseCostumeId(agent.costume_id),
      avatar: avatarFor(agent),
      latestTitle: thread?.title ?? null,
      latestId: thread?.id ?? null,
    };
  });
}

export function buildRoster(input: {
  agents: HouseAgentRow[];
  viewerId: string;
  pinnedIds?: readonly string[];
}): RosterMember[] {
  const live = input.agents.filter((agent) => !agent.archived_at);
  const byId = new Map(live.map((agent) => [agent.id, agent]));
  const host = live.find((agent) => agent.is_host);
  const pinned = (input.pinnedIds ?? [])
    .map((id) => byId.get(id))
    .filter((agent): agent is HouseAgentRow => {
      if (!agent || agent.is_host || agent.archived_at) {
        return false;
      }
      return agent.is_curated || agent.user_id === input.viewerId;
    });
  const custom = live.filter(
    (agent) =>
      agent.user_id === input.viewerId &&
      !agent.is_curated &&
      !pinned.some((item) => item.id === agent.id),
  );
  const seen = new Set<string>();
  const ordered: HouseAgentRow[] = [];
  for (const agent of [...(host ? [host] : []), ...pinned, ...custom]) {
    if (seen.has(agent.id)) {
      continue;
    }
    seen.add(agent.id);
    ordered.push(agent);
  }
  return ordered.slice(0, ROSTER_PORTRAIT_LIMIT).map((agent) => ({
    id: agent.id,
    shortName: shortNameFor(agent),
    costume: parseCostumeId(agent.costume_id),
    avatar: avatarFor(agent),
  }));
}

export function toHouseRecents(input: {
  conversations: ConversationRow[];
  agents: HouseAgentRow[];
  limit?: number;
}): HouseRecent[] {
  const agentsById = new Map(input.agents.map((agent) => [agent.id, agent]));
  const limit = input.limit ?? HOUSE_RECENTS_LIMIT;
  const recents: HouseRecent[] = [];
  for (const row of input.conversations) {
    if (recents.length >= limit) {
      break;
    }
    if (row.messageCount <= 0) {
      continue;
    }
    const agent = agentsById.get(row.agent_id);
    if (!agent || agent.archived_at) {
      continue;
    }
    recents.push({
      conversationId: row.id,
      agentId: agent.id,
      agentName: shortNameFor(agent),
      costume: parseCostumeId(agent.costume_id),
      avatar: avatarFor(agent),
      title: displayThreadTitle(row.title),
      href: houseHref(agent.id, row.id),
    });
  }
  return recents;
}
