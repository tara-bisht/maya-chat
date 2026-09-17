"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LAB_PROVIDERS } from "@maya/shared";
import type { CatalogModel } from "@/lib/credits/catalog";
import {
  filterCatalogModels,
  groupCatalogModelsByLab,
  modelLabel,
  pickVoice,
} from "@/lib/credits/catalog";
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
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const listId = useId();

  const selected = models.find((item) => item.id === selectedModelId) ?? null;
  const triggerLabel = modelLabel(
    selected?.displayName ?? selected?.id ?? selectedModelId,
  );

  const filteredModels = useMemo(
    () => filterCatalogModels(models, search),
    [models, search],
  );

  const groupedModels = useMemo(
    () => groupCatalogModelsByLab(filteredModels, LAB_PROVIDERS),
    [filteredModels],
  );

  const flatModels = useMemo(
    () => groupedModels.flatMap((group) => group.models),
    [groupedModels],
  );

  const prevOpenRef = useRef(false);

  // Focus search input and highlight current selection on popover open
  useEffect(() => {
    if (open) {
      if (!prevOpenRef.current) {
        const idx = flatModels.findIndex((m) => m.id === selectedModelId);
        setActiveIndex(idx >= 0 ? idx : 0);
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    } else {
      setSearch("");
      setActiveIndex(-1);
    }
    prevOpenRef.current = open;
  }, [open, flatModels, selectedModelId]);

  // Reset activeIndex to first item when search query changes
  useEffect(() => {
    if (open) {
      setActiveIndex(flatModels.length > 0 ? 0 : -1);
    }
  }, [search, open, flatModels.length]);

  // Scroll active item into view
  useEffect(() => {
    if (open && activeIndex >= 0 && flatModels[activeIndex]) {
      const activeModel = flatModels[activeIndex];
      const el = itemRefs.current.get(activeModel.id);
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, open, flatModels]);

  // Handle outside clicks and document-level escape
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return;
      }
      if (event.key === "Escape") {
        if (search.length > 0) {
          setSearch("");
          searchInputRef.current?.focus();
        } else {
          setOpen(false);
          triggerRef.current?.focus();
        }
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
  }, [open, search]);

  const selectModel = (item: CatalogModel) => {
    const picked = pickVoice(item);
    if (picked.ok) {
      onSelect(picked.modelId);
      setOpen(false);
      return;
    }
    onLocked(picked.model);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (flatModels.length === 0) return;
      setActiveIndex((prev) => (prev < flatModels.length - 1 ? prev + 1 : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (flatModels.length === 0) return;
      setActiveIndex((prev) => (prev <= 0 ? flatModels.length - 1 : prev - 1));
    } else if (event.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < flatModels.length) {
        event.preventDefault();
        const target = flatModels[activeIndex];
        if (target) {
          selectModel(target);
        }
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (search.length > 0) {
        setSearch("");
        searchInputRef.current?.focus();
      } else {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
  };

  if (models.length === 0) {
    return (
      <p className="h-8 font-mono text-xs leading-8 text-ink-soft">
        {triggerLabel}
      </p>
    );
  }

  const activeModel = activeIndex >= 0 ? flatModels[activeIndex] : null;
  const activeDescendantId = activeModel
    ? `${listId}-opt-${activeModel.id.replace(/[^a-zA-Z0-9-_]/g, "_")}`
    : undefined;

  return (
    <div ref={rootRef} onKeyDown={handleKeyDown} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        className="flex h-8 max-w-full items-center gap-1.5 font-mono text-xs text-ink-soft hover:text-cream disabled:opacity-40"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${triggerLabel}. Change model`}
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
        <div
          className="absolute top-9 left-0 z-40 flex max-h-96 w-[min(24rem,calc(100vw-2rem))] flex-col border border-rule bg-night shadow-[6px_6px_0_#F6EFE4]"
        >
          {/* Sticky search input at top of popover */}
          <div className="sticky top-0 z-20 shrink-0 border-b border-rule bg-night p-2">
            <div className="relative flex items-center">
              <svg
                className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-ink-soft"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                autoFocus
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={true}
                aria-controls={listId}
                aria-activedescendant={activeDescendantId}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 50+ models or labs..."
                aria-label="Search models or labs"
                className="w-full border border-rule bg-code-well py-1.5 pr-7 pl-8 font-mono text-xs text-cream placeholder:text-ink-soft/70 focus:border-cream focus:outline-none"
              />
              {search.length > 0 ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearch("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2 text-xs text-ink-soft hover:text-cream"
                >
                  ✕
                </button>
              ) : null}
            </div>
          </div>

          {/* Model list or empty state */}
          <div
            id={listId}
            role="listbox"
            aria-label="Models"
            className="min-h-0 flex-1 overflow-y-auto py-1 scroll-pt-6"
          >
            {flatModels.length === 0 ? (
              <div className="px-3 py-6 text-center font-mono text-xs text-ink-soft">
                No models found matching &quot;{search}&quot;
              </div>
            ) : (
              groupedModels.map((group) => (
                <div key={group.provider} className="relative">
                  <div className="sticky top-0 z-10 border-b border-rule/50 bg-night px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-ink-soft uppercase">
                    {group.displayName} ({group.models.length})
                  </div>
                  <ul role="presentation">
                    {group.models.map((item) => {
                      const itemIndex = flatModels.indexOf(item);
                      const isSelected = item.id === selectedModelId;
                      const isHighlighted = itemIndex === activeIndex;
                      const optionId = `${listId}-opt-${item.id.replace(/[^a-zA-Z0-9-_]/g, "_")}`;

                      return (
                        <li key={item.id} role="presentation">
                          <button
                            ref={(el) => {
                              if (el) {
                                itemRefs.current.set(item.id, el);
                              } else {
                                itemRefs.current.delete(item.id);
                              }
                            }}
                            id={optionId}
                            type="button"
                            role="option"
                            tabIndex={-1}
                            aria-selected={isSelected}
                            aria-disabled={!item.allowed}
                            title={`${item.displayName} (${item.id})`}
                            onMouseEnter={() => setActiveIndex(itemIndex)}
                            onClick={() => selectModel(item)}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-left transition-colors ${
                              isHighlighted
                                ? "bg-rule/70 text-cream"
                                : isSelected
                                  ? "bg-rule/40 text-cream"
                                  : "text-cream hover:bg-rule/40"
                            }`}
                          >
                            <div className="flex min-w-0 flex-1 items-baseline gap-1.5 truncate">
                              <span className="truncate font-sans text-xs font-semibold text-cream">
                                {item.displayName}
                              </span>
                              <span className="shrink-0 font-mono text-[10px] text-ink-soft">
                                {item.id}
                              </span>
                            </div>
                            <span className="shrink-0 font-mono text-xs text-ink-soft">
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
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

