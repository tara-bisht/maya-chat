import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-night px-4">
      <div
        className="w-full max-w-[24rem] bg-cream p-6 text-night"
        style={{ borderRadius: 10, boxShadow: "8px 8px 0 #FF4D2E" }}
      >
        <p className="font-display text-3xl italic">Maya</p>
        <h1 className="mt-3 font-display text-3xl leading-none font-medium tracking-[-0.03em] italic">
          The door did not open.
        </h1>
        <p className="mt-3 font-sans text-sm leading-snug text-night/70">
          Google sign-in did not finish. Try again from the wall.
        </p>
        <p className="mt-6">
          <Link
            href="/login"
            className="font-sans text-sm font-semibold text-night underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
