import Link from "next/link";
import { AgentPortrait } from "@/components/app/agent-portrait";
import type { RecentChat } from "@/lib/gallery/recents";
import { COPY } from "@/lib/ui-copy";

export function RecentChatRow({
  chat,
  compact = false,
}: {
  chat: RecentChat;
  compact?: boolean;
}) {
  return (
    <Link
      href={chat.href}
      className={`flex min-w-0 items-center gap-3 rounded-md px-2 py-2 hover:bg-rule/40 ${
        compact ? "" : "bg-rule/25"
      }`}
    >
      <AgentPortrait
        name={chat.agentName}
        costume={chat.costume}
        avatar={chat.avatar}
        size="rail"
      />
      <span className="min-w-0 flex-1">
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
      </span>
    </Link>
  );
}

export function RecentChatsList({
  recents,
  empty,
}: {
  recents: RecentChat[];
  empty?: string;
}) {
  if (recents.length === 0) {
    return (
      <p className="px-2 py-2 font-sans text-xs text-ink-soft">
        {empty ?? COPY.noChats}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5">
      {recents.map((chat) => (
        <li key={chat.conversationId}>
          <RecentChatRow chat={chat} compact />
        </li>
      ))}
    </ul>
  );
}

export function ContinueChats({ recents }: { recents: RecentChat[] }) {
  if (recents.length === 0) {
    return null;
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {recents.map((chat) => (
        <li key={chat.conversationId}>
          <RecentChatRow chat={chat} />
        </li>
      ))}
    </ul>
  );
}
