import { notFound } from "next/navigation";
import { DroppedNotice } from "@/components/app/dropped-notice";
import { CastingForm } from "@/components/studio/casting-form";
import { StudioSheet } from "@/components/studio/studio-sheet";
import { requireUser } from "@/lib/auth/session";
import { loadOwnSheet, loadStudioContext } from "@/lib/studio/load";
import { COPY } from "@/lib/ui-copy";

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
    return <DroppedNotice retryHref="/studio" />;
  }

  if (!sheet) {
    notFound();
  }

  return (
    <StudioSheet kicker={COPY.editAgent} title={sheet.name}>
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
