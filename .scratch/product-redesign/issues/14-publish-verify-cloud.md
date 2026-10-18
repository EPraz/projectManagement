# 14: Publish and verify the complete C redesign

**What to build:** The public portfolio demo serves the complete verified C experience through the existing free frontend/backend/database setup, with real navigation, editing and live updates working in the cloud.

**Blocked by:** 13 — Verify coherent C journeys across the complete product.

**Status:** resolved

Type: task

- [x] Publish the coherent verified result through existing deployment resources; retain the current public demo while work is staged and preserve data, provider domains and zero-cost constraints. Do not add paid resources or keep-alive automation.
- [x] Preserve sessions, API routing/deep-link reloads and WebSocket configuration; deployment/startup does not reset/reseed visitor data. No schema/backend rewrite or database migration is assumed; any genuinely required contract change must already have been tested in its owning slice.
- [x] Verify deployed revisions and hosted CI, then check real public entry, populated Projects, both themes, responsive project/work/planning/retrospective navigation and canonical updates using existing safe demo verification practices.
- [x] Retain useful cold-start/retry feedback and recovery behavior. Document the verified release/rollback reference and any material hosting limitation; do not claim local preview evidence proves cloud behavior.
- [x] Handoff to the deferred English README/walkthrough effort only after cloud checks. Keep the owner's explicit final design/readiness approval before recording; this ticket does not authorize a recording or require a new intermediate design approval.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after verified integration. Publish to the existing GitHub-connected free services, verify hosted CI/revisions and bounded public HTTP/browser/socket behavior; preserve data and recording checkpoint.

## Answer

Published verified release0d32eb3 to existing production Vercel/Render resources; exact provider revisions and production alias confirmed. Required hosted Quality run39116778240 passes all three jobs, including257 production-browser journeys. Bounded public HTTP/session/socket checks and real Chrome exploration of all8 areas in both themes at390/1280 pass, including deep links/reloads and editors; zero browser exceptions. Public content remains populated (2 projects), no reset/migration/paid resource/keepalive was introduced.

[Publication evidence, provider IDs, CI and rollback references](../evidence/14-publication.md) records actual cloud behavior and free-hosting limits. Local owned verification processes stopped; user applications and data were preserved. All14 tickets are resolved. English recruiter README and silent walkthrough remain deferred until owner feedback; explicit owner final visual/readiness approval is still required before recording. No video/trace recorded.
