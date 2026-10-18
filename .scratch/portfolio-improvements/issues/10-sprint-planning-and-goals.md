# 10: Make sprint planning and goals consistent across views

**What to build:** Selecting a sprint, planning its work and updating its goals produces consistent board/overview/checklist results through maintainable state and request boundaries.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** resolved

Type: task

- [x] Characterize selected-sprint, backlog-assignment and goal/checklist behavior using the existing supported controls.
- [x] Verify touched associations, malformed/missing identifiers and partial failures through HTTP/persistence; preserve confirmed state and useful errors.
- [x] Consolidate duplicated request/selection/calculation logic where justified, preserving distinct project-wide and sprint-scoped metrics.
- [x] Confirm goal/task updates and sprint changes reach the relevant views/independent client without stale cross-sprint state.
- [x] Cover empty/loading/error/retry/pending behavior and retain unsaved form values; keep keyboard and narrow-layout controls reachable.
- [x] Do not add a new top-level Planning feature or change stored completion-state names.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after ticket 09 passed final checks and independent review. Characterize the existing sprint selection, goals/checklists and assignment controls before changing their shared form/mutation boundaries.


## Answer

Resolved in51d882e and a828ae8. Planning forms preserve failed drafts and await confirmation; goals/checklists use canonical selected-sprint data, and all goal/checklist writes coordinate transactionally at sprint scope before publishing. Existing board assignment, selection, empty/retry/pending and keyboard/mobile behavior are verified. All60 retained browser journeys,36 API/startup tests,77 frontend tests, types/lint/builds pass. Standards P2 corrected and re-reviewed; both axes have zero outstanding findings. [Evidence](../evidence/10-planning.md), [review](../evidence/10-review.md).

