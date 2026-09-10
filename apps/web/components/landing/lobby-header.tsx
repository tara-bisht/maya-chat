import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { LOBBY_NAV } from "@/lib/landing";

export function LobbyHeader({
  signedIn = false,
  cta = { href: "#studio", label: "Create an agent" },
}: {
  signedIn?: boolean;
  cta?: { href: string; label: string };
}) {
  return (
    <header className="sticky top-0 z-30 bg-night py-2.5 md:py-0 md:pt-3 md:pb-2">
      <PageInner className="grid grid-cols-[1fr_auto] items-center gap-x-3 border-b border-rule pb-2.5 md:grid-cols-[1fr_auto_1fr] md:gap-x-4 md:rounded-md md:border-2 md:border-cream md:bg-night md:px-5 md:py-3 md:pb-3 md:shadow-[6px_6px_0_#FF4D2E]">
        <Link
          href="/"
          className="justify-self-start font-display text-3xl text-cream italic"
        >
          Maya
        </Link>
        <nav
          aria-label="Landing"
          className="hidden md:flex md:items-center md:justify-center md:gap-x-6"
        >
          {LOBBY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-1 py-2 font-sans text-sm font-semibold text-cream-dim underline-offset-4 hover:text-cream hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <nav className="flex items-center justify-end gap-2 justify-self-end md:gap-3">
          {signedIn ? (
            <Link
              href="/gallery"
              className="px-2 py-2 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline md:px-3"
            >
              Home
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-2 py-2 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline md:px-3"
            >
              Sign in
            </Link>
          )}
          <Link
            href={cta.href}
            className="inline-flex h-11 items-center rounded-md bg-acid px-3 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#F6EFE4] hover:bg-acid-hover md:px-4"
          >
            {cta.label}
          </Link>
        </nav>
      </PageInner>
    </header>
  );
}
