# Ticket 07 — project loading and selected state

Date: 2026-10-17. Approved boundaries: real browser project reads/navigation plus independent authenticated HTTP writers and actual socket frames, with the isolated local PostgreSQL demo. The public Neon database and private environment files were not used.

## Before and after

- Two browser regressions reproduced 503 and HTML/200 list responses producing a false empty workspace without retry. Project reads now use the shared authenticated request boundary, validate the expected collection shape and retain explicit loading/loaded/error metadata. A failed response never replaces confirmed data with an empty array. Initial and background failures have persistent retry; confirmed `[]` alone renders the empty workspace.
- A missing project previously remained on a loader. A browser regression failed before the new recoverable not-found view, which provides retry and navigation back to projects. Non-JSON detail responses also remain recoverable.
- An actual unrelated projectUpdated socket frame replaced the selected project's content while its URL stayed unchanged. The regression failed before scope filtering. All project/ticket/sprint listeners now belong to the project data module, filter the relevant project, and remove their exact handlers on cleanup. Independent client events verify isolation.
- ProjectProvider owns one project snapshot and selected sprint ID. TicketProvider and SprintProvider expose compatible views/actions over that owner; they no longer maintain separate fetched ticket/sprint state or their own duplicate socket subscriptions. Sprint ticket collections are projections of the canonical project tickets. Selected sprint storage is keyed by project, with the old selection accepted only when it belongs to that project.
- ProjectLayout keys the provider by route ID. Loading requests abort on replacement/unmount; a confirmed socket change invalidates a pending older snapshot and restarts that read after the change. Reconnection refreshes data without discarding existing content. A delayed response cannot replace a later project or a newer confirmed selected-project update.

List and detail expose deliberate Refresh controls. The list's former Filter button had no handler or filtering capability; its position now offers real refresh. Project breadcrumbs are keyboard-accessible buttons. A failed background detail read leaves the selected content visible with error/retry feedback.

## Retained and repeated verification

Thirteen project browser journeys pass: list unavailable/non-JSON recovery; real empty-vs-error distinction; pending/background refresh and retry; missing project recovery; unrelated project event isolation; detail refresh recovery; independent per-project sprint selection; unrelated sprint creation isolation; pending-snapshot invalidation; slash/no-slash JSON API aliases and deep-link reload; non-JSON detail recovery; and leaving an in-flight load for a different project. Shared entry steps serve the project and session journeys.

The complete retained browser run passes **23 journeys** (13 project + 10 session). The actual task-board pointer/HTTP/socket races from ticket 05 were also repeated after state consolidation: saved drag/reload, assignee preservation, controlled failure/retry, unrelated and same-task newer updates, and concurrent deletion all pass. The temporary unrelated sprint fixture was deleted and edited descriptions restored through the isolated API.

During validation, changing sprint and returning to projects exposed an obsolete Layout effect that wrote selected sprint data back into its former separate list. With the unified owner that redundant synchronization caused repeated updates. It was removed, and empty-query route replacements were restricted to actual query changes. The failing navigation journey now passes. One retry test initially counted the overview's legitimate blocker alert as a load error; its assertion now targets the specific load recovery control/message rather than unrelated alerts. The API sprint fixture was corrected to include the DTO's required dates.

Frontend: **77 Jest tests, 15 suites, 12 retained snapshots**, type checks and production build pass on Node 22. Non-mutating lint passes with **35 visible warnings**, down from 40 by removing obsolete effects/dependencies rather than suppressing rules. Final integrated CI will include this ticket after review.

## Review correction: deletion confirmation

Standards review found that the new refresh invalidation exposed an existing server ordering defect: TicketService published ticketDeleted before the DELETE committed. A retained HTTP/WebSocket/PostgreSQL regression reproduced an immediate read returning 200 after that event. Its guarded local test fixture delays the database DELETE for one second, then removes the temporary trigger/function in finally. Moving the event after the awaited deletion makes the same read return 404. The backend schema is unchanged; all **29 API/startup tests**, backend type checks, non-mutating lint and build pass.

A retained browser regression holds an older project snapshot, deletes a temporary ticket through an independent authenticated session, waits for the replacement read and verifies that releasing the old snapshot cannot restore the ticket. It passes against the rebuilt isolated backend. This adds one journey to the previously passing 23; the first locator was corrected to use the heading's full accessible name because its visible text is intentionally truncated. No product behavior was changed to satisfy that locator.

Initial bundle: 1,622.34 kB raw / 479.97 kB gzip. Ticket 13 still owns measured loading improvements. Existing ticket ordering limitations, personal-account restrictions and manual seed-restoration policy are unchanged. No video/trace recording or production fixture cleanup occurred.
