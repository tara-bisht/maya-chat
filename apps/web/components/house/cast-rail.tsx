import Link from "next/link";
import { AgentPortrait } from "@/components/app/agent-portrait";
import { houseHref } from "@/lib/house/href";
import type { CastMember, ThreadSummary } from "@/lib/house/types";

export function CastRail({
  activeAgentId,
  activeConversationId,
  cast,
  threads,
}: {
  activeAgentId: string;
  activeConversationId: string | null;
  cast: CastMember[];
  threads: ThreadSummary[];
}) {
  return (
    <aside className="hidden h-full w-[268px] shrink-0 flex-col border-r border-rule lg:flex">
      <div className="px-4 py-5">
        <Link
          href="/gallery"
          className="font-display text-3xl text-cream italic"
        >
          Maya
        </Link>
        <p className="mt-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          Back to the wall
        </p>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-6">
        {cast.map((member) => {
          const active = member.id === activeAgentId;
          return (
            <div key={member.id} className="mb-1">
              <Link
                href={houseHref(
                  member.id,
                  active
                    ? (activeConversationId ?? member.latestId)
                    : member.latestId,
                )}
                className={`flex items-center gap-3 rounded-md px-2 py-2 ${
                  active ? "bg-rule/60" : "hover:bg-rule/40"
                }`}
                style={
                  active
                    ? {
                        boxShadow: `inset 3px 0 0 var(--maya-costume-${member.costume})`,
                      }
                    : undefined
                }
              >
                <AgentPortrait
                  name={member.shortName}
                  costume={member.costume}
                  avatar={member.avatar}
                  size="rail"
                />
                <span className="min-w-0">
                  <span className="block truncate font-sans text-sm font-semibold text-cream">
                    {member.shortName}
                  </span>
                  {member.latestTitle ? (
                    <span className="block truncate font-sans text-xs text-ink-soft">
                      {member.latestTitle}
                    </span>
                  ) : null}
                </span>
              </Link>
              {active ? (
                <ul className="mt-1 ml-4 border-l border-rule pl-4">
                  {threads.map((thread) => (
                    <li key={thread.id}>
                      <Link
                        href={houseHref(member.id, thread.id)}
                        className="block truncate py-1 font-sans text-sm text-cream-dim hover:text-cream"
                      >
                        {thread.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={houseHref(member.id)}
                      className="block py-1 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
                    >
                      New thread
                    </Link>
                  </li>
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
