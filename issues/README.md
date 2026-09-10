# Maya Chat — QA Engineering Defect & Audit Report

**Audit Date**: September 10, 2026  
**QA Lead**: Antigravity Staff QA Engineer  
**Target Release**: Web MVP (Phase 2–4 Verification)  
**Status**: Ready for Engineering Review  

---

## Executive Summary

A comprehensive quality assurance and architectural audit was performed on the Maya Chat codebase, spanning the PostgreSQL/Supabase schema, Next.js 15 App Router endpoints, Vercel AI SDK integration, and `@maya/shared` domain logic.

While the foundation demonstrates sound multi-tenant security principles (RLS, PostgreSQL advisory locks, prompt IP isolation) and distinct brand identity, **10 issues** have been logged across functional correctness, concurrency, query performance, and specification drift.

---

## Ticket Index

| Ticket | Type | Priority | Component | Summary |
| :--- | :--- | :---: | :--- | :--- |
| **[MAYA-101](./MAYA-101-inverted-history-limit.md)** | Bug | **P0 (Blocker)** | API / Chat History | Inverted conversation history limit loads oldest turns instead of newest |
| **[MAYA-102](./MAYA-102-quota-check-toctou-race.md)** | Bug / Race Condition | **P0 (Critical)** | API / Rate Limiting | TOCTOU race condition in daily quota enforcement allows cap bypass |
| **[MAYA-103](./MAYA-103-unbounded-public-agents-scan.md)** | Performance | **P1 (High)** | House / SSR Loader | Unbounded public agents query in `loadHouse` causes full table scan |
| **[MAYA-104](./MAYA-104-conversation-retitling-ineffective.md)** | Bug | **P2 (Medium)** | API / Persistence | Auto-retitling logic fails when conversation title defaults to `'New Chat'` |
| **[MAYA-105](./MAYA-105-abandoned-empty-conversations.md)** | Bug / UX | **P2 (Medium)** | Client / House View | Premature conversation creation leaves orphaned empty threads in DB & UI |
| **[MAYA-106](./MAYA-106-prompt-compiler-bio-tone-ignored.md)** | Architecture / Feature | **P1 (High)** | AI / Prompt Engine | Custom tone sliders & user bio ignored during prompt construction |
| **[MAYA-107](./MAYA-107-model-selection-inoperative.md)** | Architecture / Feature | **P1 (High)** | API / Model Routing | Model selection per plan is inoperative; chat hardcoded to default model |
| **[MAYA-108](./MAYA-108-landing-pricing-catalog-drift.md)** | Spec Drift / Integrity | **P2 (Medium)** | Marketing / Landing | Pricing & model lists on landing page are hardcoded, bypassing SQL catalog |
| **[MAYA-109](./MAYA-109-memory-rpc-service-role-failure.md)** | Bug / Database | **P2 (Medium)** | Database / pgvector | `match_agent_memories` RPC fails for service role & lacks tenant index isolation |
| **[MAYA-110](./MAYA-110-unbounded-user-conversations-query.md)** | Performance | **P3 (Low)** | House / Threads | Unbounded, unpaginated conversation query degrades with user tenure |

---

## Severity Definitions

- **P0 (Blocker / Critical)**: Severe functional breakdown, data corruption, financial leakage, or security bypass. Must be resolved prior to any production deployment.
- **P1 (High)**: Major architectural flaw, high-impact performance bottleneck under scale, or core product specification deviation.
- **P2 (Medium)**: Noticeable user-facing defect, UI inconsistency, or edge-case failure with available workaround.
- **P3 (Low)**: Minor optimization, hygiene improvement, or non-blocking cosmetic cleanup.

---

## Recommended Triage Priority

1. **Immediate P0 Patch**: Resolve **MAYA-101** (Chat Amnesia) and **MAYA-102** (Daily Quota Bypass). Both directly impact core conversational continuity and token billing costs.
2. **High-Priority Performance Patch**: Resolve **MAYA-103** before community users create public custom agents in Studio.
3. **Core Specification Alignment**: Address **MAYA-106** and **MAYA-107** to unlock character customization and tier-differentiated LLMs as promised in product documentation.
