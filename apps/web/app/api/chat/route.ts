import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import {
  HOST_TOOLS,
  compilePrompt,
  estimateCharsAsTokens,
  estimateReserveCredits,
  firstTicket,
  hostTicketSchema,
  isCreateIntent,
  isMetaTurn,
  matchCatalog,
  matchRoster,
  parseChatRequest,
  parseReserveChatTurn,
  parseSettleChatTurn,
  toneSettingsSchema,
  type HostTicket,
  type HostToolCalls,
} from "@maya/shared";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import {
  loadChatAgent,
  loadChatProfile,
  loadConversationHistory,
  loadPlanModel,
} from "@/lib/chat/load-context";
import { retrieveMemories } from "@/lib/chat/retrieve";
import { createChatTools } from "@/lib/chat/tools";
import {
  acceptUserTurn,
  insertAssistantMessage,
  markUserTurn,
  rememberVoice,
  retitleConversation,
  setHostRoute,
  updateLastAssistantMessage,
} from "@/lib/chat/persist";
import { storedReplyResponse } from "@/lib/chat/reply-stream";
import { turnCloseParts, type TurnOutcome } from "@/lib/chat/turn-close";
import { settleCreditsFromUsage } from "@/lib/credits/usage";
import {
  addReason,
  pauseStreamResponse,
  switchLine,
} from "@/lib/maya/pause-stream";
import {
  loadCatalogForMatch,
  loadRosterForMatch,
} from "@/lib/maya/roster";
import { getOpenRouterModel } from "@/lib/openrouter/ai";
import { logDropped } from "@/lib/supabase/dropped";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

function proposalFromTools(toolResults: unknown): HostTicket | null {
  if (!Array.isArray(toolResults)) {
    return null;
  }
  for (const item of toolResults) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const row = item as { toolName?: string; output?: unknown };
    if (row.toolName !== "proposeCustomAgent") {
      continue;
    }
    const output = row.output as
      | { ok?: boolean; proposal?: unknown }
      | undefined;
    const parsed = hostTicketSchema.safeParse(output?.proposal);
    if (parsed.success) {
      return parsed.data;
    }
  }
  return null;
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

  const parsed = parseChatRequest(body);
  if (!parsed.ok) {
    return chatError("invalid", 400);
  }

  const stay = parsed.data.hostChoice === "stay";
  const replay = parsed.data.replay === true || stay;

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

  const isHost = agentLoad.agent.is_host === true;

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

  if (replay && !conversationLoad.lastUserText) {
    return chatError("invalid", 400);
  }

  const userText = replay ? conversationLoad.lastUserText ?? parsed.text : parsed.text;
  const hostRoute = conversationLoad.conversation.hostRoute;
  const interviewing =
    isCreateIntent(userText) || conversationLoad.hasProposal;
  const routingOpen = isHost && hostRoute === "open" && !stay && !replay;

  if (stay && isHost) {
    const routed = await setHostRoute(supabase, {
      conversationId: conversationLoad.conversation.id,
      hostRoute: "stay",
    });
    if (!routed.ok) {
      logDropped("setHostRoute", { update: routed.error });
      return chatError("dropped", 500);
    }
  }

  if (
    routingOpen &&
    !interviewing &&
    !isMetaTurn(userText) &&
    !conversationLoad.hasPause
  ) {
    const roster = await loadRosterForMatch(supabase, { userId: user.id });
    const hit = matchRoster(userText, roster);
    if (hit) {
      const accepted = await acceptUserTurn(supabase, {
        conversationId: conversationLoad.conversation.id,
        content: userText,
        clientMsgId: parsed.data.message.id,
      });
      if (!accepted.ok) {
        logDropped("insertUserMessage", { insert: accepted.error });
        return chatError("dropped", 500);
      }
      if (accepted.stored) {
        return storedReplyResponse({
          text: accepted.stored.content,
          ticket: firstTicket(accepted.stored.toolCalls),
        });
      }
      const ticket: HostTicket = {
        type: "offerSwitch",
        agentId: hit.id,
        name: hit.name,
        reason: switchLine(hit.name),
      };
      const saved = await insertAssistantMessage(supabase, {
        conversationId: conversationLoad.conversation.id,
        content: ticket.reason,
        tokensUsed: 0,
        toolCalls: { tickets: [ticket] },
        replyTo: accepted.messageId,
      });
      if (!saved.ok) {
        logDropped("insertAssistantMessage", { insert: saved.error });
        const marked = await markUserTurn(supabase, {
          messageId: accepted.messageId,
          status: "unsaved",
        });
        if (!marked.ok) {
          logDropped("markUserTurn", { update: marked.error });
        }
        return chatError("dropped", 500);
      }
      await retitleConversation(supabase, {
        conversationId: conversationLoad.conversation.id,
        currentTitle: conversationLoad.conversation.title,
        firstUserText: userText,
      });
      return pauseStreamResponse({ text: ticket.reason, ticket });
    }
  }

  const roster = isHost
    ? await loadRosterForMatch(supabase, { userId: user.id })
    : [];

  let trailing: HostTicket | null = null;
  if (
    isHost &&
    (hostRoute === "open" || stay) &&
    !conversationLoad.hasRecommend &&
    !conversationLoad.hasPause &&
    !interviewing &&
    !isMetaTurn(userText) &&
    !stay
  ) {
    const catalog = await loadCatalogForMatch(supabase, {
      userId: user.id,
      excludeIds: roster.map((item) => item.id),
    });
    const hit = matchCatalog(catalog.length ? userText : "", catalog, {
      preferFree: agentLoad.planId === "free",
    });
    if (hit) {
      trailing = {
        type: "recommendAdd",
        agentId: hit.id,
        name: hit.name,
        reason: addReason(hit.name, hit.category),
      };
    }
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

  const memories = await retrieveMemories(supabase, {
    agentId: parsed.data.agentId,
    text: userText,
    vectorMemory: planLoad.vectorMemory,
  });

  const toolsEnabled = isHost
    ? [...agentLoad.agent.tools_enabled, ...HOST_TOOLS]
    : agentLoad.agent.tools_enabled;
  const toolsAllowed = isHost
    ? [...planLoad.toolsAllowed, ...HOST_TOOLS]
    : planLoad.toolsAllowed;

  const system = compilePrompt({
    isCurated: agentLoad.agent.is_curated,
    basePrompt: agentLoad.agent.system_prompt,
    languagePreset: agentLoad.agent.language_preset,
    tone: toneSettingsSchema.safeParse(agentLoad.agent.tone_settings).data,
    userProfile: profile,
    memories,
    toolsEnabled,
    toolsAllowed,
    yourAgents: isHost ? roster : null,
  });

  const historyChars = conversationLoad.history.reduce(
    (sum, turn) => sum + turn.content.length,
    0,
  );
  const estimatedPromptTokens = estimateCharsAsTokens(
    system.length + historyChars + userText.length,
  );
  const reserveCredits = estimateReserveCredits({
    estimatedPromptTokens,
    maxOutputTokens: planLoad.model.maxOutputTokens,
    inputUsdPerMillion: planLoad.model.inputUsdPerMillion,
    outputUsdPerMillion: planLoad.model.outputUsdPerMillion,
    minTurnCredits: planLoad.model.minTurnCredits,
    scale: planLoad.creditScale,
  });

  let userMessageId: string | null = replay
    ? conversationLoad.lastUserMessageId
    : null;
  let userAlreadyStored = replay;

  if (!replay) {
    const accepted = await acceptUserTurn(supabase, {
      conversationId: conversationLoad.conversation.id,
      content: userText,
      clientMsgId: parsed.data.message.id,
    });
    if (!accepted.ok) {
      logDropped("insertUserMessage", { insert: accepted.error });
      return chatError("dropped", 500);
    }
    if (accepted.stored) {
      return storedReplyResponse({
        text: accepted.stored.content,
        ticket: firstTicket(accepted.stored.toolCalls),
      });
    }
    userMessageId = accepted.messageId;
    userAlreadyStored = accepted.duplicate;
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
    console.error(
      "[maya] reserve_chat_turn dropped: unparseable payload",
      quota.data,
    );
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

  await Promise.all([
    rememberVoice(supabase, {
      userId: user.id,
      conversationId: conversationLoad.conversation.id,
      modelId: planLoad.modelId,
    }),
    retitleConversation(supabase, {
      conversationId: conversationLoad.conversation.id,
      currentTitle: conversationLoad.conversation.title,
      firstUserText: userText,
    }),
  ]);

  const prior: UIMessage[] = conversationLoad.history.map((turn, index) => ({
    id: `hist-${index}`,
    role: turn.role,
    parts: [{ type: "text" as const, text: turn.content }],
  }));
  const nextMessages: UIMessage[] = userAlreadyStored
    ? prior
    : [
        ...prior,
        {
          id: parsed.data.message.id,
          role: "user",
          parts: [{ type: "text" as const, text: userText }],
        },
      ];

  const eventId = reserved.eventId;
  const reservedAmount = reserved.reserved;
  const voice = planLoad.model;
  const creditScale = planLoad.creditScale;
  const modelId = planLoad.modelId;
  const conversationId = conversationLoad.conversation.id;
  let settled = false;
  let liveTicket: HostTicket | null = trailing;
  let outcome: TurnOutcome = "open";

  if (userMessageId) {
    const marked = await markUserTurn(supabase, {
      messageId: userMessageId,
      status: "pending",
    });
    if (!marked.ok) {
      logDropped("markUserTurn", { update: marked.error });
    }
  }

  async function closeUserTurn(status: "interrupted" | "unsaved" | "complete") {
    if (!userMessageId) {
      return;
    }
    const marked = await markUserTurn(supabase, {
      messageId: userMessageId,
      status,
    });
    if (!marked.ok) {
      logDropped("markUserTurn", { update: marked.error });
    }
  }

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
    generationId?: string | null;
    toolResults?: unknown;
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
      p_generation_id: input.generationId ?? null,
    });
    if (settle.error) {
      logDropped("settle_chat_turn", { rpc: settle.error });
    } else if (!parseSettleChatTurn(settle.data)) {
      console.error("[maya] settle_chat_turn dropped: unparseable payload");
    }
    if (input.aborted || !input.text) {
      await closeUserTurn("interrupted");
      outcome = "interrupted";
      return;
    }
    const proposal = proposalFromTools(input.toolResults);
    const ticket = proposal ?? (stay ? null : trailing);
    if (proposal) {
      liveTicket = proposal;
    }
    const toolCalls: HostToolCalls | undefined = ticket
      ? { tickets: [ticket] }
      : undefined;
    const tokens = input.usage?.totalTokens ?? 0;
    const saved = stay
      ? await updateLastAssistantMessage(supabase, {
          conversationId,
          content: input.text,
          tokensUsed: Number.isFinite(tokens) ? Math.trunc(tokens) : 0,
          modelId,
          toolCalls,
          replyTo: userMessageId,
        })
      : await insertAssistantMessage(supabase, {
          conversationId,
          content: input.text,
          tokensUsed: Number.isFinite(tokens) ? Math.trunc(tokens) : 0,
          modelId,
          toolCalls,
          replyTo: userMessageId,
        });
    if (!saved.ok) {
      logDropped("insertAssistantMessage", { insert: saved.error });
      await closeUserTurn("unsaved");
      outcome = "unsaved";
      return;
    }
    await closeUserTurn("complete");
    outcome = "saved";
  }

  const tools = createChatTools(supabase, {
    userId: user.id,
    agentId: parsed.data.agentId,
    toolsEnabled,
    toolsAllowed,
    isHost,
  });

  const result = streamText({
    model: getOpenRouterModel(voice.gatewayId),
    maxOutputTokens: voice.maxOutputTokens,
    system,
    messages: await convertToModelMessages(nextMessages),
    abortSignal: request.signal,
    ...(tools ? { tools, stopWhen: stepCountIs(5) } : {}),
    onAbort: async () => {
      await settleTurn({ text: "", aborted: true });
    },
    onError: async ({ error }) => {
      console.error(
        "[maya] streamText dropped:",
        error instanceof Error ? error.message : "unknown",
      );
      await settleTurn({ text: "", aborted: true });
    },
    onEnd: async (event) => {
      const generationId =
        typeof event.response?.id === "string" ? event.response.id : null;
      await settleTurn({
        text: event.text,
        usage: {
          inputTokens: event.usage.inputTokens,
          outputTokens: event.usage.outputTokens,
          totalTokens: event.usage.totalTokens,
          raw: event.usage.raw as Record<string, unknown> | undefined,
        },
        providerMetadata: event.providerMetadata,
        generationId,
        toolResults: event.toolResults,
      });
    },
  });

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const ui = toUIMessageStream({ stream: result.stream });
      const reader = ui.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          writer.write(value);
        }
      } catch (error) {
        console.error(
          "[maya] stream read dropped:",
          error instanceof Error ? error.message : "unknown",
        );
        if (outcome === "open") {
          await closeUserTurn("interrupted");
          outcome = "interrupted";
        }
      }
      for (const part of turnCloseParts({
        outcome,
        ticket: isHost && !stay ? liveTicket : null,
      })) {
        writer.write(part as never);
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}
