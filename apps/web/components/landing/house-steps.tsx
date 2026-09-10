import { PageInner } from "@/components/app/page-frame";
import { HOUSE_STEPS } from "@/lib/landing";
import { SectionKicker } from "@/components/landing/section-kicker";

export function HouseSteps() {
  return (
    <section
      id="house"
      className="relative z-10 scroll-mt-8 py-10 md:py-14"
    >
      <PageInner>
        <SectionKicker kicker="How it works" title="Three steps">
          Pick an agent. Chat. They remember what you told them.
        </SectionKicker>
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {HOUSE_STEPS.map((step) => (
            <li key={step.n} className="min-w-0">
              <article
                className="ticket flex h-full flex-col gap-3 bg-cream p-5 text-night"
                style={{ borderRadius: 10 }}
              >
                <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
                  {step.n}
                </p>
                <h3 className="font-display text-[1.75rem] leading-none font-semibold tracking-[-0.03em] italic">
                  {step.title}
                </h3>
                <p className="font-sans text-sm leading-snug text-night/80">
                  {step.body}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </PageInner>
    </section>
  );
}
