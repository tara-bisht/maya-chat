"use client";

import { useState } from "react";
import { PageInner } from "@/components/app/page-frame";
import { LandingHeading } from "@/components/landing/section-kicker";
import { COSTUME_CLASS } from "@/lib/company";
import { USUAL } from "@/lib/landing";

export function Usual() {
  const [activeId, setActiveId] = useState<(typeof USUAL.prompts)[number]["id"]>(
    USUAL.prompts[0].id,
  );
  const scene =
    USUAL.prompts.find((entry) => entry.id === activeId) ?? USUAL.prompts[0];

  return (
    <section
      id="usual"
      className="relative z-10 scroll-mt-28 py-10 md:py-14"
    >
      <PageInner>
        <LandingHeading title={USUAL.title}>{USUAL.body}</LandingHeading>
        <div
          role="tablist"
          aria-label="Sample questions"
          className="mb-6 flex flex-wrap gap-2"
        >
          {USUAL.prompts.map((entry) => {
            const selected = entry.id === scene.id;
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`inline-flex h-11 items-center rounded-md px-3 font-sans text-sm font-semibold ${
                  selected
                    ? "bg-cream text-night"
                    : "text-cream-dim hover:text-cream"
                }`}
                onClick={() => setActiveId(entry.id)}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
        <article className="mb-8 rounded-md bg-cream px-4 py-3 text-night shadow-[4px_4px_0_#FF4D2E]">
          <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase">
            You
          </p>
          <p className="mt-2 font-sans text-base leading-snug md:text-lg">
            {scene.prompt}
          </p>
        </article>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <li className="min-w-0 pt-3 pr-3">
            <article
              className="ticket relative flex h-full flex-col gap-4 bg-cream p-5 text-night"
              style={{ borderRadius: 10 }}
            >
              <span className="absolute -top-2 -right-2 z-10 bg-cream px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night uppercase shadow-[3px_3px_0_#FF4D2E]">
                {scene.leftover.stamp}
              </span>
              <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
                {USUAL.leftoverName}
              </p>
              <ul className="flex flex-col gap-2">
                {scene.leftover.lines.map((line) => (
                  <li
                    key={line}
                    className="font-sans text-sm leading-snug text-night/55 line-through decoration-night/45 md:text-base"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          </li>
          {scene.nights.map((night) => (
            <li key={night.player} className="min-w-0">
              <article
                className={`poster relative flex h-full flex-col gap-3 p-5 text-cream ${COSTUME_CLASS[night.costume]}`}
                style={{ borderRadius: 10 }}
              >
                <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
                  {night.player}
                </p>
                <article className="flex flex-1 flex-col justify-end rounded-md bg-night/25 px-3 py-3">
                  <p className="font-sans text-base leading-snug text-cream md:text-lg">
                    {night.quote}
                  </p>
                </article>
              </article>
            </li>
          ))}
        </ul>
      </PageInner>
    </section>
  );
}
