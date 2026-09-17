import { MAYA_HOME_HREF } from "@maya/shared";

export const DEFAULT_NEXT = MAYA_HOME_HREF;

/** Same-origin path only. Reject protocol-relative and off-site next values. */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return DEFAULT_NEXT;
  }
  return raw;
}
