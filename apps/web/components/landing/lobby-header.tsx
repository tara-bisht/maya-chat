import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { LOBBY_NAV } from "@/lib/landing";

export function LobbyHeader({
  signedIn = false,
  cta = { href: "#company", label: "Meet the agents" },
}: {
  signedIn?: boolean;
  cta?: { href: string; label: string };
}) {
  return (
    <header className="relative z-20 py-5">
      <PageInner className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="justify-self-start font-display text-3xl text-cream italic"
        >
          Maya
        </Link>
        <nav
          aria-label="Landing"
          className="order-3 col-span-2 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-1 md:order-none md:col-span-1 md:w-auto"
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
        <nav className="flex flex-wrap items-center justify-end gap-3 justify-self-end">
          {signedIn ? (
            <Link
              href="/gallery"
              className="px-3 py-2 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
            >
              Home
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
      </PageInner>
    </header>
  );
}
