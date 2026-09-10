import Link from "next/link";

export function PaywallTicket({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <article
      className="ticket relative max-w-md bg-cream p-6 text-night"
      style={{ borderRadius: 10, boxShadow: "8px 8px 0 #FF4D2E" }}
    >
      <span className="absolute -top-2 -right-2 rotate-[-8deg] bg-stub px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-on-stub uppercase shadow-[3px_3px_0_#14110F]">
        Seat
      </span>
      <h2 className="font-display text-3xl leading-none font-semibold tracking-[-0.03em] italic">
        {title}
      </h2>
      <p className="mt-3 font-sans text-base leading-snug text-night/80">{body}</p>
      <p className="mt-5">
        <Link
          href={href}
          className="inline-flex h-11 items-center justify-center rounded-md bg-acid px-4 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#14110F]"
        >
          {cta}
        </Link>
      </p>
    </article>
  );
}

export function studioCapCopy(max: number | null, planName: string): string {
  if (max === null) {
    return `${planName} does not count roles.`;
  }
  return `${max} role${max === 1 ? "" : "s"} on ${planName}. Archive someone, or take a better seat.`;
}
