# 03: Enforce the reliable baseline in CI

**What to build:** A proposed change is checked reproducibly before publication using the same meaningful gates available locally.

**Blocked by:** 01: Trustworthy checks and isolated startup.

**Status:** ready-for-agent

Type: task

- [ ] CI uses Node 22 and lockfile installation for both applications, with Prisma generation/schema validation and builds/type checks.
- [ ] Run non-mutating lint and the canonical reliable test commands, including isolated API/seed coverage with ephemeral PostgreSQL.
- [ ] Keep all CI fixtures separate from Neon, existing local databases and provider credentials; use no production environment file.
- [ ] A real failed gate causes CI failure with useful diagnostics; do not skip retained tests or mark failures as successful to create a green badge.
- [ ] Record a successful CI run and the local reproduction commands. This gate automatically includes later tests through the normal test configuration.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
