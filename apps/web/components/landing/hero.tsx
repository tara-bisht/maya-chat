import { PageInner } from "@/components/app/page-frame";
import { HeroStage } from "@/components/landing/hero-stage";
import { HERO } from "@/lib/landing";

function PersonalityMark({ children }: { children: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 -bottom-[0.06em] left-[-0.06em] h-[0.22em]"
      >
        <svg
          viewBox="0 0 220 14"
          fill="none"
          preserveAspectRatio="none"
          className="maya-scribble h-full w-full"
        >
          <path
            d="M3 10.5 C 40 3.5, 75 11, 110 7.5 S 180 4, 217 8"
            pathLength="1"
            stroke="var(--maya-acid)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative z-10 pt-14 pb-16 md:pt-20 md:pb-24">
      <PageInner>
        <h1 className="text-center font-display text-[clamp(3.25rem,11vw,5.75rem)] leading-[0.92] font-medium tracking-[-0.04em] text-cream italic">
          {HERO.titleLead}
          <PersonalityMark>{HERO.titleMark}</PersonalityMark>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-center font-sans text-lg leading-snug text-cream-dim">
          {HERO.body}
        </p>
        <div className="mt-12 md:mt-16">
          <HeroStage />
        </div>
      </PageInner>
    </section>
  );
}
