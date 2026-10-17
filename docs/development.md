# Local development and verification

Use Node 22, npm and PostgreSQL. The frontend and backend have independent lockfiles. No cloud account or private environment file is required. Work in a new local database; never use the public demo or an existing personal database for test fixtures.

## Start a populated local application

1. Create a new PostgreSQL database (for example `project_management_local`).
2. In `backend`, run `npm ci`, then copy `.env.example` to `.env`. Set `DATABASE_URL` to the new database, replace the example `JWT_SECRET` with a random value of at least 32 characters, and set `CLIENT_URL` to the chosen frontend origin.
3. Run `npm run prisma:generate`, `npm run db:deploy`, `npm run demo:seed`, then `npm run start:dev`.
4. In another terminal, enter `frontend`, run `npm ci`, copy `.env.example` to `.env`, then run `npm run dev` (or `npm start`). Open the printed address and choose **Explore demo**.

`DATABASE_URL` is the sole database connection variable. Initialization preserves an existing initialized demo. Deploying or starting either app never restores demo data automatically. See [deployment](deployment.md) for the separately confirmed manual restoration operation.

The default ports are 3000 for the backend and 5173 for the frontend. If occupied, choose free ports explicitly. Keep backend `PORT`, frontend `API_PROXY_TARGET` and `VITE_SOCKET_URL` aligned; keep frontend `DEV_PORT` and backend `CLIENT_URL` aligned. For example, backend 3101 and frontend 5181 use `API_PROXY_TARGET=http://localhost:3101`, `VITE_SOCKET_URL=http://localhost:3101`, and `CLIENT_URL=http://localhost:5181`. The frontend fails instead of silently selecting a different origin.

Missing configuration names are reported on startup. Invalid database/client URLs are described without echoing their values. An occupied backend port gives a corrective message and exits. Database availability errors require checking the selected local PostgreSQL process and connection settings; do not paste connection strings into issues or logs.

## Checks

From `frontend`:

```sh
npm run typecheck
npm run lint
npm test -- --runInBand
npm run build
```

From `backend`:

```sh
npm run prisma:generate
npm run typecheck
npm run lint
npm run build
```

Lint checks are non-mutating. Backend `npm run lint:fix` is an explicit opt-in repair command. Type checking may update ignored compiler caches. Frontend hook warnings remain visible and must be addressed in the workflows that own them; they are not suppressed by this baseline.

The retained test runner is Jest 30, with its matching browser environment and a supported ts-jest release. The frontend locks a compatible SWC 1.15 version because newer native carriers require cache permissions that standard Windows contributors may not have; no extra environment variable or machine permission change is required. Keep the lockfiles and dependency override when installing. Current advisory dispositions are recorded in the [quality dependency assessment](../.scratch/portfolio-improvements/evidence/02-dependencies.md).

## Continuous integration

The [Quality workflow](../.github/workflows/quality.yml) runs on pushes and pull requests to `main`, and can also be started manually. Separate frontend and backend jobs install the committed lockfiles under Node 22, run the checks above, and fail when any command fails. Frontend hook warnings remain visible. The backend job also validates the Prisma schema and runs the canonical guarded tests against a disposable PostgreSQL 17 service. Its example credentials exist only for that job; no repository secrets or production environment file are loaded.

To reproduce locally, run `npm ci` in each application, then the commands in **Checks**. In `backend`, also run `npx --no-install prisma validate` with a local `DATABASE_URL`, then `npm test` with the separate disposable `TEST_DATABASE_URL` described below. Prisma generation must precede type checking after a fresh install. The test runner applies committed migrations itself. A successful local run does not substitute for checking the hosted workflow result.

## Isolated API and seed tests

Create a **different**, disposable local PostgreSQL database with a name ending in `_test`, for example `project_management_test`. Set `TEST_DATABASE_URL` in the current terminal; do not change your normal `.env` to run fixtures.

PowerShell example (local example credentials only):

```powershell
$env:TEST_DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/project_management_test?schema=public'
npm.cmd test
```

POSIX shells:

```sh
TEST_DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/project_management_test?schema=public' npm test
```

Run these commands inside `backend`. The runner rejects missing/malformed URLs, remote hosts, database names without `_test`, and schema/query overrides before invoking Prisma. It never falls back to the owner's `DATABASE_URL`. It applies committed migrations and runs the retained HTTP/seed and contributor-startup tests with `NODE_ENV=test`, so Nest does not load private environment files. **The selected test database is cleaned and restored by fixtures.** Do not point it at data you intend to keep, even if the name ends in `_test`.

For a focused run, use `npm test -- startup.e2e-spec.ts` or `npm test -- demo.e2e-spec.ts`. `npm run test:e2e` uses the same guarded runner. Run fixture suites serially against a dedicated database, and keep browser demo data in another local database when running tests concurrently.

The baseline deliberately retires 24 generated `should be defined` tests that omitted required providers, plus one obsolete `Hello World` test for a removed endpoint. These had no CRUD assertions to preserve. Their construction coverage is replaced by booting the real application for HTTP checks. Auth, health, credential filtering and seed preservation/restoration retain behavioral assertions. Mutation and relationship coverage is extended at the HTTP/WebSocket and browser boundaries in the relevant quality tickets; this baseline does not claim complete CRUD coverage.

## Repeatable browser journeys

The frontend's `npm run test:browser` runs the retained Playwright journeys against an **already running, populated isolated local application**. It never starts the normal private environment, initializes a database or restores the seed. Use the local setup above with separate fixture data. The default browser target is `http://127.0.0.1:5182`; set `BROWSER_BASE_URL` to your isolated frontend origin if different. The configuration rejects remote/non-HTTP targets. The backend's `CLIENT_URL`, Vite proxy and direct socket URL must match this fixture setup.

From `frontend`, after `npm ci`:

```sh
npm run test:browser -- session.browser.ts
```

Installed Chrome is used by default. If unavailable, run `npx playwright install chromium`, then set `BROWSER_CHANNEL=chromium` for the test command. Playwright's [browser configuration](https://playwright.dev/docs/test-configuration) controls the single local worker, bounded timeouts and failed screenshots. Video and trace recording are explicitly disabled. Ignored `test-results` contains local failure diagnostics; do not commit private credentials or authenticated browser state.

Browser test types are included in `npm run typecheck`. Jest remains the canonical component/domain runner and does not collect the `*.browser.ts` journeys. The current hosted baseline runs Jest, types, lint and builds; integrated browser automation will be added with the complete fixture workflows. Session tests cover real entry/refresh/deep-link/logout, independent browser contexts and controlled unavailable/malformed/expired responses.
