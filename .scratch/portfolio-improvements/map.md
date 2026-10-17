# Product quality and refactor

Status: ready-for-agent

## Notes

- The public demo is deployed and its earlier project-list routing defect is fixed.
- Owner changed priority to code refactoring/product quality before final README and walkthrough, then explicitly invoked to-spec.
- Existing backlog is the source inventory. Presentation decisions remain saved separately and are deferred until this phase is verified.
- Published artifact: [spec.md](spec.md), status ready-for-agent. The owner explicitly confirmed the expanded test boundaries.

## Decisions so far

- Preserve React/Vite, modular NestJS, Prisma/PostgreSQL and Vercel/Render/Neon free deployment.
- Preserve public/old data, demo-only access, the single DATABASE_URL convention and explicit manual restoration.
- Correct confirmed progress and task-attribution defects, establish reliable tests/CI, then refactor observed boundaries and improve recovery, measured loading and developer setup.
- Distinguish confirmed defects from assessment candidates; avoid a broad rewrite, invented visitor policies or an uncontrolled dependency migration.
- Save the prior approved recruiter presentation scope and resume it after quality/cloud verification.

## Test-boundary confirmation

Confirmed by the owner: primary real-browser product workflows, complemented by HTTP/WebSocket tests with isolated local PostgreSQL and focused progress/task regressions; builds, types and non-mutating lint as CI checks.

## Fog

- Current advisory applicability and compatible remedies require implementation-time inspection.
- Exact refactor boundaries and performance changes must follow consumer/dependency inspection and measurements, not file length alone.
- No current tickets published; use to-tickets against the published spec. Do not reuse the deferred six-ticket presentation graph for this broader work.
