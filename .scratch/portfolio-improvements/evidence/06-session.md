# Ticket 06 — demo session and navigation boundaries

Date: 2026-10-17. Owner-approved primary seam: real browser entry, refresh, reload, independent sessions, logout and unavailable/expired feedback. No personal-account feature or public database mutation was introduced.

## Characterization and correction

The original browser journey recorded instant-login, checkAuth, refresh and another checkAuth during a single entry. It also reproduced a 503 restoration failure that silently redirected to entry with only the shared-demo information notice. Both desired-behavior browser regressions failed before correction and now pass.

The existing AuthProvider now owns route decisions; cohesive session state, operations and cancellation live in useDemoSession, and the session HTTP contract lives in sessionApi. ApiContext keeps apiUrl for every unmigrated hook and adds a stable typed request function used by real session consumers. It preserves same-origin included cookies, explicit bearer tokens and AbortSignal propagation. The authenticated request interface is available for the next workflow migrations; no codebase-wide hook replacement occurred. The direct socket URL/configuration is unchanged.

Session identity/token remain in memory. A confirmed identity suppresses redundant restoration on navigation. Generation checks and abort controllers prevent obsolete operations from committing; one interval renews the active session. Restoration failures retain the route and offer retry; background outages retain visible authenticated content, while actual 401 responses explain expiry and return to entry. Logout has a pending state, preserves the active session on failure, and delegates navigation once through the provider.

Consumer inspection found only the unused personal screens calling login/register. Those screens, helpers, context methods and exports were removed together. The stale email-based instant-login helper was also unused and removed. Shared visual styles moved to the shipped demo entry with unchanged used declarations; three unused personal-only styled exports were removed. Both legacy auth routes still redirect to Explore demo. Needed token/cookie libraries and the demo-only backend remain intact.

## Retained browser journeys

Playwright 1.64.1 is a development dependency (registry metadata confirms Node >=20 support). This saves the already approved browser seam in the repo for later sessions rather than depending on ignored ad hoc scripts. The local-only configuration uses one worker, bounded execution, no retries that hide failures, no focused-test allowance, and explicitly disables video/trace recording. Browser test types join the existing type gate. [Local reproduction](../../../docs/development.md) documents the pre-populated isolated application, Chrome/Chromium choice and current CI boundary; configuration follows [Playwright's documented runner options](https://playwright.dev/docs/test-configuration).

All seven real Chrome journeys pass against the isolated local application:

1. Legacy registration redirect, one entry/identity request pair, and deep-link reload with one refresh/identity pair.
2. Controlled restoration outage retains the requested project URL, explains the error and recovers with Retry session.
3. Failed logout retains the session; pending logout disables repeat submission; success clears only that browser's cookie while another independent context remains authenticated.
4. One scheduled refresh at twelve simulated browser minutes handles a controlled 401, explains expiry and permits demo re-entry.
5. Legacy login redirect, unavailable and malformed response feedback, then successful retry from a 390px mobile viewport.
6. A failed background refresh preserves the populated project screen, then clears the error after successful retry.
7. Back navigation to entry cancels a delayed deep-link restoration and prevents its late result from navigating or committing identity.

The protocol/API is real except explicitly intercepted failure/race responses. Browser time simulation exercises the refresh interval; it does not claim an actual idle Render cold start or elapsed JWT lifetime. No walkthrough was recorded.

## Other verification

Clean Node 22 checkout: all **77 Jest tests, 15 suites and 12 retained snapshots** pass. Relevant UserMenu/PrivateRoute tests retain their actions and route rendering; the menu test now checks its own logout action and closure, while actual provider navigation is covered in browser. Type checking includes the browser sources and passes; production build passes. Non-mutating lint has zero errors and the unchanged 40 visible warnings owned by later tickets. The full dependency audit remains 20 moderate tooling entries, zero high/critical; dispositions from ticket 02 remain applicable.

Initial bundle is 1,618.07 kB raw / 478.65 kB gzip. This ticket makes no loading-performance improvement claim; ticket 13 owns measured splitting. The session lifecycle module remains cohesive despite its length: the API parser and navigation responsibilities are already separate, and extracting controller/epoch internals would expose state coordination without a separate consumer.
