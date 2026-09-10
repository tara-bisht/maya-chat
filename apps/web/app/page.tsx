import { CompanyWall } from "@/components/playbill-card";
import { Hero } from "@/components/landing/hero";
import { HouseSteps } from "@/components/landing/house-steps";
import { LobbyFooter } from "@/components/landing/lobby-footer";
import { LobbyHeader } from "@/components/landing/lobby-header";
import { Nights } from "@/components/landing/nights";
import { Notes } from "@/components/landing/notes";
import { Seats } from "@/components/landing/seats";
import { SectionKicker } from "@/components/landing/section-kicker";
import { StudioSheet } from "@/components/landing/studio-sheet";
import { COMPANY_KICKER } from "@/lib/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-night text-cream">
      <LobbyHeader />
      <Hero />

      <section
        id="company"
        className="relative z-10 scroll-mt-8 px-4 py-10 md:px-8 md:py-14"
      >
        <SectionKicker kicker={COMPANY_KICKER.kicker} title={COMPANY_KICKER.title}>
          {COMPANY_KICKER.body}
        </SectionKicker>
        <CompanyWall />
      </section>

      <Nights />
      <HouseSteps />
      <StudioSheet />
      <Seats />
      <Notes />
      <LobbyFooter />
    </div>
  );
}
