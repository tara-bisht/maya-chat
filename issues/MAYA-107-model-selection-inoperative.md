# [MAYA-107] Model Selection per Plan Is Inoperative; Chat Hardcoded to Default Model

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-107 |
| **Issue Type** | 🏗️ Architecture & Feature Incompleteness |
| **Status** | Open / Ready for Review |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major (Paid Feature Blocker) |
| **Component** | API (Model Routing) & Frontend (House Model Picker) |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod |

---

## 1. Summary
A core monetization premise in Maya Chat's product design is plan-gated model access:
- **Free**: Fast/cheap models (`gemini-flash`, `grok-fast`, `qwen-flash`)
- **Plus**: Mid-tier models (`deepseek`, `qwen`, `grok`, `gpt`)
- **Pro**: Flagship models (`claude-sonnet-4.5`, `kimi`)

While the relational tables `public.models` and `public.plan_models` exist in PostgreSQL, the application layer has no mechanism for users to select or chat with non-default models:
1. `chatRequestSchema` in `@maya/shared` does not accept a `modelId` parameter.
2. `loadPlanModel()` in `apps/web/lib/chat/load-context.ts` only reads `plans.default_model_id`.
3. The House UI header displays the default model as static, non-interactive text (`{house.defaultModelId}`).
4. Pro users paying $19/mo are locked to Claude with no ability to switch to Grok or GPT, and Plus users are locked to Grok.

---

## 2. Code Reference
- [`packages/shared/src/chat.ts:42-46`](file:///Users/kamalbisht/Documents/maya-chat/packages/shared/src/chat.ts#L42-L46):
  ```ts
  export const chatRequestSchema = z.object({
    conversationId: uuidSchema,
    agentId: uuidSchema,
    message: userMessageSchema,
    // Note: No modelId property exists!
  });
  ```
- [`apps/web/lib/chat/load-context.ts:73-98`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/chat/load-context.ts#L73-L98):
  ```ts
  export async function loadPlanModel(supabase, planId) {
    const planResult = await supabase
      .from("plans")
      .select("default_model_id, daily_message_limit")
      .eq("id", planId)
      .maybeSingle();

    const modelResult = await supabase
      .from("models")
      .select("id, gateway_id, is_enabled")
      .eq("id", planResult.data.default_model_id) // <--- Hardcoded to default
      .maybeSingle();
    ...
  }
  ```
- [`apps/web/components/house/house-view.tsx:142-144`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/components/house/house-view.tsx#L142-L144):
  ```tsx
  <p className="font-mono text-xs text-ink-soft">
    {house.defaultModelId}
  </p>
  ```

---

## 3. Steps to Reproduce
1. Log in with a Pro subscriber account (`entitlements.plan = 'pro'`).
2. Open a chat with Marcus.
3. Observe the header: `"claude"` is displayed in plain text.
4. Try to switch the model to `"gpt"` or `"deepseek"` — no interactive UI element exists.
5. Manually send a POST payload to `/api/chat` with `"modelId": "deepseek"`.
6. Notice that the server ignores `modelId` and still routes the prompt through the default Claude gateway ID.

---

## 4. Expected Behavior
- Plus and Pro users should be able to click the model label in the House header to open a dropdown of models allowed on their plan (`plan_models`).
- When a user selects an allowed model, the client sends `modelId` in the chat payload.
- The server validates that `modelId` is allowed for the user's plan in `public.plan_models` (returning HTTP 403 with allowed models if unauthorized).
- The response is streamed from the requested model.

---

## 5. Actual Behavior
- The model is locked to the plan's default model row with zero user choice.

---

## 6. Proposed Solution & Architecture

### Step 1: Update Schema in `@maya/shared`
```ts
export const chatRequestSchema = z.object({
  conversationId: uuidSchema,
  agentId: uuidSchema,
  modelId: z.string().optional(),
  message: userMessageSchema,
});
```

### Step 2: Validate Model Authorization in `loadPlanModel`
```ts
export async function loadPlanModel(
  supabase: SupabaseClient<Database>,
  planId: MayaPlan,
  requestedModelId?: string,
): Promise<LoadPlanModelResult> {
  // 1. Fetch plan and allowed models
  const { data: allowedModels } = await supabase
    .from("plan_models")
    .select("model_id, models(id, gateway_id, is_enabled)")
    .eq("plan_id", planId);

  const activeModelId = requestedModelId ?? plan.default_model_id;
  const match = allowedModels?.find(
    (m) => m.model_id === activeModelId && m.models?.is_enabled,
  );

  if (!match) {
    return { ok: false, reason: "forbidden_model", allowed: allowedModels?.map(m => m.model_id) };
  }

  return {
    ok: true,
    gatewayId: match.models.gateway_id,
    modelId: match.model_id,
  };
}
```

### Step 3: Implement Model Selector in House Header
Transform `{house.defaultModelId}` into a model selector dropdown populated with the user's plan models.

---

## 7. Acceptance Criteria (AC)
- [ ] Plus and Pro users can switch between their plan's allowed models in the chat UI.
- [ ] Requesting a model not allowed on the user's plan (e.g. Free user requesting Claude) returns HTTP 403.
- [ ] Omitted `modelId` gracefully defaults to the plan's `default_model_id`.
