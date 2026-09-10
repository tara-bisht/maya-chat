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
      <div
        className="w-full max-w-[24rem] rotate-[-1.5deg] bg-cream p-6 text-night"
        style={{ borderRadius: 10, boxShadow: "8px 8px 0 #FF4D2E" }}
      >
        <p className="font-display text-3xl italic">Maya</p>
        <h1 className="mt-3 font-display text-3xl leading-none font-medium tracking-[-0.03em] italic">
          Sign in.
        </h1>
        <p className="mt-3 font-sans text-sm leading-snug text-night/70">
          Continue with Google. Apple lands later.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <GoogleSignInButton next={next} />
          <button
            type="button"
            disabled
            className="inline-flex h-11 items-center justify-center rounded-md border-2 border-night bg-cream font-sans text-sm font-semibold text-night opacity-40 shadow-[4px_4px_0_#14110F]"
          >
            Continue with Apple
          </button>
        </div>
        <p className="mt-6">
          <Link
            href="/"
            className="font-sans text-sm font-semibold text-night underline-offset-4 hover:underline"
          >
            Back
          </Link>
        </p>
      </div>
    </div>
  );
}
