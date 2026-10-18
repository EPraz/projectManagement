# Ticket 16: integrated product verification

Baseline f82e43c. This ticket finishes quality work; presentation assets remain deferred.

## Bounded finish corrections

- Browser regressions first reproduced lost project-create drafts for 503 and malformed successful responses. Creation now uses the authenticated shared request boundary, validates its project response and reports failure to the existing dialog. Drafts remain open for retry; only confirmed results enter the project list.
- Settings showed a hardcoded John Doe profile and contained unreachable simulated save/notification state. It now displays the authenticated shared demo identity, keeps profile and other settings unavailable, and explains that limitation. Existing cards/palette/responsive layout are retained; no personal account or settings feature is added.
- Actual grid/list project titles were clickable text with no keyboard link. A real-browser regression first timed out finding an entry link; both titles now use native links. Existing favorite/action icon buttons have names and favorite pressed state. Mouse card navigation remains compatible.

## Controlled browser lifecycle

`npm run test:browser:isolated` requires explicit NODE_ENV=test and a loopback public-schema database ending in `_browser_test`; no DATABASE_URL fallback. Seven startup regressions reject unsafe/missing configuration before tools run, without printing supplied secrets. The runner generates Prisma, migrates and replaces only guarded fixtures, seeds, builds, selects local ports, owns both servers, waits for readiness and closes owned processes. Backend fixture mode avoids private environment files; frontend assets build in production mode with explicit proxy/socket settings. Video/trace remain off.

The new CI browser job installs both lockfiles and Chromium/OS dependencies, uses separate ephemeral PostgreSQL 17 and runs this same lifecycle. API tests retain their separate disposable database. Local verification used the clean dependency installation with no private frontend/backend environment files and a newly created browser database; all 19 migrations applied before the demo initialized (2 projects, 6 users, 36 tickets, 72 tasks, 6 sprints). On Windows an earlier owned app locked Prisma's native engine; stopping that owned app allowed generation, without changing normal user apps or filesystem permissions.

The first harness build inherited test-mode React assets; it was corrected to an explicitly production-mode frontend before the integrated run. Only matched production evidence from tickets 13/14 supports performance claims.

## Verification ledger

- 58 API/startup tests, 77 frontend tests and 12 snapshots pass. Types pass; frontend lint retains 14 warnings. Backend lint is rerun after normalizing one mixed CRLF line left by a withdrawn ticket-15 hypothesis.
- Integrated production-browser run, independent reviews, hosted CI and provider revision/HTTP/browser/socket checks are recorded below before closure.
- Ticket 15 hosted CI passed: https://github.com/EPraz/projectManagement/actions/runs/39094528915.
- Current npm audit: both applications have zero production-dependency entries and 20 moderate development-toolchain entries, no high/critical. These remain the existing documented sprintf-js/Istanbul chain; no forced fix or blanket upgrade. Render still installs build dependencies, so classification does not imply physical absence.

## Preserved limits and presentation handoff

Free Vercel/Render/Neon, shared fictional editable demo identity, single DATABASE_URL, manual explicit restoration and preservation across deployment remain in force. No public reset, load test, new visitor quota or keepalive. Ticket ordering and Settings functionality remain unavailable and are described honestly. Provider idle/cold-start timing is not exercised by an active bounded smoke check and is not claimed as tested.

Performance evidence remains [measured code loading](13-loading.md) and [project reads](14-project-reads.md), including cumulative-chunk tradeoffs and local timing limits. The agreed English recruiter README, original authorship, local silent 3:00–3:30 walkthrough, captions/transcript and screenshots remain the separate presentation phase. Owner design feedback and explicit readiness confirmation are mandatory before recording; no walkthrough or trace has been recorded.

## Independent review corrections

Standards review found two P2s: Vite still loaded env files despite explicit fixture URLs, and a nonempty incomplete create response could pass the workspace decoder while missing summary metadata. Both were reproduced before corrections. A harmless temporary `.env` sentinel appeared in an actual fixture build before the new browser-test mode disabled both env loaders; the same public build regression now passes. Creation now validates both workspace and list-summary contracts; an additional real-browser incomplete-response case is retained. Initial full local run: 90 production journeys passed; final rerun includes this additional case and the corrected fixture environment. No owner-private file was accessed by the regression.

Review also caught a clean-job dependency mistake in the added build regression: the backend job does not install frontend Vite. The actual build-sentinel regression now lives in the frontend native Node test command, invoked by the frontend CI job and the isolated runner. Backend startup tests remain independently runnable with backend dependencies only. No check was dropped or skipped.

A later integrated run passed 90/91 journeys but caught a synchronous count in the bulk browser check during board appearance. The failure snapshot contained the expected disabled arrows. The assertion now waits for the first actual visible control before checking disabled controls; zero Playwright retries remain configured and the full suite is rerun.

## Final application verification (b2a6191)

- Final isolated production-browser lifecycle: **91 passed in 2.7 minutes**, no retries/skips. Includes the incomplete-response regression and corrected env mode/control wait. Native frontend environment-isolation check: **1 passed**. Frontend Jest: **77 passed / 12 snapshots**, final types/lint pass (14 existing warnings). API retained behavior + startup tests: **58** after relocating the build assertion to the frontend boundary; the earlier combined run was 59, and all 14 remaining backend startup cases passed again after relocation. Backend types/build/lint pass, zero warnings/errors. Hosted canonical count and result are captured below.
- Standards: all three P2 findings reproduced/corrected/re-reviewed; zero remaining findings. Spec: clean-job dependency P2 corrected/re-reviewed; zero remaining findings. Final test-wait extension reviewed on both axes without weakened assertions.
- Render Free deploy `dep-dba4ai6q1p3s73a95mdg` is live at b2a6191. Vercel production deploy `dpl_Bu6X7Z4aU1SmWBmZj2DUvzciChqU` is READY at the same SHA; production alias inspection resolves to that deployment.
- Bounded public HTTP checks passed: direct/proxied health, API JSON with and without trailing slash, populated default/summary/workspace reads, anonymous rejection, unknown API 404, credential exclusion, deep SPA link and session refresh.
- Public smoke confirms secure host-only refresh cookies, independent visitors, disabled personal endpoints, logout preserving the other session, and two real direct WebSocket clients receiving a confirmed no-op project update. The update resubmitted the existing description/actor: content was preserved; normal modification metadata may advance. No public fixture/reset/load test.
- Real Chrome public journey passed: demo entry, 2 populated projects, 8 visible selected-sprint board tickets, deep reload, hierarchy/team/retrospective navigation and truthful demo Settings at wide/narrow layouts. No browser exceptions. Board and 390px Settings QA images were visually inspected; these are test diagnostics, not final presentation media. Existing compact/horizontally scrollable workspace navigation remains a design-feedback topic rather than a claim of exhaustive accessibility certification.
- Own isolated runner processes exited after the successful run; normal user apps remained untouched. No package/schema/hosting-plan changes in this ticket.
- Final hosted Quality run **SUCCESS**: https://github.com/EPraz/projectManagement/actions/runs/39095797406 on b2a6191. All three jobs passed from locked fresh installs: frontend, backend (58 canonical tests, 2 suites), and isolated production browser (91 journeys plus the real environment-build assertion). No retry/skip or secrets are used. The subsequent closure commit changes tracker/evidence only.

Presentation follow-up is explicitly reconciled in [the handoff](16-presentation-handoff.md). The pre-recording owner checkpoint remains mandatory.
