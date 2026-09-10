import { PageInner } from "@/components/app/page-frame";
import { COSTUME_CLASS } from "@/lib/company";
import { NIGHTS } from "@/lib/landing";
import { SectionKicker } from "@/components/landing/section-kicker";

export function Nights() {
  return (
    <section
      id="nights"
      className="relative z-10 scroll-mt-8 py-10 md:py-14"
    >
      <PageInner>
        <SectionKicker kicker="Scenes" title="Different nights, different players">
          Context picks the character. A proof, a pep talk, and a production fire
          do not share a voice.
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
              </article>
            </li>
          ))}
        </ul>
      </PageInner>
    </section>
  );
}
