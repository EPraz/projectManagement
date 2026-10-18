# Ticket14 measured project reads

Baselinec21f8cfc2997ebce0e93500cf5809a9bc70de3ec; implementationd8088b49d9a5ec63a82013d16d53245fc92cb7ee. Same owned populated2project PostgreSQL17 at55433, Node22.20.0/Prisma6.5.0, clean locks and localhost backend3102. Browser production preview5183 uses explicit local socket3102 and matching backend origin. No public/owner database or stored data changed. No dependency/schema changes.

## Consumer map and compatible boundaries

- Project grid/list use title/description, creation/update attribution/date, avatars(memberid/name/email), ticket/sprint/team counts and completion from ticket status IDs plus status id/name. They do not consume hierarchy, tasks, goals, retrospective or full sprint work. ProjectSummary models those actual requirements, including optional updatedBy; card/list/avatar/progress consumers are migrated together. The existing progress helper accepts the minimal status/ticket fields as well as full records. Creation's complete Project response remains structurally compatible with the list's summary type.
- Workspace root tickets own work. The existing project reducer already overwrote each sprint's nested ticket collection with filtered root tickets; overview reads that canonical projection. New ?view=workspace omits only the redundant sprint ticket trees, preserving all complete root tickets and hierarchy, statuses, user/project membership, sprint goals/checklists/capacity/retrospective. HTTP decoding and confirmed local/socket reconciliation share the existing pure projection at two actual boundaries.
- List opts into ?view=summary; detail opts into ?view=workspace. Default full GETs, ?view=full and all socket payloads retain existing shapes for old callers/fixtures and independent deployments. Both new readers also accept the old server's full shape, allowing compatible rollout. New DTOs reject unsupported/repeated view values with400. No general API redesign, cache or new identity/visitor budget.

## Comparable measurements

Prisma query telemetry uses $on(query) with the exact existing/selected include objects; no query values or private fields are persisted. Public JSON byte counts apply existing credential omission and agree with real HTTP bytes. Four reads per case include first connection/cache effects plus three warm samples; durations are retained descriptively without a latency claim. The deterministic comparison is response size and SQL statement count. All work is local, so provider wakeup is separate and not measured.

|Read|Before public JSON bytes / SQL SELECTs|After bytes / SELECTs|
|---|---:|---:|
|Project list used by UI|334805 /43|5489 /6|
|Representative project workspace|167669 /43|110965 /33|
|Default complete list(control)|334805 /43|334805 /43|
|Default complete detail(control)|167669 /43|167669 /43|

UI list body falls98.4% and queries86.0%; workspace body falls33.8% and queries23.3%. List still sends one status ID per ticket to preserve current completion semantics; no speculative aggregation framework is introduced. Workspace reconstructs its small selected-sprint projection from the complete root data, as canonical state already did. [Measured samples](14-read-measurements.json) record exact before/after revisions, table counts and local timing samples.

## Verification

Real HTTP red regression failed because the unoptimized summary still included epics (1failed/43passed). Now all44API/startup tests pass, including minimal projections versus unchanged complete reads, preserved user/status/goal/card/capacity relations, reconstructed sprint membership, credential exclusion and query validation. Backend build/lint pass with0warnings.

All16focused project browser journeys pass, including both new cases: summary grid/list progress agrees with current data and compact workspace opens; malformed nonempty summary retains error/retry instead of false emptiness. Existing unavailable/non-JSON/empty/background retry, selection, stale read/socket races and deletion regressions keep their assertions and target the new opt-in request URLs. Detail matching uses URL.pathname to distinguish query strings correctly.

All77Jest tests/15suites/12snapshots, frontend types/build/lint pass (15visiblewarnings/0errors, no suppressions or snapshot changes). A missing updatedBy summary field was caught by types and added because it is a real grid consumer. Final integrated83production-browser journeys and independent two-axis review remain pending before closure.

Ticket13 hostedCI39092022632 passed. Final presentation remains deferred through16 and explicit owner design/readiness confirmation before recording.

## Review correction and final closure

Both independent axes identified the same P2: Ticket.statusId is legitimately nullable, including legacy/deleted-status data, but the new summary guard required a string. A browser regression with one completed and one null-status ticket first failed to show50%because the whole list was rejected. The type/guard now accept explicit null and the progress helper retains missing/null/non-completed records in its denominator. Missing required properties remain malformed. A separate real PostgreSQL fixture confirms stored null statuses survive both compact HTTP reads.

Final application3723701797d23356b6d56e77950b6742dd33ceba (backend projection unchanged fromd8088b4) passes **84/84 production-browser journeys in2.6minutes**, **45API/startup tests**, **77Jest tests/15suites/12snapshots**, types/build/lint. Frontend15visiblewarnings/0errors, backend0warnings; no suppressions or regenerated snapshots. All three new project-read browser journeys pass, including50%grid/list with null status. Both axes re-reviewed and report0remainingfindings. No verification remains pending for this slice.
