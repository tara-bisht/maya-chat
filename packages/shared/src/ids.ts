const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Generates a clean, collision-resistant slug for an agent name.
 * e.g. "Dr. Sherlock Holmes" -> "dr-sherlock-holmes-a7b2"
 */
export function generateCustomAgentSlug(
  name: string,
  suffix?: string,
): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32) || "agent";

  const randomSuffix =
    suffix ??
    Math.floor(Math.random() * 0xffffff)
      .toString(36)
      .padStart(4, "0")
      .slice(0, 4);

  return `${base}-${randomSuffix}`;
}

const ZERO = BigInt(0);
const BASE = BigInt(62);

/**
 * Losslessly encodes a 128-bit UUID hex string to a compact Base62 thread token (`t_...`).
 * e.g. "00000000-0000-0000-0000-000000000001" -> "t_1"
 */
export function uuidToShortId(uuid: string): string {
  const hex = uuid.replace(/-/g, "");
  if (hex.length !== 32) {
    return uuid;
  }
  let num = BigInt(`0x${hex}`);
  if (num === ZERO) {
    return "t_0";
  }
  let result = "";
  while (num > ZERO) {
    result = BASE62[Number(num % BASE)] + result;
    num = num / BASE;
  }
  return `t_${result}`;
}

/**
 * Losslessly decodes a compact Base62 thread token (`t_...`) back to a 36-char canonical UUID string.
 * If the input is already a UUID or does not match `t_...`, returns the input unchanged.
 */
export function shortIdToUuid(token: string): string {
  if (!token.startsWith("t_")) {
    return token;
  }
  const raw = token.slice(2);
  if (!raw) {
    return token;
  }
  let num = ZERO;
  for (const char of raw) {
    const idx = BASE62.indexOf(char);
    if (idx === -1) {
      return token;
    }
    num = num * BASE + BigInt(idx);
  }
  const hex = num.toString(16).padStart(32, "0");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function isShortThreadId(token: string): boolean {
  return /^t_[0-9A-Za-z]+$/.test(token);
}

export function isAgentSlug(val: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val);
}
