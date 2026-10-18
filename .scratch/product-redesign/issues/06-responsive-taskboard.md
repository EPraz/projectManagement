# 06: Execute a sprint through the responsive Taskboard

**What to build:** A visitor follows ticket rows and moves tasks through the selected sprint on wide screens, and performs the same work through grouped tickets/task drill-in on narrow screens.

**Blocked by:** 05 — Create, edit and change task status within its ticket.

**Status:** resolved

Type: task

- [x] Wide layout preserves ticket rows/task-state columns, the full real status catalog, sticky ticket column/headers and board-local scrolling. Rows are content-sized, collapsible and initially expanded.
- [x] Narrow layout groups tickets by their own state, then exposes tasks and their separate states. Tablet uses the matrix only where content width is useful; verify portrait and landscape.
- [x] Ticket summary shows title, own state, responsible member and completed/total task count; task cards show title, responsible member and remaining hours when present. Text/actions remain readable without relying on color.
- [x] Desktop drag and explicit Change status both mutate the task within its original ticket, retaining pending guards and recoverable failures. Keep real ticket/task create/edit/delete entry points.
- [x] Task-assignee filtering targets tasks while preserving matching parent ticket rows; explicitly distinguish ticket-state and task-state controls. Preserve search, secondary filters and navigation context without filtering another sprint into the board.
- [x] Verify wide drag, keyboard/touch alternative, narrow ticket→task→parent, row collapse, full-state columns and filter/sprint changes in both themes with canonical updates.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 05; retain ticket rows/task-state columns with local scrolling, use grouped ticket/task access on narrow layouts and preserve canonical mutations/filter scope.

## Answer

- Delivered the C matrix with full real task-state columns, sticky headers/ticket cells, content-sized initially expanded rows and board-local two-axis scrolling. At widths below 1200px the available project canvas favors grouped tickets with explicit task expansion; 768/1024 tablet layouts retain the full task/editor workflow. Narrow task lists start collapsed; wide rows start expanded.
- Ticket summaries retain independent state, responsibility, completed/total children, priority/deadline and disabled ordering. Task cards expose full titles, assignee, remaining hours and explicit Change status. Drag updates only task state in its original ticket; failure preserves the card and allows retry. Restored existing replace-style editor links/Back behavior and scoped pending state to each work item after the retained late-response test caught an overbroad lock.
- Added task-assignee/state filters plus search and secondary ticket filters without broadening sprint scope. Hidden task columns are explicit and recoverable; column switches now have accessible names and one toggle per action.
- Validation: missing matrix/collapse red → green; 50 real board/editor/bulk browser regressions pass, including drag failure/retry, distinct task-vs-ticket assignment, sprint isolation, mobile parent navigation and both themes at 320/390/768/1024/1280/1440. One follow-up mobile check and frontend types/lint pass (12 retained warnings, no errors). Desktop light and mobile carbon captures inspected under `frontend/.tmp/studio/board-final/`; no public deployment/data changes or recording. Full production/CI verification remains in 13.
