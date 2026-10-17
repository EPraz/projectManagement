# Portfolio deployment preparation

Status: ready-for-agent

## Confirmed scope

- Preserve React/Vite frontend and modular NestJS backend; deploy separately.
- Owner manually configures Vercel frontend, Render Node backend and Neon PostgreSQL, using free plans and provider domains. Accept backend cold starts.
- Prepare repository configuration, build/start/migration commands, environment examples and a deployment guide. Do not create or modify provider resources or the old database.
- Initialize a fresh PostgreSQL database without importing old data.
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
