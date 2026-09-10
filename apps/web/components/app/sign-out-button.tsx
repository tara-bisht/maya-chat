"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="px-3 py-2 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline disabled:opacity-40"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
