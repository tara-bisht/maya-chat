import Link from "next/link";
import { PageInner } from "./page-frame";
import { WristbandLink } from "./wristband-link";

export function HouseHeader() {
  return (
    <header className="relative z-20 py-5">
      <PageInner className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Link
          href="/gallery"
          className="font-display text-3xl text-cream italic"
        >
          Maya
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href="/marketplace"
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            Marketplace
          </Link>
          <Link
            href="/studio"
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            Casting notes
          </Link>
          <WristbandLink />
        </div>
      </PageInner>
    </header>
  );
}
