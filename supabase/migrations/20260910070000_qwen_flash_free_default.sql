-- Add Qwen 3.8 Flash to catalog and set as default model for Free tier.

insert into public.models (id, gateway_id, display_name, provider, supports_tools, is_enabled, sort_order)
values
  ('qwen-flash', 'qwen/qwen3.8-flash', 'Qwen Flash', 'qwen', true, true, 15)
on conflict (id) do update set
  gateway_id = excluded.gateway_id,
  display_name = excluded.display_name,
  provider = excluded.provider,
  supports_tools = excluded.supports_tools,
  is_enabled = excluded.is_enabled,
  sort_order = excluded.sort_order;

insert into public.plan_models (plan_id, model_id)
values
  ('free', 'qwen-flash'),
  ('plus', 'qwen-flash'),
  ('pro', 'qwen-flash')
on conflict do nothing;

update public.plans
set default_model_id = 'qwen-flash'
where id = 'free';
