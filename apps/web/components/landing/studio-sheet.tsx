import type { CSSProperties } from "react";
import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { STUDIO } from "@/lib/landing";

export function StudioSheet() {
  return (
    <section
      id="studio"
      className="relative z-10 scroll-mt-28 py-10 md:py-14"
    >
      <PageInner>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 min-w-7 items-center justify-center bg-cream px-2 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night uppercase shadow-[2px_2px_0_#FF4D2E]">
            05
          </span>
          <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
            {STUDIO.kicker}
          </p>
          <span aria-hidden className="h-px min-w-8 flex-1 bg-rule" />
        </div>
        <article
          className="ticket mt-4 max-w-[40rem] bg-cream p-6 text-night"
          style={
            {
              borderRadius: 10,
              "--ticket-shadow": "8px 8px 0 #FF4D2E",
              "--ticket-shadow-hover": "11px 11px 0 #FF4D2E",
            } as CSSProperties
          }
        >
          <h2 className="font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] italic">
            {STUDIO.title}
          </h2>
          <p className="mt-3 font-sans text-base leading-snug text-night/80">
            {STUDIO.body}
          </p>
          <dl className="mt-6 divide-y divide-night/15 border-y border-night/15">
            {STUDIO.fields.map((field) => (
              <div
                key={field.label}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <dt className="w-28 shrink-0 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
                  {field.label}
                </dt>
                <dd className="font-sans text-sm font-semibold">{field.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/70 uppercase">
            {STUDIO.cap}
          </p>
          <p className="mt-4">
            <Link
              href="/login"
              className="font-sans text-sm font-semibold text-night underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </article>
      </PageInner>
    </section>
  );
}
