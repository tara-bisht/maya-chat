# [MAYA-108] Landing Page Pricing & Catalog Hardcoded, Bypassing SQL Source of Truth

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-108 |
| **Issue Type** | 📉 Spec Drift / Data Integrity |
| **Status** | Done (PR4b) |
| **Priority** | 🟡 P2 (Medium) |
| **Severity** | Moderate |
| **Component** | Frontend (Landing Seats) & Data Catalog |
| **Affects Versions** | Web MVP |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Fullstack Pod |

---

## 1. Summary
A core engineering requirement specified across all project design documents is:
> *"Models and plans are catalog data in Postgres, not hardcoded providers or TypeScript constants that require a PR."* ([`docs/PROJECT_DESCRIPTION.md:89`](file:///Users/kamalbisht/Documents/maya-chat/docs/PROJECT_DESCRIPTION.md#L89), [`docs/implementation-plan.md:34`](file:///Users/kamalbisht/Documents/maya-chat/docs/implementation-plan.md#L34)).

Ironically, the landing page pricing cards (`Seats` component at `/#seats`) display prices, feature bullet points, daily quotas, and model lists directly from a static, hardcoded TypeScript object in [`apps/web/lib/landing.ts:190-247`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/landing.ts#L190-L247).

Even though the landing section footer states:
> *"Plans follow the catalog. Prices and models can move without a deploy."* ([`landing.ts:256`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/landing.ts#L256)),
updating `public.plans` or `public.plan_models` in PostgreSQL will **not** update the pricing section on the landing page without modifying the code and making a git commit.

---

## 2. Code Reference
- [`apps/web/lib/landing.ts:189-247`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/lib/landing.ts#L189-L247):
  ```ts
  export const SEATS: Seat[] = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      cadence: "No bill",
      bullets: [
        "50 messages a day",
        "Starter voices + 3 of yours, public",
        "No vector memory",
        "No tools",
      ],
      models: ["qwen-flash", "gemini-flash", "grok-fast"],
    },
    {
      id: "plus",
      name: "Plus",
      price: "$9",
      cadence: "/ month · $90 / year",
      models: ["qwen-flash", "gemini-flash", "grok-fast", "deepseek", "qwen", "grok", "gpt"],
      ...
    },
    ...
  ];
  ```
- [`apps/web/components/landing/seats.tsx:75-98`](file:///Users/kamalbisht/Documents/maya-chat/apps/web/components/landing/seats.tsx#L75-L98) renders static `SEATS` directly.

---

## 3. Steps to Reproduce
1. In PostgreSQL, update the price of Plus to $12 or add a new model `llama-3` to `plan_models` for Plus:
   ```sql
   UPDATE public.plans SET monthly_price_cents = 1200 WHERE id = 'plus';
   ```
2. Navigate to the landing page at `http://localhost:3000/#seats`.
3. Observe that the Plus card continues to display `$9 / month` and the old list of models.

---

## 4. Expected Behavior
- The landing page pricing section dynamically reads its pricing, quotas, and models from `public.plans` and `public.plan_models` (cached via React `cache` / Next.js ISR for high performance).
- Changing catalog records in Supabase immediately or periodically reflects on the marketing site without requiring code redeployments.

---

## 5. Actual Behavior
- Pricing, models, and quotas are frozen in static TypeScript files, causing silent drift between marketing copy and actual database authorization rules.

---

## 6. Proposed Solution & Architecture

Create a server-side catalog loader `loadPublicPlans()`:
```ts
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const loadPublicSeats = cache(async () => {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select(`
      id,
      display_name,
      monthly_price_cents,
      yearly_price_cents,
      daily_message_limit,
      max_custom_agents,
      vector_memory,
      plan_models (
        models ( id, display_name )
      )
    `)
    .eq("is_active", true)
    .order("monthly_price_cents", { ascending: true });

  // Map database rows to UI Seat view models
  return mapPlansToSeats(plans);
});
```

Render `Seats` as an async React Server Component on the landing page, with a fallback to default constants if the database is unreachable.

---

## 7. Acceptance Criteria (AC)
- [x] Changing `monthly_price_cents` or adding a model to `plan_models` updates the landing page display.
- [x] The landing page loads with zero layout shift and sub-100ms response time using Next.js caching/ISR.

---

## 9. Tech Lead Review

| Field | Value |
| :--- | :--- |
| **Verdict** | Valid spec drift; explicitly deferred to PR4 |
| **Status** | Backlog |
| **Engineering priority** | P2 |
| **Reviewer** | Engineering Tech Lead |
| **Date** | 2026-09-10 |

**Comment:** Confirmed. `SEATS` in `apps/web/lib/landing.ts` is a static TypeScript object. The file already says so: seed copy, runtime source of truth is `public.plans` / `public.plan_models` **(PR4)**. DESIGN.md forbids hardcoding `$9` / Claude / GPT in marketing components. PR4’s exit includes “Pricing copy reads catalog.”

The seats footnote *“Plans follow the catalog. Prices and models can move without a deploy.”* currently overclaims. A one-line copy fix can ride a landing PR if we want to stop lying before PR4. Wiring `Seats` to Postgres is PR4, not a hotfix.

When that loader lands: unauthenticated `/` has no user JWT. Use a public/anon catalog read or a cached server fetch — not the authenticated Supabase client. ISR/`cache()` as QA suggests is the right shape. Do not block Web chat on this.
