# 04: Make project progress correct in both project views

**What to build:** Visitors see accurate project-wide completion in grid and list without altering Datos demo or confusing project progress with selected-sprint progress.

**Blocked by:** 01: Trustworthy checks and isolated startup.

**Status:** ready-for-agent

Type: task

- [ ] Add a regression for actual ticket completion states before correcting the calculation.
- [ ] Grid and list agree for the same data; the unchanged initial six-of-eighteen scenario is approximately 33%.
- [ ] Empty, none-completed, partially completed, fully completed and unrecognized/non-completed status cases yield valid results.
- [ ] Preserve the distinction between ticket COMPLETED and task DONE; no global stored-status rename or hardcoded percentage.
- [ ] Preserve selected-sprint denominators and verify the visible summary in the running application.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
