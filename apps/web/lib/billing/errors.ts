import { NextResponse } from "next/server";

export type BillingErrorCode =
  | "unauthorized"
  | "invalid"
  | "dropped"
  | "subscribed"
  | "unpriced"
  | "no_customer";

export function billingError(
  code: BillingErrorCode,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ error: code, ...extra }, { status });
}
