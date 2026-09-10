import { PageInner } from "@/components/app/page-frame";
import { NOTES } from "@/lib/landing";
import { SectionKicker } from "@/components/landing/section-kicker";

export function Notes() {
  return (
    <section
      id="notes"
      className="relative z-10 scroll-mt-28 py-10 md:py-14"
    >
      <PageInner className="md:grid md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-start md:gap-12">
        <SectionKicker index="07" kicker="FAQ" title="Before you start" />
        <div className="border-t border-rule">
          {NOTES.map((note) => (
            <details key={note.q} className="group border-b border-rule">
              <summary className="cursor-pointer list-none py-4 font-display text-2xl leading-tight font-semibold tracking-[-0.03em] text-cream italic [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  {note.q}
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center bg-stub font-sans text-base font-extrabold text-on-stub shadow-[2px_2px_0_#FF4D2E] group-open:hidden"
                  >
                    +
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 hidden h-7 w-7 shrink-0 items-center justify-center bg-stub font-sans text-base font-extrabold text-on-stub shadow-[2px_2px_0_#FF4D2E] group-open:inline-flex"
                  >
                    −
                  </span>
                </span>
              </summary>
              <p className="pb-5 font-sans text-base leading-snug text-cream-dim">
                {note.a}
              </p>
            </details>
          ))}
        </div>
      </PageInner>
    </section>
  );
}
