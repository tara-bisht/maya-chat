import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LobbyFooter } from "@/components/landing/lobby-footer";
import { LobbyHeader } from "@/components/landing/lobby-header";
import { MarketplaceBill } from "@/components/marketplace/wall";
import { getSessionUser } from "@/lib/auth/session";
import {
  MARKETPLACE_COPY,
  buildMarketplaceBill,
} from "@/lib/marketplace/bill";

export const metadata: Metadata = {
  title: "Marketplace · Maya Chat",
  description:
    "Eight agents now, four coming soon. Sign in to chat.",
};

export default async function MarketplacePage() {
  let signedIn = false;
  try {
    signedIn = Boolean(await getSessionUser());
  } catch {
    signedIn = false;
  }

  if (signedIn) {
    redirect("/explore");
  }

  const sections = buildMarketplaceBill();

  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-cream">
      <LobbyHeader
        signedIn={false}
        cta={{ href: "/login?next=/gallery", label: "Get started" }}
      />
      <MarketplaceBill
        sections={sections}
        signedIn={false}
        tilt
        kicker={MARKETPLACE_COPY.kicker}
        title={MARKETPLACE_COPY.title}
        body={MARKETPLACE_COPY.body}
      />
      <LobbyFooter />
    </div>
  );
}
