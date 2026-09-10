import Link from "next/link";

export default function HouseNotFound() {
  return (
    <section className="flex min-h-dvh items-center justify-center px-4">
      <div>
        <p className="font-display text-3xl text-cream italic">
          That agent is not available.
        </p>
        <p className="mt-4">
          <Link
            href="/gallery"
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            Home
          </Link>
        </p>
      </div>
    </section>
  );
}
