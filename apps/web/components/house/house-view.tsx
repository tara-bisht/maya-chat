"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  hostTicketSchema,
  type HostTicket,
  type HostRoute,
} from "@maya/shared";
import { AccountMenu } from "@/components/app/account-menu";
import { AgentPortrait } from "@/components/app/agent-portrait";
import { ChatNav } from "@/components/app/chat-nav";
import { CreditMeter } from "@/components/app/credit-meter";
import { NAV_ICONS } from "@/components/app/nav-icons";
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
import { COPY, MOBILE_NAV, navIsActive } from "@/lib/ui-copy";
import { MAYA_HOME_HREF } from "@maya/shared";
import { CharacterSheet } from "./character-sheet";
import { Composer } from "./composer";
import { RecentsRail } from "./recents-rail";
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
  const pathname = usePathname();
  const router = useRouter();
  const conversationIdRef = useRef(house.conversation?.id ?? null);
  const [hostRoute, setHostRoute] = useState<HostRoute>(
    house.conversation?.hostRoute ?? "open",
  );
  const [roster, setRoster] = useState(house.roster);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [createdIds, setCreatedIds] = useState<Record<string, string>>({});
  const [createError, setCreateError] = useState<string | null>(null);
  const [ticketBusy, setTicketBusy] = useState(false);
  const replayed = useRef(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [nightsOpen, setNightsOpen] = useState(false);
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
    <div className="flex h-dvh overflow-hidden bg-night text-cream">
      <ChatNav />
      <div className="flex min-w-0 flex-1 flex-col pb-14 lg:pb-0">
        <header className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <Link
            href={MAYA_HOME_HREF}
            className="font-display text-2xl text-cream italic lg:hidden"
          >
            Maya
          </Link>
          <AgentPortrait
            name={house.agent.shortName}
            costume={house.agent.costume}
            avatar={house.agent.avatar}
            size="rail"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-2xl leading-none text-cream italic">
              {house.agent.shortName}
            </p>
            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2">
              <VoicePicker
                models={house.models}
                selectedModelId={selectedModelId}
                disabled={!house.agent.canChat}
                onSelect={selectAllowedVoice}
                onLocked={selectLockedVoice}
              />
              {house.credits ? (
                <CreditMeter credits={house.credits} variant="compact" />
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline lg:hidden"
            onClick={() => setNightsOpen(true)}
          >
            Chats
          </button>
          <button
            type="button"
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
            onClick={() => setSheetOpen(true)}
          >
            About
          </button>
          <AccountMenu
            displayName={house.displayName}
            plan={house.plan}
            dense
          />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
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

        {house.agent.canChat && !showQuota ? (
          <Composer
            placeholder={listening}
            disabled={false}
            busy={busy}
            onSend={onSend}
          />
        ) : null}
      </div>

      <RecentsRail
        activeAgentId={house.agent.id}
        activeConversationId={house.conversation?.id ?? null}
        roster={roster}
        recents={house.recents}
      />

      <CharacterSheet
        agent={house.agent}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 flex border-t border-rule bg-night lg:hidden"
      >
        {MOBILE_NAV.map((item) => {
          const active = navIsActive(item.href, pathname);
          const Icon = NAV_ICONS[item.id];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 font-sans text-[11px] font-semibold ${
                active ? "text-cream" : "text-ink-soft"
              }`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {nightsOpen ? (
        <div
          className="fixed inset-0 z-30 bg-[color:var(--maya-overlay)] lg:hidden"
          onClick={() => setNightsOpen(false)}
        >
          <aside
            className="absolute inset-y-0 right-0 w-[min(20rem,calc(100%-2rem))] overflow-y-auto bg-night p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
              {COPY.recentChats}
            </p>
            <ul className="mt-4 space-y-2">
              {house.recents.map((chat) => (
                <li key={chat.conversationId}>
                  <Link
                    href={chat.href}
                    className="block font-sans text-sm text-cream"
                    onClick={() => setNightsOpen(false)}
                  >
                    {chat.agentName} · {chat.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={houseHref(house.agent.id)}
              className="mt-4 inline-block font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
              onClick={() => setNightsOpen(false)}
            >
              {COPY.newChat}
            </Link>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
