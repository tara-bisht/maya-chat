import type { CSSProperties } from "react";
import { COMPANY, COSTUME_CLASS, type CompanyPlayer } from "@/lib/company";

const TILTS = [-2.8, 2.4, -1.6, 3.2, -2.2, 1.8, -3.1, 2.1];

export function PlaybillCard({
  player,
  index,
}: {
  player: CompanyPlayer;
  index: number;
}) {
  return (
    <article
      className={`poster relative flex h-full flex-col gap-3 p-4 text-cream ${COSTUME_CLASS[player.costume]}`}
      style={
        {
          borderRadius: 10,
          "--tilt": `${TILTS[index % TILTS.length]}deg`,
        } as CSSProperties
      }
    >
      {!player.freeTier ? (
        <span className="absolute -top-2 -right-2 z-10 rotate-[-8deg] bg-stub px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-on-stub uppercase shadow-[3px_3px_0_#F6EFE4]">
          Plus
        </span>
      ) : (
        <span className="absolute -top-2 -right-2 z-10 rotate-[-6deg] bg-cream px-2 py-1 font-sans text-[11px] font-extrabold tracking-[0.08em] text-night uppercase shadow-[3px_3px_0_#FF4D2E]">
          Free
        </span>
      )}
      <div className="overflow-hidden rounded-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={player.avatar}
          alt=""
          width={480}
          height={480}
          className="aspect-square w-full scale-[1.12] object-cover object-[center_18%]"
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
    </article>
  );
}

export function CompanyWall() {
  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {COMPANY.map((player, index) => (
        <li
          key={player.id}
          className={index % 2 === 1 ? "lg:translate-y-8" : ""}
        >
          <PlaybillCard player={player} index={index} />
        </li>
      ))}
    </ul>
  );
}
