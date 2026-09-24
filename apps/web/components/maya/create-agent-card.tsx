"use client";

import { COPY, chatWithLabel } from "@/lib/ui-copy";
import { houseHref } from "@/lib/house/href";
import Link from "next/link";

export function CreateAgentCard({
  name,
  tagline,
  createdId,
  busy = false,
  error,
  onCreate,
}: {
  name: string;
  tagline: string;
  createdId: string | null;
  busy?: boolean;
  error?: string | null;
  onCreate: () => void;
}) {
  return (
    <div className="mt-3 rounded-xl bg-sheet px-4 py-4 text-sheet-ink">
      <p className="text-lg font-semibold">{name}</p>
      <p className="mt-1 text-sm leading-snug text-sheet-ink/80">{tagline}</p>
      {error ? (
        <p className="mt-2 text-sm font-semibold">{error}</p>
      ) : null}
      <div className="mt-3">
        {createdId ? (
          <Link
            href={houseHref(createdId)}
            className="inline-flex h-9 items-center rounded-lg bg-night px-3 text-sm font-semibold text-cream"
          >
            {chatWithLabel(name)}
          </Link>
        ) : (
          <button
            type="button"
            disabled={busy}
            className="inline-flex h-9 items-center rounded-lg bg-night px-3 text-sm font-semibold text-cream"
            onClick={onCreate}
          >
            {COPY.createAgent}
          </button>
        )}
      </div>
    </div>
  );
}
