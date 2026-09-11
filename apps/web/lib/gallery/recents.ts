import {
  OPEN_NIGHT_TITLE,
  type CreditBalance,
  type MayaPlan,
} from "@maya/shared";
import type { PosterCostumeId } from "@/lib/company";
import { houseHref } from "@/lib/house/href";

export type GalleryViewer = {
  displayName: string;
  plan: MayaPlan;
  credits: CreditBalance | null;
};

export const RECENT_CHAT_LIMIT = 8;

export type RecentConversation = {
  id: string;
  agent_id: string;
  title: string;
  updated_at: string;
  messageCount: number;
};

export type RecentAgent = {
  id: string;
  shortName: string;
  costume: PosterCostumeId;
  avatar: string;
};

export type RecentChat = {
  conversationId: string;
  agentId: string;
  agentName: string;
  costume: PosterCostumeId;
  avatar: string;
  title: string;
  updatedAt: string;
  relativeLabel: string;
  href: string;
};

export function threadTitle(title: string): string {
  return title.trim() || OPEN_NIGHT_TITLE;
}

export function relativeLabel(iso: string, nowMs: number): string {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) {
    return "";
  }
  const delta = Math.max(0, nowMs - then);
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }
  return new Date(then).toLocaleDateString();
}

export function toRecentChats(
  conversations: RecentConversation[],
  agentsById: ReadonlyMap<string, RecentAgent>,
  options: { limit?: number; nowMs?: number } = {},
): RecentChat[] {
  const limit = options.limit ?? RECENT_CHAT_LIMIT;
  const nowMs = options.nowMs ?? Date.now();
  const recents: RecentChat[] = [];
  const seenAgents = new Set<string>();

  for (const row of conversations) {
    if (recents.length >= limit) {
      break;
    }
    if (row.messageCount <= 0) {
      continue;
    }
    if (seenAgents.has(row.agent_id)) {
      continue;
    }
    const agent = agentsById.get(row.agent_id);
    if (!agent) {
      continue;
    }
    seenAgents.add(agent.id);
    recents.push({
      conversationId: row.id,
      agentId: agent.id,
      agentName: agent.shortName,
      costume: agent.costume,
      avatar: agent.avatar,
      title: threadTitle(row.title),
      updatedAt: row.updated_at,
      relativeLabel: relativeLabel(row.updated_at, nowMs),
      href: houseHref(agent.id, row.id),
    });
  }

  return recents;
}
