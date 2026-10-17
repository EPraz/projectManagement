# Ticket 04 — truthful project progress

Date: 2026-10-17. Approved seams: focused progress input/output and real browser project views with isolated Datos demo.

## Regression and correction

Before changing the calculation, the six-COMPLETED-of-eighteen regression failed with expected `33`, received `0`. The minimal fix compares the actual ticket state `COMPLETED`. Task `DONE` remains a separate state; no stored values or seed contents changed.

Eight retained focused cases cover the known six-of-eighteen scenario, no tickets, none completed, partial and full completion, task DONE, unknown status and mixed unknown/completed work. Expected values are explicit worked examples. All pass. The existing full frontend suite also passes in CI mode: 65 tests, 14 suites, 12 unchanged snapshot bodies. Types pass; lint has zero errors and the same 40 visible pre-existing warnings; production build passes on Node 22.

## Actual browser verification

Chrome against the isolated local backend/database and frontend:

- Entered through Explore demo; both unchanged projects show 33% in grid.
- Switched to list using the actual view control; both bars also show 33%.
- Entered Orbit overview. This revealed an additional hardcoded `10%` Overall Progress summary. A browser assertion expecting 33% failed before correction. The summary now reuses the same project-wide calculation over `allTickets`; it no longer reports a fixed value.
- Selected every existing sprint: Foundation has 6/6 completed and shows 100%; Delivery has 0/8 and shows 0%; Launch has 0/2 and shows 0%. Overall Progress stays 33% through all three selections, preserving distinct denominators. No sprint metric calculation was changed.

Only local disposable demo data was used. No mutations, seed reset, public database access or walkthrough recording occurred. The browser assertion script and diagnostic screenshot are ignored local QA artifacts under `backend/.tmp/quality/`.
