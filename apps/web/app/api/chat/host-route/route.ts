import { NextResponse } from "next/server";
import { MAYA_AGENT_ID, parseHostRouteWrite } from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import { setHostRoute } from "@/lib/chat/persist";
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

  const parsed = parseHostRouteWrite(body);
  if (!parsed.ok) {
    return chatError("invalid", 400);
  }

  const supabase = await createClient();
  const conversation = await supabase
    .from("conversations")
    .select("id, agent_id, user_id")
    .eq("id", parsed.conversationId)
    .maybeSingle();
  if (conversation.error) {
    logDropped("host-route", { select: conversation.error });
    return chatError("dropped", 500);
  }
  if (
    !conversation.data ||
    conversation.data.user_id !== user.id ||
    conversation.data.agent_id !== MAYA_AGENT_ID
  ) {
    return chatError("not_found", 404);
  }

  const updated = await setHostRoute(supabase, {
    conversationId: conversation.data.id,
    hostRoute: "stay",
  });
  if (!updated.ok) {
    logDropped("host-route", { update: updated.error });
    return chatError("dropped", 500);
  }

  return NextResponse.json({ ok: true });
}
