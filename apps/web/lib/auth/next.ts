import { MAYA_HOME_HREF } from "@maya/shared";

export const DEFAULT_NEXT = MAYA_HOME_HREF;

/** Same-origin path only. Reject protocol-relative and off-site next values. */
export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return DEFAULT_NEXT;
  }
  return raw;
}

/** Extracts hostname from URL string if valid. */
export function safeHostFromUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) {
    return null;
  }
  try {
    return new URL(rawUrl).host.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Validates x-forwarded-host against a list of trusted hosts to prevent Host Header Injection / Open Redirects.
 * Returns the forwardedHost if it matches one of the trusted hosts, otherwise null.
 */
export function safeRedirectHost(
  forwardedHost: string | null | undefined,
  allowedHosts: Array<string | null | undefined>,
): string | null {
  if (!forwardedHost) {
    return null;
  }
  const cleanForwarded = forwardedHost.trim().toLowerCase();
  const validAllowed = allowedHosts
    .filter((h): h is string => Boolean(h && h.trim()))
    .map((h) => h.trim().toLowerCase());

  if (validAllowed.includes(cleanForwarded)) {
    return cleanForwarded;
  }

  // Reject untrusted forwarded host to prevent Host Header Injection
  return null;
}
