"use client";

import { useState, useTransition } from "react";
import {
  COSTUME_IDS,
  DEFAULT_TONE,
  LANGUAGE_PRESETS,
  STUDIO_TOOLS,
  type CostumeId,
  type LanguagePreset,
  type StudioTool,
  type StudioUpsert,
  type ToneSettings,
} from "@maya/shared";
import { COSTUME_CLASS } from "@/lib/company";
import { archiveCustomAgent, saveCastingNotes, type StudioActionState } from "@/lib/studio/actions";
import { PaywallTicket, studioCapCopy } from "@/components/app/paywall-ticket";

const COSTUME_LABEL: Record<CostumeId, string> = {
  marcus: "Marcus moss",
  priya: "Priya magenta",
  alex: "Alex espresso",
  nonna: "Nonna tomato",
  viktor: "Viktor olive",
  valerian: "Valerian indigo",
  barnaby: "Barnaby tawny",
  ren: "Ren slate",
  custom: "Custom brown",
};

const TOOL_LABEL: Record<StudioTool, string> = {
  memory_saver: "Memory saver",
  math_solver: "Math solver",
  web_search: "Web search",
};

const TONE_LABEL: Record<keyof ToneSettings, string> = {
  warmth: "Warmth",
  directness: "Directness",
  humor: "Humor",
};

export type CastingFormDefaults = Partial<StudioUpsert> & {
  archived?: boolean;
};

export function CastingForm({
  agentId,
  defaults,
  planId,
  planDisplayName,
  maxCustomAgents,
  toolsAllowed,
}: {
  agentId: string | null;
  defaults?: CastingFormDefaults;
  planId: "free" | "plus" | "pro";
  planDisplayName: string;
  maxCustomAgents: number | null;
  toolsAllowed: string[];
}) {
  const canPrivate = planId !== "free";
  const archived = defaults?.archived === true;
  const allowedTools = STUDIO_TOOLS.filter((tool) => toolsAllowed.includes(tool));

  const [name, setName] = useState(defaults?.name ?? "");
  const [tagline, setTagline] = useState(defaults?.tagline ?? "");
  const [languagePreset, setLanguagePreset] = useState<LanguagePreset>(
    defaults?.languagePreset ?? "en",
  );
  const [costumeId, setCostumeId] = useState<CostumeId>(
    defaults?.costumeId ?? "custom",
  );
  const [backstory, setBackstory] = useState(defaults?.backstory ?? "");
  const [tone, setTone] = useState<ToneSettings>(defaults?.tone ?? DEFAULT_TONE);
  const [toolsEnabled, setToolsEnabled] = useState<StudioTool[]>(
    defaults?.toolsEnabled ?? [],
  );
  const [isPublic, setIsPublic] = useState(
    canPrivate ? (defaults?.isPublic ?? true) : true,
  );
  const [error, setError] = useState<StudioActionState>(null);
  const [pending, startTransition] = useTransition();

  function payload(): StudioUpsert {
    return {
      name,
      tagline,
      languagePreset,
      costumeId,
      backstory,
      tone,
      toolsEnabled,
      isPublic: canPrivate ? isPublic : true,
    };
  }

  function onSave() {
    startTransition(async () => {
      const result = await saveCastingNotes(agentId, payload());
      setError(result);
    });
  }

  function onArchive() {
    if (!agentId) {
      return;
    }
    startTransition(async () => {
      const result = await archiveCustomAgent(agentId);
      setError(result);
    });
  }

  if (error?.code === "studio_cap") {
    return (
      <PaywallTicket
        title="Agent limit reached."
        body={studioCapCopy(maxCustomAgents, planDisplayName)}
        href="/plan?reason=studio-cap"
        cta="Upgrade"
      />
    );
  }

  if (error?.code === "studio_private_forbidden") {
    return (
      <PaywallTicket
        title="Private agents are Plus."
        body="Upgrade to Plus to make this agent private."
        href="/plan?reason=studio-private"
        cta="Upgrade"
      />
    );
  }

  const fieldClass =
    "w-full rounded-md border border-night/20 bg-cream px-3 py-2 font-sans text-sm text-night";

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (!archived) {
          onSave();
        }
      }}
    >
      {archived ? (
        <p className="font-sans text-sm font-semibold text-night/70">
          This agent is archived.
        </p>
      ) : null}

      {error?.code === "invalid" ? (
        <p className="font-sans text-sm font-semibold text-night">
          Name, tagline, and backstory are required.
        </p>
      ) : null}

      <label className="flex flex-col gap-1">
        <span className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
          Name
        </span>
        <input
          className={fieldClass}
          value={name}
          maxLength={40}
          required
          disabled={archived || pending}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
          Tagline
        </span>
        <input
          className={fieldClass}
          value={tagline}
          maxLength={160}
          required
          disabled={archived || pending}
          onChange={(event) => setTagline(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
          Language
        </span>
        <select
          className={fieldClass}
          value={languagePreset}
          disabled={archived || pending}
          onChange={(event) =>
            setLanguagePreset(event.target.value as LanguagePreset)
          }
        >
          {LANGUAGE_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      <fieldset disabled={archived || pending}>
        <legend className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
          Costume flood
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {COSTUME_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setCostumeId(id)}
              aria-pressed={costumeId === id}
              className={`flex h-11 items-center gap-2 rounded-md border-2 px-3 font-sans text-sm font-semibold ${
                costumeId === id
                  ? "border-night text-cream"
                  : "border-night/20 text-night"
              } ${costumeId === id ? COSTUME_CLASS[id] : "bg-cream"}`}
            >
              <span
                className={`inline-block size-3 rounded-sm ${COSTUME_CLASS[id]}`}
                aria-hidden
              />
              {COSTUME_LABEL[id]}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
          Backstory
        </span>
        <textarea
          className={`${fieldClass} min-h-40`}
          value={backstory}
          maxLength={8000}
          required
          disabled={archived || pending}
          onChange={(event) => setBackstory(event.target.value)}
        />
      </label>

      <fieldset disabled={archived || pending} className="flex flex-col gap-4">
        <legend className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
          Tone
        </legend>
        {(Object.keys(TONE_LABEL) as (keyof ToneSettings)[]).map((key) => (
          <label key={key} className="flex flex-col gap-1">
            <span className="flex justify-between font-sans text-sm font-semibold">
              {TONE_LABEL[key]}
              <span className="font-mono text-xs text-night/60">
                {tone[key].toFixed(2)}
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={tone[key]}
              onChange={(event) =>
                setTone({ ...tone, [key]: Number(event.target.value) })
              }
            />
          </label>
        ))}
      </fieldset>

      {allowedTools.length > 0 ? (
        <fieldset disabled={archived || pending}>
          <legend className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
            Tools
          </legend>
          <div className="mt-3 flex flex-col gap-2">
            {allowedTools.map((tool) => {
              const checked = toolsEnabled.includes(tool);
              return (
                <label
                  key={tool}
                  className="flex items-center gap-2 font-sans text-sm font-semibold"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setToolsEnabled(
                        checked
                          ? toolsEnabled.filter((item) => item !== tool)
                          : [...toolsEnabled, tool],
                      )
                    }
                  />
                  {TOOL_LABEL[tool]}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <fieldset disabled={archived || pending}>
        <legend className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
          Visibility
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setIsPublic(true)}
            aria-pressed={isPublic}
            className={`rounded-md border-2 p-3 text-left ${
              isPublic ? "border-night bg-stub" : "border-night/20 bg-cream"
            }`}
          >
            <span className="block font-display text-xl italic">Public</span>
            <span className="mt-1 block font-sans text-sm text-night/70">
              Anyone signed in can chat. They do not see the backstory.
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (canPrivate) {
                setIsPublic(false);
              }
            }}
            aria-pressed={!isPublic}
            disabled={!canPrivate}
            className={`rounded-md border-2 p-3 text-left ${
              !isPublic ? "border-night bg-stub" : "border-night/20 bg-cream"
            } ${canPrivate ? "" : "opacity-50"}`}
          >
            <span className="block font-display text-xl italic">Private</span>
            <span className="mt-1 block font-sans text-sm text-night/70">
              {canPrivate
                ? "Only you can chat with this agent."
                : "Private agents are Plus."}
            </span>
          </button>
        </div>
      </fieldset>

      {archived ? null : (
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-md bg-acid px-5 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#14110F] disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          {agentId ? (
            <button
              type="button"
              onClick={onArchive}
              disabled={pending}
              className="font-sans text-sm font-semibold text-night underline-offset-4 hover:underline"
            >
              Archive
            </button>
          ) : null}
        </div>
      )}
    </form>
  );
}
