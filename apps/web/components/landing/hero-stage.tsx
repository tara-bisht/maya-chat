"use client";

import { useState, type CSSProperties } from "react";
import { AgentPortrait } from "@/components/app/agent-portrait";
import { COSTUME_CLASS } from "@/lib/company";
import { HERO_SCENES, type HeroScene } from "@/lib/landing";

type Place = "left" | "center" | "right";

const PLACE_CLASS: Record<Place, string> = {
  left: "left-0 translate-x-0 top-10 z-10 w-[48%] scale-[0.82]",
  center: "left-1/2 top-0 z-30 w-[54%] -translate-x-1/2 scale-100",
  right: "left-full top-10 z-10 w-[48%] -translate-x-full scale-[0.82]",
};

const PLACE_TILT: Record<Place, string> = {
  left: "-7deg",
  center: "0deg",
  right: "6deg",
};

function placeOf(id: string, activeId: string): Place {
  if (id === activeId) {
    return "center";
  }
  const others = HERO_SCENES.filter((scene) => scene.id !== activeId);
  return others[0]?.id === id ? "left" : "right";
}

function QuoteCard({ scene }: { scene: HeroScene }) {
  return (
    <article
      className={`poster relative flex h-full w-full flex-col gap-3 p-4 text-cream ${COSTUME_CLASS[scene.costume]}`}
      style={{ borderRadius: 10 }}
    >
      <span
        className={`absolute -top-2 -right-2 z-10 px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase ${
          scene.freeTier
            ? "rotate-[-6deg] bg-cream text-night shadow-[3px_3px_0_#FF4D2E]"
            : "rotate-[-8deg] bg-stub text-on-stub shadow-[3px_3px_0_#F6EFE4]"
        }`}
      >
        {scene.freeTier ? "Free" : "Plus"}
      </span>
      <div className="w-24 overflow-hidden rounded-md sm:w-28">
        <AgentPortrait
          name={scene.shortName}
          costume={scene.costume}
          avatar={scene.avatar}
        />
      </div>
      <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
        {scene.kicker} · {scene.shortName}
      </p>
      <p className="font-display text-[1.25rem] leading-[1.15] font-medium tracking-[-0.03em] text-cream italic sm:text-[1.45rem]">
        {scene.quote}
      </p>
      <p className="mt-4 rotate-[-3deg] bg-cream px-3 py-2 text-night shadow-[3px_3px_0_#FF4D2E]">
        <span className="font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase">
          You
        </span>
        <span className="mt-1 block font-sans text-sm leading-snug">
          {scene.prompt}
        </span>
      </p>
    </article>
  );
}

export function HeroStage() {
  const [activeId, setActiveId] = useState(HERO_SCENES[0].id);
  const scene =
    HERO_SCENES.find((entry) => entry.id === activeId) ?? HERO_SCENES[0];

  return (
    <div className="min-w-0">
      <div
        className="relative hidden pb-8 motion-reduce:hidden md:block"
        role="tablist"
        aria-label="Preview agents"
      >
        <div className="invisible mx-auto w-[54%]" aria-hidden="true">
          <QuoteCard scene={scene} />
        </div>
        {HERO_SCENES.map((entry) => {
          const place = placeOf(entry.id, scene.id);
          const selected = entry.id === scene.id;
          return (
            <div
              key={entry.id}
              className={`absolute origin-bottom transition-[left,top,transform,width] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] ${PLACE_CLASS[place]}`}
              style={{ "--tilt": PLACE_TILT[place] } as CSSProperties}
            >
              <button
                type="button"
                role="tab"
                id={`hero-scene-${entry.id}`}
                aria-label={entry.shortName}
                aria-selected={selected}
                aria-controls="hero-stage-panel"
                className="block w-full text-left"
                onClick={() => setActiveId(entry.id)}
              >
                <QuoteCard scene={entry} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="md:hidden motion-reduce:md:block">
        <div
          role="tablist"
          aria-label="Preview agents"
          className="mb-5 flex flex-wrap justify-center gap-2"
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
                className={`inline-flex h-11 items-center gap-2 rounded-md px-3 font-sans text-sm font-semibold ${
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
                {entry.freeTier ? null : (
                  <span className="bg-stub px-1.5 py-0.5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-on-stub uppercase shadow-[2px_2px_0_#F6EFE4]">
                    Plus
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div
          role="tabpanel"
          id="hero-stage-panel"
          aria-labelledby={`hero-scene-pick-${scene.id}`}
        >
          <QuoteCard scene={scene} />
        </div>
      </div>
    </div>
  );
}
