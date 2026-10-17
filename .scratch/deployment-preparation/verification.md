# Deployment preparation verification

Date: 2026-10-17. Review base: `9f386bf853b11ebfe73485f338028c363a1f3c32`.

## Local validation

- All 19 existing Prisma migrations applied successfully to a new, isolated local PostgreSQL 17 database. No previous database or provider resources were modified.
- Backend builds on Node 22.20.0. Two consecutive clean production builds retain the complete executable output, including `dist/main.js` and Prisma services.
- Compiled API starts on the configured port and `/health` checks PostgreSQL.
- Frontend builds with Node 22.20.0. Vite reports a bundle-size advisory; this work does not restructure application bundles.
- Frontend: 13 suites, 57 tests and 12 snapshots pass. The original baseline had 12 passing suites and one failing suite: its PrivateRoute fixture expected the retired personal-login route. The fixture now reflects demo entry.
- Backend integration: 1 suite, 8 tests pass. Covers demo-only access, unauthorized identity selection, missing/invalid/wrong-kind session tokens, independent visitor sessions, logout, protected API access, health, credential filtering, seed population, repeated initialization preserving edits and visitor-created projects, and confirmed manual restoration.
- Changed backend source, scripts and integration test pass ESLint. Changed frontend runtime files have no lint errors; two Fast Refresh warnings remain for the existing context/hooks export pattern.
- Manual local HTTP/WebSocket smoke check on the compiled API and Vite proxy passed: `/api/health`, same-origin session initialization and refresh, two populated projects, an SPA deep link, and a project update delivered over a direct WebSocket connection without credential fields.
- Documented `npm.cmd run demo:seed` and `npm.cmd run demo:reset -- --confirm-demo-reset` execute successfully against the isolated local demo database.

## Existing backend unit-test failures

The original unit suite remains broken: all 25 generated/scaffold suites fail, predominantly because their source aliases or injected providers are not configured. The same 25 suites fail against the unchanged review-base source in an isolated temporary copy. These tests were not hidden or disabled. The obsolete Hello World e2e scaffold was replaced by the meaningful HTTP integration suite.

This preparation does not repair the unrelated unit-test scaffolding. The passing build and new integration tests do not imply that the full backend unit suite is green.

## Practical limits

No connected browser was available, so visual/responsive checks could not be performed. The initial local checks did not establish cloud behavior. The later authorized publication and cloud HTTP/WebSocket evidence are recorded below; actual browser cookie-policy and visual checks remain separate limitations.

## Standards

No hard violations of documented repository standards and no blocking findings were found by the independent Standards reviewer.

One low-priority heuristic, **possible Refused Bequest**: `frontend/src/context/authContext/index.tsx` retains these legacy personal-account methods:

```ts
login: personalAccountsDisabled, register: personalAccountsDisabled,
```

Both always throw. Remaining consumers belong to unrouted legacy Login/Register pages. A future cleanup can remove those pages/helpers and these methods together. This is optional maintenance, not a standards violation or a publicly exposed personal-account flow.

## Spec

The independent Spec reviewer found **0 actionable findings** and no material scope creep. Separate deployment, standalone API, health/migration startup, fixed demo identity, disabled personal access, sanitized HTTP/socket payloads, populated shared data, repeat-safe initialization, explicit restoration, API proxy, direct socket URL and manual deployment guidance match the confirmed spec.

At the initial review, actual provider deployment was left to the owner. The owner subsequently authorized agent-assisted publication, recorded below. The test-only correction specifies the Nest application's generic type correctly; it does not change runtime behavior.

Review totals: Standards — 0 hard violations, 1 optional contract-cleanup observation; Spec — 0 findings. Neither axis has a blocking finding.

## Single database variable adjustment — 2026-10-17

- User requested `DATABASE_URL` as the only connection variable. Removed the second URL from Prisma's datasource, runtime validation, Render configuration, examples, integration fixtures and current deployment instructions.
- The ignored backend environment contained the supplied Neon pooled connection under the old variable and the local database under `DATABASE_URL`. Moved the supplied Neon connection to `DATABASE_URL`, selecting the direct endpoint of that same database for migration compatibility. Kept TLS and used `connect_timeout=15` and `connection_limit=3` unless already specified. No credentials were printed or added to tracked files.
- Prisma schema validation, client generation, backend build and ESLint for changed TypeScript files pass. Environment validation accepts `DATABASE_URL` without a second URL and rejects missing or non-PostgreSQL URLs.
- Windows initially blocked Prisma engine replacement because two backend watch processes held it open. Stopped only the verified backend watch trees, regenerated successfully and restarted a single backend watcher.
- Before initialization was authorized, a read-only Prisma query connected successfully to Neon and found **0 tables**. No Neon tables or data were changed in the variable-only adjustment. The subsequent authorized initialization is recorded below. The destructive integration suite was never run against Neon.

## Authorized cloud publication — 2026-10-17

- User authorized proceeding with Neon initialization and publication. All 19 migrations applied successfully to the verified new empty schema, without importing local data or altering old resources.
- The original 30-second seed transaction expired remotely (Prisma P2028) and rolled back completely. Confirmed 0 users/projects/tickets, increased the seed timeout to 120 seconds and initialized successfully. Verified 2 projects, 6 users, 4 epics, 8 features, 36 tickets, 72 tasks, 6 sprints, 12 goals, 36 goal tasks, 36 capacities and 12 retrospective cards. A repeat seed returned `unchanged`.
- Render: `project-management-api`, service `srv-db9shbmq1p3s739eivp0`, plan Free, region Ohio, Node 22.23.3, root `backend`, branch `main`. Verified deployment `dep-db9shc6q1p3s739ej1ng` is live at backend commit `ac3925e3cd786a06903d75dc0ec56327cb6c4bd0`. URL: https://project-management-api-5xe1.onrender.com.
- Vercel: `project-management`, project `prj_MA4JnbztEkSLNthWBEEAAPkKSaYs`, team Hobby, configured Node 22, root `frontend`, GitHub `EPraz/projectManagement`, production branch `main`. Verified deployment `dpl_HQNizbfuqaaduLEQkWN1i9onTNqD` is ready at `6d123e201d017bd89305d3284ae56318287df74c`. Stable URL: https://project-management-murex-pi.vercel.app.
- Production Render has only `DATABASE_URL` for database connectivity, a new random JWT secret, `NODE_ENV=production`, `NODE_VERSION=22` and the exact production frontend origin. Vercel has only public API/socket variables. Credentials were passed privately and remain in ignored local files/provider configuration; no credentials or backups were uploaded to GitHub or Vercel.
- Anonymous frontend HTML, SPA deep-link fallback, direct `/health` and same-origin `/api/health` return 200. The built frontend contains the actual Render socket origin.
- Through the Vercel proxy: demo login returns 201, cookies are HttpOnly/Secure/SameSite=Lax without Domain, independent visitors receive different cookies, refresh succeeds, protected projects load, arbitrary identity selection returns 400, and retired personal login/register endpoints return 404. Project responses exclude password and refresh-token fields. Logging out one visitor clears its cookie and preserves the other visitor's refresh.
- Two direct TLS WebSocket clients using the production frontend Origin connect and receive the same project update without sensitive fields. The patch reused existing description/author values; no test project or ticket was inserted.
- Updated GitHub's homepage to the stable frontend URL. Current URL/configuration and manual maintenance commands are in `docs/deployment.md`.
- Vercel's build reported dependency advisories. A focused `npm audit --omit=dev` on the frontend reports 13 advisories: 9 high, 4 moderate, 0 critical. Exploitability/reachability was not assessed, and no automatic dependency upgrades were applied. Track this as early follow-up work.
- Remaining limits: no real-browser visual/responsive/cookie-policy QA, no separate 15-minute idle recovery exercise, and the already documented 25 pre-existing scaffold unit-test failures. Cloud HTTP/WebSocket success does not imply these checks passed.
