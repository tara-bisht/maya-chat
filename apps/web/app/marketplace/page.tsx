import type { Metadata } from "next";
import { PageInner } from "@/components/app/page-frame";
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
        <section className="relative z-10 pt-6 pb-4 md:pt-10">
          <PageInner>
            <SectionKicker
              kicker={MARKETPLACE_COPY.kicker}
              title={MARKETPLACE_COPY.title}
            >
              {MARKETPLACE_COPY.body}
            </SectionKicker>
            <CategoryChips categories={sections} />
          </PageInner>
        </section>

        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="relative z-10 scroll-mt-8 py-6 md:py-10"
          >
            <PageInner>
              <SectionKicker kicker="Category" title={section.label}>
                {section.body}
              </SectionKicker>
              <MarketplaceWall players={section.players} signedIn={signedIn} />
            </PageInner>
          </section>
        ))}
      </main>
      <LobbyFooter />
    </div>
  );
}
