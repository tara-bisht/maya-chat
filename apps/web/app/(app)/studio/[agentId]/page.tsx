import { notFound } from "next/navigation";
import { PageInner } from "@/components/app/page-frame";
import { CastingForm } from "@/components/studio/casting-form";
import { StudioSheet } from "@/components/studio/studio-sheet";
import { requireUser } from "@/lib/auth/session";
import { loadOwnSheet, loadStudioContext } from "@/lib/studio/load";

export default async function StudioEditPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const user = await requireUser("/studio");
  const { agentId } = await params;
  const [context, sheet] = await Promise.all([
    loadStudioContext(user.id),
    loadOwnSheet(agentId),
  ]);

  if (!context) {
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

  if (!sheet) {
    notFound();
  }

  return (
    <StudioSheet kicker="Casting notes" title={sheet.name}>
      <CastingForm
        agentId={sheet.id}
        planId={context.planId}
        planDisplayName={context.planDisplayName}
        maxCustomAgents={context.maxCustomAgents}
        toolsAllowed={context.toolsAllowed}
        defaults={{
          name: sheet.name,
          tagline: sheet.tagline,
          languagePreset: sheet.languagePreset,
          costumeId: sheet.costumeId,
          backstory: sheet.backstory,
          tone: sheet.tone,
          toolsEnabled: sheet.toolsEnabled,
          isPublic: sheet.isPublic,
          archived: sheet.archived,
        }}
      />
    </StudioSheet>
  );
}
