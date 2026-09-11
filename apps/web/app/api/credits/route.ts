import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { chatError } from "@/lib/chat/errors";
import { loadCreditBalance } from "@/lib/credits/load";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return chatError("unauthorized", 401);
  }

  const supabase = await createClient();
  const credits = await loadCreditBalance(supabase);
  if (!credits) {
    return chatError("dropped", 500);
  }

  return NextResponse.json(credits);
}
