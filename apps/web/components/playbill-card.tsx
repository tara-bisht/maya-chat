import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { COMPANY, COSTUME_CLASS } from "@/lib/company";
import { AgentPortrait } from "@/components/app/agent-portrait";
import {
  PLAYBILL_STAMP_LABEL,
  type Playbill,
  type PlaybillStamp,
} from "@/lib/gallery/playbill";

const POSTER_TILTS = [-2.4, 1.6, -1.1, 2.8, -3, 1.2, 2.2, -1.8] as const;

export const PLAYBILL_GRID_CLASS =
  "grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:gap-x-10 md:gap-y-14 lg:grid-cols-3 xl:grid-cols-4";

export const PLAYBILL_CELL_CLASS = "min-w-0 h-full pt-4 pr-4 pb-2";

function stampClass(stamp: PlaybillStamp): string {
  if (stamp === "next-bill") {
    return "bg-rule text-cream shadow-[3px_3px_0_#F6EFE4] rotate-[-4deg]";
  }
  if (stamp === "plus" || stamp === "private") {
    return "bg-stub text-on-stub shadow-[3px_3px_0_#F6EFE4] rotate-[-8deg]";
  }
  return "bg-cream text-night shadow-[3px_3px_0_#FF4D2E] rotate-[-6deg]";
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
    <article
      className={`poster relative flex h-full flex-col gap-3 p-4 text-cream ${COSTUME_CLASS[player.costume]}`}
      style={{ borderRadius: 10 }}
    >
      <span
        className={`absolute -top-2 -right-2 z-10 px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] uppercase ${stampClass(stamp)}`}
      >
        {PLAYBILL_STAMP_LABEL[stamp]}
      </span>
      <div className="overflow-hidden rounded-md">
        <AgentPortrait
          name={player.shortName}
          costume={player.costume}
          avatar={player.avatar}
        />
      </div>
      <p className="font-sans text-[11px] font-extrabold tracking-[0.08em] text-cream/80 uppercase">
        {player.category}
      </p>
      <h3 className="font-display text-[2rem] leading-none font-semibold tracking-[-0.03em] text-cream italic">
        {player.shortName}
      </h3>
      <p className="font-sans text-sm leading-snug text-cream/90">
        {player.tagline}
      </p>
      {footer ? (
        <div className="mt-auto border-t border-cream/20 pt-3">{footer}</div>
      ) : null}
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

export function PlaybillWall({
  players,
  tilt = false,
}: {
  players: Playbill[];
  tilt?: boolean;
}) {
  return (
    <ul className={PLAYBILL_GRID_CLASS}>
      {players.map((player, index) => {
        const deg = POSTER_TILTS[index % POSTER_TILTS.length];
        const style = tilt
          ? ({ "--tilt": `${deg}deg` } as CSSProperties)
          : undefined;
        return (
          <li key={player.id} className={PLAYBILL_CELL_CLASS} style={style}>
            <PlaybillCard player={player} />
          </li>
        );
      })}
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
