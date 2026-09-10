import type { Metadata } from "next";
import { MarketplaceBill } from "@/components/marketplace/wall";
import {
  MARKETPLACE_COPY,
  buildMarketplaceBill,
} from "@/lib/marketplace/bill";

export const metadata: Metadata = {
  title: "Explore · Maya",
};

export default function ExplorePage() {
  const sections = buildMarketplaceBill();

  return (
    <MarketplaceBill
      sections={sections}
      signedIn
      tilt={false}
      kicker={MARKETPLACE_COPY.kicker}
      title={MARKETPLACE_COPY.title}
      body={MARKETPLACE_COPY.signedInBody}
    />
  );
}
