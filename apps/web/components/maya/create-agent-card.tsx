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
    <div className="mt-3 rounded-md bg-cream px-3 py-3 text-night shadow-[4px_4px_0_#FF4D2E]">
      <p className="font-display text-xl italic">{name}</p>
      <p className="mt-1 font-sans text-sm leading-snug text-night/80">{tagline}</p>
      {error ? (
        <p className="mt-2 font-sans text-sm text-acid">{error}</p>
      ) : null}
      <div className="mt-3">
        {createdId ? (
          <Link
            href={houseHref(createdId)}
            className="inline-flex h-9 items-center rounded-md bg-acid px-3 font-sans text-sm font-semibold text-on-acid shadow-[3px_3px_0_#14110F]"
          >
            {chatWithLabel(name)}
          </Link>
        ) : (
          <button
            type="button"
            disabled={busy}
            className="inline-flex h-9 items-center rounded-md bg-acid px-3 font-sans text-sm font-semibold text-on-acid shadow-[3px_3px_0_#14110F]"
            onClick={onCreate}
          >
            {COPY.createAgent}
          </button>
        )}
      </div>
    </div>
  );
}
