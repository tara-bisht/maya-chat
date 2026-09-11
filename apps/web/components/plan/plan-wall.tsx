import type { CSSProperties } from "react";
import type { PlanTicket } from "@/lib/plan/load";
import { priceLabel } from "@/lib/plan/present";

const CHECKOUT_TITLE = "Stripe checkout lands in PR4c.";
const CHECKOUT_LABEL = "Checkout opens soon";

function agentsLine(ticket: PlanTicket): string {
  const scope = ticket.id === "free" ? "public" : "public or private";
  if (ticket.maxCustomAgents === null) {
    return `Unlimited custom agents, ${scope}`;
  }
  const noun = ticket.maxCustomAgents === 1 ? "agent" : "agents";
  return `${ticket.maxCustomAgents} custom ${noun}, ${scope}`;
}

function cadenceLabel(ticket: PlanTicket): string | null {
  if (ticket.monthlyCents === 0) {
    return "No bill";
  }
  if (ticket.yearlyCents === null) {
    return "/ month";
  }
  const yearly = ticket.yearlyCents / 100;
  const yearlyLabel = Number.isInteger(yearly)
    ? `$${yearly}`
    : `$${yearly.toFixed(2)}`;
  return `/ month · ${yearlyLabel} / year`;
}

function PlanTicketCard({ ticket }: { ticket: PlanTicket }) {
  const stamp = ticket.current ? "Current" : ticket.displayName;
  const stampClass =
    ticket.current || ticket.highlighted
      ? "bg-stub text-on-stub shadow-[3px_3px_0_#14110F]"
      : "bg-cream text-night shadow-[3px_3px_0_#FF4D2E] border-2 border-night";

  return (
    <article
      className="ticket relative flex h-full flex-col bg-cream p-5 text-night"
      style={
        {
          borderRadius: 14,
          "--ticket-shadow": ticket.highlighted
            ? "8px 8px 0 #FF4D2E"
            : "8px 8px 0 #F6EFE4",
          "--ticket-shadow-hover": ticket.highlighted
            ? "11px 11px 0 #FF4D2E"
            : "11px 11px 0 #F6EFE4",
        } as CSSProperties
      }
    >
      <span
        className={`absolute -top-2 -right-2 z-10 px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase ${stampClass}`}
      >
        {stamp}
      </span>
      <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
        Plan
      </p>
      <h3 className="mt-1 font-display text-[2rem] leading-none font-semibold tracking-[-0.03em] italic">
        {ticket.displayName}
      </h3>
      <p className="mt-3 font-sans text-lg font-semibold">
        {priceLabel(ticket.monthlyCents)}{" "}
        {cadenceLabel(ticket) ? (
          <span className="text-sm font-semibold text-night/60">
            {cadenceLabel(ticket)}
          </span>
        ) : null}
      </p>
      <ul className="mt-5 flex flex-col gap-2">
        <li className="font-sans text-sm leading-snug text-night/80">
          {ticket.dailyCredits.toLocaleString("en-US")} credits a day ·{" "}
          {ticket.monthlyCredits.toLocaleString("en-US")} a month
        </li>
        <li className="font-sans text-sm leading-snug text-night/80">
          {agentsLine(ticket)}
        </li>
        <li className="font-sans text-sm leading-snug text-night/80">
          {ticket.vectorMemory
            ? "Private per-agent memory"
            : "No vector memory"}
        </li>
      </ul>
      <p className="mt-5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night/60 uppercase">
        Models
      </p>
      <p className="mt-1 font-mono text-xs leading-relaxed text-night/80">
        {ticket.models.length > 0 ? ticket.models.join(" · ") : "—"}
      </p>
      {ticket.current ? null : (
        <p className="mt-6">
          {ticket.highlighted ? (
            <button
              type="button"
              disabled
              title={CHECKOUT_TITLE}
              className="inline-flex h-11 items-center rounded-md bg-acid px-4 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#14110F] disabled:opacity-40"
            >
              {CHECKOUT_LABEL}
            </button>
          ) : (
            <button
              type="button"
              disabled
              title={CHECKOUT_TITLE}
              className="font-sans text-sm font-semibold text-night/40"
            >
              {CHECKOUT_LABEL}
            </button>
          )}
        </p>
      )}
    </article>
  );
}

export function PlanWall({ plans }: { plans: PlanTicket[] }) {
  return (
    <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
      {plans.map((ticket) => (
        <li key={ticket.id} className="min-w-0 pt-3 pr-3">
          <PlanTicketCard ticket={ticket} />
        </li>
      ))}
    </ul>
  );
}
