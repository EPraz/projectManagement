# 08: Refactor ticket and task editing as a reliable workflow

**What to build:** A visitor can inspect and edit a ticket's requirements, assignment, estimates and state through a focused editor that preserves input and reports real outcomes.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** ready-for-agent

Type: task

- [ ] Characterize the existing ticket tabs and related task-edit dialogs before extracting form/domain/presentation responsibilities; migrate their real request consumers together.
- [ ] Use the shared request boundary and clarify touched HTTP validation, response and error contracts with their real editor consumers.
- [ ] Preserve validation and unsaved data on failure, show actionable feedback/retry and guard duplicate pending submissions.
- [ ] Confirm saved changes, appropriate socket delivery and updates in the relevant board/overview; failed writes must not emit a false success.
- [ ] Preserve keyboard/focus behavior and usable dialogs at representative widths; keep sensitive fields excluded.
- [ ] The decomposition has a documented responsibility/interface benefit rather than only smaller files or a new abstraction with one trivial caller.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
