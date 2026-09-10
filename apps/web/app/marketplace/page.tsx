import type { Metadata } from "next";
import { LobbyFooter } from "@/components/landing/lobby-footer";
import { LobbyHeader } from "@/components/landing/lobby-header";
import { SectionKicker } from "@/components/landing/section-kicker";
import {
  CategoryChips,
  MarketplaceWall,
} from "@/components/marketplace/wall";
import { getSessionUser } from "@/lib/auth/session";
import {
  MARKETPLACE_COPY,
  buildMarketplaceBill,
} from "@/lib/marketplace/bill";

export const metadata: Metadata = {
  title: "Marketplace · Maya Chat",
  description:
    "The bill. Eight players tonight, four on the next bill. Talk takes a wristband.",
};

export default async function MarketplacePage() {
  let signedIn = false;
  try {
    signedIn = Boolean(await getSessionUser());
  } catch {
    signedIn = false;
  }

  const sections = buildMarketplaceBill();

  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-cream">
      <LobbyHeader
        signedIn={signedIn}
        cta={
          signedIn
            ? { href: "/gallery", label: "Tonight's company" }
            : { href: "/login?next=/gallery", label: "Wristband check" }
        }
      />
      <main>
        <section className="relative z-10 px-4 pt-6 pb-4 md:px-8 md:pt-10">
          <SectionKicker
            kicker={MARKETPLACE_COPY.kicker}
            title={MARKETPLACE_COPY.title}
          >
            {MARKETPLACE_COPY.body}
          </SectionKicker>
          <CategoryChips categories={sections} />
        </section>

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="relative z-10 scroll-mt-8 px-4 py-6 md:px-8 md:py-10"
          >
            <SectionKicker kicker="Category" title={section.label}>
              {section.body}
            </SectionKicker>
            <MarketplaceWall players={section.players} signedIn={signedIn} />
          </section>
        ))}
      </main>
      <LobbyFooter />
    </div>
  );
}
