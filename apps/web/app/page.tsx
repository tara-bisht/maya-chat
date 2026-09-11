import { PageInner } from "@/components/app/page-frame";
import { CompanyWall } from "@/components/playbill-card";
import { Hero } from "@/components/landing/hero";
import { HouseOpen } from "@/components/landing/house-open";
import { HouseSteps } from "@/components/landing/house-steps";
import { LobbyFooter } from "@/components/landing/lobby-footer";
import { LobbyHeader } from "@/components/landing/lobby-header";
import { Nights } from "@/components/landing/nights";
import { Notes } from "@/components/landing/notes";
import { Seats } from "@/components/landing/seats";
import { LandingHeading } from "@/components/landing/section-kicker";
import { StudioSheet } from "@/components/landing/studio-sheet";
import { Usual } from "@/components/landing/usual";
import { getSessionUser } from "@/lib/auth/session";
import { COMPANY_KICKER } from "@/lib/landing";
import { loadPublicSeats } from "@/lib/landing/load-seats";

export default async function Home() {
  let signedIn = false;
  try {
    signedIn = Boolean(await getSessionUser());
  } catch {
    signedIn = false;
  }
  const seats = await loadPublicSeats();

  return (
    <div className="min-h-screen overflow-x-clip bg-night text-cream">
      <LobbyHeader signedIn={signedIn} />
      <Hero />

      <section
        id="company"
        className="relative z-10 scroll-mt-28 py-10 md:py-14"
      >
        <PageInner>
          <LandingHeading title={COMPANY_KICKER.title}>
            {COMPANY_KICKER.body}
          </LandingHeading>
          <CompanyWall />
        </PageInner>
      </section>

      <Usual />
      <Nights />
      <HouseSteps />
      <StudioSheet />
      <Seats seats={seats} />
      <Notes />
      <HouseOpen />
      <LobbyFooter />
    </div>
  );
}
