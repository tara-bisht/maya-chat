import { DroppedNotice } from "@/components/app/dropped-notice";
import { PaywallTicket, studioCapCopy } from "@/components/app/paywall-ticket";
import { CastingForm } from "@/components/studio/casting-form";
import { StudioSheet } from "@/components/studio/studio-sheet";
import { requireUser } from "@/lib/auth/session";
import { loadStudioContext } from "@/lib/studio/load";
import { COPY } from "@/lib/ui-copy";

export default async function StudioNewPage() {
  const user = await requireUser("/studio/new");
  const context = await loadStudioContext(user.id);

  if (!context) {
    return <DroppedNotice retryHref="/studio/new" />;
  }

  const atCap =
    context.maxCustomAgents !== null &&
    context.liveCustomCount >= context.maxCustomAgents;

  return (
    <StudioSheet kicker={COPY.createAgent} title={COPY.newAgent}>
      {atCap ? (
        <PaywallTicket
          title={COPY.agentLimit}
          body={studioCapCopy(context.maxCustomAgents, context.planDisplayName)}
          href="/#seats"
          cta={COPY.upgrade}
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
