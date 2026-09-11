import type { Metadata } from "next";
import { DroppedNotice } from "@/components/app/dropped-notice";
import { PageInner } from "@/components/app/page-frame";
import { SectionKicker } from "@/components/landing/section-kicker";
import { SettingsForm } from "@/components/app/settings-form";
import { SignOutButton } from "@/components/app/sign-out-button";
import { ProfileAgents } from "@/components/app/your-agents-list";
import { requireUser } from "@/lib/auth/session";
import { loadLobbyChrome } from "@/lib/gallery/load";
import { loadSettings } from "@/lib/settings/load";
import { loadStudioContext } from "@/lib/studio/load";
import { createClient } from "@/lib/supabase/server";
import { COPY, agentsCapLabel } from "@/lib/ui-copy";

export const metadata: Metadata = {
  title: "Profile · Maya",
};

export default async function SettingsPage() {
  const user = await requireUser("/settings");
  const supabase = await createClient();
  const [loaded, chrome, context] = await Promise.all([
    loadSettings(supabase, {
      userId: user.id,
      email: user.email,
    }),
    loadLobbyChrome(user.id),
    loadStudioContext(user.id, supabase),
  ]);

  if (!loaded.ok) {
    return <DroppedNotice retryHref="/settings" />;
  }

  const capLabel = context
    ? agentsCapLabel(
        context.liveCustomCount,
        context.maxCustomAgents,
        context.planDisplayName,
      )
    : COPY.yourAgents;

  return (
    <main className="py-6 md:py-10">
      <PageInner width="sheet">
        <SectionKicker kicker={COPY.profile} title="Your account">
          {COPY.everyAgentReads}
        </SectionKicker>
        <SettingsForm view={loaded.view} credits={loaded.credits} />
        <ProfileAgents agents={chrome.custom} capLabel={capLabel} />
        <p className="mt-8">
          <SignOutButton />
        </p>
      </PageInner>
    </main>
  );
}
