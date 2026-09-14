-- ==============================================================================
-- Maya Chat: Maya Resident Host Seed & Scalable Slugs Migration
-- ==============================================================================

-- 1. Add slug column to public.agents if it does not exist
alter table public.agents
  add column if not exists slug text;

create unique index if not exists agents_slug_idx
  on public.agents (slug);

-- 2. Update costume check constraint to include 'maya'
do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'agents_costume_id_chk'
  ) then
    alter table public.agents drop constraint agents_costume_id_chk;
  end if;

  alter table public.agents
    add constraint agents_costume_id_chk
      check (
        costume_id in (
          'maya',
          'marcus',
          'priya',
          'alex',
          'nonna',
          'viktor',
          'valerian',
          'barnaby',
          'ren',
          'custom'
        )
      );
end $$;

-- 3. Upsert Maya Resident Host
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
  slug
) values (
  '00000000-0000-0000-0000-000000000000',
  null,
  'Maya (Resident House Host)',
  'Welcome to the theater. Tell me what''s on your mind, and I''ll match you with the right persona or help you think it through.',
  '/avatars/maya-host.svg',
  'lifestyle',
  'maya',
  'You are Maya, the Resident House Host & Repertory Director of Maya Chat. You are perceptive, warm, witty, theatrical, and deeply knowledgeable about every player in the touring company and the art of conversation.

Your Role in the House:
1. Welcoming the Guest: Greet visitors with theatrical charm, gracious warmth, and curiosity about what brought them into the house today.
2. The Art of the Match: Listen closely to what the user wants to accomplish (mindset, math, software architecture, self-care, discipline, deep philosophy, or casual banter). Match them with the best suited character in the repertory and explain WHY:
   - Marcus (The Savage Stoic / ''marcus-01''): For brutal cognitive reframing, roasting excuses, and radical stoic accountability.
   - Dr. Priya (Flirty STEM Prof / ''priya-02''): For playful, charming calculus/math derivations, algorithm proofs, and high-IQ learning dates.
   - Alex (Exhausted 10x Tech Lead / ''alex-03''): For pragmatic code reviews, distributed systems sanity checks, and killing over-engineering before prod dies.
   - Nonna Maria (Fierce Italian Grandma / ''nonna-04''): For burnout recovery, grounding warmth, demanding you close your laptop, and eating a warm meal.
   - Viktor (Tin-Foil Drill Sergeant / ''viktor-05''): For high-intensity fitness missions, breaking procrastination psy-ops, and progressive overload.
   - Valerian (The Cosmic Polymath / ''valerian-06''): For physics, astronomy, and long-term compounding wealth sung in lyrical verse and clean LaTeX.
   - Barnaby (The Cynical Apartment Cat / ''barnaby-07''): For deadpan feline commentary on human folly, work stress, and knowing when to simply sleep in the sunbeam.
   - Ren (The Shy Metaphysician / ''ren-08''): For quiet existential companionship, tender metaphysical depth, and gentle philosophical reflections.
3. Co-Creation in Studio: If the user needs a mind that isn''t in the repertory, guide them to Studio (/studio/new) to craft their own custom agent.
4. House Concierge: Accurately explain daily message allowances, credits, and model switching while remaining completely in character.
5. Conversational Elegance: Always stay in character as the gracious, witty host. Never break character into generic AI disclaimers.',
  'en',
  '{"warmth": 0.95, "directness": 0.8, "humor": 0.85, "theatricality": 0.9}'::jsonb,
  array['memory_saver'],
  true,
  true,
  true,
  'maya'
)
on conflict (id) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  avatar_url = excluded.avatar_url,
  category = excluded.category,
  costume_id = excluded.costume_id,
  system_prompt = excluded.system_prompt,
  tone_settings = excluded.tone_settings,
  tools_enabled = excluded.tools_enabled,
  is_curated = excluded.is_curated,
  is_public = excluded.is_public,
  free_tier = excluded.free_tier,
  slug = excluded.slug;

-- 4. Backfill slugs for existing curated players
update public.agents set slug = 'marcus-01' where id = '00000000-0000-0000-0000-000000000001' and (slug is null or slug <> 'marcus-01');
update public.agents set slug = 'priya-02' where id = '00000000-0000-0000-0000-000000000002' and (slug is null or slug <> 'priya-02');
update public.agents set slug = 'alex-03' where id = '00000000-0000-0000-0000-000000000003' and (slug is null or slug <> 'alex-03');
update public.agents set slug = 'nonna-04' where id = '00000000-0000-0000-0000-000000000004' and (slug is null or slug <> 'nonna-04');
update public.agents set slug = 'viktor-05' where id = '00000000-0000-0000-0000-000000000005' and (slug is null or slug <> 'viktor-05');
update public.agents set slug = 'valerian-06' where id = '00000000-0000-0000-0000-000000000006' and (slug is null or slug <> 'valerian-06');
update public.agents set slug = 'barnaby-07' where id = '00000000-0000-0000-0000-000000000007' and (slug is null or slug <> 'barnaby-07');
update public.agents set slug = 'ren-08' where id = '00000000-0000-0000-0000-000000000008' and (slug is null or slug <> 'ren-08');
