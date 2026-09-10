import { PageInner } from "@/components/app/page-frame";
import { HeroStage } from "@/components/landing/hero-stage";
import { HERO } from "@/lib/landing";

export function Hero() {
  return (
    <section className="relative z-10 pt-14 pb-16 md:pt-20 md:pb-24">
      <PageInner>
        <h1 className="font-display text-[clamp(3.25rem,11vw,5.75rem)] leading-[0.92] font-medium tracking-[-0.04em] text-cream italic">
          {HERO.titleLead}
          <span className="relative inline-block whitespace-nowrap">
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 bottom-[0.06em] left-[-0.04em] h-[0.14em] -rotate-1 bg-stub"
            />
            <span className="relative">{HERO.titleMark}</span>
          </span>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-lg leading-snug text-cream-dim">
          {HERO.body}
        </p>
        <p className="mt-6 inline-block bg-stub px-3 py-1.5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-on-stub uppercase shadow-[3px_3px_0_#FF4D2E]">
          {HERO.sticker}
        </p>
        <p className="mt-5 font-sans text-sm font-semibold text-stub">
          {HERO.lineup}
        </p>
        <div className="mt-12 md:mt-16">
          <HeroStage />
        </div>
      </PageInner>
    </section>
  );
}
