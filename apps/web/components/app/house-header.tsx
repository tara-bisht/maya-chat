import Link from "next/link";
import { WristbandLink } from "./wristband-link";

export function HouseHeader() {
  return (
    <header className="relative z-20 px-4 py-5 md:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/gallery"
          className="font-display text-3xl text-cream italic"
        >
          Maya
        </Link>
        <div className="ml-auto flex items-center gap-4">
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
      </div>
    </header>
  );
}
