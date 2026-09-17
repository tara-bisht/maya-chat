"use client";

import { useState } from "react";
import Link from "next/link";
import { AgentPortrait } from "@/components/app/agent-portrait";
import type { RecentChat } from "@/lib/gallery/recents";
import { houseHref } from "@/lib/house/href";
import { displayThreadTitle } from "@/lib/house/threads";
import { COPY } from "@/lib/ui-copy";
import { useAppShell } from "./app-shell-context";
import { ChevronIcon } from "./nav-icons";

type NestedThread = {
  id: string;
  title: string;
};

export function RecentChatRow({
  chat,
  compact = false,
  iconOnly = false,
  active = false,
  nested = false,
  onNavigate,
}: {
  chat: RecentChat;
  compact?: boolean;
  iconOnly?: boolean;
  active?: boolean;
  nested?: boolean;
  onNavigate?: () => void;
}) {
  const label = chat.relativeLabel
    ? `${chat.agentName} · ${chat.title} · ${chat.relativeLabel}`
    : `${chat.agentName} · ${chat.title}`;

  if (iconOnly) {
    return (
      <Link
        href={chat.href}
        title={label}
        aria-label={label}
        onClick={onNavigate}
        className={`flex items-center justify-center rounded-md py-2 ${
          active ? "bg-rule/60" : "hover:bg-rule/40"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <AgentPortrait
            name={chat.agentName}
            costume={chat.costume}
            avatar={chat.avatar}
            size="rail"
          />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={chat.href}
      onClick={onNavigate}
      className={`flex min-w-0 items-center gap-3 rounded-md py-1.5 ${
        compact ? "px-2" : "bg-rule/25 px-3"
      } ${active ? "bg-rule/60" : "hover:bg-rule/40"} ${nested ? "pl-6" : ""}`}
      style={
        active && !nested
          ? {
              boxShadow: `inset -3px 0 0 var(--maya-costume-${chat.costume})`,
            }
          : undefined
      }
    >
      {nested ? null : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <AgentPortrait
            name={chat.agentName}
            costume={chat.costume}
            avatar={chat.avatar}
            size="rail"
          />
        </span>
      )}
      <span className="min-w-0 flex-1">
        {nested ? (
          <span className="block truncate font-sans text-xs text-cream">
            {chat.title}
          </span>
        ) : (
          <>
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate font-sans text-sm font-semibold text-cream">
                {chat.agentName}
              </span>
              {chat.relativeLabel ? (
                <span className="shrink-0 font-sans text-[11px] text-ink-soft">
                  {chat.relativeLabel}
                </span>
              ) : null}
            </span>
            <span className="block truncate font-sans text-xs text-ink-soft">
              {chat.title}
            </span>
          </>
        )}
      </span>
    </Link>
  );
}

function ExpandableRecent({
  chat,
  iconOnly,
  activeConversationId,
  currentAgentId,
  onNavigate,
}: {
  chat: RecentChat;
  iconOnly: boolean;
  activeConversationId: string | null;
  currentAgentId: string | null;
  onNavigate?: () => void;
}) {
  const shell = useAppShell();
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<NestedThread[] | null>(null);
  const [loading, setLoading] = useState(false);
  const active =
    chat.conversationId === activeConversationId ||
    (threads?.some((thread) => thread.id === activeConversationId) ?? false);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (!next || threads) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `/api/conversations?agentId=${encodeURIComponent(chat.agentId)}`,
      );
      const payload = (await response.json()) as {
        conversations?: NestedThread[];
      };
      const older = (payload.conversations ?? []).filter(
        (thread) => thread.id !== chat.conversationId,
      );
      setThreads(older);
    } catch {
      setThreads([]);
    } finally {
      setLoading(false);
    }
  }

  if (iconOnly) {
    return (
      <li>
        <RecentChatRow
          chat={chat}
          compact
          iconOnly
          active={chat.conversationId === activeConversationId}
          onNavigate={onNavigate}
        />
      </li>
    );
  }

  const canAbout = currentAgentId === chat.agentId;

  return (
    <li>
      <div className="flex min-w-0 items-start">
        <div className="min-w-0 flex-1">
          <RecentChatRow
            chat={chat}
            compact
            active={active}
            onNavigate={onNavigate}
          />
        </div>
        <button
          type="button"
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-soft hover:bg-rule/40 hover:text-cream"
          aria-expanded={open}
          aria-label={open ? COPY.close : COPY.olderChats}
          onClick={() => void toggle()}
        >
          <span className={open ? "rotate-180" : undefined}>
            <ChevronIcon />
          </span>
        </button>
      </div>
      {open ? (
        <div className="pb-1">
          {canAbout ? (
            <button
              type="button"
              className="flex w-full px-2 py-1.5 pl-6 text-left font-sans text-xs font-semibold text-ink-soft hover:bg-rule/40 hover:text-cream"
              onClick={() => {
                if (shell.openAbout(chat.agentId)) {
                  onNavigate?.();
                }
              }}
            >
              {COPY.about}
            </button>
          ) : null}
          {loading ? (
            <p className="px-2 py-1.5 pl-6 font-sans text-xs text-ink-soft">
              {COPY.loading}
            </p>
          ) : null}
          {threads && threads.length === 0 && !loading ? null : (
            <ul>
              {(threads ?? []).map((thread) => (
                <li key={thread.id}>
                  <RecentChatRow
                    chat={{
                      ...chat,
                      conversationId: thread.id,
                      title: displayThreadTitle(thread.title),
                      href: houseHref(chat.agentId, thread.id),
                      relativeLabel: "",
                    }}
                    compact
                    nested
                    active={thread.id === activeConversationId}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </li>
  );
}

export function RecentChatsList({
  recents,
  empty,
  iconOnly = false,
  activeConversationId = null,
  currentAgentId = null,
  onNavigate,
}: {
  recents: RecentChat[];
  empty?: string;
  iconOnly?: boolean;
  activeConversationId?: string | null;
  currentAgentId?: string | null;
  onNavigate?: () => void;
}) {
  if (recents.length === 0) {
    if (iconOnly) {
      return null;
    }
    return (
      <p className="px-2 py-2 font-sans text-xs text-ink-soft">
        {empty ?? COPY.noChats}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5">
      {recents.map((chat) => (
        <ExpandableRecent
          key={chat.conversationId}
          chat={chat}
          iconOnly={iconOnly}
          activeConversationId={activeConversationId}
          currentAgentId={currentAgentId}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}

export function ContinueChats({ recents }: { recents: RecentChat[] }) {
  if (recents.length === 0) {
    return null;
  }

  return (
    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {recents.map((chat) => (
        <li key={chat.conversationId}>
          <RecentChatRow chat={chat} />
        </li>
      ))}
    </ul>
  );
}
