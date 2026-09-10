import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import {
  compilePrompt,
  parseChatRequest,
  toneSettingsSchema,
} from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import {
  loadChatAgent,
  loadChatProfile,
  loadConversationHistory,
  loadPlanModel,
} from "@/lib/chat/load-context";
import {
  insertAssistantMessage,
  insertUserMessage,
  retitleConversation,
} from "@/lib/chat/persist";
import { getOpenRouterModel } from "@/lib/openrouter/ai";
import { logDropped } from "@/lib/supabase/dropped";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  const parsed = parseChatRequest(body);
  if (!parsed.ok) {
    return chatError("invalid", 400);
  }

  const supabase = await createClient();
  const agentLoad = await loadChatAgent(supabase, {
    userId: user.id,
    agentId: parsed.data.agentId,
  });

  if (!agentLoad.ok) {
    return chatError(
      agentLoad.reason === "not_found" ? "not_found" : "dropped",
      agentLoad.reason === "not_found" ? 404 : 500,
    );
  }

  if (!agentLoad.canChat) {
    return chatError("locked_agent", 403);
  }

  const planLoad = await loadPlanModel(supabase, agentLoad.planId);
  if (!planLoad.ok) {
    return chatError("dropped", 500);
  }

  const [conversationLoad, profile] = await Promise.all([
    loadConversationHistory(supabase, {
      userId: user.id,
      agentId: parsed.data.agentId,
      conversationId: parsed.data.conversationId,
    }),
    loadChatProfile(supabase, user.id),
  ]);

  if (!conversationLoad.ok) {
    return chatError(
      conversationLoad.reason === "not_found" ? "not_found" : "dropped",
      conversationLoad.reason === "not_found" ? 404 : 500,
    );
  }

  const inserted = await insertUserMessage(supabase, {
    conversationId: conversationLoad.conversation.id,
    content: parsed.text,
  });
  if (!inserted.ok) {
    logDropped("insertUserMessage", { insert: inserted.error });
    return chatError("dropped", 500);
  }

  const quota = await supabase.rpc("consume_chat_turn");
  if (quota.error) {
    logDropped("chat", { quota: quota.error });
    return chatError("dropped", 500);
  }
  if (quota.data !== true) {
    return chatError("quota", 429);
  }

  await retitleConversation(supabase, {
    conversationId: conversationLoad.conversation.id,
    currentTitle: conversationLoad.conversation.title,
    firstUserText: parsed.text,
  });

  const prior: UIMessage[] = conversationLoad.history.map((turn, index) => ({
    id: `hist-${index}`,
    role: turn.role,
    parts: [{ type: "text" as const, text: turn.content }],
  }));
  const nextMessages: UIMessage[] = [
    ...prior,
    {
      id: parsed.data.message.id,
      role: "user",
      parts: [{ type: "text" as const, text: parsed.text }],
    },
  ];

  const result = streamText({
    model: getOpenRouterModel(planLoad.gatewayId),
    maxOutputTokens: 2048,
    system: compilePrompt({
      isCurated: agentLoad.agent.is_curated,
      basePrompt: agentLoad.agent.system_prompt,
      languagePreset: agentLoad.agent.language_preset,
      tone: toneSettingsSchema.safeParse(agentLoad.agent.tone_settings).data,
      userProfile: profile,
      memories: [],
      toolsEnabled: agentLoad.agent.tools_enabled,
      toolsAllowed: planLoad.toolsAllowed,
    }),
    messages: await convertToModelMessages(nextMessages),
    onError: ({ error }) => {
      console.error("[streamText error]", error);
    },
    onEnd: async ({ text, usage }) => {
      const tokens = usage.totalTokens ?? 0;
      const saved = await insertAssistantMessage(supabase, {
        conversationId: conversationLoad.conversation.id,
        content: text,
        tokensUsed: Number.isFinite(tokens) ? Math.trunc(tokens) : 0,
      });
      if (!saved.ok) {
        logDropped("insertAssistantMessage", { insert: saved.error });
      }
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
