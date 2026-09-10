import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { HERO } from "@/lib/landing";

export function Hero({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <section className="relative z-10 pt-6 pb-4 md:pt-10">
      <PageInner>
        <h1 className="max-w-[16ch] font-display text-[clamp(3.25rem,11vw,5.75rem)] leading-[0.92] font-medium tracking-[-0.04em] text-cream italic">
          {HERO.title}
        </h1>
        <p className="mt-6 max-w-xl font-sans text-lg leading-snug text-cream-dim">
          {HERO.body}
        </p>
        <p className="mt-6 inline-block bg-stub px-3 py-1.5 font-sans text-[11px] font-extrabold tracking-[0.08em] text-on-stub uppercase shadow-[3px_3px_0_#FF4D2E]">
          {HERO.sticker}
        </p>
        <p className="mt-5 font-sans text-sm font-semibold text-stub">
          {HERO.lineup}
        </p>
        <p className="mt-3">
          <Link
            href={signedIn ? "/gallery" : "/login"}
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            {signedIn ? "Tonight's company" : "Wristband check"}
          </Link>
        </p>
      </PageInner>
    </section>
  );
}
