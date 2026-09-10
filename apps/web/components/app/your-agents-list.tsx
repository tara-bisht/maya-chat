import Link from "next/link";
import { AgentPortrait } from "@/components/app/agent-portrait";
import {
  PLAYBILL_STAMP_LABEL,
  type Playbill,
} from "@/lib/gallery/playbill";
import { COPY } from "@/lib/ui-copy";

export function SidebarAgents({ agents }: { agents: Playbill[] }) {
  if (agents.length === 0) {
    return (
      <p className="px-2 py-2 font-sans text-xs text-ink-soft">
        {COPY.noAgents}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-0.5">
      {agents.map((agent) => (
        <li key={agent.id}>
          <Link
            href={agent.href ?? `/chat/${agent.id}`}
            className="flex min-w-0 items-center gap-3 rounded-md px-2 py-2 hover:bg-rule/40"
          >
            <AgentPortrait
              name={agent.shortName}
              costume={agent.costume}
              avatar={agent.avatar}
              size="rail"
            />
            <span className="min-w-0">
              <span className="block truncate font-sans text-sm font-semibold text-cream">
                {agent.shortName}
              </span>
              {agent.stamp ? (
                <span className="block font-sans text-[11px] text-ink-soft">
                  {PLAYBILL_STAMP_LABEL[agent.stamp]}
                </span>
              ) : null}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProfileAgents({
  agents,
  capLabel,
}: {
  agents: Playbill[];
  capLabel: string;
}) {
  return (
    <section id="your-agents" className="scroll-mt-8 border-t border-rule pt-8">
      <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
        {COPY.yourAgents}
      </p>
      <p className="mt-2 font-sans text-sm text-ink-soft">{capLabel}</p>
      {agents.length === 0 ? (
        <p className="mt-4 font-sans text-base text-cream-dim">
          {COPY.yourAgentsEmpty}{" "}
          <Link
            href="/studio/new"
            className="font-semibold text-acid underline-offset-4 hover:underline"
          >
            {COPY.createAgent}
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {agents.map((agent) => (
            <li
              key={agent.id}
              className="flex items-center gap-3 rounded-md border border-rule px-3 py-3"
            >
              <AgentPortrait
                name={agent.shortName}
                costume={agent.costume}
                avatar={agent.avatar}
                size="rail"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-sm font-semibold text-cream">
                  {agent.shortName}
                </p>
                <p className="font-sans text-xs text-ink-soft">
                  {agent.stamp ? PLAYBILL_STAMP_LABEL[agent.stamp] : COPY.public}
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link
                  href={agent.href ?? `/chat/${agent.id}`}
                  className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
                >
                  {COPY.chat}
                </Link>
                <Link
                  href={`/studio/${agent.id}`}
                  className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
