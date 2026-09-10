import { PageInner } from "@/components/app/page-frame";
import { COSTUME_CLASS } from "@/lib/company";
import { NIGHTS, NIGHTS_KICKER } from "@/lib/landing";
import { SectionKicker } from "@/components/landing/section-kicker";

export function Nights() {
  return (
    <section
      id="nights"
      className="relative z-10 scroll-mt-28 py-10 md:py-14"
    >
      <PageInner>
        <SectionKicker
          index="03"
          kicker={NIGHTS_KICKER.kicker}
          title={NIGHTS_KICKER.title}
        >
          {NIGHTS_KICKER.body}
        </SectionKicker>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
          {NIGHTS.map((scene) => (
            <li key={scene.id} className="min-w-0">
              <article
                className={`poster relative flex h-full flex-col gap-3 p-5 text-cream ${COSTUME_CLASS[scene.costume]}`}
                style={{ borderRadius: 10 }}
              >
                <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
                  {scene.kicker} · {scene.player}
                </p>
                <h3 className="font-display text-[1.75rem] leading-none font-semibold tracking-[-0.03em] text-cream italic">
                  {scene.title}
                </h3>
                <p className="font-sans text-sm leading-snug text-cream/90">
                  {scene.body}
                </p>
                <div className="mt-auto flex flex-col gap-2 pt-2">
                  <article className="rounded-md bg-cream px-3 py-2 text-night shadow-[3px_3px_0_#FF4D2E]">
                    <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase">
                      You
                    </p>
                    <p className="mt-1 font-sans text-sm leading-snug">
                      {scene.prompt}
                    </p>
                  </article>
                  <article className="rounded-md bg-night/25 px-3 py-2">
                    <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
                      {scene.player}
                    </p>
                    <p className="mt-1 font-sans text-sm leading-snug text-cream">
                      {scene.quote}
                    </p>
                  </article>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </PageInner>
    </section>
  );
}
