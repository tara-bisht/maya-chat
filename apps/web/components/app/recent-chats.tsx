import Link from "next/link";
import { AgentPortrait } from "@/components/app/agent-portrait";
import type { RecentChat } from "@/lib/gallery/recents";
import { COPY } from "@/lib/ui-copy";

export function RecentChatRow({
  chat,
  compact = false,
  iconOnly = false,
}: {
  chat: RecentChat;
  compact?: boolean;
  iconOnly?: boolean;
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
        className="flex items-center justify-center rounded-md py-2 hover:bg-rule/40"
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
      className={`flex min-w-0 items-center gap-3 rounded-md px-3 py-2 hover:bg-rule/40 ${
        compact ? "" : "bg-rule/25"
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
  iconOnly = false,
}: {
  recents: RecentChat[];
  empty?: string;
  iconOnly?: boolean;
}) {
  if (recents.length === 0) {
    if (iconOnly) {
      return null;
    }
    return (
      <p className="px-3 py-2 font-sans text-xs text-ink-soft">
        {empty ?? COPY.noChats}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5">
      {recents.map((chat) => (
        <li key={chat.conversationId}>
          <RecentChatRow chat={chat} compact iconOnly={iconOnly} />
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
    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {recents.map((chat) => (
        <li key={chat.conversationId}>
          <RecentChatRow chat={chat} />
        </li>
      ))}
    </ul>
  );
}
