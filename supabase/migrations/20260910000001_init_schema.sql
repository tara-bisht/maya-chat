-- Maya Chat Phase 1 schema: tables, RLS, grants, catalog seed, auth trigger, memory RPC.

create extension if not exists vector with schema extensions;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  preferred_language text not null default 'en',
  global_bio text,
  plan text check (plan in ('free', 'plus', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  tagline text not null,
  avatar_url text,
  category text not null check (
    category in ('learning', 'philosophy', 'productivity', 'wellbeing', 'lifestyle', 'custom')
  ),
  system_prompt text not null,
  language_preset text not null default 'en',
  tone_settings jsonb not null default '{"warmth": 0.8, "directness": 0.5, "humor": 0.5}'::jsonb,
  tools_enabled text[] not null default '{}',
  is_curated boolean not null default false,
  is_public boolean not null default false,
  free_tier boolean not null default false,
  created_at timestamptz not null default now(),
  constraint agents_curated_owner_chk check (
    (is_curated = true and user_id is null)
    or (is_curated = false)
  )
);

create table public.agent_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  agent_id uuid not null references public.agents (id) on delete cascade,
  content text not null,
  embedding extensions.vector(1024), -- dim pinned; OpenRouter embedding model chosen in the memory PR
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  agent_id uuid not null references public.agents (id) on delete cascade,
  title text not null default 'New Chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system', 'tool')),
  content text not null,
  tool_calls jsonb,
  tokens_used integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.models (
  id text primary key,
  gateway_id text not null,
  display_name text not null,
  provider text not null,
  supports_tools boolean not null default true,
  is_enabled boolean not null default true,
  sort_order integer not null default 0
);

create table public.plans (
  id text primary key,
  display_name text not null,
  monthly_price_cents integer not null default 0,
  yearly_price_cents integer,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  daily_message_limit integer,
  max_custom_agents integer,
  curated_agent_limit integer,
  vector_memory boolean not null default false,
  tools_allowed text[] not null default '{}',
  default_model_id text not null references public.models (id),
  is_active boolean not null default true
);

create table public.plan_models (
  plan_id text not null references public.plans (id) on delete cascade,
  model_id text not null references public.models (id) on delete cascade,
  primary key (plan_id, model_id)
);

create table public.entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'free' references public.plans (id),
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled')),
  source text not null default 'manual' check (source in ('stripe', 'revenuecat', 'manual')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_type text not null check (event_type in ('chat_turn')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index agents_user_id_idx on public.agents (user_id);
create index agent_memories_user_agent_idx on public.agent_memories (user_id, agent_id);
create index agent_memories_agent_id_idx on public.agent_memories (agent_id);
create index agent_memories_embedding_idx
  on public.agent_memories
  using hnsw (embedding extensions.vector_cosine_ops);
create index conversations_user_id_idx on public.conversations (user_id);
create index conversations_agent_id_idx on public.conversations (agent_id);
create index messages_conversation_created_idx
  on public.messages (conversation_id, created_at);
create index usage_events_user_day on public.usage_events (user_id, created_at);
create index entitlements_plan_idx on public.entitlements (plan);
create index plan_models_model_id_idx on public.plan_models (model_id);
create index plans_default_model_id_idx on public.plans (default_model_id);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.set_updated_at();

create trigger entitlements_set_updated_at
  before update on public.entitlements
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.agent_memories enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.models enable row level security;
alter table public.plans enable row level security;
alter table public.plan_models enable row level security;
alter table public.entitlements enable row level security;
alter table public.usage_events enable row level security;

create policy "Users select own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users update own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users select curated public or own agents"
  on public.agents
  for select
  to authenticated
  using (
    is_curated = true
    or is_public = true
    or (select auth.uid()) = user_id
  );

create policy "Users insert own custom agents"
  on public.agents
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and is_curated = false
    and user_id is not null
  );

create policy "Users update own custom agents"
  on public.agents
  for update
  to authenticated
  using ((select auth.uid()) = user_id and is_curated = false)
  with check ((select auth.uid()) = user_id and is_curated = false);

create policy "Users delete own custom agents"
  on public.agents
  for delete
  to authenticated
  using ((select auth.uid()) = user_id and is_curated = false);

create policy "Users select own memories"
  on public.agent_memories
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users insert own memories"
  on public.agent_memories
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users update own memories"
  on public.agent_memories
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete own memories"
  on public.agent_memories
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users select own conversations"
  on public.conversations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users insert own conversations"
  on public.conversations
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users update own conversations"
  on public.conversations
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete own conversations"
  on public.conversations
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users select messages in own conversations"
  on public.messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = (select auth.uid())
    )
  );

create policy "Users insert messages in own conversations"
  on public.messages
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = (select auth.uid())
    )
  );

create policy "Users update messages in own conversations"
  on public.messages
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = (select auth.uid())
    )
  );

create policy "Users delete messages in own conversations"
  on public.messages
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and c.user_id = (select auth.uid())
    )
  );

create policy "Authenticated read models"
  on public.models
  for select
  to authenticated
  using (true);

create policy "Authenticated read plans"
  on public.plans
  for select
  to authenticated
  using (true);

create policy "Authenticated read plan_models"
  on public.plan_models
  for select
  to authenticated
  using (true);

create policy "Users read own entitlement"
  on public.entitlements
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users read own usage"
  on public.usage_events
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users insert own usage"
  on public.usage_events
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Data API grants (explicit; anon gets nothing)
-- ---------------------------------------------------------------------------

grant usage on schema public to authenticated, service_role;

grant select, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.agents to authenticated;
grant select, insert, update, delete on table public.agent_memories to authenticated;
grant select, insert, update, delete on table public.conversations to authenticated;
grant select, insert, update, delete on table public.messages to authenticated;
grant select on table public.models to authenticated;
grant select on table public.plans to authenticated;
grant select on table public.plan_models to authenticated;
grant select on table public.entitlements to authenticated;
grant select, insert on table public.usage_events to authenticated;

grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.agents to service_role;
grant select, insert, update, delete on table public.agent_memories to service_role;
grant select, insert, update, delete on table public.conversations to service_role;
grant select, insert, update, delete on table public.messages to service_role;
grant select, insert, update, delete on table public.models to service_role;
grant select, insert, update, delete on table public.plans to service_role;
grant select, insert, update, delete on table public.plan_models to service_role;
grant select, insert, update, delete on table public.entitlements to service_role;
grant select, insert, update, delete on table public.usage_events to service_role;

-- ---------------------------------------------------------------------------
-- Catalog seed (config data; required before the signup trigger)
-- ---------------------------------------------------------------------------

-- OpenRouter slugs, pinned 2026-09-10. Keep in sync with apps/web/lib/openrouter/catalog.ts.
-- grok-fast: xai/grok-4-1-fast is not on OpenRouter; x-ai/grok-4.20 is the current cheap/fast Grok.
insert into public.models (id, gateway_id, display_name, provider, supports_tools, is_enabled, sort_order)
values
  ('gemini-flash', 'google/gemini-2.5-flash', 'Gemini Flash', 'google', true, true, 10),
  ('grok-fast', 'x-ai/grok-4.20', 'Grok Fast', 'xai', true, true, 20),
  ('deepseek', 'deepseek/deepseek-chat', 'DeepSeek', 'deepseek', true, true, 30),
  ('qwen', 'qwen/qwen3-235b-a22b', 'Qwen', 'qwen', true, true, 40),
  ('grok', 'x-ai/grok-4.5', 'Grok', 'xai', true, true, 50),
  ('gpt', 'openai/gpt-5.4', 'GPT', 'openai', true, true, 60),
  ('claude', 'anthropic/claude-sonnet-4.5', 'Claude', 'anthropic', true, true, 70),
  ('kimi', 'moonshotai/kimi-k2.5', 'Kimi', 'moonshot', true, true, 80)
on conflict (id) do update set
  gateway_id = excluded.gateway_id,
  display_name = excluded.display_name,
  provider = excluded.provider,
  supports_tools = excluded.supports_tools,
  is_enabled = excluded.is_enabled,
  sort_order = excluded.sort_order;

insert into public.plans (
  id,
  display_name,
  monthly_price_cents,
  yearly_price_cents,
  daily_message_limit,
  max_custom_agents,
  curated_agent_limit,
  vector_memory,
  tools_allowed,
  default_model_id,
  is_active
)
values
  ('free', 'Free', 0, null, 50, 0, 2, false, '{}', 'gemini-flash', true),
  ('plus', 'Plus', 900, 9000, 200, 5, null, true, '{memory_saver,math_solver}', 'grok', true),
  ('pro', 'Pro', 1900, 19000, null, null, null, true, '{memory_saver,math_solver,web_search}', 'claude', true)
on conflict (id) do update set
  display_name = excluded.display_name,
  monthly_price_cents = excluded.monthly_price_cents,
  yearly_price_cents = excluded.yearly_price_cents,
  daily_message_limit = excluded.daily_message_limit,
  max_custom_agents = excluded.max_custom_agents,
  curated_agent_limit = excluded.curated_agent_limit,
  vector_memory = excluded.vector_memory,
  tools_allowed = excluded.tools_allowed,
  default_model_id = excluded.default_model_id,
  is_active = excluded.is_active;

insert into public.plan_models (plan_id, model_id)
values
  ('free', 'gemini-flash'),
  ('free', 'grok-fast'),
  ('plus', 'gemini-flash'),
  ('plus', 'grok-fast'),
  ('plus', 'deepseek'),
  ('plus', 'qwen'),
  ('plus', 'grok'),
  ('plus', 'gpt'),
  ('pro', 'gemini-flash'),
  ('pro', 'grok-fast'),
  ('pro', 'deepseek'),
  ('pro', 'qwen'),
  ('pro', 'grok'),
  ('pro', 'gpt'),
  ('pro', 'claude'),
  ('pro', 'kimi')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Signup trigger: profiles + free entitlement
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, preferred_language, plan)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    coalesce(new.raw_user_meta_data ->> 'preferred_language', 'en'),
    'free'
  );

  insert into public.entitlements (user_id, plan, status, source)
  values (new.id, 'free', 'active', 'manual');

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Memory RPC — isolation is user_id + agent_id in SQL
-- ---------------------------------------------------------------------------

create or replace function public.match_agent_memories(
  p_agent_id uuid,
  p_query extensions.vector(1024),
  p_match_count integer default 8
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity double precision
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    m.id,
    m.content,
    m.metadata,
    1 - (m.embedding <=> p_query) as similarity
  from public.agent_memories as m
  where m.user_id = (select auth.uid())
    and m.agent_id = p_agent_id
    and m.embedding is not null
  order by m.embedding <=> p_query
  limit least(coalesce(p_match_count, 8), 16);
$$;

revoke all on function public.match_agent_memories(uuid, extensions.vector, integer) from public, anon;
grant execute on function public.match_agent_memories(uuid, extensions.vector, integer) to authenticated, service_role;
