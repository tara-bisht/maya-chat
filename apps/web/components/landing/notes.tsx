import { NOTES } from "@/lib/landing";
import { SectionKicker } from "@/components/landing/section-kicker";

export function Notes() {
  return (
    <section
      id="notes"
      className="relative z-10 scroll-mt-8 px-4 py-10 md:px-8 md:py-14"
    >
      <SectionKicker kicker="Program notes" title="Before you take a seat" />
      <div className="max-w-measure border-t border-rule">
        {NOTES.map((note) => (
          <details
            key={note.q}
            className="group border-b border-rule"
          >
            <summary className="cursor-pointer list-none py-4 font-display text-2xl leading-tight font-semibold tracking-[-0.03em] text-cream italic [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {note.q}
                <span
                  aria-hidden
                  className="mt-1 shrink-0 font-sans text-sm font-semibold text-stub group-open:hidden"
                >
                  +
                </span>
                <span
                  aria-hidden
                  className="mt-1 hidden shrink-0 font-sans text-sm font-semibold text-stub group-open:inline"
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
    </section>
  );
}
