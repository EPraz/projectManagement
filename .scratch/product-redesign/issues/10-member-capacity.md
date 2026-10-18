# 10: Plan member capacity for the selected sprint

**What to build:** A visitor reviews and changes real member capacity/days off against sprint work through a C table on wide screens and expandable member cards on narrow screens.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** ready-for-agent

Type: task

- [ ] Preserve capacity/day-off/remaining-work and progress calculations plus all currently supported capacity create/edit/delete actions and validation.
- [ ] Use only actual member and sprint data. Remove the fixed Development activity claim; use a real meaningful label/value or omit the non-domain field.
- [ ] Keep project membership requirements and canonical ownership; removed/moved members and sprint changes cannot retain invalid or stale capacity rows.
- [ ] Support readable wide comparisons and narrow per-member cards with explicit actions, confirmed deletion and recoverable drafts/errors.
- [ ] Verify capacity edits, zero/invalid inputs, empty/no-sprint, membership consistency, selected-sprint isolation and delayed/failed updates. Existing Team functionality suffices; its visual migration is not a blocker.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.
