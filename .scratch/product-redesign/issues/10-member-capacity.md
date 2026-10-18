# 10: Plan member capacity for the selected sprint

**What to build:** A visitor reviews and changes real member capacity/days off against sprint work through a C table on wide screens and expandable member cards on narrow screens.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** resolved

Type: task

- [x] Preserve capacity/day-off/remaining-work and progress calculations plus all currently supported capacity create/edit/delete actions and validation.
- [x] Use only actual member and sprint data. Remove the fixed Development activity claim; use a real meaningful label/value or omit the non-domain field.
- [x] Keep project membership requirements and canonical ownership; removed/moved members and sprint changes cannot retain invalid or stale capacity rows.
- [x] Support readable wide comparisons and narrow per-member cards with explicit actions, confirmed deletion and recoverable drafts/errors.
- [x] Verify capacity edits, zero/invalid inputs, empty/no-sprint, membership consistency, selected-sprint isolation and delayed/failed updates. Existing Team functionality suffices; its visual migration is not a blocker.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 09. Preserve capacity/day-off/remaining-work semantics and canonical membership ownership; replace the fixed Development claim and use a C wide comparison/compact member detail view with the verified protected forms.

## Answer

- Delivered C capacity comparison and expandable compact member cards, retaining real capacity/days off/remaining/completed work and existing progress formulas. Removed the fixed Development activity and placeholder avatar URLs. Actual member initials, sprint totals and clear capacity-specific actions replace ambiguous member-removal labels.
- Kept protected confirmed forms, existing positive-integer capacity and non-negative days/remaining validation, per-record pending guards, selected-sprint and membership ownership. Add capacity explains when all existing project members are already planned; empty capacity is distinguished from empty project membership. Compact indicators keep member cards close to the beginning of the page.
- Validation: compact-capacity red → green; 21 real capacity/team browser regressions pass, including failed edit/delete/create recovery, actual zero days/remaining with 100% progress, rejected zero capacity without a request, independent updates, late next-sprint draft, two-session membership consistency and keyboard creation with a genuinely available local fixture member. Both themes checked at 320/390/768/1024/1440; two final mobile polish checks plus types/lint pass (12 retained warnings, no errors). Captures inspected under `frontend/.tmp/studio/capacity-verified/`, compact indicator polish under `capacity-polish/`. No public data/release changes or recording.
