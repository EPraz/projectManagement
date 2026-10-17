# 03: Enforce the reliable baseline in CI

**What to build:** A proposed change is checked reproducibly before publication using the same meaningful gates available locally.

**Blocked by:** 01: Trustworthy checks and isolated startup.

**Status:** resolved

Type: task

- [x] CI uses Node 22 and lockfile installation for both applications, with Prisma generation/schema validation and builds/type checks.
- [x] Run non-mutating lint and the canonical reliable test commands, including isolated API/seed coverage with ephemeral PostgreSQL.
- [x] Keep all CI fixtures separate from Neon, existing local databases and provider credentials; use no production environment file.
- [x] A real failed gate causes CI failure with useful diagnostics; do not skip retained tests or mark failures as successful to create a green badge.
- [x] Record a successful CI run and the local reproduction commands. This gate automatically includes later tests through the normal test configuration.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed the independent CI slice after ticket 01 passed. Preparing the workflow while ticket 02 clean dependency verification runs; no successful hosted run is claimed yet.

## Answer

Resolved with workflow `89ae447` and snapshot-header compatibility correction `7c8bc31`. [Run 39076784331](https://github.com/EPraz/projectManagement/actions/runs/39076784331) passed both application jobs. The earlier genuine failure and subsequent correction, isolated fixtures, local reproduction and zero-finding independent Standards/Spec reviews are recorded in [CI evidence](../evidence/03-ci.md).
