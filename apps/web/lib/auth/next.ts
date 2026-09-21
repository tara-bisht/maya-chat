import { MAYA_HOME_HREF } from "@maya/shared";

export const DEFAULT_NEXT = MAYA_HOME_HREF;

/** Same-origin path only. Reject protocol-relative, backslash, control character, and off-site next values. */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string" || !raw.startsWith("/")) {
    return DEFAULT_NEXT;
  }
  // Reject protocol-relative paths or backslash/tab/control trickery (e.g. //evil.com, /\evil.com, /\tevil.com)
  if (raw.startsWith("//") || raw.startsWith("/\\") || raw.startsWith("/\t") || raw.startsWith("/\n") || raw.startsWith("/\r")) {
    return DEFAULT_NEXT;
  }
  try {
    const dummyBase = "https://safe-origin.local";
    const url = new URL(raw, dummyBase);
    if (url.origin !== dummyBase) {
      return DEFAULT_NEXT;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_NEXT;
  }
}
