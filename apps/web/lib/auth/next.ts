import { MAYA_HOME_HREF } from "@maya/shared";

export const DEFAULT_NEXT = MAYA_HOME_HREF;

/** Same-origin path only. Reject protocol-relative and off-site next values. */
export function safeNextPath(raw: string | null | undefined): string {
  if (
    !raw ||
    typeof raw !== "string" ||
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.startsWith("/\\")
  ) {
    return DEFAULT_NEXT;
  }

  try {
    const dummyOrigin = "https://maya.local";
    const parsed = new URL(raw, dummyOrigin);
    if (parsed.origin !== dummyOrigin) {
      return DEFAULT_NEXT;
    }

    const decodedPath = decodeURIComponent(parsed.pathname);
    if (decodedPath.startsWith("//") || decodedPath.startsWith("/\\")) {
      return DEFAULT_NEXT;
    }

    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return DEFAULT_NEXT;
  }
}
