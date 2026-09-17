import { unixToIso } from "@maya/shared";

export type StripeLikeEvent = {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function stringField(
  object: Record<string, unknown>,
  key: string,
): string | null {
  return asString(object[key]);
}

export function metadataPlanId(object: Record<string, unknown>): string | null {
  const metadata = asRecord(object.metadata);
  return metadata ? asString(metadata.planId) : null;
}

export function metadataUserId(object: Record<string, unknown>): string | null {
  const metadata = asRecord(object.metadata);
  const fromMeta = metadata ? asString(metadata.userId) : null;
  return fromMeta ?? asString(object.client_reference_id);
}

export function priceIdsFromSubscription(
  object: Record<string, unknown>,
): string[] {
  const items = asRecord(object.items);
  const data = items?.data;
  if (!Array.isArray(data)) {
    return [];
  }
  const ids: string[] = [];
  for (const item of data) {
    const row = asRecord(item);
    const price = row ? asRecord(row.price) : null;
    const id = price ? asString(price.id) : null;
    if (id) {
      ids.push(id);
    }
  }
  return ids;
}

export function periodEndFromSubscription(
  object: Record<string, unknown>,
): string | null {
  return unixToIso(object.current_period_end);
}

export function customerIdFromObject(
  object: Record<string, unknown>,
): string | null {
  const customer = object.customer;
  if (typeof customer === "string") {
    return customer;
  }
  const nested = asRecord(customer);
  return nested ? asString(nested.id) : null;
}
