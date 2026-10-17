# 03: Initialize Neon and publish the portfolio

Type: task
Status: claimed

## Scope

- Apply the existing migration history and initialize Datos demo in the supplied new Neon database, without importing local data or resetting an existing demo.
- Publish the Vercel frontend and free Render Node API using the available authenticated sessions and GitHub integration.
- Keep `DATABASE_URL` as the sole database connection variable and keep all credentials out of tracked files and logs.
- Verify deployed health, same-origin API proxy, demo entry, populated content, refresh and direct WebSocket connection.
- Preserve unrelated applications, old provider resources and the local database.

## Comments

2026-10-17: Owner authorized proceeding. Verified the supplied direct Neon schema had 0 tables; applied all 19 migrations successfully. Vercel CLI authenticates as the expected owner and lists existing projects, none belonging to this repository's new deployment. Render CLI was downloaded from the official release into ignored backend temporary storage and its SHA-256 verified; Render authentication is pending.

2026-10-17: Initial seed rolled back. A diagnostic rerun exposed Prisma P2028: the 30-second transaction timeout expired on the remote database. Verified 0 users/projects/tickets after rollback. Increased only the seed transaction timeout to 120 seconds to accommodate the same existing scenario over the network; initialization remains atomic and guarded.

2026-10-17: Neon initialization succeeded: 2 projects, 6 users, 4 epics, 8 features, 36 tickets, 72 tasks, 6 sprints, 12 goals, 36 goal tasks, 36 capacities and 12 retrospective cards. A second seed returned `unchanged` with identical counts. Owner completed Render CLI authorization. Created the Vercel Hobby project linked to GitHub (`frontend`, Node 22) and the Render Free Node service in Ohio (`backend`, branch `main`). Production secrets were provided privately; no secret values were logged or committed. Render assigned https://project-management-api-5xe1.onrender.com; Vercel assigned https://project-management-murex-pi.vercel.app. Updated the frontend proxy and public Vercel environment variables to those actual origins.

## Remaining

- [x] Apply 19 migrations to the new Neon database.
- [x] Initialize and verify the complete demo scenario.
- [ ] Publish frontend in Vercel with the actual backend URL.
- [ ] Publish API in Render with Neon and the production frontend origin.
- [ ] Verify cloud workflows and record URLs, commit and any limitations.
