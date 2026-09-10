import type { CSSProperties } from "react";
import Link from "next/link";
import { PlaybillCard } from "@/components/playbill-card";
import {
  talkHref,
  type MarketplacePlayer,
} from "@/lib/marketplace/bill";

const POSTER_TILTS = [-2.4, 1.6, -1.1, 2.8, -3, 1.2, 2.2, -1.8] as const;

export function MarketplaceWall({
  players,
  signedIn,
}: {
  players: MarketplacePlayer[];
  signedIn: boolean;
}) {
  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {players.map((player, index) => {
        const deg = POSTER_TILTS[index % POSTER_TILTS.length];
        const href = talkHref(player, signedIn);
        return (
          <li
            key={player.id}
            style={{ "--tilt": `${deg}deg` } as CSSProperties}
          >
            <PlaybillCard
              player={{
                id: player.id,
                shortName: player.shortName,
                tagline: player.tagline,
                category: player.category,
                costume: player.costume,
                avatar: player.avatar,
                freeTier: player.freeTier,
                stamp:
                  player.status === "coming_soon"
                    ? "next-bill"
                    : player.freeTier
                      ? "free"
                      : "plus",
                href: null,
              }}
            />
            {href ? (
              <p className="mt-3">
                <Link
                  href={href}
                  className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
                >
                  Talk
                </Link>
              </p>
            ) : (
              <p className="mt-3 font-sans text-sm font-semibold text-ink-soft">
                Not on tonight&apos;s bill
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function CategoryChips({
  categories,
}: {
  categories: readonly { id: string; label: string }[];
}) {
  return (
    <nav
      aria-label="Categories"
      className="mb-10 flex flex-wrap gap-x-4 gap-y-2"
    >
      {categories.map((category) => (
        <a
          key={category.id}
          href={`#${category.id}`}
          className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream-dim uppercase underline-offset-4 hover:text-cream hover:underline"
        >
          {category.label}
        </a>
      ))}
    </nav>
  );
}
