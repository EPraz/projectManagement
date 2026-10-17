# 02: Initialize Datos demo in the current local database

**What to build:** The owner can enter the running local portfolio and explore a fully populated demo using the current PostgreSQL database.

**Blocked by:** 01: Restore local frontend and backend startup.

**Status:** resolved

- [x] Initialize the schema and rich Datos demo in the current local PostgreSQL database.
- [x] Preserve existing records and keep them outside the public demo's data.
- [x] Keep all credentials in ignored local environment files.
- [x] Verify entry, projects, session refresh and populated content through the running frontend proxy.
- [x] Record the local setup and commands so another session can resume.

## Comments

2026-10-17: Owner requested preparing the current database rather than a separate database. It contains 5 users, 4 projects, 12 tickets and other existing records, with 17 migrations applied. A custom-format PostgreSQL backup was created and verified under the ignored backend temporary backup directory before changes.

Use a new `portfolio_demo` schema inside that same database. Only the ignored local connection URLs' schema parameter changes. Existing public-schema data remains in place and is not exposed through the demo API. This satisfies current-database use without deleting or importing existing records. Production Neon configuration remains a separate manual step.

## Answer

Created `portfolio_demo` inside the current local database, applied all 19 migrations to that new schema and ran the rich seed successfully. Updated only the schema parameter of DATABASE_URL and DIRECT_URL in the ignored local backend environment. The existing public schema still contains its original 5 users, 4 projects and 12 tickets. The verified backup is retained in the ignored local backup directory.

Live verification through http://localhost:5180/api passed: demo entry HTTP 201, protected resource reads and session refresh. Payloads contain 2 projects, 6 users, 4 epics, 8 features, 36 tickets, 72 tasks, 6 sprints, 12 goals, 36 capacities and 12 retrospective cards, without password or refresh-token fields. A direct WebSocket connection from the frontend's configured origin also succeeds.

The running frontend is http://localhost:5180 and backend http://localhost:3000. For later starts: `npm start` in frontend, `npm run start:dev` in backend. Both local connection URLs must keep `schema=portfolio_demo`; initialization is now repeat-safe with `npm run demo:seed`. Explicit restoration affects the active demo schema, not the original public schema. No data was imported from the previous application.
