# 02: Address applicable dependency findings without uncontrolled upgrades

**What to build:** The existing demo continues to work with applicable dependency findings addressed through justified compatible changes and an honest disposition for any remainder.

**Blocked by:** 01: Trustworthy checks and isolated startup. Advisory inspection may start earlier, but dependency-changing completion requires the behavior baseline.

**Status:** resolved

Type: task

- [x] Inspect the current lockfiles/advisories and distinguish production/browser usage, server usage and build/development-only paths with revision/date evidence.
- [x] Assess the previously observed frontend findings; record usage/reachability evidence and uncertainty rather than equating severity with exploitability.
- [x] Apply justified compatible remedies or remove verified-unused dependencies; run the affected workflow, reliable tests and production builds afterward.
- [x] Give each remaining finding a documented disposition and identify any genuinely required incompatible migration as separate scope.
- [x] No forced blanket audit fixes, major framework/ORM migration, hidden suppression or unsupported claim that all findings are harmless.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after ticket 01 passed and was reviewed. Assessment uses current lockfiles/npm audit, distinguishes lockfile runtime classification from proven reachability, and preserves major framework/ORM versions.

2026-10-17: Owner explicitly authorized the latest package versions when necessary, including necessary major version updates. This permits a tested Jest 30 migration to remove the remaining legacy test-tool advisory chains; it does not waive compatibility/data/hosting checks or the pre-recording owner checkpoint.

## Answer

Resolved in implementation commit `8b4f8cd`. The [dated dependency assessment](../evidence/02-dependencies.md) and [package disposition ledger](../evidence/02-package-dispositions.json) record the changes, applicability and remaining moderate tooling advisory. Both runtime audits have zero findings; full audits have no high or critical findings. Clean Node 22 installs, all 25 backend and 57 frontend tests, 12 retained snapshots, types, lint and builds passed, followed by populated browser navigation and a real independent Socket.IO event. [Standards and Spec review](../evidence/02-review.md): zero actionable findings on each axis. No public or personal database was used for fixtures.
