import Link from "next/link";
import { MAYA_HOME_HREF } from "@maya/shared";

export default function HouseNotFound() {
  return (
    <section className="flex min-h-dvh items-center justify-center px-4">
      <div>
        <p className="font-display text-3xl text-cream italic">
          That agent is not available.
        </p>
        <p className="mt-4">
          <Link
            href={MAYA_HOME_HREF}
            className="font-sans text-sm font-semibold text-cream underline-offset-4 hover:underline"
          >
            Home
          </Link>
        </p>
      </div>
    </section>
  );
}
