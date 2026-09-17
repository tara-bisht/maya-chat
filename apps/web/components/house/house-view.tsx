"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
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

function toUiMessages(house: HouseViewData): UIMessage[] {
  return (
    house.conversation?.messages.map((turn) => ({
      id: turn.id,
      role: turn.role,
      parts: [{ type: "text" as const, text: turn.content }],
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

export function HouseView({ house }: { house: HouseViewData }) {
  const pathname = usePathname();
  const conversationIdRef = useRef(house.conversation?.id ?? null);
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

  const { messages, sendMessage, status, error, clearError } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages: pending }) {
        return {
          body: {
            message: pending[pending.length - 1],
            conversationId: conversationIdRef.current,
            agentId: house.agent.id,
            modelId: selectedModelIdRef.current,
          },
        };
      },
    }),
  });

  const busy = status === "submitted" || status === "streaming";
  const turns: StageTurn[] = messages.flatMap((message, index) => {
    const content = textFromMessage(message);
    const last = index === messages.length - 1;
    if (!content && !(busy && last)) {
      return [];
    }
    return [
      {
        id: message.id,
        role: (message.role === "assistant" ? "assistant" : "user") as
          | "assistant"
          | "user",
        content,
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
                onChip={onSend}
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
        roster={house.roster}
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
