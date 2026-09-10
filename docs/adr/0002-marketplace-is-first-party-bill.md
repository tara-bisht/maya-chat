# Marketplace is a first-party public bill

The PRD’s “marketplace” is community sharing of Studio characters, deferred to v1.1. `/marketplace` is a public discovery lobby of the company plus named coming-soon posters, grouped by category. Browse is open; Talk requires sign-in. User-owned custom agents stay off this wall.

Coming-soon players live in a static catalog (`apps/web/lib/marketplace/bill.ts`), not `public.agents`. Putting them in the table would make them chat-able or force a status column and compiler guards; a public `select` on `agents` would also risk leaking `system_prompt` without a view. The eight live posters stay `COMPANY` — same source as the landing strip. Gallery remains the authenticated, DB-backed wall.

When chat exists, only `talkHref` changes. Community marketplace stays v1.1.
