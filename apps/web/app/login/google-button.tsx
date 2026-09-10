"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setError(null);
    setPending(true);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
        className="inline-flex h-11 items-center justify-center rounded-md border-2 border-night bg-cream font-sans text-sm font-semibold text-night shadow-[4px_4px_0_#14110F] hover:bg-cream-dim disabled:opacity-40"
      >
        {pending ? "Opening Google…" : "Continue with Google"}
      </button>
      {error ? (
        <p className="font-sans text-xs leading-5 text-night/70">{error}</p>
      ) : null}
    </div>
  );
}
