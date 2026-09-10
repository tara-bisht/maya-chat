"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COPY } from "@/lib/ui-copy";

export function SignOutButton({
  className = "px-3 py-2 font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline disabled:opacity-40",
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
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
      {...props}
      onClick={signOut}
      disabled={pending || props.disabled}
      className={className}
    >
      {pending ? COPY.signingOut : (children ?? COPY.signOut)}
    </button>
  );
}
