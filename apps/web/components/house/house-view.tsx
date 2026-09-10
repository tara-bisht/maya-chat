"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AgentPortrait } from "@/components/app/agent-portrait";
import { PaywallTicket } from "@/components/app/paywall-ticket";
import { lockedAgentCopy, quotaCopy } from "@/lib/house/copy";
import { houseHref } from "@/lib/house/href";
import type { HouseView as HouseViewData } from "@/lib/house/types";
import { CastRail } from "./cast-rail";
import { CharacterSheet } from "./character-sheet";
import { Composer } from "./composer";
import { Transcript, type StageTurn } from "./transcript";

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

type WellError = "locked_agent" | "quota" | "dropped" | null;

export function HouseView({ house }: { house: HouseViewData }) {
  const conversationIdRef = useRef(house.conversation?.id ?? null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [nightsOpen, setNightsOpen] = useState(false);
  const [wellError, setWellError] = useState<WellError>(
    house.agent.canChat ? null : "locked_agent",
  );

  const initialMessages = useMemo(() => toUiMessages(house), [house]);

  const { messages, sendMessage, status, error } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages: pending }) {
        return {
          body: {
            message: pending[pending.length - 1],
            conversationId: conversationIdRef.current,
            agentId: house.agent.id,
          },
        };
      },
    }),
  });

  const busy = status === "submitted" || status === "streaming";
  const turns: StageTurn[] = messages.map((message) => ({
    id: message.id,
    role: message.role === "assistant" ? "assistant" : "user",
    content: textFromMessage(message),
  }));

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

  const listening = `${house.agent.shortName} is listening.`;
  const showQuota = wellError === "quota" || error?.message?.includes("quota");
  const showLocked =
    !house.agent.canChat || wellError === "locked_agent";
  const showDropped = wellError === "dropped" || Boolean(error && !showQuota);

  return (
    <div className="flex h-dvh overflow-hidden bg-night text-cream">
      <CastRail
        activeAgentId={house.agent.id}
        activeConversationId={house.conversation?.id ?? null}
        cast={house.cast}
        threads={house.threads}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-rule px-4 py-3">
          <Link
            href="/gallery"
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline lg:hidden"
          >
            Wall
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
            <p className="font-mono text-xs text-ink-soft">
              Voice through {house.defaultModelId}
            </p>
          </div>
          <button
            type="button"
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline lg:hidden"
            onClick={() => setNightsOpen(true)}
          >
            Nights
          </button>
          <button
            type="button"
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
            onClick={() => setSheetOpen(true)}
          >
            The player
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {showLocked ? (
            <div className="flex flex-1 items-center justify-center px-4 py-10">
              <PaywallTicket
                title={`${house.agent.shortName} is on the Plus bill`}
                body={lockedAgentCopy(house.agent.shortName)}
                href="/#seats"
                cta="Buy a better seat"
              />
            </div>
          ) : showQuota ? (
            <div className="flex flex-1 items-center justify-center px-4 py-10">
              <PaywallTicket
                title="Daily curtain"
                body={quotaCopy(house.dailyLimit ?? 50)}
                href="/#seats"
                cta="Buy a better seat"
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
              />
              {showDropped ? (
                <p className="mx-auto max-w-measure px-4 pb-6 font-sans text-base text-cream">
                  The line dropped.{" "}
                  <button
                    type="button"
                    className="font-semibold underline-offset-4 hover:underline"
                    onClick={() => setWellError(null)}
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

      <CharacterSheet
        agent={house.agent}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      {nightsOpen ? (
        <div
          className="fixed inset-0 z-30 bg-[color:var(--maya-overlay)] lg:hidden"
          onClick={() => setNightsOpen(false)}
        >
          <aside
            className="absolute inset-y-0 left-0 w-[min(20rem,calc(100%-2rem))] overflow-y-auto bg-night p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
              Nights with {house.agent.shortName}
            </p>
            <ul className="mt-4 space-y-2">
              {house.threads.map((thread) => (
                <li key={thread.id}>
                  <Link
                    href={houseHref(house.agent.id, thread.id)}
                    className="block font-sans text-sm text-cream"
                    onClick={() => setNightsOpen(false)}
                  >
                    {thread.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={houseHref(house.agent.id)}
              className="mt-4 inline-block font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
              onClick={() => setNightsOpen(false)}
            >
              New thread
            </Link>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
