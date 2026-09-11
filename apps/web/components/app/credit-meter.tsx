import type { CreditBalance } from "@maya/shared";
import {
  COPY,
  creditsLeftLabel,
  creditsMonthLabel,
  creditsRailLabel,
  creditsResetLabel,
} from "@/lib/ui-copy";

function barWidth(credits: CreditBalance): number {
  if (credits.dailyLimit <= 0) {
    return 0;
  }
  return Math.min(
    100,
    Math.round((100 * credits.dailyRemaining) / credits.dailyLimit),
  );
}

function barIsLow(credits: CreditBalance): boolean {
  return (
    credits.dailyLimit > 0 &&
    credits.dailyRemaining / credits.dailyLimit <= 0.15
  );
}

export function CreditMeter({
  credits,
  variant,
}: {
  credits: CreditBalance;
  variant: "rail" | "compact" | "block";
}) {
  if (variant === "compact") {
    return (
      <p
        className="font-mono text-xs text-ink-soft"
        title={`${creditsRailLabel(credits.dailyRemaining, credits.dailyLimit)} · ${creditsResetLabel()}`}
      >
        {creditsLeftLabel(credits.dailyRemaining)}
      </p>
    );
  }

  if (variant === "block") {
    return (
      <section className="border-t border-rule pt-6">
        <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {COPY.credits}
        </p>
        <p className="mt-2 font-display text-2xl text-cream italic">
          {creditsLeftLabel(credits.dailyRemaining)}
        </p>
        <p className="mt-1 font-mono text-xs text-ink-soft">
          {creditsRailLabel(credits.dailyRemaining, credits.dailyLimit)}
        </p>
        <p className="mt-1 font-mono text-xs text-ink-soft">
          {creditsMonthLabel(credits.monthlyRemaining, credits.monthlyLimit)}
        </p>
        <p className="mt-1 font-sans text-sm text-ink-soft">
          {creditsResetLabel()}
        </p>
        <div className="mt-3 h-[3px] bg-rule">
          <div
            className={`h-full ${barIsLow(credits) ? "bg-acid" : "bg-cream"}`}
            style={{ width: `${barWidth(credits)}%` }}
          />
        </div>
      </section>
    );
  }

  return (
    <div className="shrink-0 border-t border-rule px-4 py-3">
      <p className="font-mono text-xs text-ink-soft">
        {creditsRailLabel(credits.dailyRemaining, credits.dailyLimit)}
      </p>
      <div className="mt-2 h-[3px] bg-rule">
        <div
          className={`h-full ${barIsLow(credits) ? "bg-acid" : "bg-cream"}`}
          style={{ width: `${barWidth(credits)}%` }}
        />
      </div>
    </div>
  );
}
