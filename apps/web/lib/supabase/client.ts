"use client";

import { createBrowserSupabaseClient } from "@maya/database";

export function createClient() {
  return createBrowserSupabaseClient();
}
