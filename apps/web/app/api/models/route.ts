import { NextResponse } from "next/server";
import { isUuid, parseMayaPlan } from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import { loadModelsPayload } from "@/lib/credits/load";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return chatError("unauthorized", 401);
  }

  const supabase = await createClient();
  const conversationId = new URL(request.url).searchParams.get("conversationId");
  if (conversationId && !isUuid(conversationId)) {
    return chatError("invalid", 400);
  }

  const [entitlement, profile, conversation] = await Promise.all([
    supabase
      .from("entitlements")
      .select("plan")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("preferred_model_id")
      .eq("id", user.id)
      .maybeSingle(),
    conversationId
      ? supabase
          .from("conversations")
          .select("id, model_id, user_id")
          .eq("id", conversationId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (conversation.error) {
    return chatError("dropped", 500);
  }
  if (
    conversationId &&
    (!conversation.data || conversation.data.user_id !== user.id)
  ) {
    return chatError("not_found", 404);
  }

  const payload = await loadModelsPayload(supabase, {
    planId: parseMayaPlan(entitlement.data?.plan),
    conversationModelId: conversation.data?.model_id,
    preferredModelId: profile.data?.preferred_model_id,
  });

  if (!payload) {
    return chatError("dropped", 500);
  }

  return NextResponse.json(payload);
}
