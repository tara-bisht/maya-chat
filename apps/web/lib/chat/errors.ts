import { NextResponse } from "next/server";

export type ChatErrorCode =
  | "locked_agent"
  | "quota"
  | "quota_month"
  | "forbidden_model"
  | "not_found"
  | "invalid"
  | "dropped"
  | "unauthorized";

export function chatError(
  code: ChatErrorCode,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ error: code, ...extra }, { status });
}
