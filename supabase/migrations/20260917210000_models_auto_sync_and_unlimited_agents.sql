-- Auto-sync plan entitlements on model changes, expand catalog to 57 models, and allow unlimited custom agents with free private roles.

-- 1. Automated plan-models sync trigger
create or replace function public.sync_model_plans()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.is_enabled = false then
    delete from public.plan_models where model_id = new.id;
    return new;
  end if;

  -- Always available to paid plans (plus, pro)
  insert into public.plan_models (plan_id, model_id)
  values ('plus', new.id), ('pro', new.id)
  on conflict do nothing;

  -- Available to free plan ONLY if output token rate <= $20/1M
  if new.output_usd_per_million <= 20.00 then
    insert into public.plan_models (plan_id, model_id)
    values ('free', new.id)
    on conflict do nothing;
  else
    delete from public.plan_models where plan_id = 'free' and model_id = new.id;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_model_plans() from public;
grant execute on function public.sync_model_plans() to postgres, service_role;

drop trigger if exists trg_models_sync_plan_entitlements on public.models;
create trigger trg_models_sync_plan_entitlements
  after insert or update of output_usd_per_million, is_enabled
  on public.models
  for each row
  execute function public.sync_model_plans();

-- 2. Remove custom agent limits and curated limits from all plans
update public.plans
set max_custom_agents = null,
    curated_agent_limit = null;

-- 3. Update private.enforce_custom_agent_quota() to remove studio_private_forbidden
create or replace function private.enforce_custom_agent_quota()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_plan text;
  v_max integer;
  v_live integer;
  v_becoming_live boolean;
begin
  if new.is_curated then
    return new;
  end if;

  v_uid := (select auth.uid());

  if v_uid is null or new.user_id is distinct from v_uid then
    raise exception 'studio_owner_required' using errcode = 'P0001';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(v_uid::text));

  select e.plan, p.max_custom_agents
    into v_plan, v_max
  from public.entitlements as e
  inner join public.plans as p on p.id = e.plan
  where e.user_id = v_uid;

  if v_plan is null then
    raise exception 'studio_no_entitlement' using errcode = 'P0001';
  end if;

  v_becoming_live :=
    (tg_op = 'INSERT' and new.archived_at is null)
    or (
      tg_op = 'UPDATE'
      and old.archived_at is not null
      and new.archived_at is null
    );

  if v_becoming_live and v_max is not null then
    select count(*)::integer
      into v_live
    from public.agents as a
    where a.user_id = v_uid
      and a.is_curated = false
      and a.archived_at is null;

    if v_live >= v_max then
      raise exception 'studio_cap' using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_custom_agent_quota() from public;
revoke all on function private.enforce_custom_agent_quota() from anon, authenticated;

-- 4. Mark all curated agents as free tier accessible
update public.agents
set free_tier = true
where is_curated = true;

-- 5. Insert/upsert the 57 catalog models
insert into public.models (
  id,
  gateway_id,
  display_name,
  provider,
  supports_tools,
  is_enabled,
  sort_order,
  input_usd_per_million,
  output_usd_per_million
)
values
  ('qwen-flash', 'qwen/qwen3.8-flash', 'Qwen Flash', 'qwen', true, true, 10, 0.15, 0.47),
  ('gemini-flash', 'google/gemini-2.5-flash', 'Gemini Flash', 'google', true, true, 15, 0.3, 2.5),
  ('grok-fast', 'x-ai/grok-4.20', 'Grok Fast', 'xai', true, true, 20, 1.25, 2.5),
  ('deepseek', 'deepseek/deepseek-chat', 'DeepSeek', 'deepseek', true, true, 30, 0.2574, 1.0287),
  ('qwen', 'qwen/qwen3-235b-a22b', 'Qwen', 'qwen', true, true, 40, 0.455, 1.82),
  ('grok', 'x-ai/grok-4.5', 'Grok', 'xai', true, true, 50, 2, 6),
  ('gpt', 'openai/gpt-5.4', 'GPT', 'openai', true, true, 60, 2.5, 15),
  ('claude', 'anthropic/claude-sonnet-4.5', 'Claude', 'anthropic', true, true, 70, 3, 15),
  ('kimi', 'moonshotai/kimi-k2.5', 'Kimi', 'moonshot', true, true, 80, 0.45, 2.25),
  ('gpt-6-astra', 'openai/gpt-6-astra', 'GPT-6 Astra', 'openai', true, true, 100, 10, 50),
  ('gpt-6-astra-pro', 'openai/gpt-6-astra-pro', 'GPT-6 Astra Pro', 'openai', true, true, 101, 10, 50),
  ('gpt-5-6-luna-pro', 'openai/gpt-5.6-luna-pro', 'GPT-5.6 Luna Pro', 'openai', true, true, 102, 0.2, 1.2),
  ('gpt-5-6-luna', 'openai/gpt-5.6-luna', 'GPT-5.6 Luna', 'openai', true, true, 103, 0.2, 1.2),
  ('gpt-5-6-terra-pro', 'openai/gpt-5.6-terra-pro', 'GPT-5.6 Terra Pro', 'openai', true, true, 104, 2, 12),
  ('claude-fable-5-1', 'anthropic/claude-fable-5.1', 'Claude Fable 5.1', 'anthropic', true, true, 105, 10, 50),
  ('claude-opus-5', 'anthropic/claude-opus-5', 'Claude Opus 5', 'anthropic', true, true, 106, 5, 25),
  ('claude-sonnet-5', 'anthropic/claude-sonnet-5', 'Claude Sonnet 5', 'anthropic', true, true, 107, 2, 10),
  ('claude-fable-5', 'anthropic/claude-fable-5', 'Claude Fable 5', 'anthropic', true, true, 108, 10, 50),
  ('claude-opus-4-8', 'anthropic/claude-opus-4.8', 'Claude Opus 4.8', 'anthropic', true, true, 109, 5, 25),
  ('gemini-3-8-flash', 'google/gemini-3.8-flash', 'Gemini 3.8 Flash', 'google', true, true, 110, 0.75, 3.75),
  ('gemini-3-7-flash', 'google/gemini-3.7-flash', 'Gemini 3.7 Flash', 'google', true, true, 111, 0.75, 3.75),
  ('gemini-3-6-flash', 'google/gemini-3.6-flash', 'Gemini 3.6 Flash', 'google', true, true, 112, 0.75, 3.75),
  ('gemini-3-5-flash-lite', 'google/gemini-3.5-flash-lite', 'Gemini 3.5 Flash Lite', 'google', true, true, 113, 0.3, 2.5),
  ('gemini-3-1-flash-lite-image', 'google/gemini-3.1-flash-lite-image', 'Nano Banana 2 Lite', 'google', true, true, 114, 0.25, 1.5),
  ('deepseek-v4-1-flash', 'deepseek/deepseek-v4.1-flash', 'DeepSeek V4.1 Flash', 'deepseek', true, true, 115, 0.15, 0.6),
  ('deepseek-v4-flash-vision-exp', 'deepseek/deepseek-v4-flash-vision-exp', 'DeepSeek V4 Flash Vision Exp', 'deepseek', true, true, 116, 0.22, 0.66),
  ('deepseek-v4-pro-0813', 'deepseek/deepseek-v4-pro-0813', 'DeepSeek V4 Pro 0813', 'deepseek', true, true, 117, 0.66, 1.98),
  ('deepseek-v4-flash-0731', 'deepseek/deepseek-v4-flash-0731', 'DeepSeek V4 Flash 0731', 'deepseek', true, true, 118, 0.06, 0.12),
  ('deepseek-v4-pro', 'deepseek/deepseek-v4-pro', 'DeepSeek V4 Pro 0423', 'deepseek', true, true, 119, 1.6, 3.2),
  ('grok-4-6', 'x-ai/grok-4.6', 'Grok 4.6', 'xai', true, true, 120, 2, 6),
  ('grok-build-0-1', 'x-ai/grok-build-0.1', 'Grok Build 0.1', 'xai', true, true, 121, 1, 2),
  ('grok-4-3', 'x-ai/grok-4.3', 'Grok 4.3', 'xai', true, true, 122, 1.25, 2.5),
  ('grok-4-20-multi-agent', 'x-ai/grok-4.20-multi-agent', 'Grok 4.20 Multi-Agent', 'xai', true, true, 123, 1.25, 2.5),
  ('llama-4-maverick', 'meta-llama/llama-4-maverick', 'Llama 4 Maverick', 'meta', true, true, 124, 0.1875, 0.6525),
  ('llama-4-scout', 'meta-llama/llama-4-scout', 'Llama 4 Scout', 'meta', true, true, 125, 0.1, 0.3),
  ('llama-3-3-70b-instruct', 'meta-llama/llama-3.3-70b-instruct', 'Llama 3.3 70B Instruct', 'meta', true, true, 126, 0.1, 0.32),
  ('llama-3-2-1b-instruct', 'meta-llama/llama-3.2-1b-instruct', 'Llama 3.2 1B Instruct', 'meta', true, true, 127, 0.027, 0.201),
  ('llama-3-2-3b-instruct', 'meta-llama/llama-3.2-3b-instruct', 'Llama 3.2 3B Instruct', 'meta', true, true, 128, 0.05, 0.33),
  ('mistral-medium-3-5', 'mistralai/mistral-medium-3-5', 'Mistral Medium 3.5', 'mistral', true, true, 129, 1.5, 7.5),
  ('mistral-small-2603', 'mistralai/mistral-small-2603', 'Mistral Small 4', 'mistral', true, true, 130, 0.15, 0.6),
  ('devstral-2512', 'mistralai/devstral-2512', 'Devstral 2 2512', 'mistral', true, true, 131, 0.4, 2),
  ('ministral-14b-2512', 'mistralai/ministral-14b-2512', 'Ministral 3 14B 2512', 'mistral', true, true, 132, 0.2, 0.2),
  ('ministral-8b-2512', 'mistralai/ministral-8b-2512', 'Ministral 3 8B 2512', 'mistral', true, true, 133, 0.15, 0.15),
  ('qwen3-8-max-0902', 'qwen/qwen3.8-max-0902', 'Qwen3.8 Max', 'qwen', true, true, 134, 2, 6),
  ('qwen3-8-27b', 'qwen/qwen3.8-27b', 'Qwen3.8 27B', 'qwen', true, true, 135, 0.214, 2.55),
  ('qwen3-8-2-4t-a95b', 'qwen/qwen3.8-2.4t-a95b', 'Qwen3.8 2.4T A95B', 'qwen', true, true, 136, 2, 6),
  ('qwen3-7-flash', 'qwen/qwen3.7-flash', 'Qwen3.7 Flash', 'qwen', true, true, 137, 0.03, 0.13),
  ('qwen3-7-plus', 'qwen/qwen3.7-plus', 'Qwen3.7 Plus', 'qwen', true, true, 138, 0.32, 1.28),
  ('kimi-k3', 'moonshotai/kimi-k3', 'Kimi K3', 'moonshot', true, true, 139, 3, 15),
  ('kimi-k2-7-code', 'moonshotai/kimi-k2.7-code', 'Kimi K2.7 Code', 'moonshot', true, true, 140, 0.7062, 3.21),
  ('kimi-k2-6', 'moonshotai/kimi-k2.6', 'Kimi K2.6', 'moonshot', true, true, 141, 0.95, 4),
  ('kimi-k2-thinking', 'moonshotai/kimi-k2-thinking', 'Kimi K2 Thinking', 'moonshot', true, true, 142, 0.6, 2.5),
  ('kimi-k2-0905', 'moonshotai/kimi-k2-0905', 'Kimi K2 0905', 'moonshot', true, true, 143, 0.6, 2.5),
  ('command-a', 'cohere/command-a', 'Command A', 'cohere', true, true, 144, 2.5, 10),
  ('command-r7b-12-2024', 'cohere/command-r7b-12-2024', 'Command R7B', 'cohere', true, true, 145, 0.0375, 0.15),
  ('command-r-08-2024', 'cohere/command-r-08-2024', 'Command R', 'cohere', true, true, 146, 0.15, 0.6),
  ('command-r-plus-08-2024', 'cohere/command-r-plus-08-2024', 'Command R+', 'cohere', true, true, 147, 2.5, 10)
on conflict (id) do update set
  gateway_id = excluded.gateway_id,
  display_name = excluded.display_name,
  provider = excluded.provider,
  supports_tools = excluded.supports_tools,
  is_enabled = excluded.is_enabled,
  sort_order = excluded.sort_order,
  input_usd_per_million = excluded.input_usd_per_million,
  output_usd_per_million = excluded.output_usd_per_million;

-- 6. Ensure plan_models is populated for all existing models
insert into public.plan_models (plan_id, model_id)
select p.id, m.id
from public.plans as p
cross join public.models as m
where m.is_enabled = true
  and (p.id in ('plus', 'pro') or m.output_usd_per_million <= 20.00)
on conflict do nothing;

delete from public.plan_models
where plan_id = 'free'
  and model_id in (select id from public.models where output_usd_per_million > 20.00);
