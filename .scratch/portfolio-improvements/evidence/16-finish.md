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
