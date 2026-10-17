# Ticket 01: verification evidence

Date: 2026-10-17. Implementation/review base: a713e85. This establishes the contributor/check baseline, not completion of the remaining quality tickets.

## Before

- The initial shell used Node 24.13.0; final commands and clean installation explicitly use installed Node 22.20.0 without changing the owner's global Node selection.
- Frontend: 57 tests in 13 suites, 12 snapshots passed. Lint reported 30 errors and 43 warnings, including generated coverage files.
- Backend: all 25 legacy scaffold suites failed. Twenty-four asserted only construction while omitting required providers; shared source aliases were unresolved by their old Jest configuration. The remaining test imported an inactive controller and expected the removed Hello World endpoint. Backend type checking also failed on that obsolete import.
- The retained, separate HTTP/seed suite passed all 8 tests against isolated PostgreSQL 17.
- Backend lint reported 3,698 errors and two warnings, dominated by CRLF/style mismatch. Actual unused imports and typed request handling also needed repair.

## Delivered checks and safety

- Backend `npm test` and `npm run test:e2e` now use one explicit guarded HTTP/seed runner. No tests are skipped to make the canonical run pass. No fallback to the owner's normal database or environment file is allowed.
- The runner validates the isolated local `_test` database/public schema before migration and runs committed migrations before Jest. The destructive suite retains its own destination guard as well.
- Startup regressions reject unsafe fixture destinations and invalid database URLs without echoing private values. An occupied backend port reports a corrective message and exits.
- The port test binds the same wildcard address as the API. An initial loopback-only fixture was invalid on Windows because loopback and wildcard listeners could coexist; a standalone Node reproduction confirmed that difference. Final same-address coverage passes. Earlier timeout observations are not evidence of a product hang.
- Lint is non-mutating; explicit `lint:fix` remains opt-in. Source type holes, unused bindings/imports and inert expressions were corrected without changing workflow behavior. Formatting accepts the checkout's Windows/Unix line endings; lint ignores generated frontend coverage, not active source.
- Contributor instructions describe local database creation, migrations/generation, explicit seed initialization, app startup, ports and guarded fixture execution in `docs/development.md`. The deployment guide points to those commands.

## Scaffold retirement and coverage mapping

| Retired scaffold | Retained/replacement behavioral boundary | Further coverage owned by |
| --- | --- | --- |
| App controller / obsolete Hello World | Health readiness; removed root remains 404 | Existing HTTP suite |
| Auth controller/service | Demo entry, rejected personal accounts, cookies, refresh, independent sessions, logout | 06 session/navigation |
| User controller/service | Protected demo identity; no account creation; credential exclusion | 11 team/capacity |
| Project controller/service | Populated project reads, edit preservation, repeat initialization and explicit restoration | 07 project state; 14 reads |
| Epic, feature, sprint, ticket, task, goal, capacity and retrospective controller/service construction | Real application module boot, protected HTTP routes, populated nested seed/project graph | 05, 08–12, 15 workflow mutations |
| Epic-status controller/service construction | Real application module boot; controller exposes no business routes | Existing module configuration |

The retired assertions did not verify CRUD behavior. This mapping does not claim comprehensive CRUD coverage; the approved workflow tickets extend it at the agreed HTTP/WebSocket/browser seams.

## Final results

| Check | Result |
| --- | --- |
| Frontend retained tests | 57 passed, 13 suites, 12 snapshots |
| Backend canonical suite | 25 passed, 2 suites, no skips |
| Frontend/backend types | Pass |
| Backend lint | Pass, no errors/warnings |
| Frontend lint | Pass, zero errors; 40 visible warnings retained |
| Isolated clean `npm ci` for both applications under Node 22 | Pass |
| Clean Prisma generation and all committed migrations | Pass |
| Clean explicit seed | 2 projects, 6 users, 36 tickets, 72 tasks, 6 sprints |
| Clean backend/frontend production builds | Pass |
| Chrome 1440×1000, real clean local processes | Demo entry; both populated cards rendered; Orbit overview; authenticated deep-link reload pass |
| Git whitespace check | Pass |

The test and clean-demo databases use a separately initialized PostgreSQL 17 process in ignored task storage on loopback port 55433. Fixture and browser databases are different. Clean source/dependencies contain no ignored private environment files. Browser processes use dedicated free ports 3102/5182; unrelated listeners were left alone.

Raw local diagnostics, clean-copy dependencies and a visually inspected startup screenshot are ignored under `backend/.tmp/quality/`. The initial browser screenshot caught an entry animation; the final capture waited until both project cards were fully rendered. No walkthrough/video was recorded.

Baseline build measurement for later comparison: Vite reports one main JavaScript asset of 1,609.73 kB, gzip 475.40 kB. The large-chunk warning remains visible for ticket 13. The project-list progress still displays the known 0% defect, intentionally reserved for ticket 04's regression/change. No claim of complete workflow QA or cloud verification is made here.

No cloud deployment, dependency upgrade, public Neon write, old-database cleanup, or demo reset was performed for this ticket. Public and old data were preserved. The owner's current environment files remain unchanged. The owner's pre-recording design-feedback/approval checkpoint is recorded in both effort maps and the presentation walkthrough criteria.
