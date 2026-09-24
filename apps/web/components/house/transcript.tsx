import type { CostumeId, HostTicket } from "@maya/shared";
import { AddTicket } from "@/components/maya/add-ticket";
import { CreateAgentCard } from "@/components/maya/create-agent-card";
import { SwitchTicket } from "@/components/maya/switch-ticket";
import { MarkdownBody } from "./markdown-body";

export type StageTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  ticket?: HostTicket | null;
};

export type TicketHandlers = {
  resolved: boolean;
  addedIds: ReadonlySet<string>;
  createdIds: Readonly<Record<string, string>>;
  createError?: string | null;
  busy?: boolean;
  onKeepGoing: () => void;
  onSwitch: (agentId: string) => void;
  onOpenAgent: (agentId: string) => void;
  onAdd: (agentId: string) => void;
  onDismiss: () => void;
  onCreate: (ticket: Extract<HostTicket, { type: "proposeCustomAgent" }>) => void;
};

function formatTime(iso?: string): string | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const HOST_CHIPS = [
  { label: "I have a midterm", text: "I have a calculus midterm." },
  { label: "Make me an agent", text: "I want to create an agent." },
  { label: "What can you do?", text: "What can you do?" },
] as const;

const CREATE_CHIPS = [
  {
    label: "A lifting coach",
    text: "Make me a sarcastic Hinglish lifting coach.",
  },
  {
    label: "A math tutor",
    text: "Make me a patient math tutor who explains proofs.",
  },
  { label: "What do you need?", text: "I want to create an agent. Ask me." },
] as const;

export function Transcript({
  turns,
  agentName,
  costume,
  streaming,
  tagline,
  hostEmpty = false,
  createIntent = false,
  onChip,
  tickets,
}: {
  turns: StageTurn[];
  agentName: string;
  costume: CostumeId;
  streaming: boolean;
  tagline: string;
  hostEmpty?: boolean;
  createIntent?: boolean;
  onChip?: (text: string) => void;
  tickets?: TicketHandlers;
}) {
  if (turns.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <p className="max-w-measure text-center text-lg leading-snug text-cream">
          {tagline}
        </p>
        {hostEmpty && onChip ? (
          <div className="flex w-full max-w-md flex-col gap-2">
            {(createIntent ? CREATE_CHIPS : HOST_CHIPS).map((chip) => (
              <button
                key={chip.label}
                type="button"
                className="rounded-lg border border-rule bg-panel px-3 py-2.5 text-left text-sm font-medium hover:bg-raised"
                onClick={() => onChip(chip.text)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-measure flex-col gap-4 px-4 py-5">
      {turns.map((turn, index) => {
        const last = index === turns.length - 1;
        const time = formatTime(turn.createdAt);
        if (turn.role === "assistant") {
          return (
            <article key={turn.id} className="max-w-[40rem]">
              <p className="mb-1 flex items-baseline justify-between gap-4 text-[11px] font-medium tracking-[0.06em] text-ink-soft uppercase">
                <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                  <i
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: `var(--maya-costume-${costume})` }}
                  />
                  {agentName}
                </span>
                {time ? <span className="tracking-normal normal-case">{time}</span> : null}
              </p>
              {turn.content ? (
                <MarkdownBody
                  text={turn.content}
                  className="text-[14.5px] leading-relaxed text-cream"
                />
              ) : null}
              {turn.ticket && tickets ? (
                <TicketBlock ticket={turn.ticket} handlers={tickets} />
              ) : null}
              {last && streaming ? <span className="maya-caret mt-2 inline-block" /> : null}
            </article>
          );
        }

        return (
          <article key={turn.id} className="flex flex-col items-end">
            <p className="mb-1 text-[11px] font-medium tracking-[0.06em] text-ink-soft uppercase">
              You
            </p>
            <div className="max-w-[min(32rem,100%)] rounded-xl rounded-br-sm bg-raised px-3 py-2">
              <MarkdownBody
                text={turn.content}
                className="text-[14.5px] leading-relaxed"
              />
            </div>
          </article>
        );
      })}
      {streaming && turns[turns.length - 1]?.role !== "assistant" ? (
        <span className="maya-caret ml-4" />
      ) : null}
    </div>
  );
}

function TicketBlock({
  ticket,
  handlers,
}: {
  ticket: HostTicket;
  handlers: TicketHandlers;
}) {
  if (ticket.type === "offerSwitch") {
    return (
      <SwitchTicket
        name={ticket.name}
        reason={ticket.reason}
        resolved={handlers.resolved}
        busy={handlers.busy}
        onKeepGoing={handlers.onKeepGoing}
        onSwitch={() => handlers.onSwitch(ticket.agentId)}
      />
    );
  }
  if (ticket.type === "recommendAdd") {
    return (
      <AddTicket
        name={ticket.name}
        reason={ticket.reason}
        added={handlers.addedIds.has(ticket.agentId)}
        dismissed={handlers.resolved && !handlers.addedIds.has(ticket.agentId)}
        busy={handlers.busy}
        onAdd={() => handlers.onAdd(ticket.agentId)}
        onDismiss={handlers.onDismiss}
        onChat={() => handlers.onOpenAgent(ticket.agentId)}
      />
    );
  }
  return (
    <CreateAgentCard
      name={ticket.name}
      tagline={ticket.tagline}
      createdId={handlers.createdIds[ticket.name] ?? null}
      busy={handlers.busy}
      error={handlers.createError}
      onCreate={() => handlers.onCreate(ticket)}
    />
  );
}
