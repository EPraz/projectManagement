# Product quality and refactor

Status: ready-for-agent

## Notes

- Owner instruction (2026-10-17): continue implementation and automated verification, but notify the owner and wait for design feedback and explicit readiness confirmation before recording the walkthrough. This checkpoint applies when the deferred presentation phase resumes.

- The public demo is deployed and its earlier project-list routing defect is fixed.
- Owner changed priority to code refactoring/product quality before final README and walkthrough, then explicitly invoked to-spec.
- Existing backlog is the source inventory. Presentation decisions remain saved separately and are deferred until this phase is verified.
- Published artifact: [spec.md](spec.md), status ready-for-agent. The owner explicitly confirmed the expanded test boundaries.

## Decisions so far

- 2026-10-17: Owner explicitly permits current package versions when necessary, including necessary major updates. Apply coupled package migrations with evidence and retained behavior checks; preserve data, hosting and pre-recording review boundaries.

- 2026-10-17: [Ticket 01](issues/01-trustworthy-checks-and-local-startup.md) resolved after passing clean local startup and canonical checks; [evidence](evidence/01-baseline.md) and [review](evidence/01-review.md) are recorded. Implementation commit 75165b8.

- 2026-10-17: [Ticket 02](issues/02-dependency-remediation.md) resolved: compatible dependency remedies and Jest 30 pass the clean application baseline; remaining moderate tooling exposure is explicitly recorded. [Assessment](evidence/02-dependencies.md), [review](evidence/02-review.md). Implementation commit 8b4f8cd.

- 2026-10-17: [Ticket 03](issues/03-quality-gates-ci.md) resolved: both hosted CI jobs passed on 7c8bc31 after a genuine snapshot-header failure was corrected without changing expectations. [Run and review evidence](evidence/03-ci.md).

- 2026-10-17: [Ticket 04](issues/04-accurate-project-progress.md) resolved: grid, list and overview report actual project progress, retaining sprint-specific metrics. [Evidence](evidence/04-progress.md), [review](evidence/04-review.md), implementation c4354d4.

- 2026-10-17: [Ticket 05](issues/05-reliable-task-movement.md) resolved: authenticated actor, valid status relationships, recoverable moves and preserved concurrent updates/deletions. [Evidence](evidence/05-task-movement.md), [review](evidence/05-review.md); c420f07 and d3cae3a. The initial Spec P2 was fixed and rechecked.

- 2026-10-17: [Ticket 06](issues/06-demo-session-and-navigation.md) resolved: cohesive demo-session/request/navigation boundaries and ten retained browser journeys. [Evidence](evidence/06-session.md), [review](evidence/06-review.md). Initial findings on cancellation and expiry were corrected and rechecked.

- Preserve React/Vite, modular NestJS, Prisma/PostgreSQL and Vercel/Render/Neon free deployment.
- Preserve public/old data, demo-only access, the single DATABASE_URL convention and explicit manual restoration.
- Correct confirmed progress and task-attribution defects, establish reliable tests/CI, then refactor observed boundaries and improve recovery, measured loading and developer setup.
- Distinguish confirmed defects from assessment candidates; avoid a broad rewrite, invented visitor policies or an uncontrolled dependency migration.
- Save the prior approved recruiter presentation scope and resume it after quality/cloud verification.

- 2026-10-17: [Ticket 07](issues/07-project-loading-and-recovery.md) resolved: canonical project state, recoverable reads, scoped events/selection, and confirmed deletion before refresh. [Evidence](evidence/07-project-state.md), [review](evidence/07-review.md); ff4ecab and d3b2f27. The initial Standards P2 was fixed and rechecked.

## Test-boundary confirmation

Confirmed by the owner: primary real-browser product workflows, complemented by HTTP/WebSocket tests with isolated local PostgreSQL and focused progress/task regressions; builds, types and non-mutating lint as CI checks.

## Fog

- Current advisory applicability and compatible remedies require implementation-time inspection.
- Exact refactor boundaries and performance changes must follow consumer/dependency inspection and measurements, not file length alone.
- Any material newly discovered scope or genuine additional dependency must be recorded explicitly before expanding an implementation ticket. The deferred six-ticket presentation graph remains separate.

## Approved ticket sequence

- 01 establishes meaningful checks and isolated local setup; it is the initial execution frontier.
- 02–06 then cover dependencies, CI, project progress, task movement and session/navigation cleanup.
- 07 establishes coherent project loading; 08–12 are independently verifiable ticket, hierarchy, planning, capacity/team and retrospective workflows.
- 13–15 address measured code loading, project read efficiency and existing bulk-operation correctness/diagnostics.
- 16 integrates checks, verifies product finish in the cloud and returns to the saved presentation phase.
- 2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Individual issues are published with status ready-for-agent; implementation has not started. The source spec, product code, database content, dependencies and cloud resources are unchanged.

## Execution index

| Ticket | Status | Blocked by |
| --- | --- | --- |
| [01: Establish trustworthy checks and isolated local startup](issues/01-trustworthy-checks-and-local-startup.md) | resolved | None |
| [02: Address applicable dependency findings without uncontrolled upgrades](issues/02-dependency-remediation.md) | resolved | 01 |
| [03: Enforce the reliable baseline in CI](issues/03-quality-gates-ci.md) | resolved | 01 |
| [04: Make project progress correct in both project views](issues/04-accurate-project-progress.md) | resolved | 01 |
| [05: Make task movement truthful and recoverable](issues/05-reliable-task-movement.md) | resolved | 01 |
| [06: Simplify demo sessions and navigation with a compatible request boundary](issues/06-demo-session-and-navigation.md) | resolved | 01 |
| [07: Make project loading, selection and recovery coherent](issues/07-project-loading-and-recovery.md) | resolved | 06 |
| [08: Refactor ticket and task editing as a reliable workflow](issues/08-ticket-and-task-editing.md) | ready-for-agent | 07 |
| [09: Refactor hierarchy and backlog without breaking linked work](issues/09-hierarchy-and-backlog.md) | ready-for-agent | 07 |
| [10: Make sprint planning and goals consistent across views](issues/10-sprint-planning-and-goals.md) | ready-for-agent | 07 |
| [11: Make team and capacity planning reliable](issues/11-team-and-capacity.md) | ready-for-agent | 07 |
| [12: Refactor the retrospective with complete recovery behavior](issues/12-retrospective-recovery.md) | ready-for-agent | 07 |
| [13: Reduce unnecessary initial and editor code loading](issues/13-initial-code-loading.md) | ready-for-agent | 08 |
| [14: Reduce unnecessary project read payloads and query work](issues/14-project-read-efficiency.md) | ready-for-agent | 07 |
| [15: Make bulk ticket operations and their diagnostics predictable](issues/15-bulk-ticket-operations.md) | ready-for-agent | 08 |
| [16: Verify product finish in CI and the cloud, then hand off presentation](issues/16-cloud-quality-verification.md) | ready-for-agent | 02, 03, 04, 05, 09, 10, 11, 12, 13, 14, 15 |

## Resume implementation

- Tickets 01–07 are resolved. Next numbered frontier: 08, ticket and task editing, now unblocked. Later blockers remain unchanged.
- Read the source [spec](spec.md), this map and the selected ticket. Claim the first open, unblocked, unclaimed ticket before implementing it, following the local tracker instructions.
- Preserve the approved test boundaries: use isolated PostgreSQL fixtures, never the owner's current private environment or public Neon database for fixture cleanup.
- Record verification and remaining findings with each ticket; resolve it and update this map before moving the frontier.
- Final presentation remains deferred until ticket 16 verifies the integrated application.

