# 04: Make project progress correct in both project views

**What to build:** Visitors see accurate project-wide completion in grid and list without altering Datos demo or confusing project progress with selected-sprint progress.

**Blocked by:** 01: Trustworthy checks and isolated startup.

**Status:** resolved

Type: task

- [x] Add a regression for actual ticket completion states before correcting the calculation.
- [x] Grid and list agree for the same data; the unchanged initial six-of-eighteen scenario is approximately 33%.
- [x] Empty, none-completed, partially completed, fully completed and unrecognized/non-completed status cases yield valid results.
- [x] Preserve the distinction between ticket COMPLETED and task DONE; no global stored-status rename or hardcoded percentage.
- [x] Preserve selected-sprint denominators and verify the visible summary in the running application.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after baseline 01. Use the approved focused progress regression seam plus real browser grid/list and selected-sprint verification against isolated Datos demo. No stored-status or seed changes.

## Answer

Resolved in `c4354d4`. Actual COMPLETED tickets now drive grid/list and overview summaries; the fixed overview 10% was removed. Eight focused regressions and actual Chrome checks preserve project/sprint scopes. [Verification](../evidence/04-progress.md) and [independent review](../evidence/04-review.md) record passing checks and zero actionable findings on both axes.
