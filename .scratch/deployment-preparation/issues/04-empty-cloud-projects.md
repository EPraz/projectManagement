# 04: Cloud demo shows an empty project list

Type: task
Status: claimed

## Symptom and reproduction

After Explore demo, the real browser navigates to `/projects` and displays "No projects yet". The direct authenticated API has two populated projects.

`node backend/.tmp/browser-demo-repro.cjs` reproduces the actual empty state in a fresh headless Chrome session. The browser requests `/api/projects/` and receives HTTP 200, but neither seeded project title renders. Diagnostics and screenshots remain in ignored backend temporary storage.

## Root cause

The Vercel rewrite forwards `/api/projects` as JSON but sends `/api/projects/` to the SPA fallback, returning HTML with HTTP 200. The existing project/user loading hooks use the trailing slash; parsing HTML as JSON fails and the project hook returns `[]`. The earlier HTTP smoke check used only the canonical route without a trailing slash and missed this browser request shape.

## Acceptance

- API requests with or without a trailing slash return API JSON, including errors, and preserve POST methods/bodies and session cookies.
- A fresh browser login shows both seeded project titles on the main page and retains them after reload.
- Opening a seeded project displays populated content.
- No database reset or reseed; existing demo content remains intact.

## Comments

2026-10-17: Owner reported an empty main Projects page after cloud demo entry. Reproduced in real headless Chrome and narrowed to the API trailing-slash routing boundary. Added a deployment regression probe at `frontend/scripts/check-deployment.mjs` that exercises the real proxy and session flow rather than asserting implementation details of the routing config.

2026-10-17: The regression probe fails on the original production deployment: `/api/auth/instant-login/` returns 405 instead of 201. Separate probes confirm `/api/projects/` returns HTML while `/api/projects` returns the two projects as JSON. Set the documented Vercel `trailingSlash: false` option so canonicalization occurs before API rewrite/SPA fallback. No application hooks, database content or unrelated code are changed.
