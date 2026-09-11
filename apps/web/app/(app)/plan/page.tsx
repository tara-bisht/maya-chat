import type { Metadata } from "next";
import { DroppedNotice } from "@/components/app/dropped-notice";
import { PageInner } from "@/components/app/page-frame";
import { SectionKicker } from "@/components/landing/section-kicker";
import { PlanWall } from "@/components/plan/plan-wall";
import { requireUser } from "@/lib/auth/session";
import { SEATS_FOOTNOTE, SEATS_KICKER } from "@/lib/landing";
import { loadPlan } from "@/lib/plan/load";
import { parsePlanReason, planReasonHeading } from "@/lib/plan/present";
import { createClient } from "@/lib/supabase/server";
import { COPY } from "@/lib/ui-copy";

export const metadata: Metadata = {
  title: "Plan · Maya",
};

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string | string[] }>;
}) {
  const user = await requireUser("/plan");
  const supabase = await createClient();
  const loaded = await loadPlan(supabase, { userId: user.id });

  if (!loaded.ok) {
    return <DroppedNotice retryHref="/plan" />;
  }

  const { reason } = await searchParams;
  const heading = planReasonHeading(
    parsePlanReason(typeof reason === "string" ? reason : null),
  );

  return (
    <main className="py-6 md:py-10">
      <PageInner>
        <SectionKicker kicker={COPY.plan} title={heading ?? SEATS_KICKER.title}>
          {heading
            ? "Compare plans, then check out when billing opens."
            : SEATS_KICKER.body}
        </SectionKicker>
        <PlanWall plans={loaded.plans} />
        {loaded.current === "pro" ? (
          <p className="mt-8 max-w-xl font-sans text-sm text-ink-soft">
            {COPY.portalClosed}
          </p>
        ) : null}
        <p className="mt-8 max-w-xl font-sans text-sm text-ink-soft">
          {SEATS_FOOTNOTE}
        </p>
      </PageInner>
    </main>
  );
}
