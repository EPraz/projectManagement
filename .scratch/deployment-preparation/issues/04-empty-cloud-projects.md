# 04: Cloud demo shows an empty project list

Type: task
Status: resolved

## Symptom and reproduction

After Explore demo, the real browser navigates to `/projects` and displays "No projects yet". The direct authenticated API has two populated projects.

`node backend/.tmp/browser-demo-repro.cjs` reproduces the actual empty state in a fresh headless Chrome session. The browser requests `/api/projects/` and receives HTTP 200, but neither seeded project title renders. Diagnostics and screenshots remain in ignored backend temporary storage.

## Root cause

The Vercel rewrite forwards `/api/projects` as JSON but sends `/api/projects/` to the SPA fallback, returning HTML with HTTP 200. The existing project/user loading hooks use the trailing slash; parsing HTML as JSON fails and the project hook returns `[]`. The earlier HTTP smoke check used only the canonical route without a trailing slash and missed this browser request shape.

## Acceptance

- [x] API requests with or without a trailing slash return API JSON, including errors, and preserve POST methods/bodies and session cookies.
- [x] A fresh browser login shows both seeded project titles on the main page and retains them after reload.
- [x] Opening a seeded project displays populated content.
- [x] No database reset or reseed; existing demo content remains intact.

## Comments

2026-10-17: Owner reported an empty main Projects page after cloud demo entry. Reproduced in real headless Chrome and narrowed to the API trailing-slash routing boundary. Added a deployment regression probe at `frontend/scripts/check-deployment.mjs` that exercises the real proxy and session flow rather than asserting implementation details of the routing config.

2026-10-17: The regression probe fails on the original production deployment: `/api/auth/instant-login/` returns 405 instead of 201. Separate probes confirm `/api/projects/` returns HTML while `/api/projects` returns the two projects as JSON. Set the documented Vercel `trailingSlash: false` option so canonicalization occurs before API rewrite/SPA fallback. No application hooks, database content or unrelated code are changed.

## Answer

Commit `775b95ed9c28c99bd26677edc9e9e904370910ce` deployed successfully as `dpl_5LhHeUfG3Aq1pgCpMQwSmrCTJgDc` at the stable production frontend URL. `node frontend/scripts/check-deployment.mjs` now passes against production: canonical and trailing-slash API requests return JSON, authorization/errors remain API responses, POST login/refresh preserve methods and cookies, and SPA deep links still serve HTML.

The original real-Chrome reproduction now passes without intercepting requests: both Launchpad and Orbit render, showing 18 tickets, 3 sprints and 6 team members each. Browser traces show `/api/projects/` redirects with 308 to `/api/projects`, which returns two projects as JSON. Browser reload preserves the authenticated populated list at widths 1440, 1024, 768 and 320. Opening Launchpad loads its populated overview, activity, deadlines, goals and blockers.

No database reset/reseed was run. Browser tooling was installed only in ignored temporary storage and used the already-installed Chrome in headless mode. Full accessibility and visual polish remain separate backlog work.
