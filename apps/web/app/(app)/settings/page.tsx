import type { Metadata } from "next";
import Link from "next/link";
import { PageInner } from "@/components/app/page-frame";
import { SectionKicker } from "@/components/landing/section-kicker";
import { SettingsForm } from "@/components/app/settings-form";
import { requireUser } from "@/lib/auth/session";
import { loadSettings } from "@/lib/settings/load";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Wristband · Maya",
};

export default async function SettingsPage() {
  const user = await requireUser("/settings");
  const supabase = await createClient();
  const loaded = await loadSettings(supabase, {
    userId: user.id,
    email: user.email,
  });

  if (!loaded.ok) {
    return (
      <section className="py-16">
        <PageInner width="sheet">
          <p className="font-display text-3xl text-cream italic">
            The line dropped.
          </p>
          <p className="mt-4">
            <Link
              href="/settings"
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
    <main className="py-6 md:py-10">
      <PageInner width="sheet">
        <SectionKicker kicker="Wristband" title="What the company knows">
          Every player reads this. It is not a costume.
        </SectionKicker>
        <SettingsForm view={loaded.view} />
      </PageInner>
    </main>
  );
}
