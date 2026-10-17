# 01: Establish trustworthy checks and isolated local startup

**What to build:** A developer can start the populated application and run meaningful canonical checks from a clean local setup without using public credentials or data.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

Type: task

- [ ] Recheck and record the current frontend/backend test, build, type and lint baseline instead of treating historical counts as current results.
- [ ] Repair shared aliases/provider/test configuration and retire genuinely obsolete scaffolding with mapped behavior coverage; all retained canonical tests pass, without broad skips, hollow construction tests or blanket mock fixes.
- [ ] Preserve the useful existing frontend and API/seed integration tests and provide repeatable isolated PostgreSQL fixtures guarded against remote/shared cleanup.
- [ ] Document/verify lockfile installation, Node 22, Prisma migrations/generation, explicit Datos demo initialization and both application starts using examples only.
- [ ] Missing variables, invalid database configuration and occupied ports produce actionable feedback; keep DATABASE_URL as the sole database connection variable.
- [ ] Canonical verification commands are non-mutating where appropriate and runnable without the owner's private environment files. No product behavior defect is silently bundled into baseline repair.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
