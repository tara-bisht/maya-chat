import Link from "next/link";
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
      <section className="px-4 py-16 md:px-8">
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
      </section>
    );
  }

  return (
    <main>
      <section className="relative z-10 px-4 py-6 md:px-8 md:py-10">
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
      </section>

      <section className="relative z-10 px-4 py-6 md:px-8 md:py-10">
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
      </section>

      {gallery.house.length > 0 ? (
        <section className="relative z-10 px-4 py-6 md:px-8 md:py-10">
          <SectionKicker kicker="Also on the wall" title="The house listing">
            Public custom roles. Their threads stay yours.
          </SectionKicker>
          <PlaybillWall players={gallery.house} tilt />
        </section>
      ) : null}
    </main>
  );
}
