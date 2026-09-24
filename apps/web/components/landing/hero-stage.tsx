"use client";

import { useEffect, useRef, useState } from "react";
import { AgentPortrait } from "@/components/app/agent-portrait";
import { HERO_SCENES, type HeroScene } from "@/lib/landing";

function SendGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function TierStamp({ freeTier }: { freeTier: boolean }) {
  return (
    <span className="shrink-0 text-xs text-ink-soft">
      {freeTier ? "Free" : "Plus"}
    </span>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="maya-caret ml-1 inline-block align-middle"
    />
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

function useScriptedTurn(scene: HeroScene, reduced: boolean) {
  const skipType = useRef(true);
  const [promptLen, setPromptLen] = useState(scene.prompt.length);
  const [quoteLen, setQuoteLen] = useState(scene.quote.length);
  const [phase, setPhase] = useState<"prompt" | "quote" | "hold">("hold");

  useEffect(() => {
    if (skipType.current) {
      skipType.current = false;
      setPromptLen(scene.prompt.length);
      setQuoteLen(scene.quote.length);
      setPhase("hold");
      return;
    }
    if (reduced) {
      setPromptLen(scene.prompt.length);
      setQuoteLen(scene.quote.length);
      setPhase("hold");
      return;
    }
    setPromptLen(0);
    setQuoteLen(0);
    setPhase("prompt");
  }, [scene.id, scene.prompt.length, scene.quote.length, reduced]);

  useEffect(() => {
    if (reduced) {
      return undefined;
    }
    if (phase === "prompt") {
      if (promptLen >= scene.prompt.length) {
        const id = window.setTimeout(() => setPhase("quote"), 220);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => setPromptLen((n) => n + 1), 16);
      return () => window.clearTimeout(id);
    }
    if (phase === "quote") {
      if (quoteLen >= scene.quote.length) {
        const id = window.setTimeout(() => setPhase("hold"), 220);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => setQuoteLen((n) => n + 1), 12);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [
    phase,
    promptLen,
    quoteLen,
    scene.prompt.length,
    scene.quote.length,
    reduced,
  ]);

  return {
    prompt: scene.prompt.slice(0, promptLen),
    quote: scene.quote.slice(0, quoteLen),
    typingPrompt: !reduced && phase === "prompt",
    typingQuote: !reduced && phase === "quote",
    done:
      phase === "hold" &&
      promptLen >= scene.prompt.length &&
      quoteLen >= scene.quote.length,
  };
}

function PreviewWell({
  scene,
  turn,
}: {
  scene: HeroScene;
  turn: ReturnType<typeof useScriptedTurn>;
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-rule px-4 py-3">
        <AgentPortrait
          name={scene.shortName}
          costume={scene.costume}
          avatar={scene.avatar}
          size="rail"
        />
        <div className="min-w-0 flex-1">
          <p className="font-sans text-xl leading-none text-cream ">
            {scene.shortName}
          </p>
          <p className="mt-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
            {scene.kicker}
          </p>
        </div>
        <TierStamp freeTier={scene.freeTier} />
      </div>
      <div
        role="tabpanel"
        id="hero-stage-panel"
        aria-label={`${scene.shortName} preview`}
        className="flex min-h-[18rem] flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 md:min-h-0"
      >
        <p className="sr-only">
          You: {scene.prompt} {scene.shortName}: {scene.quote}
        </p>
        <article aria-hidden className="ml-auto max-w-[80%] rounded-xl rounded-br-sm bg-raised px-4 py-3">
          <p className="text-[11px] font-medium tracking-[0.06em] text-ink-soft uppercase">You</p>
          <p className="mt-2 text-base leading-snug">
            {turn.prompt}
            {turn.typingPrompt ? <Caret /> : null}
          </p>
        </article>
        <article aria-hidden className="max-w-[85%]">
          <p className="text-[11px] font-medium tracking-[0.06em] text-ink-soft uppercase">
            {scene.shortName}
          </p>
          <p className="mt-2 text-base leading-relaxed text-cream">
            {turn.quote}
            {turn.typingQuote ? <Caret /> : null}
          </p>
        </article>
      </div>
      <div
        aria-hidden="true"
        className="shrink-0 border-t border-rule bg-night px-3 py-3"
      >
        <div className="flex items-end gap-2">
          <p className="min-h-11 flex-1 rounded-xl border border-rule bg-panel px-3 py-2.5 text-base text-ink-soft">
            Ask {scene.shortName}…
          </p>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream text-night">
            <SendGlyph />
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroStage() {
  const [activeId, setActiveId] = useState(HERO_SCENES[0].id);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const scene =
    HERO_SCENES.find((entry) => entry.id === activeId) ?? HERO_SCENES[0];
  const turn = useScriptedTurn(scene, reduced);

  useEffect(() => {
    if (reduced || paused || !turn.done) {
      return undefined;
    }
    const id = window.setTimeout(() => {
      const index = HERO_SCENES.findIndex((entry) => entry.id === scene.id);
      const next = HERO_SCENES[(index + 1) % HERO_SCENES.length];
      setActiveId(next.id);
    }, 4000);
    return () => window.clearTimeout(id);
  }, [reduced, paused, turn.done, scene.id]);

  return (
    <div
      className="relative mx-auto w-full max-w-5xl md:px-3 md:pt-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="flex flex-col overflow-hidden rounded-xl border border-rule bg-night md:aspect-[16/10]">
        <div
          role="tablist"
          aria-label="Preview agents"
          className="flex gap-2 overflow-x-auto border-b border-rule px-3 py-3 md:hidden"
        >
          {HERO_SCENES.map((entry) => {
            const selected = entry.id === scene.id;
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                id={`hero-scene-pick-${entry.id}`}
                aria-selected={selected}
                aria-controls="hero-stage-panel"
                className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-3 font-sans text-sm font-semibold ${
                  selected
                    ? "bg-cream text-night"
                    : "text-cream-dim hover:text-cream"
                }`}
                onClick={() => setActiveId(entry.id)}
              >
                <AgentPortrait
                  name={entry.shortName}
                  costume={entry.costume}
                  avatar={entry.avatar}
                  size="rail"
                />
                {entry.shortName}
              </button>
            );
          })}
        </div>

        <div className="flex min-h-0 flex-1">
          <div
            role="tablist"
            aria-label="Preview agents"
            className="hidden w-[200px] shrink-0 flex-col overflow-y-auto border-r border-rule md:flex"
          >
            {HERO_SCENES.map((entry) => {
              const selected = entry.id === scene.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  id={`hero-scene-${entry.id}`}
                  aria-selected={selected}
                  aria-controls="hero-stage-panel"
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left ${
                    selected ? "bg-raised" : "hover:bg-raised/60"
                  }`}
                  onClick={() => setActiveId(entry.id)}
                >
                  <AgentPortrait
                    name={entry.shortName}
                    costume={entry.costume}
                    avatar={entry.avatar}
                    size="rail"
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-sans text-sm font-semibold text-cream">
                      {entry.shortName}
                    </span>
                    {entry.freeTier ? null : (
                      <span className="mt-0.5 block text-[11px] text-ink-soft">Plus</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <PreviewWell scene={scene} turn={turn} />
        </div>
      </div>

    </div>
  );
}
