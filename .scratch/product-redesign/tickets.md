# Product redesign C: approved implementation tickets

Status: ready-for-agent

Owner approved all 14 tickets and their dependency edges on 2026-10-18 with "aprubo, proceda a $to-tickets". This is the navigation index and common acceptance contract; each implementation issue is published as its own file.

## Current frontier

**All14 deliveries are resolved.** The complete C redesign is published and verified. Next checkpoint: owner final visual/readiness feedback before the deferred README/walkthrough phase.

## Tickets and immediate blockers

| Ticket | Delivery | Blocked by | Status |
| --- | --- | --- | --- |
| 01 | [Enter the demo and use Projects in C](issues/01-demo-entry-projects.md) | None | resolved |
| 02 | [Navigate a project with shared sprint context](issues/02-project-navigation-sprint-context.md) | 01 | resolved |
| 03 | [See a truthful operational Overview](issues/03-truthful-overview.md) | 02 | resolved |
| 04 | [Create and edit tickets without losing context](issues/04-ticket-editor.md) | 02 | resolved |
| 05 | [Create, edit and change task status within its ticket](issues/05-task-editor-status.md) | 04 | resolved |
| 06 | [Execute a sprint through the responsive Taskboard](issues/06-responsive-taskboard.md) | 05 | resolved |
| 07 | [Work from a selected-sprint Backlog](issues/07-selected-sprint-backlog.md) | 05 | resolved |
| 08 | [Explore project hierarchy and open linked tickets](issues/08-project-hierarchy.md) | 04 | resolved |
| 09 | [Plan sprint goals and checklists](issues/09-sprint-goals-checklists.md) | 02 | resolved |
| 10 | [Plan member capacity for the selected sprint](issues/10-member-capacity.md) | 02 | resolved |
| 11 | [Manage the project's team membership](issues/11-project-team.md) | 02 | resolved |
| 12 | [Run a responsive sprint retrospective](issues/12-sprint-retrospective.md) | 02 | resolved |
| 13 | [Verify coherent C journeys across the complete product](issues/13-integrated-verification.md) | 03, 06, 07, 08, 09, 10, 11, 12 | resolved |
| 14 | [Publish and verify the complete C redesign](issues/14-publish-verify-cloud.md) | 13 | resolved |

Edges omit transitive dependencies. Once 02 is complete, Overview, ticket editing, goals, capacity, team and retrospective are independently available. Capacity does not require the Team redesign: its existing membership contract remains valid. Ticket 13 requires every complete domain surface; ticket 14 requires verified integration. Use the numbered open/unblocked/unclaimed frontier when proceeding sequentially.

## Shared scope and acceptance

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


## Visual source and continuity

The current design brief records the accepted direction and representative-screen approval. The effort map records the full Q1–Q33 decisions and prototype references. Disposable code/captures/verdict are preserved on local branch `prototype/product-redesign-project-studio-20261018`, commit `ada8ab271100fcfbd033b09a166aaedae93fe354`. The selected C preview can be reopened locally using the recorded review instructions; implementation must use canonical application data and existing React/MUI contracts.

The archived proposal preserves the exact breakdown reviewed by the owner. Individual issue files are the operational tracker. Preserve acceptance criteria and append actual completion evidence; do not treat an inherited prototype screenshot or an earlier refactor check as proof that a new implementation ticket is complete.

## Validation and release boundaries

Per-ticket relevant checks are required throughout. Integration verifies both themes, mobile 320–390, tablet 768/1024 and desktop 1280/1440, keyboard/focus/touch/zoom/reduced-motion and real loading/error/pending workflows, together with existing HTTP/WebSocket/browser behavior and CI gates. Keep staged work off the public deployment branch until ticket 14 releases the coherent verified result. No video/trace recording is part of these tickets.

README and the silent English walkthrough remain in the deferred presentation effort. The owner's explicit final design/readiness confirmation is required before recording, even after all 14 tickets are complete.

## Comments

- 2026-10-18: Published 14 individual approved issues. Blockers are ordered and acyclic. No issue has been claimed or resolved, no implementation started and no deployment performed as part of ticket publication.
