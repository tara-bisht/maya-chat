import { PageInner } from "@/components/app/page-frame";
import { HOUSE_KICKER, HOUSE_STEPS } from "@/lib/landing";
import { LandingHeading } from "@/components/landing/section-kicker";

export function HouseSteps() {
  return (
    <section
      id="house"
      className="relative z-10 scroll-mt-28 py-10 md:py-14"
    >
      <PageInner>
        <LandingHeading title={HOUSE_KICKER.title}>
          {HOUSE_KICKER.body}
        </LandingHeading>
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {HOUSE_STEPS.map((step) => (
            <li key={step.n} className="min-w-0">
              <article
                className="ticket flex h-full flex-col gap-3 bg-cream p-5 text-night"
                style={{ borderRadius: 10 }}
              >
                <p className="font-mono text-xs tracking-[0.08em] text-night/60 uppercase">
                  {step.n}
                </p>
                <h3 className="font-display text-[1.75rem] leading-none font-semibold tracking-[-0.03em] italic">
                  {step.title}
                </h3>
                <p className="font-sans text-sm leading-snug text-night/80">
                  {step.body}
                </p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                  {step.pills.map((pill) => (
                    <li
                      key={pill}
                      className="bg-cream-dim px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night uppercase"
                    >
                      {pill}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </PageInner>
    </section>
  );
}
