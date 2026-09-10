import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_NEXT, safeNextPath } from "./next";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser(next = DEFAULT_NEXT) {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(safeNextPath(next))}`);
  }
  return user;
}
