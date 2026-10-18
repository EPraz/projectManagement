# 05: Create, edit and change task status within its ticket

**What to build:** A visitor manages a real task in the C editor, changes its state by an explicit accessible action and returns to its parent ticket with accurate work/progress information.

**Blocked by:** 04 — Create and edit tickets without losing context.

**Status:** resolved

Type: task

- [x] Preserve task creation, all existing fields/estimates/assignment, editing and confirmed deletion, using the C contextual/full-screen editor and real server outcomes.
- [x] Offer explicit Change status for touch/keyboard using the project's complete task-state catalog and existing mutation contract. Preserve creation defaults/domain rules and the task's parent ticket.
- [x] Task → parent returns to the ticket's Tasks context; preserve appropriate draft, focus, selection and navigation state with only one editor visible.
- [x] Completed/non-completed transitions and estimate changes use existing canonical progress semantics, including valid zero values; do not equate task state with ticket state or invent automatic ticket transitions.
- [x] Pending/error/retry, double submissions, late responses and live reconciliation keep task identity/data correct. No reparenting, reordering or ticket ordering is introduced.
- [x] Verify task CRUD, status changes, parent return, progress/effort results and failed-save recovery through real browser/API behavior as appropriate.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 04. Reuse the real C editor/exit surface, preserve task creation TODO/default fields, full status catalog and independent ticket state; verify canonical CRUD/status/parent return and pending/failure races.

## Answer

- Implemented the C task create/edit panel with server-confirmed saves, all existing assignment/discussion/estimate fields, complete six-state catalog, valid zero hours, protected drafts and confirmed deletion. Creation retains the existing TODO contract; task state never changes ticket state automatically.
- Parent navigation derives the actual ticket and returns to its Tasks context, including keep/discard/save. Shared generation/navigation safeguards retain failed drafts and isolate late responses. Task/ticket creation now refreshes canonical project data instead of adding a potentially stale creation response; task POST returns its nullable assignee projection for response validation.
- Validation: meaningful missing-status browser red → green; 35 editor browser regressions pass, followed by 13 isolated production-browser checks (CRUD, failed creation/retry, parent draft/save and both themes at 320/390/768/1024/1440). Sixteen task editor/move checks pass; frontend/backend types/lint and production builds pass (frontend retains 12 existing warnings, no errors). Desktop light and mobile carbon captures inspected under `frontend/.tmp/studio/task-production/`. Public data/deployment preserved, no recording.
