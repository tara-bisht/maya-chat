import Link from "next/link";
import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/auth/next";
import { getSessionUser } from "@/lib/auth/session";
import { GoogleSignInButton } from "./google-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeNextPath(rawNext);
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  if (supabaseConfigured) {
    const user = await getSessionUser();
    if (user) {
      redirect(next);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-night px-4">
      <div className="w-full max-w-sm rounded-xl border border-rule bg-panel p-6 text-cream">
        <p className="text-lg font-semibold">Maya</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Sign in.
        </h1>
        <p className="mt-3 text-sm leading-snug text-ink-soft">
          Continue with Google. Apple lands later.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <GoogleSignInButton next={next} />
          <button
            type="button"
            disabled
            className="inline-flex h-11 items-center justify-center rounded-lg border border-rule text-sm font-semibold text-ink-soft opacity-40"
          >
            Continue with Apple
          </button>
        </div>
        <p className="mt-6">
          <Link
            href="/"
            className="text-sm font-semibold text-ink-soft underline-offset-4 hover:text-cream hover:underline"
          >
            Back
          </Link>
        </p>
      </div>
    </div>
  );
}
