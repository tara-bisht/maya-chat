import Link from "next/link";
import { LOBBY_NAV } from "@/lib/landing";

export function LobbyHeader({
  signedIn = false,
  cta = { href: "#company", label: "Meet the company" },
}: {
  signedIn?: boolean;
  cta?: { href: string; label: string };
}) {
  return (
    <header className="relative z-20 px-4 py-5 md:px-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Link
          href="/"
          className="font-display text-3xl text-cream italic"
        >
          Maya
        </Link>
        <nav
          aria-label="Program"
          className="order-3 flex w-full flex-wrap gap-x-4 gap-y-1 md:order-none md:w-auto md:flex-1"
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
        <nav className="ml-auto flex items-center gap-3">
          {signedIn ? (
            <Link
              href="/gallery"
              className="px-3 py-2 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
            >
              Tonight&apos;s company
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-2 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          )}
          <Link
            href={cta.href}
            className="inline-flex h-11 items-center rounded-md bg-acid px-4 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#F6EFE4] hover:bg-acid-hover"
          >
            {cta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
