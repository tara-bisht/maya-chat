import type { PlanTicket } from "@/lib/plan/load";
import { formatModelsSummary, priceLabel } from "@/lib/plan/present";
import { BillingCta } from "./billing-cta";

const AGENTS_LINE = "Unlimited custom agents, public or private";

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
  return (
    <article className="flex h-full flex-col rounded-xl border border-rule bg-sheet p-5 text-sheet-ink">
      <p className="text-xs font-medium text-sheet-ink/60">
        {ticket.current ? "Current plan" : "Plan"}
      </p>
      <h3 className="mt-1 font-sans text-[2rem] leading-none font-semibold tracking-[-0.03em] ">
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
          {AGENTS_LINE}
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
        {formatModelsSummary(ticket.models, ticket.id)}
      </p>
      {ticket.cta ? (
        <BillingCta
          kind={ticket.cta.kind}
          planId={ticket.id === "free" ? undefined : ticket.id}
          label={ticket.cta.label}
          highlighted={
            ticket.highlighted || (ticket.current && ticket.id === "pro")
          }
        />
      ) : null}
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
