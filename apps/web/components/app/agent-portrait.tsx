import { COSTUME_CLASS, type PosterCostumeId } from "@/lib/company";

export function AgentPortrait({
  name,
  costume,
  avatar,
  size = "poster",
}: {
  name: string;
  costume: PosterCostumeId;
  avatar: string;
  size?: "poster" | "rail";
}) {
  const letter = (name.trim()[0] ?? "?").toLocaleUpperCase();

  if (size === "rail") {
    if (avatar) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-md object-cover"
        />
      );
    }
    return (
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-md ${COSTUME_CLASS[costume]}`}
      >
        <span className="font-display text-sm leading-none text-cream italic">
          {letter}
        </span>
      </div>
    );
  }

  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt=""
        width={480}
        height={480}
        className="aspect-square w-full scale-[1.12] object-cover object-[center_18%]"
      />
    );
  }

  return (
    <div
      className={`flex aspect-square w-full items-center justify-center ${COSTUME_CLASS[costume]}`}
    >
      <span className="font-display text-6xl leading-none text-cream italic">
        {letter}
      </span>
    </div>
  );
}
