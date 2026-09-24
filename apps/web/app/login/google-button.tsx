"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleSignInButton({ next }: { next: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setError(null);
    setPending(true);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={signIn}
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-lg bg-cream text-sm font-semibold text-night hover:bg-acid-hover disabled:opacity-40"
      >
        {pending ? "Opening Google…" : "Continue with Google"}
      </button>
      {error ? (
        <p className="text-xs leading-5 text-ink-soft">{error}</p>
      ) : null}
    </div>
  );
}
