import type { ReactNode } from "react";

export function SectionKicker({
  index,
  kicker,
  title,
  children,
}: {
  index?: string;
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        {index ? (
          <span className="inline-flex h-7 min-w-7 items-center justify-center bg-cream px-2 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night uppercase shadow-[2px_2px_0_#FF4D2E]">
            {index}
          </span>
        ) : null}
        <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
          {kicker}
        </p>
        <span aria-hidden className="h-px min-w-8 flex-1 bg-rule" />
      </div>
      <h2 className="mt-3 max-w-xl font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-cream italic md:text-[2.5rem]">
        {title}
      </h2>
      {children ? (
        <p className="mt-3 max-w-xl font-sans text-base leading-snug text-cream-dim">
          {children}
        </p>
      ) : null}
    </div>
  );
}
