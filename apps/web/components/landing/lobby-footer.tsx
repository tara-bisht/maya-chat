import Link from "next/link";
import { FOOTER, LOBBY_NAV } from "@/lib/landing";

export function LobbyFooter() {
  return (
    <footer className="relative z-10 mx-4 mb-10 rotate-[-0.6deg] border-2 border-dashed border-night bg-stub px-5 py-5 text-on-stub shadow-[6px_6px_0_#FF4D2E] md:mx-8">
      <p className="font-display text-2xl italic">{FOOTER.wordmark}</p>
      <p className="mt-1 max-w-xl font-sans text-sm font-semibold">
        {FOOTER.tagline}
      </p>
      <nav
        aria-label="Footer"
        className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        {LOBBY_NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="font-sans text-sm font-semibold underline-offset-4 hover:underline"
          >
            {item.label}
          </a>
        ))}
        <a
          href="#notes"
          className="font-sans text-sm font-semibold underline-offset-4 hover:underline"
        >
          Notes
        </a>
        <Link
          href="/login"
          className="font-sans text-sm font-semibold underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </nav>
    </footer>
  );
}
