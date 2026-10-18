# Ticket 08 — reliable ticket and task editing

Date: 2026-10-17. Verification uses the approved real-browser and HTTP/WebSocket/PostgreSQL boundaries in the isolated local fixture environment. No private environment file, public Neon fixture cleanup or media recording.

## Observed defects and changes

Initial browser regressions reproduced three failures: an existing assigned task saved response-only fields and received 400; a failed task save closed the editor during the pending request; and a failed ticket save closed the dialog, discarding edited requirements. The task payload now explicitly selects writable fields. Both editors await confirmed save/delete outcomes, expose pending controls and preserve drafts with inline retry feedback after failure. Existing update/delete request consumers now share the authenticated request boundary.

The existing ticket Details, Planning and Additional Info surfaces, assignment/time controls and task description/discussion fields were characterized through the real editor. The decomposition removes repeated draft/pending/error behavior into a feature-local hook used by both dialogs and repeated numeric controls into EstimateFields, used by both editors and ticket planning. Writable DTO shaping/validation belongs to workItemUpdates. The larger remaining ticket file is cohesive presentation with UI-specific event adapters; no line-count split or new form/query framework was introduced. This preserves its established controlled form while consolidating its lifecycle rather than migrating unrelated forms.

Draft identity follows the opened item, so independent socket snapshots cannot erase typing. A delayed ticket PATCH response formerly replaced a newer independent task change on the board; its new browser regression failed before correction and passes after preserving the current task collection during ticket metadata updates. Task editing uses the confirmed functional task merger introduced in ticket 05, and task deletion removes only that task from current state. Retired stale-collection edit/delete helpers have no remaining consumers.

The Planning tab now saves its own sprint selection rather than overwriting it with the currently viewed sprint. Its feature selection is accepted by the update DTO and checked against the ticket's project. Clearing assignment, estimates, sprint, feature and story points uses nullable values rather than omitted fields or empty foreign keys. Server validation rejects blank titles, negative estimates, fractional story points and foreign-project sprint/status relationships. Ticket update attribution comes from the authenticated demo session. Known validation/conflict/not-found messages can pass through the request boundary; unavailable/malformed errors retain safe fallbacks. Unconfirmed update/deletion representations cannot display success.

## Verification

- Initial three real-editor regressions failed before the corresponding fixes, then passed.
- The delayed ticket-save/independent-task regression failed before its merge correction, then passed.
- The integrated **36-journey browser run passed** (12 editor, 14 project, 10 session). Review subsequently added three more regressions, described below.
- Keyboard focus, Escape/query cleanup, reachable controls and horizontal containment passed at 390px and 1280px for both editors. Produced mobile ticket and desktop task screenshots were visually inspected; the narrow view stacks panels and retains scroll access to actions.
- The API regression initially accepted an invalid blank task title (200 instead of 400). All **30 API/startup tests** pass after DTO/relationship/nullable-field corrections, including confirmed event delivery and credential exclusion.
- All **77 frontend tests, 15 suites and 12 retained snapshots** pass. Existing editor callback tests now return explicit success promises; the ticket test expects its actual draft sprint selection rather than the former implicit selected-sprint override.
- Frontend/backend type checks and non-mutating lint pass. Frontend lint has **31 visible warnings**, down from 35 without suppressions; backend lint has no warnings/errors. Both builds pass. Initial frontend output is 1,623.64 kB raw / 480.93 kB gzip; measured code loading still belongs to ticket 13.

One browser selector initially assumed MUI's accessible select name excluded its selected value; it now matches the label prefix. The empty numeric DOM assertion was corrected from null to an empty string, while the separate persisted API assertion remains null. These were test corrections, not weakened product outcomes. Temporary fields were restored after these checks.

No dependency, schema or hosting change is needed for this ticket. Final README and walkthrough remain deferred, with owner feedback and explicit confirmation required before recording.

## Independent review corrections

Standards P2: the initial response guard accepted a nonempty partial object containing only id/title/updatedAt, then treated it as a complete item. Separate task/ticket browser regressions failed before correction. Actual response guards now check the common scalar/assignment/status contract, task ticket identity and ticket planning/collection fields before reporting success. The original empty-object regression remains, and both nonempty-partial cases pass.

Spec P2: completion of an old save could clear the later editor's query after browser navigation. A real Back/open-next-task/type/release regression reproduced the missing second taskId. Completion now belongs to the opened-item generation and is invalidated synchronously on identity changes/unmount. The same test exposed blanket request-loading props preventing typing in another item while the first request waited; request locks and rendered pending flags are now keyed by item ID, shared by the four actual update/delete consumers. Duplicate submission for the same item remains blocked while another item stays usable. The navigation regression passes after both corrections.

The first navigation attempts timed out because the second item inherited the first item's blanket loading flag. Bounded named steps and the subsequent concrete URL assertion separated that interactivity problem from stale completion; no timeout was increased to claim success. Final 15-editor regression run, final correction build and follow-up review will be recorded before closure.
