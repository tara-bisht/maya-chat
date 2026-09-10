import type { CSSProperties, ReactNode } from "react";

export function StudioSheet({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="relative z-10 px-4 py-8 md:px-8 md:py-12">
      <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-ink-soft uppercase">
        {kicker}
      </p>
      <article
        className="ticket mt-4 w-full max-w-[40rem] bg-cream p-6 text-night"
        style={
          {
            borderRadius: 10,
            "--ticket-shadow": "8px 8px 0 #FF4D2E",
            "--ticket-shadow-hover": "8px 8px 0 #FF4D2E",
          } as CSSProperties
        }
      >
        <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-[-0.03em] italic">
          {title}
        </h1>
        <div className="mt-6">{children}</div>
      </article>
    </section>
  );
}
