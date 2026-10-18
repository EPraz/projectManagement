# 07: Work from a selected-sprint Backlog

**What to build:** A visitor searches, filters and edits the selected sprint's tickets through a readable wide Backlog table or narrow work list, including child-task access.

**Blocked by:** 05 — Create, edit and change task status within its ticket.

**Status:** resolved

Type: task

- [x] Show only tickets belonging to the selected sprint. Do not introduce a whole-project default, all-project filter or unplanned-ticket Backlog scope.
- [x] Preserve existing column choice, priority/status/type/assignee/due/blocked filters, search, ticket expansion, task access and supported create/edit/delete actions in C table/list presentations.
- [x] Backlog assignee targets tickets, unlike the Taskboard's task-assignee filter. State labels and results identify their real entity/scope.
- [x] Switching sprint, clearing filters, empty/no matches, pending mutations and failed refreshes keep scope/context correct; disabled ticket ordering remains disabled.
- [x] Verify filtered ticket/task CRUD, sprint isolation, visible columns and editor return with real canonical data on mobile and desktop.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 06. Reuse the verified work-filter surface with ticket assignment semantics; retain column choice, child-task actions and selected-sprint-only scope in readable C table/mobile lists.

## Answer

- Delivered the selected-sprint-only C Backlog table and compact work list. Preserved all 14 selectable columns, priority/state/type/ticket-assignee/due/blocked filters, search, expansion, direct ticket/task editing and confirmed deletion. Shared filtering now has one typed contract; task filters remain distinct from Backlog ticket assignment. Sprint labels use actual selected sprint data.
- Retained explicit hidden-column, empty-sprint, no-match and recoverable deletion states. Child task panels support creation and all shared editor fields/statuses without introducing ordering or whole-project/unplanned Backlog scope. Wide overflow stays inside the table; compact lists preserve columns/identity and keyboard actions.
- Validation: missing ticket-assignee red → green; 12 retained hierarchy/Backlog browser journeys pass. Twelve additional Backlog column/filter/layout checks plus the focused successful full empty-sprint → ticket/task create/edit/delete → empty journey pass; both themes checked at 320/390/768/1024/1440. Frontend types/lint pass (12 retained warnings, no errors). Desktop light/mobile carbon captures inspected under `frontend/.tmp/studio/backlog-verified/`. Initial full-CRUD assertion was narrowed to the empty notice to distinguish it from the simultaneous success toast; no product behavior was removed. Public data/release preserved.
