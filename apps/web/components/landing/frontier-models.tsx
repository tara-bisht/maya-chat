"use client";

import { useState } from "react";
import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { LandingHeading } from "@/components/landing/section-kicker";
import {
  type FrontierModelCard,
  getActiveFrontierModels,
} from "@/lib/landing/frontier-models";

function TierBadge({ tier }: { tier: FrontierModelCard["tier"] }) {
  if (tier === "Free") {
    return (
      <span className="rounded bg-cream px-2 py-0.5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night uppercase shadow-[2px_2px_0_#CEFF00]">
        Free Tier
      </span>
    );
  }
  if (tier === "Plus") {
    return (
      <span className="rounded bg-stub px-2 py-0.5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-on-stub uppercase shadow-[2px_2px_0_#F6EFE4]">
        Plus
      </span>
    );
  }
  return (
    <span className="rounded bg-acid px-2 py-0.5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream uppercase shadow-[2px_2px_0_#CEFF00]">
      Pro Flagship
    </span>
  );
}

function ProviderMark({ provider }: { provider: FrontierModelCard["provider"] }) {
  return (
    <span className="font-mono text-xs font-bold tracking-wider text-ink-soft uppercase">
      {provider}
    </span>
  );
}

export function FrontierModels({
  models = getActiveFrontierModels(),
}: {
  models?: FrontierModelCard[];
}) {
  const [selectedId, setSelectedId] = useState(models[0]?.id ?? "claude");
  const selected = models.find((m) => m.id === selectedId) ?? models[0];

  return (
    <section
      id="models"
      className="relative z-10 scroll-mt-28 border-t border-rule/70 py-16 md:py-24"
    >
      <PageInner>
        <LandingHeading title="The Repertory Engine">
          Every character can think through the world&apos;s most formidable frontier
          models. Switch the intellect behind any persona with a single click.
        </LandingHeading>

        {/* Featured Model Spotlight Well */}
        {selected ? (
          <div className="mt-10 overflow-hidden rounded-lg border-2 border-cream bg-night shadow-[8px_8px_0_#CEFF00] md:mt-12">
            <div className="flex flex-col border-b border-rule bg-rule/20 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <div className="flex items-center gap-3">
                  <ProviderMark provider={selected.provider} />
                  <TierBadge tier={selected.tier} />
                  {selected.featured ? (
                    <span className="rounded bg-cream/10 px-2 py-0.5 font-mono text-[11px] font-bold text-acid uppercase">
                      ★ Featured
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 font-display text-3xl font-semibold text-cream italic md:text-4xl">
                  {selected.displayName}
                </h3>
                <p className="mt-1 font-sans text-base text-cream-dim">
                  {selected.headline}
                </p>
              </div>

              <div className="mt-6 flex shrink-0 items-center gap-4 md:mt-0">
                <div className="border-l border-rule pl-4 text-left">
                  <div className="font-mono text-[11px] font-bold text-ink-soft uppercase">
                    Context Window
                  </div>
                  <div className="font-sans text-lg font-bold text-cream">
                    {selected.contextWindow} tokens
                  </div>
                </div>
                <div className="border-l border-rule pl-4 text-left">
                  <div className="font-mono text-[11px] font-bold text-ink-soft uppercase">
                    Latency
                  </div>
                  <div className="font-sans text-lg font-bold text-acid">
                    {selected.speedRating}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-3 md:gap-8 md:p-8">
              <div className="md:col-span-2">
                <h4 className="font-mono text-xs font-bold tracking-wider text-ink-soft uppercase">
                  Persona Dynamics & Character Strengths
                </h4>
                <p className="mt-3 font-sans text-base leading-relaxed text-cream-dim">
                  {selected.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {selected.strengths.map((str) => (
                    <span
                      key={str}
                      className="rounded border border-cream/30 bg-night px-3 py-1 font-mono text-xs text-cream"
                    >
                      ✓ {str}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-md border border-rule/80 bg-rule/30 p-5">
                <div>
                  <div className="font-mono text-xs font-bold text-ink-soft uppercase">
                    In Repertory Use
                  </div>
                  <p className="mt-2 font-sans text-sm text-cream-dim italic">
                    &ldquo;{selected.tagline}&rdquo;
                  </p>
                </div>
                <Link
                  href="/chat"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-cream px-5 font-sans text-sm font-bold text-night shadow-[4px_4px_0_#FF4D2E] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Experience in Chat →
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        {/* Model Selector Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
          {models.map((model) => {
            const isSelected = model.id === selectedId;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setSelectedId(model.id)}
                className={`group relative flex flex-col rounded-md border p-3.5 text-left transition-all ${
                  isSelected
                    ? "border-cream bg-rule/70 shadow-[4px_4px_0_#CEFF00]"
                    : "border-rule bg-night/80 hover:border-cream/50 hover:bg-rule/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-ink-soft uppercase">
                    {model.provider}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isSelected ? "bg-acid animate-pulse" : "bg-rule"
                    }`}
                  />
                </div>
                <div className="mt-2 truncate font-display text-base font-semibold text-cream">
                  {model.displayName}
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-cream-dim">
                  <span className="font-mono">{model.contextWindow}</span>
                  <span className="font-bold text-acid">{model.tier}</span>
                </div>
              </button>
            );
          })}
        </div>
      </PageInner>
    </section>
  );
}
