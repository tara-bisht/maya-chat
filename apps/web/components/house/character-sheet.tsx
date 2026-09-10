import Link from "next/link";
import { LANGUAGE_PRESETS } from "@maya/shared";
import { COSTUME_CLASS } from "@/lib/company";
import type { HouseAgent } from "@/lib/house/types";

function languageLabel(id: HouseAgent["languagePreset"]): string {
  return LANGUAGE_PRESETS.find((preset) => preset.id === id)?.label ?? id;
}

export function CharacterSheet({
  agent,
  open,
  onClose,
}: {
  agent: HouseAgent;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-start justify-center bg-[color:var(--maya-overlay)] p-4 pt-16"
      onClick={onClose}
    >
      <article
        className="ticket max-h-[min(36rem,calc(100dvh-6rem))] w-full max-w-md overflow-y-auto bg-cream p-6 text-night"
        style={{ borderRadius: 10, boxShadow: "8px 8px 0 #FF4D2E" }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-sheet-title"
      >
        <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/50 uppercase">
          The player
        </p>
        <h2
          id="player-sheet-title"
          className="font-display mt-1 text-3xl leading-none font-semibold tracking-[-0.03em] italic"
        >
          {agent.shortName}
        </h2>
        <dl className="mt-5 divide-y divide-night/15 border-y border-night/15">
          <SheetRow label="Category" value={agent.category} />
          <SheetRow label="Tagline" value={agent.tagline} />
          <SheetRow label="Language" value={languageLabel(agent.languagePreset)} />
          <SheetRow
            label="Tone"
            value={`Warmth ${agent.tone.warmth.toFixed(1)} · Directness ${agent.tone.directness.toFixed(1)} · Humor ${agent.tone.humor.toFixed(1)}`}
          />
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
            <dt className="w-28 shrink-0 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
              Tools
            </dt>
            <dd className="font-mono text-xs">
              {agent.toolsEnabled.length > 0
                ? agent.toolsEnabled.join(" · ")
                : "None on this sheet"}
            </dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-6">
            <dt className="w-28 shrink-0 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
              Costume
            </dt>
            <dd>
              <span
                className={`inline-block h-2 w-2 rounded-sm ${COSTUME_CLASS[agent.costume]}`}
                aria-label={agent.costume}
              />
            </dd>
          </div>
          {agent.canEdit && agent.backstory ? (
            <SheetRow label="Backstory" value={agent.backstory} />
          ) : null}
        </dl>
        <div className="mt-5 flex flex-wrap gap-4">
          {agent.canEdit ? (
            <Link
              href={`/studio/${agent.id}`}
              className="font-sans text-sm font-semibold text-night underline-offset-4 hover:underline"
            >
              Casting notes
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-sm font-semibold text-night/70 underline-offset-4 hover:underline"
          >
            Close
          </button>
        </div>
      </article>
    </div>
  );
}

function SheetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="w-28 shrink-0 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
        {label}
      </dt>
      <dd className="font-sans text-sm font-semibold whitespace-pre-wrap">
        {value}
      </dd>
    </div>
  );
}
