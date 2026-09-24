import { PageInner } from "@/components/app/page-frame";
import { HeroStage } from "@/components/landing/hero-stage";
import { HERO } from "@/lib/landing";

function PersonalityMark({ children }: { children: string }) {
  return <span className="underline decoration-cream/70 underline-offset-4">{children}</span>;
}

export function Hero() {
  return (
    <section className="relative z-10 pt-14 pb-16 md:pt-20 md:pb-24">
      <PageInner>
        <h1 className="text-center text-4xl font-semibold tracking-tight text-cream md:text-6xl">
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
