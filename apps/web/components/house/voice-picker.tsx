"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CatalogModel } from "@/lib/credits/catalog";
import { pickVoice, voiceThroughLabel } from "@/lib/credits/catalog";
import { planLabel } from "@/lib/ui-copy";

export function VoicePicker({
  models,
  selectedModelId,
  disabled = false,
  onSelect,
  onLocked,
}: {
  models: CatalogModel[];
  selectedModelId: string;
  disabled?: boolean;
  onSelect: (modelId: string) => void;
  onLocked: (model: CatalogModel) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected =
    models.find((item) => item.id === selectedModelId) ?? null;
  const triggerLabel = voiceThroughLabel(selected?.id ?? selectedModelId);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function onPointer(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  if (models.length === 0) {
    return (
      <p className="h-8 font-mono text-xs leading-8 text-ink-soft">
        {triggerLabel}
      </p>
    );
  }

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        className="flex h-8 max-w-full items-center gap-1.5 font-mono text-xs text-ink-soft hover:text-cream disabled:opacity-40"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${triggerLabel}. Change voice`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="min-w-0 truncate">{triggerLabel}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={`shrink-0 opacity-80 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Voice"
          className="absolute top-9 left-0 z-40 max-h-80 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto border border-rule bg-night py-1 shadow-[6px_6px_0_#F6EFE4]"
        >
          {models.map((item) => {
            const active = item.id === selectedModelId;
            return (
              <li key={item.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  aria-disabled={!item.allowed}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs ${
                    active ? "bg-rule/60 text-cream" : "text-cream hover:bg-rule/40"
                  }`}
                  onClick={() => {
                    const picked = pickVoice(item);
                    if (picked.ok) {
                      onSelect(picked.modelId);
                      setOpen(false);
                      return;
                    }
                    onLocked(picked.model);
                    setOpen(false);
                  }}
                >
                  <span className="min-w-0 flex-1 truncate">{item.id}</span>
                  <span className="shrink-0 text-ink-soft">
                    ~{item.estimatedCreditsPerTurn.toLocaleString("en-US")}
                  </span>
                  {item.allowed ? null : (
                    <span className="shrink-0 bg-stub px-1.5 py-0.5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-on-stub uppercase">
                      {planLabel(item.minPlan)}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
