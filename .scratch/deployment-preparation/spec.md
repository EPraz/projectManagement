# Portfolio deployment preparation

Status: implemented

## Confirmed scope

- Preserve React/Vite frontend and modular NestJS backend; deploy separately.
- Deploy Vercel frontend, Render Node backend and Neon PostgreSQL using free plans and provider domains. Accept backend cold starts. The owner authorized agent-assisted publication on 2026-10-17; owner completes interactive authentication when required.
- Prepare repository configuration, build/start/migration commands, environment examples and a deployment guide. Initialize only the newly supplied Neon demo database and create/configure the corresponding deployment resources. Do not modify the old database or unrelated provider resources.
- Initialize a fresh PostgreSQL database without importing old data.
- Use `DATABASE_URL` as the sole database connection variable for the API, Prisma migrations and demo seed. With Neon, use its direct endpoint so migrations do not depend on transaction pooling.
- Public app offers only Acceso demo with a dedicated Usuario demo. No arbitrary email selection, personal login or public account registration.
- Shared editable demo: visitors see each other's changes. Deploys/restarts never reseed or reset data.
- Seed representative projects, fictional team, epics, features, varied tickets/tasks/statuses, backlog, past/current/future sprints, capacity, goals, retrospectives and pair programming. Dates relative to initialization/reset.
- Repeated initialization must not duplicate or overwrite visitor changes. Provide a separate explicit manual restoration command for this dedicated demo database.
- HTTP sessions must work with provider domains without relying on third-party cookies; document same-origin Vercel API proxy and separate direct Render WebSocket URL.

## Agreed verification boundaries

- HTTP demo authentication/session API: fixed identity, denied personal account access, refresh/logout behavior and protected resource access.
- Demo seed CLI against an isolated local PostgreSQL database: full content, repeat initialization preservation, explicit reset behavior.
- Build/typecheck both apps, run relevant tests and the full suites once at completion. Do not use existing database credentials for tests.

## Acceptance

- Vercel routes SPA deep links correctly and forwards /api to the documented Render URL.
- Backend starts as a standalone API, respects PORT and provides a health check.
- Prisma migration history applies to an empty PostgreSQL database.
- Demo API never returns password hashes or refresh tokens in resource payloads.
- Manual deployment instructions cover all provider configuration, migration, initial demo data and smoke checks.

## Later work

- Recruiter-oriented README rewrite, using Keelwatch as a reference when supplied.
- Walkthrough video.

## Comments

2026-10-17: User confirmed architecture, free plans, provider URLs, manual provider setup, rich seed, shared editable demo with manual restoration, demo-only access and API/seed verification. Review base proposed: 9f386bf853b11ebfe73485f338028c363a1f3c32.

2026-10-17: User confirmed that review base. Preparation implemented and locally verified; see [verification.md](verification.md). Provider deployment remains the owner's manual step. Recruiter README and walkthrough remain later work.

2026-10-17: User supplied the Neon connection in the ignored backend environment and requested the project's usual `DATABASE_URL` naming, removing the previously required second connection variable. This is a configuration adjustment; it does not authorize database reset or publish the application.

2026-10-17: User then instructed "proceda" after the pending Neon initialization and deployment were identified. This authorizes migrations, the initial demo seed and publication using the existing GitHub/Vercel access. The earlier manual-only provider arrangement is superseded; free plans, no old-data import, no old-resource modification and explicit-only restoration still apply. Track operational progress in issue 03.
