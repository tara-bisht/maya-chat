import { PageInner } from "@/components/app/page-frame";
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
import { getSessionUser } from "@/lib/auth/session";
import { COMPANY_KICKER } from "@/lib/landing";

export default async function Home() {
  let signedIn = false;
  try {
    signedIn = Boolean(await getSessionUser());
  } catch {
    signedIn = false;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-cream">
      <LobbyHeader signedIn={signedIn} />
      <Hero signedIn={signedIn} />

      <section
        id="company"
        className="relative z-10 scroll-mt-8 py-10 md:py-14"
      >
        <PageInner>
          <SectionKicker kicker={COMPANY_KICKER.kicker} title={COMPANY_KICKER.title}>
            {COMPANY_KICKER.body}
          </SectionKicker>
          <CompanyWall />
        </PageInner>
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
