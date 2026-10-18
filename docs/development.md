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

The [Quality workflow](../.github/workflows/quality.yml) runs on pushes and pull requests to `main`, and can also be started manually. Frontend and backend jobs install the committed lockfiles under Node 22, run the checks above, and fail when any command fails. Frontend hook warnings remain visible. The backend job validates the Prisma schema and runs guarded tests against disposable PostgreSQL 17. A separate browser job uses its own PostgreSQL service, installs Chromium and runs the production applications with the isolated runner below. Its example credentials exist only for that job; no repository secrets or production environment file are loaded.

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

For the complete reproducible check, install both lockfiles and create a **dedicated disposable** local PostgreSQL database ending in `_browser_test`, separate from the API test database and all normal application data. From `frontend`:

```powershell
$env:NODE_ENV='test'
$env:BROWSER_DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/project_management_browser_test?schema=public'
npm.cmd run test:browser:isolated
```

POSIX shells:

```sh
NODE_ENV=test BROWSER_DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/project_management_browser_test?schema=public' npm run test:browser:isolated
```

**This command replaces the selected database's application fixtures on every run.** It refuses remote hosts, other database suffixes, schema/query overrides, or a missing explicit test mode. It never falls back to `DATABASE_URL`. It generates Prisma, applies committed migrations, replaces only this guarded database's fixtures, seeds the demo, builds both applications, chooses free local ports and starts its own API/production preview with matching proxy/socket/CORS settings. It waits for readiness and stops only its own child processes on success, failure or interruption. Fixture data remains available for local diagnosis. Run one suite per database at a time. On Windows, stop any application using the same installation before Prisma generation, or use a separate checkout, because its native engine can be locked by a running process.

Use installed Chrome by default. To use downloaded Chromium locally, run `npx --no-install playwright install chromium` and set `BROWSER_CHANNEL=chromium`. CI installs Chromium with its OS libraries. Optional test arguments follow `--`, for example `npm run test:browser:isolated -- finish.browser.ts`. Video and tracing stay off; failure screenshots are test diagnostics, not presentation assets.

The frontend's `npm run test:browser` runs the retained Playwright journeys against an **already running, populated isolated local application**. It never starts the normal private environment, initializes a database or restores the seed. Use the local setup above with separate fixture data. The default browser target is `http://127.0.0.1:5182`; set `BROWSER_BASE_URL` to your isolated frontend origin if different. The configuration rejects remote/non-HTTP targets. The backend's `CLIENT_URL`, Vite proxy and direct socket URL must match this fixture setup.

From `frontend`, after `npm ci`:

```sh
npm run test:browser -- session.browser.ts
```

Installed Chrome is used by default. If unavailable, run `npx playwright install chromium`, then set `BROWSER_CHANNEL=chromium` for the test command. Playwright's [browser configuration](https://playwright.dev/docs/test-configuration) controls the single local worker, bounded timeouts and failed screenshots. Video and trace recording are explicitly disabled. Ignored `test-results` contains local failure diagnostics; do not commit private credentials or authenticated browser state.

Browser test types are included in `npm run typecheck`. Jest remains the canonical component/domain runner and does not collect the `*.browser.ts` journeys. The current hosted baseline runs Jest, types, lint and builds; integrated browser automation will be added with the complete fixture workflows. Session tests cover real entry/refresh/deep-link/logout, independent browser contexts and controlled unavailable/malformed/expired responses.

Project journeys additionally cover load failures versus confirmed empty data, retained content on refresh, scoped socket updates and sprint selection, delayed-response cancellation, JSON API slash aliases and deep-link reload. Their independent API writers use fictional fixture data; run them only against the isolated local application. Temporary sprint fixtures and description edits are cleaned up by the affected journey.

Project state is owned by `context/projectContext`: the fetched project, canonical ticket collection and selected sprint ID are coordinated there. Sprint and ticket providers expose compatible views/actions for existing workflows. Sprint ticket collections are derived from the canonical project tickets; avoid adding a second fetched copy or writing a selected sprint back through an effect. Project-scoped socket subscriptions belong to the data module and dispose their handlers on unmount. An event during a pending read invalidates the older snapshot; retry/reconnection preserve existing content while fetching.

Editor journeys (`npm run test:browser -- editors.browser.ts`) exercise actual ticket tabs and task saves, draft preservation/retry, independent socket updates, pending submissions, planning/assignment clearing, keyboard focus and 390/1280px dialogs. Fixtures restore their edited fictional fields. Keep browser runs serial so their fixture edits and screenshot directories cannot interfere.

The ticket/task editors share a feature-local draft lifecycle and estimate fields. Their existing controlled presentation remains in each dialog; writable payloads and validation live in `services/workItemUpdates`. Save/delete callbacks return a confirmed boolean; closing before awaiting them discards failed edits. Completion must still belong to the active opened item; navigation invalidates its callbacks. Update/delete request locks and visible pending flags are keyed by item ID, so a different editor remains usable while the original request finishes. The request hooks use the authenticated request boundary and exclude nested response objects from editor payloads. Nullable assignment, estimates and planning relationships use `null` to clear persisted values. A ticket PATCH response updates ticket metadata while preserving the current task collection, which receives independent task events. Do not restore an older task snapshot from that response.

Hierarchy journeys (`hierarchy.browser.ts`) cover selected-project epics/features, linked backlog editors, create/edit/delete recovery, actual empty data, independent confirmed events, filters and keyboard use at narrow/wide widths. The existing `/projects/:id/epics` route now reads the canonical project instead of placeholder data. Its feature-local hook owns request/payload/projection work; React Hook Form owns editor validation and submission. Delete confirmation explains the existing database cascade to linked work. A committed hierarchy mutation emits only its project ID; the scoped project subscription reloads that project, including affected tickets.

The hierarchy list APIs use query parameters: `GET /epics?projectId=...` and `GET /features?epicId=...`. Mutation payloads retain their existing parent identifiers. Updating an existing title excludes that same record from duplicate detection; moving an epic to another project or assigning a feature to a parent/status in another project is rejected before writing.

The board tab comes from its URL query; avoid keeping a competing tab state that removes a linked ticket during navigation. Task board and backlog both read the canonical ticket context rather than a copied Layout array. The shared delete confirmation awaits callbacks and keeps explicit `false` failures available for retry; legacy void callbacks remain compatible while their workflows migrate. Supply an item key and return the actual outcome from newly migrated callers.
