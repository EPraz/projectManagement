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
- The owner invoked to-tickets against the published spec. A 16-ticket proposal is prepared in tickets.proposed.md and awaits the required granularity/dependency review before individual issue publication. Do not reuse the deferred six-ticket presentation graph for this broader work.

## Ticket proposal

- 01 establishes meaningful checks and isolated local setup; it is the initial execution frontier.
- 02–06 then cover dependencies, CI, project progress, task movement and session/navigation cleanup.
- 07 establishes coherent project loading; 08–12 are independently verifiable ticket, hierarchy, planning, capacity/team and retrospective workflows.
- 13–15 address measured code loading, project read efficiency and existing bulk-operation correctness/diagnostics.
- 16 integrates checks, verifies product finish in the cloud and returns to the saved presentation phase.
- No source spec, product code, database content, dependency or cloud resource is changed by preparing this proposal.
