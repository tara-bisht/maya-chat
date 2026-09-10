import { NextResponse } from "next/server";

export type ChatErrorCode =
  | "locked_agent"
  | "quota"
  | "not_found"
  | "invalid"
  | "dropped"
  | "unauthorized";

export function chatError(code: ChatErrorCode, status: number) {
  return NextResponse.json({ error: code }, { status });
}
