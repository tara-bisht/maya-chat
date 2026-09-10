import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { HOUSE_OPEN } from "@/lib/landing";

function CircularStamp() {
  return (
    <div
      aria-hidden
      className="maya-spin-slow pointer-events-none absolute top-0 right-0 hidden h-28 w-28 md:block"
    >
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="none"
          stroke="var(--maya-stub)"
          strokeWidth="2"
        />
        <defs>
          <path
            id="maya-house-open-circle"
            d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0"
          />
        </defs>
        <text
          fill="var(--maya-stub)"
          fontSize="10"
          fontWeight="800"
          letterSpacing="2.4"
          className="font-sans uppercase"
        >
          <textPath href="#maya-house-open-circle">
            {HOUSE_OPEN.stamp} · {HOUSE_OPEN.stamp} ·
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export function HouseOpen() {
  return (
    <section className="relative z-10 overflow-hidden py-16 md:py-20">
      <PageInner className="relative text-center">
        <CircularStamp />
        <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {HOUSE_OPEN.kicker}
        </p>
        <h2 className="mt-3 font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-cream italic md:text-5xl">
          {HOUSE_OPEN.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-sans text-base leading-snug text-cream-dim md:text-lg">
          {HOUSE_OPEN.body}
        </p>
        <p className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={HOUSE_OPEN.cta.href}
            className="inline-flex h-11 items-center rounded-md border-2 border-night bg-cream px-4 font-sans text-sm font-semibold text-night shadow-[4px_4px_0_#FF4D2E]"
          >
            {HOUSE_OPEN.cta.label}
          </Link>
          <Link
            href={HOUSE_OPEN.secondary.href}
            className="px-2 py-2 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            {HOUSE_OPEN.secondary.label}
          </Link>
        </p>
      </PageInner>
    </section>
  );
}
