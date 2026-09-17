# [MAYA-115] Dual Plan Truth: `profiles.plan` vs `entitlements.plan` Drift With No Sync

| Field | Value |
| :--- | :--- |
| **Issue Key** | MAYA-115 |
| **Issue Type** | 🏗️ Architecture / Data Integrity |
| **Status** | Done (PR4c) |
| **Priority** | 🟠 P1 (High) |
| **Severity** | Major (entitlement drift, billing disputes) |
| **Component** | Database (Catalog / Entitlements) |
| **Affects Versions** | Web MVP, Stripe PR4 |
| **Reporter** | Staff QA Engineer |
| **Assignee** | Database Pod |

---

## 1. Summary
Two columns both claimed to be "the user's plan" with no sync: `profiles.plan TEXT CHECK (free/plus/pro)` (not an FK) and `entitlements.plan FK → plans(id)` (canonical). `handle_new_user` wrote `'free'` to both.

PR4c dropped `profiles.plan`. Signup and the Stripe webhook write only `entitlements`.

---

## 8. Acceptance Criteria (AC)
- [x] Exactly one writable plan column (`entitlements.plan`).
- [x] No `SELECT plan FROM profiles` reader in app code.
- [x] Webhook updates one place; seat reads never drift.

---

## 9. Tech Lead Review

Dropped `profiles.plan` in `20260917120000_stripe_events_drop_profiles_plan.sql`. Webhook (`processStripeEvent`) updates `entitlements` only.
