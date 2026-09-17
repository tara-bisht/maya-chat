import "server-only";

import type { ToolSet } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import { intersectTools } from "@maya/shared";
import { memorySaverTool } from "./memory-saver";

export function createChatTools(
  supabase: SupabaseClient<Database>,
  input: {
    userId: string;
    agentId: string;
    toolsEnabled: readonly string[];
    toolsAllowed: readonly string[];
  },
): ToolSet | undefined {
  const allowed = intersectTools(input.toolsEnabled, input.toolsAllowed);
  if (!allowed.includes("memory_saver")) {
    return undefined;
  }
  return {
    memory_saver: memorySaverTool(supabase, {
      userId: input.userId,
      agentId: input.agentId,
    }),
  };
}
