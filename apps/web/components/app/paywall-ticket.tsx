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
    <article className="w-full max-w-md rounded-xl bg-sheet p-6 text-sheet-ink">
      <p className="text-xs font-semibold text-ready">Plan</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-sheet-ink/80">{body}</p>
      <p className="mt-5">
        <Link
          href={href}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-night px-4 text-sm font-semibold text-cream"
        >
          {cta}
        </Link>
      </p>
    </article>
  );
}

export { studioCapCopy } from "@/lib/ui-copy";
