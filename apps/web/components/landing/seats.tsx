import type { CSSProperties } from "react";
import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { SEATS, SEATS_FOOTNOTE, SEATS_KICKER, type Seat } from "@/lib/landing";
import { SectionKicker } from "@/components/landing/section-kicker";

function SeatTicket({ seat }: { seat: Seat }) {
  const stampClass =
    seat.stampTone === "stub"
      ? "bg-stub text-on-stub shadow-[3px_3px_0_#14110F]"
      : "bg-cream text-night shadow-[3px_3px_0_#FF4D2E] border-2 border-night";

  return (
    <article
      className="ticket relative flex h-full flex-col bg-cream p-5 text-night"
      style={
        {
          borderRadius: 14,
          "--ticket-shadow": "8px 8px 0 #FF4D2E",
          "--ticket-shadow-hover": "11px 11px 0 #FF4D2E",
        } as CSSProperties
      }
    >
      <span
        className={`absolute -top-2 -right-2 z-10 px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase ${stampClass}`}
      >
        {seat.stamp}
      </span>
      <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
        Plan
      </p>
      <h3 className="mt-1 font-display text-[2rem] leading-none font-semibold tracking-[-0.03em] italic">
        {seat.name}
      </h3>
      <p className="mt-3 font-sans text-lg font-semibold">
        {seat.price}{" "}
        <span className="text-sm font-semibold text-night/60">
          {seat.cadence}
        </span>
      </p>
      <ul className="mt-5 flex flex-col gap-2">
        {seat.bullets.map((bullet) => (
          <li key={bullet} className="font-sans text-sm leading-snug text-night/80">
            {bullet}
          </li>
        ))}
      </ul>
      <p className="mt-5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
        Models
      </p>
      <p className="mt-1 font-mono text-xs leading-relaxed text-night/80">
        {seat.models.join(" · ")}
      </p>
      <p className="mt-6">
        {seat.cta.kind === "acid" ? (
          <Link
            href={seat.cta.href}
            className="inline-flex h-11 items-center rounded-md bg-acid px-4 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#14110F] hover:bg-acid-hover"
          >
            {seat.cta.label}
          </Link>
        ) : (
          <Link
            href={seat.cta.href}
            className="font-sans text-sm font-semibold text-night underline-offset-4 hover:underline"
          >
            {seat.cta.label}
          </Link>
        )}
      </p>
    </article>
  );
}

export function Seats() {
  return (
    <section
      id="seats"
      className="relative z-10 scroll-mt-28 py-10 md:py-14"
    >
      <PageInner>
        <SectionKicker
          index="06"
          kicker={SEATS_KICKER.kicker}
          title={SEATS_KICKER.title}
        >
          {SEATS_KICKER.body}
        </SectionKicker>
        <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {SEATS.map((seat) => (
            <li key={seat.id} className="min-w-0 pt-3 pr-3">
              <SeatTicket seat={seat} />
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-xl font-sans text-sm text-ink-soft">
          {SEATS_FOOTNOTE}
        </p>
      </PageInner>
    </section>
  );
}
