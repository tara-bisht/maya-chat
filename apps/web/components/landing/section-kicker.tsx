import type { ReactNode } from "react";

const TITLE_CLASS =
  "max-w-xl font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-cream italic md:text-[2.5rem]";

const BODY_CLASS = "mt-3 max-w-xl font-sans text-base leading-snug text-cream-dim";

/** Lobby section title. Claims only — no numbered act, no document kicker. */
export function LandingHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className={TITLE_CLASS}>{title}</h2>
      {children ? <p className={BODY_CLASS}>{children}</p> : null}
    </div>
  );
}

export function SectionKicker({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {kicker}
        </p>
        <span aria-hidden className="h-px min-w-8 flex-1 bg-rule" />
      </div>
      <h2 className={`mt-3 ${TITLE_CLASS}`}>{title}</h2>
      {children ? <p className={BODY_CLASS}>{children}</p> : null}
    </div>
  );
}
