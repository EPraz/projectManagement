# 01: Restore local frontend and backend startup

**What to build:** The owner can start the existing local applications with their normal npm commands, reach the frontend and API, and keep unrelated projects running.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] Frontend supports `npm start` as well as `npm run dev`.
- [x] Missing local deployment variables are prepared without exposing credentials or weakening production validation.
- [x] Frontend port is explicit and agrees with the backend allowed origin; occupied ports never silently change the session/socket origin.
- [x] Original npm commands start both services and the API health check succeeds.
- [x] Existing application data is preserved; no migrations or seed run against the previous database.
- [x] Document the actual local commands and verification, including any separate demo-data initialization still needed.

## Comments

2026-10-17: Owner reports backend `Missing environment variable: DIRECT_URL` and frontend `npm start` fails because no start script exists. Reproduced both commands. Local backend env also lacks JWT_SECRET. Existing local PostgreSQL connection is present. Other projects occupy frontend ports 5173–5175; automatic Vite fallback changes the origin used for sessions/WebSockets.

The owner prefers specs and tickets for work that may span sessions, so pauses do not lose decisions or outstanding work. Preserve that workflow preference for subsequent work.

## Answer

The backend's existing ignored local environment was missing the newly required DIRECT_URL and JWT_SECRET. DIRECT_URL was set to the existing verified local PostgreSQL connection and a fresh random JWT secret was generated without printing it. DATABASE_URL was preserved. Production validation was not weakened.

The frontend had no `start` script; an alias to Vite now makes the owner's command work. Other projects occupy ports 5173–5175. DEV_PORT now explicitly selects the frontend port and strictPort prevents an unnoticed origin change. This local environment uses frontend http://localhost:5180 and CLIENT_URL with that exact origin; REST uses the same-origin /api proxy and the socket connects to localhost:3000.

Original commands now start successfully: `npm run start:dev` in backend and `npm start` in frontend. Local frontend, API /health and proxied /api/health all return HTTP 200. Typecheck/lint validate the configuration change. Both services are left running for the owner.

The current local database does not contain the dedicated Usuario demo: access correctly returns HTTP 503 with `Demo data is not initialized`. No migration, seed, reset or data import was run against that database. The owner has been asked whether to initialize a separate new local demo database or wait for manual Neon setup; this is a separate data initialization decision, not a remaining startup failure.
