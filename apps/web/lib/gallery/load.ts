import "server-only";

import { cache } from "react";
import {
  parseCreditBalance,
  parseMayaPlan,
  type CreditBalance,
  type MayaPlan,
} from "@maya/shared";
import { houseHref } from "@/lib/house/href";
import {
  messageCountFromEmbed,
  type ConversationQueryRow,
} from "@/lib/house/threads";
import { createClient } from "@/lib/supabase/server";
import { logDropped } from "@/lib/supabase/dropped";
import {
  GALLERY_AGENT_COLUMNS,
  playbillFromAgent,
  sortCuratedPlaybills,
  type GalleryAgentRow,
  type Playbill,
} from "./playbill";
import {
  RECENT_CHAT_LIMIT,
  toRecentChats,
  type GalleryViewer,
  type RecentAgent,
  type RecentChat,
  type RecentConversation,
} from "./recents";

export type { GalleryViewer };

export type LobbyChrome = {
  viewer: GalleryViewer;
  recents: RecentChat[];
  custom: Playbill[];
};

export type GalleryLoad =
  | {
      ok: true;
      curated: Playbill[];
      custom: Playbill[];
      house: Playbill[];
      recents: RecentChat[];
      viewer: GalleryViewer;
      plan: MayaPlan;
    }
  | { ok: false };

const HOUSE_LISTING_LIMIT = 24;

type ConversationRow = RecentConversation;

type GalleryBundle = {
  curatedError: boolean;
  curatedRows: GalleryAgentRow[];
  customRows: GalleryAgentRow[];
  houseRows: GalleryAgentRow[];
  extraRows: GalleryAgentRow[];
  conversations: ConversationRow[];
  plan: MayaPlan;
  displayName: string;
  credits: CreditBalance | null;
};

const loadGalleryBundle = cache(async (userId: string): Promise<GalleryBundle> => {
  const supabase = await createClient();
  const [
    curatedResult,
    customResult,
    houseResult,
    entitlementResult,
    conversationsResult,
    profileResult,
    creditResult,
  ] = await Promise.all([
    supabase.from("agents").select(GALLERY_AGENT_COLUMNS).eq("is_curated", true),
    supabase
      .from("agents")
      .select(GALLERY_AGENT_COLUMNS)
      .eq("user_id", userId)
      .eq("is_curated", false)
      .is("archived_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("agents")
      .select(GALLERY_AGENT_COLUMNS)
      .eq("is_public", true)
      .eq("is_curated", false)
      .is("archived_at", null)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(HOUSE_LISTING_LIMIT),
    supabase
      .from("entitlements")
      .select("plan")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("conversations")
      .select("id, agent_id, title, updated_at, messages(count)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .maybeSingle(),
    supabase.rpc("credit_balance"),
  ]);

  if (curatedResult.error) {
    logDropped("gallery", { curated: curatedResult.error });
  }

  if (customResult.error || houseResult.error || conversationsResult.error) {
    logDropped("gallery", {
      custom: customResult.error,
      house: houseResult.error,
      conversations: conversationsResult.error,
    });
  }

  const curatedRows = (curatedResult.data ?? []) as GalleryAgentRow[];
  const customRows = (customResult.data ?? []) as GalleryAgentRow[];
  const houseRows = (houseResult.data ?? []) as GalleryAgentRow[];
  const conversations = (
    (conversationsResult.data ?? []) as ConversationQueryRow[]
  ).map((row) => ({
    id: row.id,
    agent_id: row.agent_id,
    title: row.title,
    updated_at: row.updated_at,
    messageCount: messageCountFromEmbed(row.messages),
  }));

  const known = new Set<string>(
    [...curatedRows, ...customRows, ...houseRows].map((row) => row.id),
  );
  const missing: string[] = [];
  for (const conversation of conversations) {
    if (conversation.messageCount <= 0) {
      continue;
    }
    if (known.has(conversation.agent_id)) {
      continue;
    }
    if (!missing.includes(conversation.agent_id)) {
      missing.push(conversation.agent_id);
    }
    if (missing.length >= RECENT_CHAT_LIMIT) {
      break;
    }
  }

  let extraRows: GalleryAgentRow[] = [];
  if (missing.length > 0) {
    const extraResult = await supabase
      .from("agents")
      .select(GALLERY_AGENT_COLUMNS)
      .in("id", missing);
    if (extraResult.error) {
      logDropped("gallery", { extra: extraResult.error });
    } else {
      extraRows = (extraResult.data ?? []) as GalleryAgentRow[];
    }
  }

  if (creditResult.error) {
    logDropped("gallery", { credits: creditResult.error });
  }

  return {
    curatedError: Boolean(curatedResult.error),
    curatedRows,
    customRows,
    houseRows,
    extraRows,
    conversations,
    plan: parseMayaPlan(entitlementResult.data?.plan),
    displayName: profileResult.data?.display_name?.trim() ?? "",
    credits: parseCreditBalance(creditResult.data),
  };
});

function assemble(userId: string, bundle: GalleryBundle) {
  const latestByAgent = new Map<string, string>();
  for (const conversation of bundle.conversations) {
    if (!latestByAgent.has(conversation.agent_id)) {
      latestByAgent.set(conversation.agent_id, conversation.id);
    }
  }

  const withDoor = (playbill: Playbill): Playbill => ({
    ...playbill,
    href: houseHref(playbill.id, latestByAgent.get(playbill.id)),
  });

  const curated = sortCuratedPlaybills(
    bundle.curatedRows.map((row) => playbillFromAgent(row, userId)),
  ).map(withDoor);
  const custom = bundle.customRows
    .map((row) => playbillFromAgent(row, userId))
    .map(withDoor);
  const house = bundle.houseRows
    .map((row) => playbillFromAgent(row, userId))
    .map(withDoor);

  const agentsById = new Map<string, RecentAgent>();
  for (const playbill of [...curated, ...custom, ...house]) {
    agentsById.set(playbill.id, playbill);
  }
  for (const row of bundle.extraRows) {
    const playbill = playbillFromAgent(row, userId);
    agentsById.set(playbill.id, playbill);
  }

  const recents = toRecentChats(bundle.conversations, agentsById);
  const viewer: GalleryViewer = {
    displayName: bundle.displayName,
    plan: bundle.plan,
    credits: bundle.credits,
  };

  return { curated, custom, house, recents, viewer, plan: bundle.plan };
}

export async function loadGallery(userId: string): Promise<GalleryLoad> {
  const bundle = await loadGalleryBundle(userId);
  if (bundle.curatedError) {
    return { ok: false };
  }
  return { ok: true, ...assemble(userId, bundle) };
}

export async function loadLobbyChrome(userId: string): Promise<LobbyChrome> {
  const bundle = await loadGalleryBundle(userId);
  const assembled = assemble(userId, bundle);
  return {
    viewer: assembled.viewer,
    recents: assembled.recents,
    custom: assembled.custom,
  };
}
