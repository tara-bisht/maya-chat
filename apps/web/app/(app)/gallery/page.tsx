import Link from "next/link";
import { ContinueChats } from "@/components/app/recent-chats";
import { DroppedNotice } from "@/components/app/dropped-notice";
import { GalleryJumps } from "@/components/app/gallery-jumps";
import { PageInner } from "@/components/app/page-frame";
import { PlaybillWall } from "@/components/playbill-card";
import { LandingHeading } from "@/components/landing/section-kicker";
import { requireUser } from "@/lib/auth/session";
import { loadGallery } from "@/lib/gallery/load";
import { COPY } from "@/lib/ui-copy";

export default async function GalleryPage() {
  const user = await requireUser();
  const gallery = await loadGallery(user.id);

  if (!gallery.ok) {
    return <DroppedNotice retryHref="/gallery" />;
  }

  const jumps = [
    gallery.recents.length > 0
      ? { href: "#continue", label: "Continue" }
      : null,
    { href: "#featured", label: "Featured" },
    { href: "#your-agents", label: COPY.yourAgents },
    gallery.house.length > 0
      ? { href: "#from-others", label: COPY.fromOthers }
      : null,
  ].filter((item): item is { href: string; label: string } => item !== null);

  return (
    <main>
      <GalleryJumps items={jumps} />

      {gallery.recents.length > 0 ? (
        <section
          id="continue"
          className="relative z-10 scroll-mt-14 py-6 md:py-8"
        >
          <PageInner>
            <LandingHeading title={COPY.continueChatting} />
            <ContinueChats recents={gallery.recents} />
          </PageInner>
        </section>
      ) : null}

      <section
        id="featured"
        className="relative z-10 scroll-mt-14 py-6 md:py-10"
      >
        <PageInner>
          <LandingHeading title={COPY.featured}>
            {COPY.featuredBody}
          </LandingHeading>
          {gallery.curated.length === 0 ? (
            <p className="font-sans text-base text-cream-dim">
              No featured agents yet.
            </p>
          ) : (
            <PlaybillWall players={gallery.curated} />
          )}
        </PageInner>
      </section>

      <section
        id="your-agents"
        className="relative z-10 scroll-mt-14 py-6 md:py-10"
      >
        <PageInner>
          <LandingHeading title={COPY.yourAgents}>
            Agents you created. Edit them from Profile.
          </LandingHeading>
          {gallery.custom.length === 0 ? (
            <p className="font-sans text-base text-cream-dim">
              {COPY.yourAgentsEmpty}{" "}
              <Link
                href="/studio/new"
                className="font-semibold text-acid underline-offset-4 hover:underline"
              >
                {COPY.createAgent}
              </Link>
              .
            </p>
          ) : (
            <PlaybillWall players={gallery.custom} />
          )}
        </PageInner>
      </section>

      {gallery.house.length > 0 ? (
        <section
          id="from-others"
          className="relative z-10 scroll-mt-14 py-6 md:py-10"
        >
          <PageInner>
            <LandingHeading title={COPY.fromOthers}>
              Public custom agents. Your chats with them stay private.
            </LandingHeading>
            <PlaybillWall players={gallery.house} />
          </PageInner>
        </section>
      ) : null}
    </main>
  );
}
