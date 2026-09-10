import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
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
      <section className="py-16">
        <PageInner width="sheet">
          <p className="font-display text-3xl text-cream italic">
            The line dropped.
          </p>
        </PageInner>
      </section>
    );
  }

  const capLabel =
    context.maxCustomAgents === null
      ? `${context.liveCustomCount} roles · ${context.planDisplayName} does not count`
      : `${context.liveCustomCount} of ${context.maxCustomAgents} roles`;

  const hasRoles = roles.playbills.length > 0;

  return (
    <main>
      <section className="relative z-10 py-6 md:py-10">
        <PageInner width={hasRoles ? "stage" : "sheet"}>
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
          {hasRoles ? (
            <PlaybillWall players={roles.playbills} tilt />
          ) : (
            <p className="font-sans text-base text-cream-dim">
              No one on the wall yet.
            </p>
          )}
        </PageInner>
      </section>
    </main>
  );
}
