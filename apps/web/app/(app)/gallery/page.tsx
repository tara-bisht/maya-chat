import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { PlaybillWall } from "@/components/playbill-card";
import { SectionKicker } from "@/components/landing/section-kicker";
import { requireUser } from "@/lib/auth/session";
import { loadGallery } from "@/lib/gallery/load";
import { createClient } from "@/lib/supabase/server";

export default async function GalleryPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const gallery = await loadGallery(supabase, user.id);

  if (!gallery.ok) {
    return (
      <section className="py-16">
        <PageInner width="sheet">
          <p className="font-display text-3xl text-cream italic">
            The line dropped.
          </p>
          <p className="mt-4">
            <Link
              href="/gallery"
              className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
            >
              Try again
            </Link>
          </p>
        </PageInner>
      </section>
    );
  }

  return (
    <main>
      <section className="relative z-10 py-6 md:py-10">
        <PageInner>
          <SectionKicker kicker="The lineup" title="Tonight's company">
            Two players on Free. Six stamped Plus. Locked posters stay on the
            wall.
          </SectionKicker>
          {gallery.curated.length === 0 ? (
            <p className="font-sans text-base text-cream-dim">
              The company has not posted yet.
            </p>
          ) : (
            <PlaybillWall players={gallery.curated} tilt />
          )}
        </PageInner>
      </section>

      <section className="relative z-10 py-6 md:py-10">
        <PageInner>
          <SectionKicker kicker="Your roles" title="On your wall">
            Players you cast in Studio land here.
          </SectionKicker>
          {gallery.custom.length === 0 ? (
            <p className="font-sans text-base text-cream-dim">
              No one on the wall yet.{" "}
              <Link
                href="/studio/new"
                className="font-semibold text-acid underline-offset-4 hover:underline"
              >
                Cast someone
              </Link>
              .
            </p>
          ) : (
            <PlaybillWall players={gallery.custom} tilt />
          )}
        </PageInner>
      </section>

      {gallery.house.length > 0 ? (
        <section className="relative z-10 py-6 md:py-10">
          <PageInner>
            <SectionKicker kicker="Also on the wall" title="The house listing">
              Public custom roles. Their threads stay yours.
            </SectionKicker>
            <PlaybillWall players={gallery.house} tilt />
          </PageInner>
        </section>
      ) : null}
    </main>
  );
}
