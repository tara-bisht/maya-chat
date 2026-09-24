"use client";

import Link from "next/link";
import { LANGUAGE_PRESETS } from "@maya/shared";
import { COSTUME_CLASS } from "@/lib/company";
import type { HouseAgent } from "@/lib/house/types";
import { COPY } from "@/lib/ui-copy";

function languageLabel(id: HouseAgent["languagePreset"]): string {
  return LANGUAGE_PRESETS.find((preset) => preset.id === id)?.label ?? id;
}

export function CharacterSheet({
  agent,
  onClose,
}: {
  agent: HouseAgent;
  onClose: () => void;
}) {
  return (
    <article className="mx-auto w-full max-w-measure px-4 py-6" aria-labelledby="player-sheet-title">
      <p className="text-xs font-medium text-ready">About</p>
      <h2 id="player-sheet-title" className="mt-1 text-2xl font-semibold tracking-tight">
        {agent.shortName}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{agent.tagline}</p>
      <dl className="mt-6 divide-y divide-rule border-y border-rule">
        <SheetRow label="Category" value={agent.category} />
        <SheetRow label="Language" value={languageLabel(agent.languagePreset)} />
        <SheetRow
          label="Tone"
          value={`Warmth ${agent.tone.warmth.toFixed(1)} · Directness ${agent.tone.directness.toFixed(1)} · Humor ${agent.tone.humor.toFixed(1)}`}
        />
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
          <dt className="w-28 shrink-0 text-sm text-ink-soft">Tools</dt>
          <dd className="font-mono text-xs">
            {agent.toolsEnabled.length > 0 ? agent.toolsEnabled.join(" · ") : COPY.none}
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-6">
          <dt className="w-28 shrink-0 text-sm text-ink-soft">Color</dt>
          <dd>
            <span
              className={`inline-block h-2 w-2 rounded-full ${COSTUME_CLASS[agent.costume]}`}
              aria-label={agent.costume}
            />
          </dd>
        </div>
        {agent.canEdit && agent.backstory ? (
          <SheetRow label="Instructions" value={agent.backstory} />
        ) : null}
      </dl>
      <div className="mt-5 flex flex-wrap gap-4">
        {agent.canEdit ? (
          <Link
            href={`/studio/${agent.id}`}
            className="text-sm font-semibold underline-offset-4 hover:underline"
          >
            {COPY.editAgent}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-ink-soft underline-offset-4 hover:text-cream hover:underline"
        >
          {COPY.chat}
        </button>
      </div>
    </article>
  );
}

function SheetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="w-28 shrink-0 text-sm text-ink-soft">{label}</dt>
      <dd className="text-sm whitespace-pre-wrap">{value}</dd>
    </div>
  );
}
