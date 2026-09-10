import { COSTUME_CLASS } from "@/lib/company";
import type { CostumeId } from "@maya/shared";
import { MarkdownBody } from "./markdown-body";

export type StageTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
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

export function Transcript({
  turns,
  agentName,
  costume,
  streaming,
  tagline,
}: {
  turns: StageTurn[];
  agentName: string;
  costume: CostumeId;
  streaming: boolean;
  tagline: string;
}) {
  if (turns.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <p className="max-w-measure font-display text-center text-3xl leading-tight text-cream italic">
          {tagline}
        </p>
      </div>
    );
  }

  const label = agentName.toLocaleUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-measure flex-col gap-6 px-4 py-6">
      {turns.map((turn, index) => {
        const last = index === turns.length - 1;
        if (turn.role === "assistant") {
          return (
            <article
              key={turn.id}
              className={`rounded-md px-4 py-3 ${COSTUME_CLASS[costume]}/90`}
            >
              <p className="flex items-baseline justify-between gap-4 font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
                <span>{label}</span>
                <span>{formatTime(turn.createdAt)}</span>
              </p>
              <MarkdownBody
                text={turn.content}
                className="mt-2 font-sans text-lg leading-relaxed text-cream"
              />
              {last && streaming ? <span className="maya-caret mt-2 inline-block" /> : null}
            </article>
          );
        }

        return (
          <article
            key={turn.id}
            className="rounded-md bg-cream px-4 py-3 text-night shadow-[4px_4px_0_#FF4D2E]"
          >
            <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase">
              You
            </p>
            <MarkdownBody
              text={turn.content}
              className="mt-2 font-sans text-lg leading-relaxed"
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
