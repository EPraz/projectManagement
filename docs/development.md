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
