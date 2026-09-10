"use client";

import { createBrowserSupabaseClient } from "@maya/database";
import { getPublicSupabaseEnv } from "./public-env";

export function createClient() {
  const { url, publishableKey } = getPublicSupabaseEnv();
  return createBrowserSupabaseClient(url, publishableKey);
}
