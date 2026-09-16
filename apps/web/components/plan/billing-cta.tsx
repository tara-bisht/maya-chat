"use client";

import { useState } from "react";

export function BillingCta({
  kind,
  planId,
  label,
  highlighted,
}: {
  kind: "checkout" | "portal";
  planId?: "plus" | "pro";
  label: string;
  highlighted: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setPending(true);
    setError(null);
    try {
      const path =
        kind === "portal" ? "/api/billing/portal" : "/api/billing/checkout";
      const response = await fetch(path, {
        method: "POST",
        headers:
          kind === "checkout"
            ? { "content-type": "application/json" }
            : undefined,
        body:
          kind === "checkout" && planId
            ? JSON.stringify({ planId })
            : undefined,
      });
      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !payload.url) {
        setError(
          payload.error === "unpriced"
            ? "Checkout is not configured yet."
            : payload.error === "subscribed"
              ? "Manage this plan in the portal."
              : payload.error === "no_customer"
                ? "No billing customer yet."
                : "Something went wrong.",
        );
        return;
      }
      window.location.assign(payload.url);
    } catch {
      setError("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  const className = highlighted
    ? "inline-flex h-11 items-center rounded-md bg-acid px-4 font-sans text-sm font-semibold text-on-acid shadow-[4px_4px_0_#14110F] disabled:opacity-40"
    : "font-sans text-sm font-semibold text-night underline-offset-4 hover:underline disabled:opacity-40";

  return (
    <p className="mt-6">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={className}
      >
        {pending ? "Opening…" : label}
      </button>
      {error ? (
        <span className="mt-2 block font-sans text-sm text-night/70">
          {error}
        </span>
      ) : null}
    </p>
  );
}
