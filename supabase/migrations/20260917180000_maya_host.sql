-- Maya host row, Your-agents roster, conversation routing state.

alter table public.agents
  add column if not exists is_host boolean not null default false;

create unique index if not exists agents_one_host_idx
  on public.agents ((true))
  where is_host;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'agents_category_check'
      and conrelid = 'public.agents'::regclass
  ) then
    alter table public.agents drop constraint agents_category_check;
  end if;
end $$;

alter table public.agents
  add constraint agents_category_check
  check (
    category in (
      'learning',
      'philosophy',
      'productivity',
      'wellbeing',
      'lifestyle',
      'custom',
      'host'
    )
  );

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'agents_costume_id_chk'
      and conrelid = 'public.agents'::regclass
  ) then
    alter table public.agents drop constraint agents_costume_id_chk;
  end if;
end $$;

alter table public.agents
  add constraint agents_costume_id_chk
  check (
    costume_id in (
      'marcus',
      'priya',
      'alex',
      'nonna',
      'viktor',
      'valerian',
      'barnaby',
      'ren',
      'custom',
      'maya'
    )
  );

grant select (is_host) on table public.agents to authenticated;

alter table public.conversations
  add column if not exists host_route text not null default 'open';

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'conversations_host_route_check'
      and conrelid = 'public.conversations'::regclass
  ) then
    alter table public.conversations drop constraint conversations_host_route_check;
  end if;
end $$;

alter table public.conversations
  add constraint conversations_host_route_check
  check (host_route in ('open', 'stay', 'handed_off'));

create table if not exists public.agent_roster (
  user_id uuid not null references auth.users (id) on delete cascade,
  agent_id uuid not null references public.agents (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, agent_id)
);

create index if not exists agent_roster_user_idx
  on public.agent_roster (user_id, created_at desc);

comment on table public.agent_roster is
  'Official agents a member added to Your agents. Maya is implicit. Custom agents are implicit via agents.user_id.';

alter table public.agent_roster enable row level security;

create policy "Users select own roster"
  on public.agent_roster
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users insert own roster"
  on public.agent_roster
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.agents a
      where a.id = agent_id
        and a.is_curated = true
        and a.is_public = true
        and a.is_host = false
        and a.archived_at is null
    )
  );

create policy "Users delete own roster"
  on public.agent_roster
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on table public.agent_roster to authenticated;
grant select, insert, update, delete on table public.agent_roster to service_role;

insert into public.agents (
  id,
  user_id,
  name,
  tagline,
  avatar_url,
  category,
  costume_id,
  system_prompt,
  language_preset,
  tone_settings,
  tools_enabled,
  is_curated,
  is_public,
  free_tier,
  is_host
) values (
  '00000000-0000-0000-0000-00000000000a',
  null,
  'Maya',
  'Tell me the job. I''ll get you the person — or I''ll do it.',
  '/avatars/maya-host.svg',
  'host',
  'maya',
  'You are Maya, the host of Maya Chat. You are a named character: warm, sharp, a little rude, never bland, never corporate. People land with you first.

You CAN help. Answer the question. Write the snippet. Explain the integral. Talk through the plan. Stay yourself the whole time — you are not Priya, not Alex, not a generic assistant, and you are not a "super agent."

Your other job is the door. Official specialists are better at some jobs because they live there. You do not refuse work, and you do not dump a menu of names. If someone clearly needs a person who does not exist yet, help them describe that person.

Rules:
1. Lead with the answer. Do not open with a roster.
2. Never impersonate another agent or switch mid-thread. One conversation, one person: you.
3. Product facts only for plans, credits, and models. Do not invent prices.
4. Ask at most one or two questions when you need them. Do not interview forever.
5. Hinglish and Hindi are welcome when the user writes that way.
6. If they mention a durable preference (who they like, what they are trying to do), use memory_saver when you have it.

Tone: cool, graphic, a little rude. Not cute. Not a concierge script.',
  'en',
  '{"warmth": 0.7, "directness": 0.8, "humor": 0.55}'::jsonb,
  array['memory_saver'],
  true,
  true,
  true,
  true
)
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  avatar_url = excluded.avatar_url,
  category = excluded.category,
  costume_id = excluded.costume_id,
  system_prompt = excluded.system_prompt,
  language_preset = excluded.language_preset,
  tone_settings = excluded.tone_settings,
  tools_enabled = excluded.tools_enabled,
  is_curated = excluded.is_curated,
  is_public = excluded.is_public,
  free_tier = excluded.free_tier,
  is_host = true;
