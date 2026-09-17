import Link from "next/link";
import { AgentPortrait } from "@/components/app/agent-portrait";
import { houseHref } from "@/lib/house/href";
import type { HouseRecent, RosterMember } from "@/lib/house/types";
import { COPY } from "@/lib/ui-copy";

export function RecentsRail({
  activeAgentId,
  activeConversationId,
  roster,
  recents,
}: {
  activeAgentId: string;
  activeConversationId: string | null;
  roster: RosterMember[];
  recents: HouseRecent[];
}) {
  return (
    <aside className="hidden h-full w-[268px] shrink-0 flex-col border-l border-rule lg:flex">
      <div className="px-4 py-5">
        <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {COPY.yourAgents}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {roster.map((member) => {
            const active = member.id === activeAgentId;
            return (
              <li key={member.id}>
                <Link
                  href={houseHref(member.id)}
                  title={member.shortName}
                  aria-label={member.shortName}
                  className={`block rounded-md ${
                    active ? "ring-2 ring-acid ring-offset-2 ring-offset-night" : ""
                  }`}
                >
                  <AgentPortrait
                    name={member.shortName}
                    costume={member.costume}
                    avatar={member.avatar}
                    size="rail"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href={houseHref(activeAgentId)}
          className="mt-4 inline-block font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
        >
          {COPY.newChat}
        </Link>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-6">
        <p className="px-2 font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {COPY.recentChats}
        </p>
        {recents.length === 0 ? (
          <p className="px-2 py-2 font-sans text-xs text-ink-soft">
            {COPY.noChats}
          </p>
        ) : (
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {recents.map((chat) => {
              const active = chat.conversationId === activeConversationId;
              return (
                <li key={chat.conversationId}>
                  <Link
                    href={chat.href}
                    className={`flex min-w-0 items-center gap-3 rounded-md px-2 py-2 ${
                      active ? "bg-rule/60" : "hover:bg-rule/40"
                    }`}
                    style={
                      active
                        ? {
                            boxShadow: `inset -3px 0 0 var(--maya-costume-${chat.costume})`,
                          }
                        : undefined
                    }
                  >
                    <AgentPortrait
                      name={chat.agentName}
                      costume={chat.costume}
                      avatar={chat.avatar}
                      size="rail"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-sans text-sm font-semibold text-cream">
                        {chat.agentName}
                      </span>
                      <span className="block truncate font-sans text-xs text-ink-soft">
                        {chat.title}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
