import { NextResponse } from "next/server";
import { MAYA_AGENT_ID, parseHandoffRequest } from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import { loadChatAgent, loadConversationHistory } from "@/lib/chat/load-context";
import { insertUserMessage, setHostRoute } from "@/lib/chat/persist";
import { houseHref } from "@/lib/house/href";
import { logDropped } from "@/lib/supabase/dropped";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

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

  const parsed = parseHandoffRequest(body);
  if (!parsed.ok) {
    return chatError("invalid", 400);
  }

  const supabase = await createClient();
  const from = await loadConversationHistory(supabase, {
    userId: user.id,
    agentId: MAYA_AGENT_ID,
    conversationId: parsed.data.fromConversationId,
  });
  if (!from.ok) {
    return chatError(
      from.reason === "not_found" ? "not_found" : "dropped",
      from.reason === "not_found" ? 404 : 500,
    );
  }
  if (!from.lastUserText) {
    return chatError("invalid", 400);
  }

  const target = await loadChatAgent(supabase, {
    userId: user.id,
    agentId: parsed.data.agentId,
  });
  if (!target.ok) {
    return chatError(
      target.reason === "not_found" ? "not_found" : "dropped",
      target.reason === "not_found" ? 404 : 500,
    );
  }
  if (!target.canChat) {
    return chatError("locked_agent", 403);
  }
  if (target.agent.is_host) {
    return chatError("invalid", 400);
  }

  const created = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      agent_id: target.agent.id,
      title: "",
    })
    .select("id")
    .single();
  if (created.error || !created.data) {
    logDropped("handoff", { insert: created.error });
    return chatError("dropped", 500);
  }

  const copied = await insertUserMessage(supabase, {
    conversationId: created.data.id,
    content: from.lastUserText,
  });
  if (!copied.ok) {
    logDropped("handoff", { copy: copied.error });
    return chatError("dropped", 500);
  }

  const routed = await setHostRoute(supabase, {
    conversationId: from.conversation.id,
    hostRoute: "handed_off",
  });
  if (!routed.ok) {
    logDropped("handoff", { route: routed.error });
  }

  return NextResponse.json({
    href: `${houseHref(target.agent.id, created.data.id)}?play=1`,
    conversationId: created.data.id,
  });
}
