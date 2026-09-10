"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  allowedStudioTools,
  evaluateStudioWrite,
  parseStudioWriteError,
  studioUpsertSchema,
  type StudioWriteCode,
  type StudioWriteResult,
} from "@maya/shared";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { loadOwnSheet, loadStudioContext } from "./load";

export type StudioActionState = {
  ok: false;
  code: StudioWriteCode | "invalid" | "not_found";
  upgradePlan?: "plus" | "pro";
} | null;

function failureFromDecision(decision: StudioWriteResult): StudioActionState {
  if (decision.ok) {
    return null;
  }
  return {
    ok: false,
    code: decision.code,
    upgradePlan: decision.upgradePlan,
  };
}

export async function saveCastingNotes(
  agentId: string | null,
  raw: unknown,
): Promise<StudioActionState> {
  const user = await requireUser("/studio");
  const parsed = studioUpsertSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, code: "invalid" };
  }

  const context = await loadStudioContext(user.id);
  if (!context) {
    return { ok: false, code: "invalid" };
  }

  const desiredPublic = context.planId === "free" ? true : parsed.data.isPublic;
  const toolsEnabled = allowedStudioTools(
    parsed.data.toolsEnabled,
    context.toolsAllowed,
  );

  const supabase = await createClient();

  if (agentId) {
    const existing = await loadOwnSheet(agentId);
    if (!existing) {
      return { ok: false, code: "not_found" };
    }

    const decision = evaluateStudioWrite({
      action: "update",
      planId: context.planId,
      maxCustomAgents: context.maxCustomAgents,
      liveCustomCount: context.liveCustomCount,
      desiredPublic,
      existing: { isPublic: existing.isPublic, archived: existing.archived },
    });
    if (!decision.ok) {
      return failureFromDecision(decision);
    }

    const { error } = await supabase
      .from("agents")
      .update({
        name: parsed.data.name,
        tagline: parsed.data.tagline,
        language_preset: parsed.data.languagePreset,
        costume_id: parsed.data.costumeId,
        system_prompt: parsed.data.backstory,
        tone_settings: parsed.data.tone,
        tools_enabled: toolsEnabled,
        is_public: desiredPublic,
      })
      .eq("id", agentId)
      .eq("user_id", user.id);

    if (error) {
      const code = parseStudioWriteError(error.message);
      if (code) {
        return {
          ok: false,
          code,
          upgradePlan: code === "studio_cap" ? (context.planId === "free" ? "plus" : "pro") : "plus",
        };
      }
      return { ok: false, code: "invalid" };
    }

    revalidatePath("/studio");
    revalidatePath(`/studio/${agentId}`);
    revalidatePath("/gallery");
    revalidatePath("/settings");
    return null;
  }

  const decision = evaluateStudioWrite({
    action: "create",
    planId: context.planId,
    maxCustomAgents: context.maxCustomAgents,
    liveCustomCount: context.liveCustomCount,
    desiredPublic,
  });
  if (!decision.ok) {
    return failureFromDecision(decision);
  }

  const { data, error } = await supabase
    .from("agents")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      tagline: parsed.data.tagline,
      category: "custom",
      language_preset: parsed.data.languagePreset,
      costume_id: parsed.data.costumeId,
      system_prompt: parsed.data.backstory,
      tone_settings: parsed.data.tone,
      tools_enabled: toolsEnabled,
      is_public: desiredPublic,
    })
    .select("id")
    .single();

  if (error || !data) {
    const code = parseStudioWriteError(error?.message);
    if (code) {
      return {
        ok: false,
        code,
        upgradePlan: code === "studio_cap" ? (context.planId === "free" ? "plus" : "pro") : "plus",
      };
    }
    return { ok: false, code: "invalid" };
  }

  revalidatePath("/studio");
  revalidatePath("/gallery");
  revalidatePath("/settings");
  redirect(`/studio/${data.id}`);
}

export async function archiveCustomAgent(agentId: string): Promise<StudioActionState> {
  const user = await requireUser("/studio");
  const existing = await loadOwnSheet(agentId);
  if (!existing) {
    return { ok: false, code: "not_found" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("agents")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", agentId)
    .eq("user_id", user.id);

  if (error) {
    return { ok: false, code: "invalid" };
  }

  revalidatePath("/studio");
  revalidatePath("/gallery");
  revalidatePath("/settings");
  redirect("/settings#your-agents");
}
