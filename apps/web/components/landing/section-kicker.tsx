import type { ReactNode } from "react";

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
    <div className="mb-8 max-w-xl">
      <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
        {kicker}
      </p>
      <h2 className="mt-2 font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-cream italic md:text-[2.5rem]">
        {title}
      </h2>
      {children ? (
        <p className="mt-3 font-sans text-base leading-snug text-cream-dim">
          {children}
        </p>
      ) : null}
    </div>
  );
}
