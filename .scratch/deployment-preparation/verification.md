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

No connected browser was available, so visual/responsive checks could not be performed. Local HTTP/WebSocket checks do not establish behavior on deployed Vercel, Render or Neon resources. The owner must replace the Render destination in `frontend/vercel.json`, configure provider variables and follow the deployed smoke checklist in `docs/deployment.md`.

## Standards

No hard violations of documented repository standards and no blocking findings were found by the independent Standards reviewer.

One low-priority heuristic, **possible Refused Bequest**: `frontend/src/context/authContext/index.tsx` retains these legacy personal-account methods:

```ts
login: personalAccountsDisabled, register: personalAccountsDisabled,
```

Both always throw. Remaining consumers belong to unrouted legacy Login/Register pages. A future cleanup can remove those pages/helpers and these methods together. This is optional maintenance, not a standards violation or a publicly exposed personal-account flow.

## Spec

The independent Spec reviewer found **0 actionable findings** and no material scope creep. Separate deployment, standalone API, health/migration startup, fixed demo identity, disabled personal access, sanitized HTTP/socket payloads, populated shared data, repeat-safe initialization, explicit restoration, API proxy, direct socket URL and manual deployment guidance match the confirmed spec.

Actual provider deployment is intentionally left to the owner, as agreed. The final test-only correction specifies the Nest application's generic type correctly; it does not change runtime behavior.

Review totals: Standards — 0 hard violations, 1 optional contract-cleanup observation; Spec — 0 findings. Neither axis has a blocking finding.

## Single database variable adjustment — 2026-10-17

- User requested `DATABASE_URL` as the only connection variable. Removed the second URL from Prisma's datasource, runtime validation, Render configuration, examples, integration fixtures and current deployment instructions.
- The ignored backend environment contained the supplied Neon pooled connection under the old variable and the local database under `DATABASE_URL`. Moved the supplied Neon connection to `DATABASE_URL`, selecting the direct endpoint of that same database for migration compatibility. Kept TLS and used `connect_timeout=15` and `connection_limit=3` unless already specified. No credentials were printed or added to tracked files.
- Prisma schema validation, client generation, backend build and ESLint for changed TypeScript files pass. Environment validation accepts `DATABASE_URL` without a second URL and rejects missing or non-PostgreSQL URLs.
- Windows initially blocked Prisma engine replacement because two backend watch processes held it open. Stopped only the verified backend watch trees, regenerated successfully and restarted a single backend watcher.
- A read-only Prisma query connects successfully to Neon. Its selected schema has **0 tables**; migrations and the first demo seed remain pending. No Neon tables or data were created, changed or deleted in this adjustment. Earlier local integration results above remain historical; the destructive integration suite was not run against Neon.
