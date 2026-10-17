# 02: Address applicable dependency findings without uncontrolled upgrades

**What to build:** The existing demo continues to work with applicable dependency findings addressed through justified compatible changes and an honest disposition for any remainder.

**Blocked by:** 01: Trustworthy checks and isolated startup. Advisory inspection may start earlier, but dependency-changing completion requires the behavior baseline.

**Status:** claimed

Type: task

- [ ] Inspect the current lockfiles/advisories and distinguish production/browser usage, server usage and build/development-only paths with revision/date evidence.
- [ ] Assess the previously observed frontend findings; record usage/reachability evidence and uncertainty rather than equating severity with exploitability.
- [ ] Apply justified compatible remedies or remove verified-unused dependencies; run the affected workflow, reliable tests and production builds afterward.
- [ ] Give each remaining finding a documented disposition and identify any genuinely required incompatible migration as separate scope.
- [ ] No forced blanket audit fixes, major framework/ORM migration, hidden suppression or unsupported claim that all findings are harmless.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after ticket 01 passed and was reviewed. Assessment uses current lockfiles/npm audit, distinguishes lockfile runtime classification from proven reachability, and preserves major framework/ORM versions.

2026-10-17: Owner explicitly authorized the latest package versions when necessary, including necessary major version updates. This permits a tested Jest 30 migration to remove the remaining legacy test-tool advisory chains; it does not waive compatibility/data/hosting checks or the pre-recording owner checkpoint.
