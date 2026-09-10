import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HouseView } from "@/components/house/house-view";
import { requireUser } from "@/lib/auth/session";
import { loadHouse } from "@/lib/house/load";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "House · Maya",
};

export default async function HousePage({
  params,
}: {
  params: Promise<{ agentId: string; thread?: string[] }>;
}) {
  const { agentId, thread } = await params;
  const conversationId = thread?.[0] ?? null;
  if (thread && thread.length > 1) {
    notFound();
  }

  const user = await requireUser(`/chat/${agentId}`);
  const supabase = await createClient();
  const loaded = await loadHouse(supabase, {
    userId: user.id,
    agentId,
    conversationId,
  });

  if (!loaded.ok && loaded.reason === "not_found") {
    notFound();
  }

  if (!loaded.ok) {
    return (
      <section className="flex min-h-dvh items-center justify-center px-4">
        <div>
          <p className="font-display text-3xl text-cream italic">
            The line dropped.
          </p>
          <p className="mt-4">
            <Link
              href="/gallery"
              className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
            >
              Back to the wall
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return <HouseView house={loaded.house} />;
}
