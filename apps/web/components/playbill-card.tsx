import type { ReactNode } from "react";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { AgentPortrait } from "@/components/app/agent-portrait";
import {
  PLAYBILL_STAMP_LABEL,
  type Playbill,
  type PlaybillStamp,
} from "@/lib/gallery/playbill";

export const PLAYBILL_GRID_CLASS =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3";

export const PLAYBILL_CELL_CLASS = "min-w-0 h-full";

function stampLabel(stamp: PlaybillStamp, freeTier: boolean): string {
  return PLAYBILL_STAMP_LABEL[stamp ?? (freeTier ? "free" : "plus")];
}

export function PlaybillCard({
  player,
  footer,
}: {
  player: Playbill;
  footer?: ReactNode;
}) {
  const stamp = player.stamp ?? (player.freeTier ? "free" : "plus");
  const card = (
    <article className="flex h-full gap-3 rounded-xl border border-rule bg-panel p-3 hover:bg-raised">
      <span className="mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full">
        <AgentPortrait
          name={player.shortName}
          costume={player.costume}
          avatar={player.avatar}
          size="rail"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <h3 className="truncate text-sm font-semibold text-cream">
            {player.shortName}
          </h3>
          <span className="shrink-0 text-xs text-ink-soft">
            {stampLabel(stamp, player.freeTier)}
          </span>
        </span>
        <span className="mt-0.5 block text-xs text-ink-soft">{player.category}</span>
        <span className="mt-1 block text-sm leading-snug text-cream/85">
          {player.tagline}
        </span>
        {footer ? <span className="mt-2 block">{footer}</span> : null}
      </span>
    </article>
  );

  if (!player.href) {
    return card;
  }

  return (
    <Link href={player.href} className="group block h-full">
      {card}
    </Link>
  );
}

export function PlaybillWall({ players }: { players: Playbill[]; tilt?: boolean }) {
  return (
    <ul className={PLAYBILL_GRID_CLASS}>
      {players.map((player) => (
        <li key={player.id} className={PLAYBILL_CELL_CLASS}>
          <PlaybillCard player={player} />
        </li>
      ))}
    </ul>
  );
}

export function CompanyWall() {
  return (
    <PlaybillWall
      players={COMPANY.map((player) => ({
        id: player.id,
        shortName: player.shortName,
        tagline: player.tagline,
        category: player.category,
        costume: player.costume,
        avatar: player.avatar,
        freeTier: player.freeTier,
        stamp: player.freeTier ? "free" : "plus",
        href: null,
      }))}
    />
  );
}
