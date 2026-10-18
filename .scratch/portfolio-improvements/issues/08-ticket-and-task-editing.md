# 08: Refactor ticket and task editing as a reliable workflow

**What to build:** A visitor can inspect and edit a ticket's requirements, assignment, estimates and state through a focused editor that preserves input and reports real outcomes.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** resolved

Type: task

- [x] Characterize the existing ticket tabs and related task-edit dialogs before extracting form/domain/presentation responsibilities; migrate their real request consumers together.
- [x] Use the shared request boundary and clarify touched HTTP validation, response and error contracts with their real editor consumers.
- [x] Preserve validation and unsaved data on failure, show actionable feedback/retry and guard duplicate pending submissions.
- [x] Confirm saved changes, appropriate socket delivery and updates in the relevant board/overview; failed writes must not emit a false success.
- [x] Preserve keyboard/focus behavior and usable dialogs at representative widths; keep sensitive fields excluded.
- [x] The decomposition has a documented responsibility/interface benefit rather than only smaller files or a new abstraction with one trivial caller.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after 07 resolved. Characterize real ticket tabs and task editor saves first, then separate draft/payload concerns and preserve failed edits through the shared request boundary.


## Answer

Resolved in 99b5574 and d89a537. Editors preserve failed drafts, confirm save/delete responses, scope pending/completion to their item, and save actual planning selections with explicit writable payloads. Shared draft/estimate/request boundaries replace repeated lifecycle logic. [Evidence](../evidence/08-editors.md) and [review](../evidence/08-review.md) record 36 integrated browser passes followed by 15 correction editor passes, 77 frontend tests/12 snapshots, 30 backend tests, types, lint and builds. Both initial P2 findings are fixed and independently rechecked. No schema/dependency change or production fixture cleanup.

