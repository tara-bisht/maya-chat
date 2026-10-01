import { NextResponse } from "next/server";
import {
  MAYA_AGENT_ID,
  isUuid,
  parseCostumeId,
  parseRosterWrite,
} from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import { loadChatAgent } from "@/lib/chat/load-context";
import { setHostRoute } from "@/lib/chat/persist";
import { HOUSE_AGENT_COLUMNS, type HouseAgentRow } from "@/lib/house/columns";
import { avatarFor, shortNameFor } from "@/lib/house/public-agent";
import { logDropped } from "@/lib/supabase/dropped";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return chatError("unauthorized", 401);
  }
  const supabase = await createClient();
  const pinned = await supabase
    .from("agent_roster")
    .select("agent_id")
    .eq("user_id", user.id);
  if (pinned.error) {
    logDropped("roster GET", { roster: pinned.error });
    return chatError("dropped", 500);
  }
  const validIds = (pinned.data ?? [])
    .map((row) => row.agent_id)
    .filter((id) => typeof id === "string" && isUuid(id));
  const filterTerms = [
    `id.eq.${MAYA_AGENT_ID}`,
    `user_id.eq.${user.id}`,
  ];
  if (validIds.length > 0) {
    filterTerms.push(`id.in.(${validIds.join(",")})`);
  }
  const agents = await supabase
    .from("agents")
    .select(HOUSE_AGENT_COLUMNS)
    .or(filterTerms.join(","));
  if (agents.error) {
    logDropped("roster GET", { agents: agents.error });
    return chatError("dropped", 500);
  }
  const rows = (agents.data ?? []) as HouseAgentRow[];
  const live = rows.filter((row) => !row.archived_at);
  const host = live.find((row) => row.is_host);
  const byId = new Map(live.map((row) => [row.id, row]));
  const official = validIds
    .map((id) => byId.get(id))
    .filter((row): row is HouseAgentRow => row != null && !row.is_host);
  const custom = live.filter(
    (row) => row.user_id === user.id && !row.is_curated,
  );
  const seen = new Set<string>();
  const ordered: HouseAgentRow[] = [];
  for (const row of [...(host ? [host] : []), ...official, ...custom]) {
    if (seen.has(row.id)) {
      continue;
    }
    seen.add(row.id);
    ordered.push(row);
  }
  return NextResponse.json({
    roster: ordered.map((row) => ({
      id: row.id,
      shortName: shortNameFor(row),
      costume: parseCostumeId(row.costume_id),
      avatar: avatarFor(row),
    })),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return chatError("unauthorized", 401);
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return chatError("invalid", 400);
  }
  const parsed = parseRosterWrite(body);
  if (!parsed.ok) {
    return chatError("invalid", 400);
  }
  const supabase = await createClient();
  const loaded = await loadChatAgent(supabase, {
    userId: user.id,
    agentId: parsed.data.agentId,
  });
  if (!loaded.ok) {
    return chatError(
      loaded.reason === "not_found" ? "not_found" : "dropped",
      loaded.reason === "not_found" ? 404 : 500,
    );
  }
  if (loaded.agent.is_host) {
    return chatError("invalid", 400);
  }
  const inserted = await supabase.from("agent_roster").insert({
    user_id: user.id,
    agent_id: parsed.data.agentId,
  });
  if (inserted.error && inserted.error.code !== "23505") {
    if (inserted.error.code === "42501") {
      return chatError("invalid", 400);
    }
    logDropped("roster POST", { insert: inserted.error });
    return chatError("dropped", 500);
  }
  if (parsed.data.conversationId) {
    const conversation = await supabase
      .from("conversations")
      .select("id, agent_id, user_id")
      .eq("id", parsed.data.conversationId)
      .maybeSingle();
    if (
      conversation.data &&
      conversation.data.user_id === user.id &&
      conversation.data.agent_id === MAYA_AGENT_ID
    ) {
      await setHostRoute(supabase, {
        conversationId: conversation.data.id,
        hostRoute: "stay",
      });
    }
  }
  return NextResponse.json({
    ok: true,
    agent: {
      id: loaded.agent.id,
      shortName: shortNameFor(loaded.agent),
      costume: parseCostumeId(loaded.agent.costume_id),
      avatar: avatarFor(loaded.agent),
    },
  });
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return chatError("unauthorized", 401);
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return chatError("invalid", 400);
  }
  const parsed = parseRosterWrite(body);
  if (!parsed.ok) {
    return chatError("invalid", 400);
  }
  const supabase = await createClient();
  const removed = await supabase
    .from("agent_roster")
    .delete()
    .eq("user_id", user.id)
    .eq("agent_id", parsed.data.agentId);
  if (removed.error) {
    logDropped("roster DELETE", { delete: removed.error });
    return chatError("dropped", 500);
  }
  return NextResponse.json({ ok: true });
}
