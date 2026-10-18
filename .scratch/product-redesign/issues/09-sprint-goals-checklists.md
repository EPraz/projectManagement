# 09: Plan sprint goals and checklists

**What to build:** A visitor creates and updates the selected sprint's real goals/checklists and understands their progress through C goal cards and responsive editing.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** resolved

Type: task

- [x] Preserve goal title/description/status, progress and checklist create/edit/delete/toggle operations using clear cards and responsive forms.
- [x] Checklist state and goal progress follow existing domain rules; a sprint name is never substituted for a stored goal.
- [x] Selected-sprint, no-sprint, empty, pending, failed-save/delete and late-response journeys retain correct ownership, entered data and server-confirmed results.
- [x] Maintain explicit actions, confirmations, accessible focus and mobile touch targets in both themes.
- [x] Verify a complete goal/checklist journey plus sprint-switch isolation and failure recovery against the existing planning contracts.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 08. Apply C goal/checklist cards and responsive protected forms while preserving canonical goal progress/status, all planning operations and sprint/late-response isolation.

## Answer

- Delivered responsive C goal/checklist cards with real title/description/status, stored server progress, accessible progress labels, checklist completion counts and all edit/delete/create/toggle operations. Goal state/progress remain governed by the existing transactional planning service; the sprint name is only context. Wide cards compare goals side by side; narrow actions/text wrap without overflow.
- The shared schema form now uses the contextual/full-screen editor, explicit pending state, reachable actions and keep/discard/save protection, retaining existing validation, confirmed-result and generation guards. Planning forms show actual sprint/project context, readable field labels and multiline goal descriptions. Compact form widths are explicit editor-shell options. Retained tests now explicitly discard intentionally cancelled dirty forms.
- Validation: dirty goal close red → green. Eleven planning/dirty-draft browser checks pass, then 21 goal layout/shared capacity/team regressions; seven follow-up planning/visual checks pass after field/layout polish. Includes failed save/toggle/delete, canonical 0/50/100 progress, late sprint response, independent edits and pending duplicate guards. Both themes checked at 320/390/768/1024/1440; captures inspected under `frontend/.tmp/studio/goals-verified/` and final polish retained under `goals-polish/`. Five existing shared-form component checks/snapshot, frontend types/lint pass (12 retained warnings, no errors). No public data/release changes or recording.
