import { PageInner } from "@/components/app/page-frame";
import { COSTUME_CLASS } from "@/lib/company";
import { HERO_SCENES, USUAL } from "@/lib/landing";
import { SectionKicker } from "@/components/landing/section-kicker";

const HOUSE = HERO_SCENES[0];

export function Usual() {
  return (
    <section
      id="usual"
      className="relative z-10 scroll-mt-28 py-10 md:py-14"
    >
      <PageInner>
        <SectionKicker index="02" kicker={USUAL.kicker} title={USUAL.title}>
          {USUAL.body}
        </SectionKicker>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <li className="min-w-0 pt-3 pr-3">
            <article
              className="ticket relative flex h-full flex-col gap-4 bg-cream p-5 text-night"
              style={{ borderRadius: 10 }}
            >
              <span className="absolute -top-2 -right-2 z-10 bg-cream px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night uppercase shadow-[3px_3px_0_#FF4D2E]">
                {USUAL.leftover.stamp}
              </span>
              <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
                Generic chatbot
              </p>
              <ul className="flex flex-col gap-3">
                {USUAL.leftover.lines.map((line) => (
                  <li
                    key={line}
                    className="font-sans text-base leading-snug text-night/50 line-through"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          </li>
          <li className="min-w-0">
            <article
              className={`poster relative flex h-full flex-col gap-3 p-5 text-cream ${COSTUME_CLASS[HOUSE.costume]}`}
              style={{ borderRadius: 10 }}
            >
              <span className="absolute -top-2 -right-2 z-10 bg-cream px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night uppercase shadow-[3px_3px_0_#FF4D2E]">
                Free
              </span>
              <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
                {HOUSE.kicker} · {HOUSE.shortName}
              </p>
              <article className="rounded-md bg-cream px-3 py-2.5 text-night shadow-[3px_3px_0_#FF4D2E]">
                <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase">
                  You
                </p>
                <p className="mt-1 font-sans text-sm leading-snug">
                  {HOUSE.prompt}
                </p>
              </article>
              <article className="rounded-md bg-night/25 px-3 py-2.5">
                <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
                  {HOUSE.shortName}
                </p>
                <p className="mt-1 font-sans text-sm leading-snug text-cream">
                  {HOUSE.quote}
                </p>
              </article>
            </article>
          </li>
        </ul>
      </PageInner>
    </section>
  );
}
