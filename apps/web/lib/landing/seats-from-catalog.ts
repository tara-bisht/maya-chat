import { parseMayaPlan, type MayaPlan } from "@maya/shared";

export type SeatCtaKind = "acid" | "ghost";

export type Seat = {
  id: "free" | "plus" | "pro";
  name: string;
  price: string;
  cadence: string;
  stamp: string;
  stampTone: "cream" | "stub";
  cta: { href: "/login"; label: string; kind: SeatCtaKind };
  bullets: string[];
  models: string[];
};

export type CatalogPlanRow = {
  id: string;
  display_name: string;
  monthly_price_cents: number;
  yearly_price_cents: number | null;
  daily_credit_limit: number;
  max_custom_agents: number | null;
  curated_agent_limit: number | null;
  vector_memory: boolean;
  tools_allowed: string[];
};

export type CatalogModelRow = {
  id: string;
  sort_order: number;
  is_enabled: boolean;
};

export type CatalogPlanModelRow = {
  plan_id: string;
  model_id: string;
};

export type CatalogSeatsInput = {
  plans: readonly CatalogPlanRow[];
  models: readonly CatalogModelRow[];
  planModels: readonly CatalogPlanModelRow[];
};

const PLAN_ORDER: MayaPlan[] = ["free", "plus", "pro"];

const SEAT_CHROME: Record<
  MayaPlan,
  {
    stamp: string;
    stampTone: "cream" | "stub";
    cta: { href: "/login"; label: string; kind: SeatCtaKind };
  }
> = {
  free: {
    stamp: "Included",
    stampTone: "cream",
    cta: { href: "/login", label: "Get started", kind: "acid" },
  },
  plus: {
    stamp: "Plus",
    stampTone: "stub",
    cta: { href: "/login", label: "Sign in", kind: "ghost" },
  },
  pro: {
    stamp: "Pro",
    stampTone: "stub",
    cta: { href: "/login", label: "Sign in", kind: "ghost" },
  },
};

const TOOL_LABEL: Record<string, string> = {
  memory_saver: "Memory saver",
  math_solver: "math solver",
  web_search: "web search",
};

export const FALLBACK_CATALOG: CatalogSeatsInput = {
  plans: [
    {
      id: "free",
      display_name: "Free",
      monthly_price_cents: 0,
      yearly_price_cents: null,
      daily_credit_limit: 1500,
      max_custom_agents: 3,
      curated_agent_limit: 2,
      vector_memory: false,
      tools_allowed: [],
    },
    {
      id: "plus",
      display_name: "Plus",
      monthly_price_cents: 900,
      yearly_price_cents: 9000,
      daily_credit_limit: 4000,
      max_custom_agents: 10,
      curated_agent_limit: null,
      vector_memory: true,
      tools_allowed: ["memory_saver", "math_solver"],
    },
    {
      id: "pro",
      display_name: "Pro",
      monthly_price_cents: 1900,
      yearly_price_cents: 19000,
      daily_credit_limit: 9000,
      max_custom_agents: null,
      curated_agent_limit: null,
      vector_memory: true,
      tools_allowed: ["memory_saver", "math_solver", "web_search"],
    },
  ],
  models: [
    { id: "qwen-flash", sort_order: 10, is_enabled: true },
    { id: "gemini-flash", sort_order: 15, is_enabled: true },
    { id: "grok-fast", sort_order: 20, is_enabled: true },
    { id: "deepseek", sort_order: 30, is_enabled: true },
    { id: "qwen", sort_order: 40, is_enabled: true },
    { id: "grok", sort_order: 50, is_enabled: true },
    { id: "gpt", sort_order: 60, is_enabled: true },
    { id: "claude", sort_order: 70, is_enabled: true },
    { id: "kimi", sort_order: 80, is_enabled: true },
  ],
  planModels: [
    { plan_id: "free", model_id: "qwen-flash" },
    { plan_id: "free", model_id: "gemini-flash" },
    { plan_id: "free", model_id: "grok-fast" },
    { plan_id: "plus", model_id: "qwen-flash" },
    { plan_id: "plus", model_id: "gemini-flash" },
    { plan_id: "plus", model_id: "grok-fast" },
    { plan_id: "plus", model_id: "deepseek" },
    { plan_id: "plus", model_id: "qwen" },
    { plan_id: "plus", model_id: "grok" },
    { plan_id: "plus", model_id: "gpt" },
    { plan_id: "pro", model_id: "qwen-flash" },
    { plan_id: "pro", model_id: "gemini-flash" },
    { plan_id: "pro", model_id: "grok-fast" },
    { plan_id: "pro", model_id: "deepseek" },
    { plan_id: "pro", model_id: "qwen" },
    { plan_id: "pro", model_id: "grok" },
    { plan_id: "pro", model_id: "gpt" },
    { plan_id: "pro", model_id: "claude" },
    { plan_id: "pro", model_id: "kimi" },
  ],
};

export function formatUsdFromCents(cents: number): string {
  if (!Number.isFinite(cents) || cents <= 0) {
    return "$0";
  }
  if (cents % 100 === 0) {
    return `$${cents / 100}`;
  }
  return `$${(cents / 100).toFixed(2)}`;
}

function priceCadence(plan: CatalogPlanRow): { price: string; cadence: string } {
  if (plan.monthly_price_cents <= 0) {
    return { price: "$0", cadence: "No bill" };
  }
  const price = formatUsdFromCents(plan.monthly_price_cents);
  if (plan.yearly_price_cents && plan.yearly_price_cents > 0) {
    return {
      price,
      cadence: `/ month · ${formatUsdFromCents(plan.yearly_price_cents)} / year`,
    };
  }
  return { price, cadence: "/ month" };
}

function toolsBullet(tools: readonly string[]): string {
  if (tools.length === 0) {
    return "No tools";
  }
  const labels = tools.map((id) => TOOL_LABEL[id] ?? id.replaceAll("_", " "));
  if (labels.length === 1) {
    return labels[0] ?? "No tools";
  }
  if (labels.length === 2) {
    return `${labels[0]}, ${labels[1]}`;
  }
  const last = labels[labels.length - 1];
  return `${labels.slice(0, -1).join(", ")}, and ${last}`;
}

function agentBullets(plan: CatalogPlanRow): string[] {
  if (plan.curated_agent_limit != null) {
    const max = plan.max_custom_agents ?? plan.curated_agent_limit;
    return [`Starter voices + ${max} of yours, public`];
  }
  if (plan.max_custom_agents == null) {
    return [
      "Every featured voice",
      "Unlimited custom agents, public or private",
    ];
  }
  return [
    "Every featured voice",
    `${plan.max_custom_agents} custom agents, public or private`,
  ];
}

function modelsForPlan(
  planId: string,
  models: readonly CatalogModelRow[],
  planModels: readonly CatalogPlanModelRow[],
): string[] {
  const allowed = new Set(
    planModels
      .filter((row) => row.plan_id === planId)
      .map((row) => row.model_id),
  );
  return models
    .filter((row) => row.is_enabled && allowed.has(row.id))
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id))
    .map((row) => row.id);
}

export function seatsFromCatalog(input: CatalogSeatsInput): Seat[] {
  const byId = new Map<MayaPlan, CatalogPlanRow>();
  for (const row of input.plans) {
    const id = parseMayaPlan(row.id);
    if (row.id !== id) {
      continue;
    }
    byId.set(id, row);
  }

  const seats: Seat[] = [];
  for (const id of PLAN_ORDER) {
    const plan = byId.get(id);
    if (!plan) {
      continue;
    }
    const chrome = SEAT_CHROME[id];
    const { price, cadence } = priceCadence(plan);
    seats.push({
      id,
      name: plan.display_name,
      price,
      cadence,
      stamp: chrome.stamp,
      stampTone: chrome.stampTone,
      cta: chrome.cta,
      bullets: [
        `${plan.daily_credit_limit.toLocaleString("en-US")} credits a day`,
        ...agentBullets(plan),
        plan.vector_memory ? "Private per-agent memory" : "No vector memory",
        toolsBullet(plan.tools_allowed),
      ],
      models: modelsForPlan(id, input.models, input.planModels),
    });
  }
  return seats;
}

export const FALLBACK_SEATS = seatsFromCatalog(FALLBACK_CATALOG);
