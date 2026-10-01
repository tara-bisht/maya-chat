import { MAYA_HOME_HREF } from "@maya/shared";

export const DEFAULT_NEXT = MAYA_HOME_HREF;

/** Same-origin path only. Reject protocol-relative, backslash-bypass, and off-site next values. */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return DEFAULT_NEXT;
  }
  try {
    const url = new URL(raw, "https://maya.internal");
    if (url.origin !== "https://maya.internal") {
      return DEFAULT_NEXT;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_NEXT;
  }
}
