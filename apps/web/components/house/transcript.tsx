import { COSTUME_WASH_CLASS } from "@/lib/company";
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
        <p className="max-w-measure font-display text-center text-2xl leading-tight text-cream italic">
          {tagline}
        </p>
        {hostEmpty && onChip ? (
          <div className="flex flex-wrap justify-center gap-2">
            {(createIntent ? CREATE_CHIPS : HOST_CHIPS).map((chip) => (
              <button
                key={chip.label}
                type="button"
                className="rounded-md bg-cream px-3 py-1.5 font-sans text-sm font-semibold text-night shadow-[3px_3px_0_#FF4D2E]"
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

  const label = agentName.toLocaleUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-measure flex-col gap-3 px-4 py-4">
      {turns.map((turn, index) => {
        const last = index === turns.length - 1;
        if (turn.role === "assistant") {
          return (
            <article
              key={turn.id}
              className={`rounded-md px-3 py-2 ${COSTUME_WASH_CLASS[costume]}`}
            >
              <p className="flex items-baseline justify-between gap-4 font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
                <span>{label}</span>
                <span>{formatTime(turn.createdAt)}</span>
              </p>
              {turn.content ? (
                <MarkdownBody
                  text={turn.content}
                  className="mt-1.5 font-sans text-base leading-snug text-cream"
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
          <article
            key={turn.id}
            className="rounded-md bg-cream px-3 py-2 text-night shadow-[3px_3px_0_#FF4D2E]"
          >
            <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase">
              You
            </p>
            <MarkdownBody
              text={turn.content}
              className="mt-1.5 font-sans text-base leading-snug"
            />
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
