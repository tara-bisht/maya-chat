"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function WristbandLink() {
  const pathname = usePathname();
  const active = pathname === "/settings";

  return (
    <Link
      href="/settings"
      className={`px-3 py-2 font-sans text-sm font-semibold underline-offset-4 hover:underline ${
        active ? "text-cream" : "text-ink-soft"
      }`}
    >
      Wristband
    </Link>
  );
}
