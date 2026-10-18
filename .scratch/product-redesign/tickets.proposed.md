# Product redesign C: proposed ticket breakdown

Status: needs-info

Owner accepted the selected C identity and extended representative screens on 2026-10-18 and requested `$to-tickets`. This file is the reviewable proposal, not published implementation issues. Individual tickets will be published only after breakdown approval, using the configured local tracker and `ready-for-agent` status.

## Approved scope and source

- Source: the confirmed Q1–Q33 conversation, selected/accepted C visual reference and [current design brief](../../.design/product-redesign/DESIGN_BRIEF.md).
- Preserve the 16 completed quality/refactor tickets and their behavioral guarantees. This effort implements the visual redesign and specifically agreed truth/interaction corrections; it is not another broad backend refactor.
- C means floating rail, project identity and progress, mixed module hierarchy, white/azure light appearance, neutral carbon dark appearance and loaded IBM Plex Sans. Use real project titles and product identity; Project studio is a design-direction name, not an app rename.
- Keep the actual domain/status catalog, all existing fields and supported operations. Prototype data, simplified forms, disabled notices and three sample task columns are not production limitations. Projects retains both grid/list and the existing favorite behavior; its disabled Edit Project/Manage Team/Settings entries do not authorize new project-edit/account/settings features.
- Wide Taskboard uses ticket rows/task-state columns; narrow layouts group tickets by own state and expose their tasks. Backlog remains selected-sprint-only. Team/hierarchy are project-wide; goals/capacity/retrospective retain selected-sprint scope.
- Keep the public shared demo, free infrastructure and data; no personal accounts, audit-history feature, task reparent/order, ticket order, schema rewrite, automatic resets or video recording in this effort.

## Completion contract for every delivery

- Each ticket is a complete runnable user journey against canonical API data. Make any required contract/service adjustment within the same delivery and verify it; do not create artificial schema/API work where existing contracts already suffice.
- Maintain light/dark coherence, responsive behavior, useful labels, keyboard/focus, touch actions and honest scope. Initial appearance follows system preference, with a remembered manual override. Use the approved C reference rather than copying disposable prototype code into production.
- The affected workflow includes loading, confirmed empty, no search/filter matches, recoverable error/retry, pending mutation, success, validation and relevant deletion/unsaved-change confirmation. A refresh/error must not replace loaded data with a fake empty screen.
- Saves require actual server confirmation, keep entered values/errors on failure, prevent duplicate submission and preserve canonical HTTP/WebSocket reconciliation. Ticket and task state/progress remain distinct. Never weaken the existing race/stale-response protections to make a UI test pass.
- Add/update meaningful browser regressions for changed behavior and targeted calculation/API regressions where warranted. Update accessible selectors while preserving the original assertions; do not delete a behavior check merely because labels/layout changed. Run relevant checks before resolving each ticket; full CI is required for integration/publication.
- Preserve URLs/deep links, parent/project/sprint context and appropriate back/reload/focus/draft behavior. Write completion evidence and any remaining limitations to the local ticket so the work can resume across sessions.
- Small necessary prefactoring happens first within the first complete journey that needs it, preserving working legacy callers while areas migrate. No independent horizontal token/API/editor rewrite or all-at-once stack migration is proposed. Remove obsolete shared paths only after the final callers migrate.

## Dependency overview

1. Demo entry and Projects in C — none.
2. Project navigation and shared sprint context — 01.
3. Truthful operational Overview — 02.
4. Create and edit tickets with context — 02.
5. Create, edit and change task status — 04.
6. Responsive sprint Taskboard — 05.
7. Selected-sprint Backlog — 05.
8. Project hierarchy and linked tickets — 04.
9. Sprint goals and checklists — 02.
10. Member capacity planning — 02.
11. Project team membership — 02.
12. Sprint retrospective — 02.
13. Integrated C journeys and final quality gates — 03, 06, 07, 08, 09, 10, 11, 12.
14. Publish and verify the complete redesign — 13.

Edges list only genuine immediate blockers; transitive blockers are omitted. Capacity does not depend on the Team redesign because existing membership/data contracts already work. Independent branches can be implemented sequentially from the numbered frontier without additional owner review between tickets.

## 01: Enter the demo and use Projects in C

**What to build:** A visitor opens the demo, finds and enters a real project through the C project list, and can perform the existing project-list operations on any supported screen.

**Blocked by:** None (can start immediately).

- [ ] Demo entry and Projects use the selected light/neutral-carbon identity and a genuinely loaded Plex font; system/manual theme choice is readable and retained without disturbing sessions.
- [ ] C project cards show real title, concise description, project-wide progress/counts, team summary and clear entry. No prototype percentages, project names, emblems-as-data or sample counts are hardcoded.
- [ ] Preserve search, refresh, grid/list choice and its existing persistence, favorite ordering with its existing semantics, project creation and permitted deletion. Deletion is secondary and confirmed; preserve role restrictions.
- [ ] Remove disabled project-menu placeholders rather than implementing new Edit Project, personal-account or Settings features. Useful demo/theme information remains discoverable.
- [ ] Distinguish opening/waking demo, session recovery, first load, refreshing with retained content, empty/no matches, create/delete pending and recoverable failures. No duplicate submissions or lost creation input on failure.
- [ ] Entry → Projects → correct real project works in both themes and narrow/wide layouts. Existing summary reads and session protections remain verified; other application areas keep working during staged migration.

## 02: Navigate a project with shared sprint context

**What to build:** A visitor enters Overview and moves between project work, planning, team and retrospective through one coherent C navigation while keeping the correct project and sprint context.

**Blocked by:** 01 — Enter the demo and use Projects in C.

- [ ] Use the C floating rail on wide screens and compact header/section menu on narrow screens. Provide usable labels, focus and active state without duplicated header/sidebar navigation or dead Settings entries.
- [ ] Expose Overview; Work → Taskboard, Backlog, Epics & Features; Planning → Goals, Capacity; Team; Retrospective. Overview remains project entry.
- [ ] Shared sprint selection affects only sprint-scoped areas. Team/hierarchy remain clearly project-wide. Preserve existing sprint creation/deletion with pending, confirmation, failure recovery and a valid selection fallback.
- [ ] Project changes cannot inherit another project's selection/data; delayed loads and live updates cannot overwrite the current workspace. Keep known URLs/deep links/back/reload compatible while moving presentation.
- [ ] Theme/demo preferences remain accessible on all layouts, navigation does not strand focus, and mobile width is available to content rather than a permanent rail.
- [ ] Verify project entry, section changes, selection switching, empty/no-sprint and recovery journeys against the real app; legacy surfaces remain usable until their own C slices land.

## 03: See a truthful operational Overview

**What to build:** A visitor can understand the whole project's progress and the selected sprint's execution, attention items, deadlines and workload through the accepted C Overview using real data.

**Blocked by:** 02 — Navigate a project with shared sprint context.

- [ ] Reproduce C's project/profile progress, selected-sprint execution, attention and ticket-state modules, calendar and updates. Mobile prioritizes sprint/attention; descriptive metadata follows lower in the reading order.
- [ ] Project progress uses the whole project and the existing completion definition; sprint totals/completion/effort/chart use the selected sprint. Retain the full real status catalog, actual sprint dates and understandable chart labels/legends.
- [ ] A ticket is blocked when its flag OR own state says blocked; count it once and count the full collection before limiting a preview. Cover flag-only, state-only, both and totals larger than the displayed preview.
- [ ] Separate overdue/upcoming unfinished ticket deadlines; completed tickets do not appear as overdue work. Sprint/project changes, missing dates and no sprint cannot show stale or fabricated values.
- [ ] Recent updates describe only known creations/latest modifications from timestamps, without inferring audit events. A sprint name is labeled as sprint context rather than presented as a stored goal.
- [ ] Preserve real sprint goals, milestones, team workload, story-point/time information and project metadata already available, using lower-priority areas where needed. The prototype's omitted widgets are not deleted capabilities.
- [ ] Regression-check calculation scopes and truthful labels plus a browser journey that changes sprint/work and sees canonical results, with readable charts in both themes/sizes.

## 04: Create and edit tickets without losing context

**What to build:** A visitor opens or creates a ticket from existing work views or a deep link, edits it in the C panel/full-screen surface and returns with confirmed changes or a recoverable draft.

**Blocked by:** 02 — Navigate a project with shared sprint context.

- [ ] Use one editor surface at a time: wide contextual panel / full screen on mobile, with Details, Planning, Tasks and Additional info. Preserve every existing field, validation and domain restriction.
- [ ] Keep ticket state, type, responsible member, priority, sprint/feature relations, blocking fields/relations, estimates/story points/time, deadlines, acceptance/design/additional content, notes/discussion and existing metadata accessible.
- [ ] Explicit Save/Cancel and secondary confirmed deletion remain reachable. Pending/duplicate submissions, failed responses, retry and unsaved-change keep/discard/save preserve input and focus. No autosave is introduced.
- [ ] Tasks tab shows real child tasks and can launch the existing task journey until 05 migrates that editor. Ticket creation and deletion remain server-confirmed and reconcile views/live updates.
- [ ] Ticket deep links resolve from the full project collection, including another sprint or an unplanned ticket, without silently broadening Backlog scope or losing the parent/project return path.
- [ ] Verify create/edit/delete, validation/failure recovery, dirty navigation, deep-link/back/reload and preservation of fields omitted by the prototype on mobile and desktop.

## 05: Create, edit and change task status within its ticket

**What to build:** A visitor manages a real task in the C editor, changes its state by an explicit accessible action and returns to its parent ticket with accurate work/progress information.

**Blocked by:** 04 — Create and edit tickets without losing context.

- [ ] Preserve task creation, all existing fields/estimates/assignment, editing and confirmed deletion, using the C contextual/full-screen editor and real server outcomes.
- [ ] Offer explicit Change status for touch/keyboard using the project's complete task-state catalog and existing mutation contract. Preserve creation defaults/domain rules and the task's parent ticket.
- [ ] Task → parent returns to the ticket's Tasks context; preserve appropriate draft, focus, selection and navigation state with only one editor visible.
- [ ] Completed/non-completed transitions and estimate changes use existing canonical progress semantics, including valid zero values; do not equate task state with ticket state or invent automatic ticket transitions.
- [ ] Pending/error/retry, double submissions, late responses and live reconciliation keep task identity/data correct. No reparenting, reordering or ticket ordering is introduced.
- [ ] Verify task CRUD, status changes, parent return, progress/effort results and failed-save recovery through real browser/API behavior as appropriate.

## 06: Execute a sprint through the responsive Taskboard

**What to build:** A visitor follows ticket rows and moves tasks through the selected sprint on wide screens, and performs the same work through grouped tickets/task drill-in on narrow screens.

**Blocked by:** 05 — Create, edit and change task status within its ticket.

- [ ] Wide layout preserves ticket rows/task-state columns, the full real status catalog, sticky ticket column/headers and board-local scrolling. Rows are content-sized, collapsible and initially expanded.
- [ ] Narrow layout groups tickets by their own state, then exposes tasks and their separate states. Tablet uses the matrix only where content width is useful; verify portrait and landscape.
- [ ] Ticket summary shows title, own state, responsible member and completed/total task count; task cards show title, responsible member and remaining hours when present. Text/actions remain readable without relying on color.
- [ ] Desktop drag and explicit Change status both mutate the task within its original ticket, retaining pending guards and recoverable failures. Keep real ticket/task create/edit/delete entry points.
- [ ] Task-assignee filtering targets tasks while preserving matching parent ticket rows; explicitly distinguish ticket-state and task-state controls. Preserve search, secondary filters and navigation context without filtering another sprint into the board.
- [ ] Verify wide drag, keyboard/touch alternative, narrow ticket→task→parent, row collapse, full-state columns and filter/sprint changes in both themes with canonical updates.

## 07: Work from a selected-sprint Backlog

**What to build:** A visitor searches, filters and edits the selected sprint's tickets through a readable wide Backlog table or narrow work list, including child-task access.

**Blocked by:** 05 — Create, edit and change task status within its ticket.

- [ ] Show only tickets belonging to the selected sprint. Do not introduce a whole-project default, all-project filter or unplanned-ticket Backlog scope.
- [ ] Preserve existing column choice, priority/status/type/assignee/due/blocked filters, search, ticket expansion, task access and supported create/edit/delete actions in C table/list presentations.
- [ ] Backlog assignee targets tickets, unlike the Taskboard's task-assignee filter. State labels and results identify their real entity/scope.
- [ ] Switching sprint, clearing filters, empty/no matches, pending mutations and failed refreshes keep scope/context correct; disabled ticket ordering remains disabled.
- [ ] Verify filtered ticket/task CRUD, sprint isolation, visible columns and editor return with real canonical data on mobile and desktop.

## 08: Explore project hierarchy and open linked tickets

**What to build:** A visitor manages epics/features and follows their tickets using a wide expandable hierarchy or narrow parent-aware level navigation.

**Blocked by:** 04 — Create and edit tickets without losing context.

- [ ] Project-wide hierarchy uses the C identity, readable wide tree and narrow level navigation with visible parent/return context.
- [ ] Preserve search/expansion, epic/feature CRUD, actual states, parent relations, description/acceptance content and existing validation/dependent-deletion information.
- [ ] Open linked tickets through the shared editor/deep-link journey, including tickets outside the selected sprint or unplanned tickets. Keep Backlog selected-sprint-only and distinguish project-wide hierarchy scope.
- [ ] Save/delete/relationship changes reconcile with the real server; confirm deletion, retain failed drafts and prevent stale outcomes from replacing another selected entity.
- [ ] Verify parent changes, empty hierarchy, deletion restrictions and linked-ticket navigation on narrow/wide screens with keyboard and both themes.

## 09: Plan sprint goals and checklists

**What to build:** A visitor creates and updates the selected sprint's real goals/checklists and understands their progress through C goal cards and responsive editing.

**Blocked by:** 02 — Navigate a project with shared sprint context.

- [ ] Preserve goal title/description/status, progress and checklist create/edit/delete/toggle operations using clear cards and responsive forms.
- [ ] Checklist state and goal progress follow existing domain rules; a sprint name is never substituted for a stored goal.
- [ ] Selected-sprint, no-sprint, empty, pending, failed-save/delete and late-response journeys retain correct ownership, entered data and server-confirmed results.
- [ ] Maintain explicit actions, confirmations, accessible focus and mobile touch targets in both themes.
- [ ] Verify a complete goal/checklist journey plus sprint-switch isolation and failure recovery against the existing planning contracts.

## 10: Plan member capacity for the selected sprint

**What to build:** A visitor reviews and changes real member capacity/days off against sprint work through a C table on wide screens and expandable member cards on narrow screens.

**Blocked by:** 02 — Navigate a project with shared sprint context.

- [ ] Preserve capacity/day-off/remaining-work and progress calculations plus all currently supported capacity create/edit/delete actions and validation.
- [ ] Use only actual member and sprint data. Remove the fixed Development activity claim; use a real meaningful label/value or omit the non-domain field.
- [ ] Keep project membership requirements and canonical ownership; removed/moved members and sprint changes cannot retain invalid or stale capacity rows.
- [ ] Support readable wide comparisons and narrow per-member cards with explicit actions, confirmed deletion and recoverable drafts/errors.
- [ ] Verify capacity edits, zero/invalid inputs, empty/no-sprint, membership consistency, selected-sprint isolation and delayed/failed updates. Existing Team functionality suffices; its visual migration is not a blocker.

## 11: Manage the project's team membership

**What to build:** A visitor searches the project's members, adds people from the existing catalog and removes membership through a clear C team view on all sizes.

**Blocked by:** 02 — Navigate a project with shared sprint context.

- [ ] Present searchable real project membership with relevant existing member/role information; make project-wide scope explicit.
- [ ] Preserve add-from-catalog/remove and current validation/restrictions. Do not create personal accounts, edit roles or add a new user-management feature.
- [ ] Search/no matches, empty membership, catalog loading, pending add/remove, duplicate membership, failed confirmation and retry provide useful outcomes without false success.
- [ ] Membership changes reconcile affected workspace/capacity data according to existing contracts and cannot appear on the wrong project after navigation.
- [ ] Verify add/remove/search and membership consistency in both themes and narrow/wide layouts without changing account permissions.

## 12: Run a responsive sprint retrospective

**What to build:** A visitor records and reacts to retrospective notes for the selected sprint through C category columns or a narrow category selector/card list.

**Blocked by:** 02 — Navigate a project with shared sprint context.

- [ ] Wide screens show Positive/Negative/Improvements columns; mobile shows category selection with readable cards, preserving full operations and clear sprint context.
- [ ] Preserve existing card create/edit/delete, reactions, retries and display controls. Explain name-hide/blur as presentation, without implying actual anonymity.
- [ ] Keep empty/no-sprint, pending reaction/save/delete, failure recovery, retained input and correct canonical results through sprint/project changes.
- [ ] Reach actions by touch/keyboard, manage editor focus and keep both themes readable without color-only category meaning.
- [ ] Verify notes/reactions/editing, category changes, display semantics and cross-sprint isolation on narrow/wide layouts.

## 13: Verify coherent C journeys across the complete product

**What to build:** A visitor completes the real demo-to-delivery journey across every redesigned area with consistent interaction, truthful feedback and the approved visual identity.

**Blocked by:** 03, 06, 07, 08, 09, 10, 11, 12 — Completed Overview and every work/planning/team/retrospective surface.

- [ ] Run integrated entry → Projects → Overview → Taskboard/Backlog → ticket/task → hierarchy/planning/team/retrospective journeys, including project/sprint changes, deep links, return paths and canonical live updates.
- [ ] Check both themes at representative 320–390 mobile, 768/1024 tablet and 1280/1440 desktop widths; verify zoom/reflow, portrait/landscape behavior, contrast, reduced motion, touch targets, keyboard, visible focus and modal focus return. Allow only intentional local two-dimensional scrolling.
- [ ] Validate real loading/empty/no matches/error/retry/pending/unsaved/deletion states across surfaces, not only populated happy-path screenshots. Each earlier ticket already owns its local checks; this ticket covers integration gaps.
- [ ] Preserve meaningful HTTP/WebSocket PostgreSQL regressions and existing browser guarantees, plus targeted new blocker/deadline/state/filter tests. Use isolated local test databases, never the public/private Neon database for fixtures or resets.
- [ ] Pass current frontend/backend builds, types, lint and required CI checks; review against approved behavior and documented conventions and resolve material findings. Check loading/bundle/performance regressions where changes warrant comparison against recorded quality baselines.
- [ ] Remove old duplicate navigation, obsolete styles/components/compatibility paths only when no caller remains; keep retained functionality and CI green. Exclude disposable prototype routes/controls/data from production builds.
- [ ] Record final screenshots, verification evidence and material limitations for handoff. README/walkthrough remain deferred and no video is recorded here.

## 14: Publish and verify the complete C redesign

**What to build:** The public portfolio demo serves the complete verified C experience through the existing free frontend/backend/database setup, with real navigation, editing and live updates working in the cloud.

**Blocked by:** 13 — Verify coherent C journeys across the complete product.

- [ ] Publish the coherent verified result through existing deployment resources; retain the current public demo while work is staged and preserve data, provider domains and zero-cost constraints. Do not add paid resources or keep-alive automation.
- [ ] Preserve sessions, API routing/deep-link reloads and WebSocket configuration; deployment/startup does not reset/reseed visitor data. No schema/backend rewrite or database migration is assumed; any genuinely required contract change must already have been tested in its owning slice.
- [ ] Verify deployed revisions and hosted CI, then check real public entry, populated Projects, both themes, responsive project/work/planning/retrospective navigation and canonical updates using existing safe demo verification practices.
- [ ] Retain useful cold-start/retry feedback and recovery behavior. Document the verified release/rollback reference and any material hosting limitation; do not claim local preview evidence proves cloud behavior.
- [ ] Handoff to the deferred English README/walkthrough effort only after cloud checks. Keep the owner's explicit final design/readiness approval before recording; this ticket does not authorize a recording or require a new intermediate design approval.

## Breakdown review requested

Confirm whether these 14 slices fit the expected granularity, whether every blocking edge is a real prerequisite, and whether any should be merged/split. On approval, publish one individual local issue per ticket in dependency order. Do not begin implementation as part of this ticket-planning turn.

## Comments

- 2026-10-18: Proposed from the accepted conversation/design, with a fresh check of real project-list, navigation, work-item editor, Overview and planning behavior. Preserved favorite/grid-list operations, full state catalogs and scoped data; excluded nonfunctional project edit/settings placeholders. No implementation issues published yet.
