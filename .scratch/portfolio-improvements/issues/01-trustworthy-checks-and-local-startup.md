# 01: Establish trustworthy checks and isolated local startup

**What to build:** A developer can start the populated application and run meaningful canonical checks from a clean local setup without using public credentials or data.

**Blocked by:** None (can start immediately).

**Status:** resolved

Type: task

- [x] Recheck and record the current frontend/backend test, build, type and lint baseline instead of treating historical counts as current results.
- [x] Repair shared aliases/provider/test configuration and retire genuinely obsolete scaffolding with mapped behavior coverage; all retained canonical tests pass, without broad skips, hollow construction tests or blanket mock fixes.
- [x] Preserve the useful existing frontend and API/seed integration tests and provide repeatable isolated PostgreSQL fixtures guarded against remote/shared cleanup.
- [x] Document/verify lockfile installation, Node 22, Prisma migrations/generation, explicit Datos demo initialization and both application starts using examples only.
- [x] Missing variables, invalid database configuration and occupied ports produce actionable feedback; keep DATABASE_URL as the sole database connection variable.
- [x] Canonical verification commands are non-mutating where appropriate and runnable without the owner's private environment files. No product behavior defect is silently bundled into baseline repair.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Implementation started under the owner's authorization to advance the approved sequence without intermediate owner reviews. Review base: a713e85. Approved browser, HTTP/WebSocket and focused regression seams remain in force.

## Answer

Established the guarded local verification baseline and clean contributor setup. Final results: frontend 57 tests/12 snapshots; backend 25 tests; types, lint and clean builds pass. Forty frontend warnings remain visible for their approved workflow slices. Isolated Node 22/PostgreSQL clean installation, populated browser entry and authenticated deep-link reload verified. Public and old data and private environment files were preserved.

Evidence: [01 baseline](../evidence/01-baseline.md). Review: [independent Standards/Spec review](../evidence/01-review.md), both with zero actionable findings. Implementation commit: 75165b8.
