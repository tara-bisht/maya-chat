import Link from "next/link";
import { PlaybillWall } from "@/components/playbill-card";
import { SectionKicker } from "@/components/landing/section-kicker";
import { requireUser } from "@/lib/auth/session";
import { loadOwnRoles, loadStudioContext } from "@/lib/studio/load";

export default async function StudioIndexPage() {
  const user = await requireUser("/studio");
  const [context, roles] = await Promise.all([
    loadStudioContext(user.id),
    loadOwnRoles(user.id),
  ]);

  if (!context || !roles.ok) {
    return (
      <section className="px-4 py-16 md:px-8">
        <p className="font-display text-3xl text-cream italic">
          The line dropped.
        </p>
      </section>
    );
  }

  const capLabel =
    context.maxCustomAgents === null
      ? `${context.liveCustomCount} roles · ${context.planDisplayName} does not count`
      : `${context.liveCustomCount} of ${context.maxCustomAgents} roles`;

  return (
    <main>
      <section className="relative z-10 px-4 py-6 md:px-8 md:py-10">
        <SectionKicker kicker="Casting notes" title="Your roles">
          {capLabel}
        </SectionKicker>
        <p className="mb-8">
          <Link
            href="/studio/new"
            className="inline-flex h-11 items-center justify-center rounded-md bg-acid px-5 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#F6EFE4]"
          >
            Cast someone
          </Link>
        </p>
        {roles.playbills.length === 0 ? (
          <p className="font-sans text-base text-cream-dim">
            No one on the wall yet.
          </p>
        ) : (
          <PlaybillWall players={roles.playbills} tilt />
        )}
      </section>
    </main>
  );
}
