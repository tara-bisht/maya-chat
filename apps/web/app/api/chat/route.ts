import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import {
  HISTORY_WINDOW,
  isDailyCapReached,
  parseChatRequest,
  systemPromptWithLanguage,
} from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import {
  loadChatAgent,
  loadConversationHistory,
  loadPlanModel,
} from "@/lib/chat/load-context";
import {
  countTurnsToday,
  insertAssistantMessage,
  insertUsageEvent,
  insertUserMessage,
  retitleConversation,
} from "@/lib/chat/persist";
import { getOpenRouterModel } from "@/lib/openrouter/ai";
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

  const used = await countTurnsToday(supabase, user.id);
  if (isDailyCapReached(planLoad.dailyLimit, used)) {
    return chatError("quota", 429);
  }

  const conversationLoad = await loadConversationHistory(supabase, {
    userId: user.id,
    agentId: parsed.data.agentId,
    conversationId: parsed.data.conversationId,
  });

  if (!conversationLoad.ok) {
    return chatError(
      conversationLoad.reason === "not_found" ? "not_found" : "dropped",
      conversationLoad.reason === "not_found" ? 404 : 500,
    );
  }

  await insertUsageEvent(supabase, user.id);
  await insertUserMessage(supabase, {
    conversationId: conversationLoad.conversation.id,
    content: parsed.text,
  });
  await retitleConversation(supabase, {
    conversationId: conversationLoad.conversation.id,
    currentTitle: conversationLoad.conversation.title,
    firstUserText: parsed.text,
  });

  const prior: UIMessage[] = conversationLoad.history
    .slice(-HISTORY_WINDOW)
    .map((turn, index) => ({
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
    system: systemPromptWithLanguage(
      agentLoad.agent.system_prompt,
      agentLoad.agent.language_preset,
    ),
    messages: await convertToModelMessages(nextMessages),
    onFinish: async ({ text, totalUsage, usage }) => {
      const tokens =
        totalUsage?.totalTokens ??
        usage?.totalTokens ??
        0;
      try {
        await insertAssistantMessage(supabase, {
          conversationId: conversationLoad.conversation.id,
          content: text,
          tokensUsed: Number.isFinite(tokens) ? Math.trunc(tokens) : 0,
        });
      } catch {
        // Stream already reached the client; persist failure is logged by the thrower.
      }
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
