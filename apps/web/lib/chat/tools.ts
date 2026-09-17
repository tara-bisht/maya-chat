import "server-only";

import { jsonSchema, tool, type ToolSet } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@maya/database";
import {
  HOST_TOOLS,
  intersectTools,
  proposeCustomAgentSchema,
} from "@maya/shared";
import { memorySaverTool } from "./memory-saver";

const proposalInputSchema = jsonSchema<{
  name: string;
  tagline: string;
  backstory: string;
  languagePreset?: string;
  costumeId?: string;
}>({
  type: "object",
  properties: {
    name: { type: "string" },
    tagline: { type: "string" },
    backstory: { type: "string" },
    languagePreset: { type: "string" },
    costumeId: { type: "string" },
  },
  required: ["name", "tagline", "backstory"],
});

function proposeCustomAgentTool() {
  return tool({
    description:
      "Propose a custom agent after a short interview. Do not insert a row. The member taps Create agent.",
    inputSchema: proposalInputSchema,
    execute: async (raw) => {
      const parsed = proposeCustomAgentSchema.safeParse({
        type: "proposeCustomAgent",
        ...raw,
      });
      if (!parsed.success) {
        return { ok: false as const, error: "Need a name, tagline, and backstory." };
      }
      return { ok: true as const, proposal: parsed.data };
    },
  });
}

export function createChatTools(
  supabase: SupabaseClient<Database>,
  input: {
    userId: string;
    agentId: string;
    toolsEnabled: readonly string[];
    toolsAllowed: readonly string[];
    isHost?: boolean;
  },
): ToolSet | undefined {
  const allowed = intersectTools(input.toolsEnabled, input.toolsAllowed);
  const tools: ToolSet = {};
  if (allowed.includes("memory_saver")) {
    tools.memory_saver = memorySaverTool(supabase, {
      userId: input.userId,
      agentId: input.agentId,
    });
  }
  if (input.isHost || HOST_TOOLS.some((name) => allowed.includes(name))) {
    tools.proposeCustomAgent = proposeCustomAgentTool();
  }
  return Object.keys(tools).length > 0 ? tools : undefined;
}
