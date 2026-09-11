import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import {
  compilePrompt,
  estimateCharsAsTokens,
  estimateReserveCredits,
  parseChatRequest,
  parseReserveChatTurn,
  parseSettleChatTurn,
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
  rememberVoice,
  retitleConversation,
} from "@/lib/chat/persist";
import { settleCreditsFromUsage } from "@/lib/credits/usage";
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

  const planLoad = await loadPlanModel(supabase, agentLoad.planId, {
    requestedModelId: parsed.data.modelId,
    conversationModelId: conversationLoad.conversation.modelId,
    preferredModelId: profile.preferredModelId,
  });

  if (!planLoad.ok) {
    if (planLoad.reason === "forbidden_model") {
      return chatError("forbidden_model", 403, {
        allowedModelIds: planLoad.allowedModelIds,
      });
    }
    return chatError("dropped", 500);
  }

  const system = compilePrompt({
    isCurated: agentLoad.agent.is_curated,
    basePrompt: agentLoad.agent.system_prompt,
    languagePreset: agentLoad.agent.language_preset,
    tone: toneSettingsSchema.safeParse(agentLoad.agent.tone_settings).data,
    userProfile: profile,
    memories: [],
    toolsEnabled: agentLoad.agent.tools_enabled,
    toolsAllowed: planLoad.toolsAllowed,
  });

  const historyChars = conversationLoad.history.reduce(
    (sum, turn) => sum + turn.content.length,
    0,
  );
  const estimatedPromptTokens = estimateCharsAsTokens(
    system.length + historyChars + parsed.text.length,
  );
  const reserveCredits = estimateReserveCredits({
    estimatedPromptTokens,
    maxOutputTokens: planLoad.model.maxOutputTokens,
    inputUsdPerMillion: planLoad.model.inputUsdPerMillion,
    outputUsdPerMillion: planLoad.model.outputUsdPerMillion,
    minTurnCredits: planLoad.model.minTurnCredits,
    scale: planLoad.creditScale,
  });

  const inserted = await insertUserMessage(supabase, {
    conversationId: conversationLoad.conversation.id,
    content: parsed.text,
  });
  if (!inserted.ok) {
    logDropped("insertUserMessage", { insert: inserted.error });
    return chatError("dropped", 500);
  }

  const quota = await supabase.rpc("reserve_chat_turn", {
    p_model_id: planLoad.modelId,
    p_reserve_credits: reserveCredits,
    p_conversation_id: conversationLoad.conversation.id,
  });
  if (quota.error) {
    logDropped("reserve_chat_turn", { rpc: quota.error });
    return chatError("dropped", 500);
  }
  const reserved = parseReserveChatTurn(quota.data);
  if (!reserved) {
    console.error("[maya] reserve_chat_turn dropped: unparseable payload");
    return chatError("dropped", 500);
  }
  if (!reserved.ok) {
    if (reserved.reason === "forbidden_model") {
      return chatError("forbidden_model", 403, {
        allowedModelIds: reserved.allowed ?? planLoad.allowedModelIds,
      });
    }
    if (reserved.reason === "quota_month") {
      return chatError("quota_month", 429, {
        remaining: reserved.remaining ?? 0,
      });
    }
    if (reserved.reason === "not_found") {
      return chatError("not_found", 404);
    }
    return chatError("quota", 429, {
      remaining: reserved.remaining ?? 0,
      resetsAt: reserved.resetsAt,
    });
  }

  await rememberVoice(supabase, {
    userId: user.id,
    conversationId: conversationLoad.conversation.id,
    modelId: planLoad.modelId,
  });

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

  const eventId = reserved.eventId;
  const reservedAmount = reserved.reserved;
  const voice = planLoad.model;
  const creditScale = planLoad.creditScale;
  const modelId = planLoad.modelId;
  const conversationId = conversationLoad.conversation.id;
  let settled = false;

  async function settleTurn(input: {
    text: string;
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
      raw?: Record<string, unknown>;
    };
    providerMetadata?: unknown;
    aborted?: boolean;
  }) {
    if (settled) {
      return;
    }
    settled = true;
    const billed = settleCreditsFromUsage({
      usage: input.usage,
      providerMetadata: input.providerMetadata,
      model: voice,
      creditScale,
      reservedCredits: reservedAmount,
    });
    const settle = await supabase.rpc("settle_chat_turn", {
      p_event_id: eventId,
      p_settled_credits: input.aborted ? reservedAmount : billed.credits,
      p_prompt_tokens: billed.promptTokens,
      p_completion_tokens: billed.completionTokens,
      p_cost: billed.costUsd,
    });
    if (settle.error) {
      logDropped("settle_chat_turn", { rpc: settle.error });
    } else if (!parseSettleChatTurn(settle.data)) {
      console.error("[maya] settle_chat_turn dropped: unparseable payload");
    }
    if (!input.aborted && input.text) {
      const tokens = input.usage?.totalTokens ?? 0;
      const saved = await insertAssistantMessage(supabase, {
        conversationId,
        content: input.text,
        tokensUsed: Number.isFinite(tokens) ? Math.trunc(tokens) : 0,
        modelId,
      });
      if (!saved.ok) {
        logDropped("insertAssistantMessage", { insert: saved.error });
      }
    }
  }

  const result = streamText({
    model: getOpenRouterModel(voice.gatewayId),
    maxOutputTokens: voice.maxOutputTokens,
    system,
    messages: await convertToModelMessages(nextMessages),
    onError: ({ error }) => {
      console.error("[streamText error]", error);
      void settleTurn({ text: "", aborted: true });
    },
    onEnd: async (event) => {
      await settleTurn({
        text: event.text,
        usage: {
          inputTokens: event.usage.inputTokens,
          outputTokens: event.usage.outputTokens,
          totalTokens: event.usage.totalTokens,
          raw: event.usage.raw as Record<string, unknown> | undefined,
        },
        providerMetadata: event.providerMetadata,
      });
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
