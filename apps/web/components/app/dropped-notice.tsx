import Link from "next/link";
import { COPY } from "@/lib/ui-copy";
import { PageInner } from "./page-frame";

export function DroppedNotice({ retryHref }: { retryHref: string }) {
  return (
    <section className="py-16">
      <PageInner width="sheet">
        <p className="font-display text-3xl text-cream italic">{COPY.dropped}</p>
        <p className="mt-4">
          <Link
            href={retryHref}
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            {COPY.tryAgain}
          </Link>
        </p>
      </PageInner>
    </section>
  );
}
