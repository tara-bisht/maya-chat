import { NextResponse } from "next/server";
import { parseConversationCreate } from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import { loadChatAgent } from "@/lib/chat/load-context";
import { createClient } from "@/lib/supabase/server";

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

  const parsed = parseConversationCreate(body);
  if (!parsed.ok) {
    return chatError("invalid", 400);
  }

  const supabase = await createClient();
  const loaded = await loadChatAgent(supabase, {
    userId: user.id,
    agentId: parsed.agentId,
  });

  if (!loaded.ok) {
    return chatError(loaded.reason === "not_found" ? "not_found" : "dropped", loaded.reason === "not_found" ? 404 : 500);
  }

  if (!loaded.canChat) {
    return chatError("locked_agent", 403);
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      agent_id: loaded.agent.id,
      title: "",
    })
    .select("id")
    .single();

  if (error || !data) {
    return chatError("dropped", 500);
  }

  return NextResponse.json({ id: data.id });
}

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return chatError("unauthorized", 401);
  }

  const agentId = new URL(request.url).searchParams.get("agentId");
  if (!agentId) {
    return chatError("invalid", 400);
  }

  const supabase = await createClient();
  const loaded = await loadChatAgent(supabase, {
    userId: user.id,
    agentId,
  });

  if (!loaded.ok) {
    return chatError(
      loaded.reason === "not_found" ? "not_found" : "dropped",
      loaded.reason === "not_found" ? 404 : 500,
    );
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .eq("agent_id", agentId)
    .order("updated_at", { ascending: false });

  if (error) {
    return chatError("dropped", 500);
  }

  return NextResponse.json({ conversations: data ?? [] });
}
