import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { FOOTER, LOBBY_NAV } from "@/lib/landing";

export function LobbyFooter() {
  return (
    <footer className="relative z-10 mb-10">
      <PageInner>
        <div className="rounded-xl border border-rule bg-panel px-5 py-5 text-cream">
          <p className="font-sans text-2xl ">{FOOTER.wordmark}</p>
          <p className="mt-1 max-w-xl font-sans text-sm font-semibold">
            {FOOTER.tagline}
          </p>
          <nav
            aria-label="Footer"
            className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            {LOBBY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-sm font-semibold underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#notes"
              className="font-sans text-sm font-semibold underline-offset-4 hover:underline"
            >
              FAQ
            </Link>
            <Link
              href="/login"
              className="font-sans text-sm font-semibold underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </PageInner>
    </footer>
  );
}
