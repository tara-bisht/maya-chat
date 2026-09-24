"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  hostTicketSchema,
  type HostTicket,
  type HostRoute,
} from "@maya/shared";
import { useAppShell } from "@/components/app/app-shell-context";
import { CreditMeter } from "@/components/app/credit-meter";
import { MenuIcon } from "@/components/app/nav-icons";
import { PaywallTicket } from "@/components/app/paywall-ticket";
import type { CatalogModel } from "@/lib/credits/catalog";
import {
  lockedAgentCopy,
  lockedVoiceCopy,
  lockedVoiceFallbackTitle,
  lockedVoiceTitle,
  monthlyQuotaCopy,
  quotaCopy,
} from "@/lib/house/copy";
import { houseHref } from "@/lib/house/href";
import type { HouseView as HouseViewData } from "@/lib/house/types";
import { COPY } from "@/lib/ui-copy";
import { CharacterSheet } from "./character-sheet";
import { Composer } from "./composer";
import { Transcript, type StageTurn } from "./transcript";
import { VoicePicker } from "./voice-picker";
import { commitProposedAgent } from "@/lib/studio/actions";

type MayaUIMessage = UIMessage<unknown, { ticket: HostTicket }>;

function ticketFromParts(parts: MayaUIMessage["parts"]): HostTicket | null {
  for (const part of parts) {
    if (part.type === "data-ticket" && "data" in part) {
      const parsed = hostTicketSchema.safeParse(part.data);
      if (parsed.success) {
        return parsed.data;
      }
    }
  }
  return null;
}

function toUiMessages(house: HouseViewData): MayaUIMessage[] {
  return (
    house.conversation?.messages.map((turn) => ({
      id: turn.id,
      role: turn.role,
      parts: [
        ...(turn.content
          ? [{ type: "text" as const, text: turn.content }]
          : []),
        ...(turn.ticket
          ? [{ type: "data-ticket" as const, data: turn.ticket }]
          : []),
      ],
    })) ?? []
  );
}

function textFromMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

type WellError =
  | "locked_agent"
  | "quota"
  | "quota_month"
  | "forbidden_model"
  | "dropped"
  | null;

export function HouseView({
  house,
  intentCreate = false,
  autoReplay = false,
}: {
  house: HouseViewData;
  intentCreate?: boolean;
  autoReplay?: boolean;
}) {
  const router = useRouter();
  const { menuOpen, openMenu, setAboutOpener } = useAppShell();
  const conversationIdRef = useRef(house.conversation?.id ?? null);
  const [hostRoute, setHostRoute] = useState<HostRoute>(
    house.conversation?.hostRoute ?? "open",
  );
  const [, setRoster] = useState(house.roster);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [createdIds, setCreatedIds] = useState<Record<string, string>>({});
  const [createError, setCreateError] = useState<string | null>(null);
  const [ticketBusy, setTicketBusy] = useState(false);
  const replayed = useRef(false);
  const [pane, setPane] = useState<"chat" | "about">("chat");
  const [selectedModelId, setSelectedModelId] = useState(house.selectedModelId);
  const selectedModelIdRef = useRef(selectedModelId);
  selectedModelIdRef.current = selectedModelId;
  const [lockedVoice, setLockedVoice] = useState<CatalogModel | null>(null);
  const [wellError, setWellError] = useState<WellError>(
    house.agent.canChat ? null : "locked_agent",
  );

  const initialMessages = useMemo(() => toUiMessages(house), [house]);

  const { messages, sendMessage, status, error, clearError } = useChat<MayaUIMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport<MayaUIMessage>({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages: pending, body }) {
        const lastUser = [...pending].reverse().find((item) => item.role === "user");
        return {
          body: {
            message: lastUser ?? pending[pending.length - 1],
            conversationId: conversationIdRef.current,
            agentId: house.agent.id,
            modelId: selectedModelIdRef.current,
            ...body,
          },
        };
      },
    }),
  });

  const busy = status === "submitted" || status === "streaming";
  const turns: StageTurn[] = messages.flatMap((message, index) => {
    const content = textFromMessage(message);
    const ticket = ticketFromParts(message.parts);
    const last = index === messages.length - 1;
    if (!content && !ticket && !(busy && last)) {
      return [];
    }
    return [
      {
        id: message.id,
        role: (message.role === "assistant" ? "assistant" : "user") as
          | "assistant"
          | "user",
        content,
        ticket,
      },
    ];
  });

  async function onSend(text: string) {
    if (!house.agent.canChat) {
      setWellError("locked_agent");
      return;
    }
    try {
      if (!conversationIdRef.current) {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ agentId: house.agent.id }),
        });
        const payload = (await response.json()) as {
          id?: string;
          error?: string;
        };
        if (!response.ok || !payload.id) {
          setWellError(payload.error === "quota" ? "quota" : "dropped");
          return;
        }
        conversationIdRef.current = payload.id;
        window.history.replaceState(
          null,
          "",
          houseHref(house.agent.id, payload.id),
        );
      }
      setWellError(null);
      await sendMessage({ text });
    } catch {
      setWellError("dropped");
    }
  }

  function selectAllowedVoice(modelId: string) {
    setSelectedModelId(modelId);
    setLockedVoice(null);
    if (wellError === "forbidden_model") {
      setWellError(null);
      clearError();
    }
  }

  function selectLockedVoice(model: CatalogModel) {
    setLockedVoice(model);
    setWellError("forbidden_model");
    clearError();
  }

  useEffect(() => {
    setAboutOpener(house.agent.id, () => setPane("about"));
    return () => setAboutOpener(null, null);
  }, [house.agent.id, setAboutOpener]);

  useEffect(() => {
    setPane("chat");
  }, [house.agent.id]);

  useEffect(() => {
    if (pane !== "about") {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPane("chat");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pane]);

  useEffect(() => {
    if (!autoReplay || replayed.current || busy) {
      return;
    }
    if (!house.conversation || house.conversation.messages.length !== 1) {
      return;
    }
    if (house.conversation.messages[0]?.role !== "user") {
      return;
    }
    replayed.current = true;
    void sendMessage(undefined, { body: { replay: true } }).then(() => {
      router.replace(houseHref(house.agent.id, house.conversation?.id));
    });
  }, [autoReplay, busy, house, router, sendMessage]);

  async function onKeepGoing() {
    setTicketBusy(true);
    try {
      setHostRoute("stay");
      await sendMessage(undefined, { body: { hostChoice: "stay" } });
    } finally {
      setTicketBusy(false);
    }
  }

  async function onSwitch(agentId: string) {
    const conversationId = conversationIdRef.current;
    if (!conversationId) {
      return;
    }
    setTicketBusy(true);
    try {
      const response = await fetch("/api/chat/handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fromConversationId: conversationId,
          agentId,
        }),
      });
      const payload = (await response.json()) as { href?: string };
      if (!response.ok || !payload.href) {
        setWellError("dropped");
        return;
      }
      setHostRoute("handed_off");
      router.push(payload.href);
    } catch {
      setWellError("dropped");
    } finally {
      setTicketBusy(false);
    }
  }

  async function onAdd(agentId: string) {
    const conversationId = conversationIdRef.current;
    setTicketBusy(true);
    try {
      const response = await fetch("/api/roster", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agentId, conversationId }),
      });
      const payload = (await response.json()) as {
        agent?: { id: string; shortName: string; costume: string; avatar: string };
      };
      const agent = payload.agent;
      if (!response.ok || !agent) {
        setWellError("dropped");
        return;
      }
      setAddedIds((current) => new Set(current).add(agent.id));
      setHostRoute("stay");
      setRoster((current) => {
        if (current.some((item) => item.id === agent.id)) {
          return current;
        }
        return [
          ...current,
          {
            id: agent.id,
            shortName: agent.shortName,
            costume: agent.costume as (typeof current)[number]["costume"],
            avatar: agent.avatar,
          },
        ];
      });
      router.refresh();
    } catch {
      setWellError("dropped");
    } finally {
      setTicketBusy(false);
    }
  }

  async function onDismiss() {
    const conversationId = conversationIdRef.current;
    if (!conversationId) {
      setHostRoute("stay");
      return;
    }
    setTicketBusy(true);
    try {
      await fetch("/api/chat/host-route", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId, hostRoute: "stay" }),
      });
      setHostRoute("stay");
    } finally {
      setTicketBusy(false);
    }
  }

  async function onCreate(ticket: Extract<HostTicket, { type: "proposeCustomAgent" }>) {
    setTicketBusy(true);
    setCreateError(null);
    try {
      const result = await commitProposedAgent(ticket);
      if (!result.ok) {
        setCreateError(
          result.code === "studio_cap" ? COPY.agentLimit : COPY.studioInvalid,
        );
        return;
      }
      setCreatedIds((current) => ({ ...current, [ticket.name]: result.id }));
      setHostRoute("stay");
      setRoster((current) => {
        if (current.some((item) => item.id === result.id)) {
          return current;
        }
        return [
          ...current,
          {
            id: result.id,
            shortName: result.name,
            costume: "custom",
            avatar: "",
          },
        ];
      });
      if (conversationIdRef.current) {
        await fetch("/api/chat/host-route", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationIdRef.current,
            hostRoute: "stay",
          }),
        });
      }
      router.refresh();
    } finally {
      setTicketBusy(false);
    }
  }

  const listening = `${house.agent.shortName} is listening.`;
  const errorText = `${error?.message ?? ""} ${wellError ?? ""}`;
  const showMonth =
    wellError === "quota_month" || errorText.includes("quota_month");
  const showQuota =
    !showMonth &&
    (wellError === "quota" ||
      errorText.includes("quota") ||
      errorText.includes("429"));
  const showLocked =
    !house.agent.canChat || wellError === "locked_agent";
  const showForbidden =
    !showLocked &&
    !showQuota &&
    !showMonth &&
    (wellError === "forbidden_model" || errorText.includes("forbidden_model"));
  const showDropped =
    wellError === "dropped" ||
    Boolean(error && !showQuota && !showLocked && !showForbidden);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-night text-cream">
      <header className="flex shrink-0 flex-col gap-2 border-b border-rule px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center text-cream lg:hidden"
              aria-label={COPY.menu}
              aria-expanded={menuOpen}
              onClick={openMenu}
            >
              <MenuIcon />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold">
                {house.agent.shortName}
                <span className="ml-2 text-sm font-medium text-ink-soft">
                  {house.agent.category}
                </span>
              </h1>
              <p className="truncate text-[13px] text-ink-soft">{house.agent.tagline}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <VoicePicker
              models={house.models}
              selectedModelId={selectedModelId}
              disabled={!house.agent.canChat}
              tone="night"
              placement="down"
              onSelect={selectAllowedVoice}
              onLocked={selectLockedVoice}
            />
            {house.credits ? (
              <CreditMeter credits={house.credits} variant="compact" />
            ) : null}
          </div>
        </div>
        <div className="inline-flex w-fit gap-0.5 rounded-lg border border-rule bg-panel p-0.5">
          {(["chat", "about"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={pane === item}
              className={`rounded-md px-3 py-1 text-[13px] font-medium ${
                pane === item ? "bg-raised text-cream" : "text-ink-soft"
              }`}
              onClick={() => setPane(item)}
            >
              {item === "chat" ? COPY.chat : COPY.about}
            </button>
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {showLocked ? (
            <div className="flex flex-1 items-center justify-center px-4 py-10">
              <PaywallTicket
                title={`${house.agent.shortName} is on Plus`}
                body={lockedAgentCopy(house.agent.shortName)}
                href="/plan?reason=locked-agent"
                cta="Upgrade"
              />
            </div>
          ) : showQuota || showMonth ? (
            <div className="flex flex-1 items-center justify-center px-4 py-10">
              <PaywallTicket
                title={
                  showMonth ? "Monthly limit reached" : "Daily limit reached"
                }
                body={showMonth ? monthlyQuotaCopy() : quotaCopy()}
                href="/plan?reason=quota"
                cta="Upgrade"
              />
            </div>
          ) : showForbidden ? (
            <div className="flex flex-1 items-center justify-center px-4 py-10">
              <PaywallTicket
                title={
                  lockedVoice
                    ? lockedVoiceTitle(lockedVoice.displayName, lockedVoice.minPlan)
                    : lockedVoiceFallbackTitle()
                }
                body={lockedVoiceCopy()}
                href="/plan?reason=locked-voice"
                cta={COPY.upgrade}
              />
            </div>
          ) : pane === "about" ? (
            <CharacterSheet
              agent={house.agent}
              onClose={() => setPane("chat")}
            />
          ) : (
            <>
              <Transcript
                turns={turns}
                agentName={house.agent.shortName}
                costume={house.agent.costume}
                streaming={status === "streaming"}
                tagline={house.agent.tagline}
                hostEmpty={house.agent.isHost}
                createIntent={intentCreate}
                onChip={onSend}
                tickets={
                  house.agent.isHost
                    ? {
                        resolved: hostRoute !== "open",
                        addedIds,
                        createdIds,
                        createError,
                        busy: ticketBusy || busy,
                        onKeepGoing,
                        onSwitch,
                        onOpenAgent: (agentId) => router.push(houseHref(agentId)),
                        onAdd,
                        onDismiss,
                        onCreate,
                      }
                    : undefined
                }
              />
              {showDropped ? (
                <p className="mx-auto max-w-measure px-4 pb-6 font-sans text-base text-cream">
                  Something went wrong.{" "}
                  <button
                    type="button"
                    className="font-semibold underline-offset-4 hover:underline"
                    onClick={() => {
                      setWellError(null);
                      clearError();
                    }}
                  >
                    Try again
                  </button>
                </p>
              ) : null}
            </>
          )}
        </div>

        {house.agent.canChat && !showQuota && pane === "chat" ? (
          <Composer
            placeholder={listening}
            disabled={false}
            busy={busy}
            onSend={onSend}
          />
        ) : null}
    </div>
  );
}
