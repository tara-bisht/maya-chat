import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import {
  MEMORY_MATCH_COUNT,
  type CompilePromptMemory,
} from "@maya/shared";
import { embedText } from "@/lib/openrouter/embed";
import { logDropped } from "@/lib/supabase/dropped";

export async function retrieveMemories(
  supabase: SupabaseClient<Database>,
  input: {
    agentId: string;
    text: string;
    vectorMemory: boolean;
  },
): Promise<CompilePromptMemory[]> {
  if (!input.vectorMemory || !input.text.trim()) {
    return [];
  }

  const embedded = await embedText(input.text);
  if (!embedded.ok) {
    return [];
  }

  const matched = await supabase.rpc("match_agent_memories", {
    p_agent_id: input.agentId,
    p_query: embedded.vector,
    p_match_count: MEMORY_MATCH_COUNT,
  });

  if (matched.error) {
    logDropped("retrieveMemories", { rpc: matched.error });
    return [];
  }

  const memories: CompilePromptMemory[] = [];
  for (const row of matched.data ?? []) {
    const content = row.content?.trim();
    if (!content) {
      continue;
    }
    memories.push({ content });
  }
  return memories;
}
