import { PaywallTicket, studioCapCopy } from "@/components/app/paywall-ticket";
import { CastingForm } from "@/components/studio/casting-form";
import { StudioSheet } from "@/components/studio/studio-sheet";
import { requireUser } from "@/lib/auth/session";
import { loadStudioContext } from "@/lib/studio/load";

export default async function StudioNewPage() {
  const user = await requireUser("/studio/new");
  const context = await loadStudioContext(user.id);

  if (!context) {
    return (
      <section className="px-4 py-16 md:px-8">
        <p className="font-display text-3xl text-cream italic">
          The line dropped.
        </p>
      </section>
    );
  }

  const atCap =
    context.maxCustomAgents !== null &&
    context.liveCustomCount >= context.maxCustomAgents;

  return (
    <StudioSheet kicker="Casting notes" title="Cast someone">
      {atCap ? (
        <PaywallTicket
          title="The sheet is full."
          body={studioCapCopy(context.maxCustomAgents, context.planDisplayName)}
          href="/login?next=/studio"
          cta="Wristband check"
        />
      ) : (
        <CastingForm
          agentId={null}
          planId={context.planId}
          planDisplayName={context.planDisplayName}
          maxCustomAgents={context.maxCustomAgents}
          toolsAllowed={context.toolsAllowed}
        />
      )}
    </StudioSheet>
  );
}
