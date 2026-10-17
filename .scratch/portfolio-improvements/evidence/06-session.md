# Ticket 06 — demo session and navigation boundaries

Date: 2026-10-17. Owner-approved primary seam: real browser entry, refresh, reload, independent sessions, logout and unavailable/expired feedback. No personal-account feature or public database mutation was introduced.

## Characterization and correction

The original browser journey recorded instant-login, checkAuth, refresh and another checkAuth during a single entry. It also reproduced a 503 restoration failure that silently redirected to entry with only the shared-demo information notice. Both desired-behavior browser regressions failed before correction and now pass.

The existing AuthProvider now owns route decisions; cohesive session state, operations and cancellation live in useDemoSession, and the session HTTP contract lives in sessionApi. ApiContext keeps apiUrl for every unmigrated hook and adds a stable typed request function used by real session consumers. It preserves same-origin included cookies, explicit bearer tokens and AbortSignal propagation. The authenticated request interface is available for the next workflow migrations; no codebase-wide hook replacement occurred. The direct socket URL/configuration is unchanged.

Session identity/token remain in memory. A confirmed identity suppresses redundant restoration on navigation. Generation checks and abort controllers prevent obsolete operations from committing; one interval renews the active session. Restoration failures retain the route and offer retry; background outages retain visible authenticated content, while actual 401 responses explain expiry and return to entry. Logout has a pending state, preserves the active session on failure, and delegates navigation once through the provider.

Consumer inspection found only the unused personal screens calling login/register. Those screens, helpers, context methods and exports were removed together. The stale email-based instant-login helper was also unused and removed. Shared visual styles moved to the shipped demo entry with unchanged used declarations; three unused personal-only styled exports were removed. Both legacy auth routes still redirect to Explore demo. Needed token/cookie libraries and the demo-only backend remain intact.

## Retained browser journeys

Playwright 1.64.1 is a development dependency (registry metadata confirms Node >=20 support). This saves the already approved browser seam in the repo for later sessions rather than depending on ignored ad hoc scripts. The local-only configuration uses one worker, bounded execution, no retries that hide failures, no focused-test allowance, and explicitly disables video/trace recording. Browser test types join the existing type gate. [Local reproduction](../../../docs/development.md) documents the pre-populated isolated application, Chrome/Chromium choice and current CI boundary; configuration follows [Playwright's documented runner options](https://playwright.dev/docs/test-configuration).

All ten real Chrome journeys pass against the isolated local application:

1. Legacy registration redirect, one entry/identity request pair, and deep-link reload with one refresh/identity pair.
2. Controlled restoration outage retains the requested project URL, explains the error and recovers with Retry session.
3. Failed logout retains the session; pending logout disables repeat submission; success clears only that browser's cookie while another independent context remains authenticated.
4. One scheduled refresh at twelve simulated browser minutes handles a controlled 401, explains expiry and permits demo re-entry.
5. Legacy login redirect, unavailable and malformed response feedback, then successful retry from a 390px mobile viewport.
6. A failed background refresh preserves the populated project screen, then clears the error after successful retry.
7. Back navigation to entry cancels a delayed deep-link restoration; Forward then restores the protected project without an erroneous entry redirect.
8. After an initial failure, a delayed manual restoration retry is also cancelled when navigating Back to entry. Releasing its response makes no late identity request.
9. While logout is pending, session retry is disabled and another simulated renewal interval issues no refresh request. Confirmed logout still returns to entry.
10. A real authenticated project-list request receiving 401 immediately after fresh entry returns to entry with the expiry notice; retry succeeds when the controlled failure is removed.

The protocol/API is real except explicitly intercepted failure/race responses. Browser time simulation exercises the refresh interval; it does not claim an actual idle Render cold start or elapsed JWT lifetime. No walkthrough was recorded.

## Other verification

Clean Node 22 checkout: all **77 Jest tests, 15 suites and 12 retained snapshots** pass. Relevant UserMenu/PrivateRoute tests retain their actions and route rendering; the menu test now checks its own logout action and closure, while actual provider navigation is covered in browser. Type checking includes the browser sources and passes; production build passes. Non-mutating lint has zero errors and the unchanged 40 visible warnings owned by later tickets. The full dependency audit remains 20 moderate tooling entries, zero high/critical; dispositions from ticket 02 remain applicable.

Final initial bundle is 1,618.17 kB raw / 478.77 kB gzip. This ticket makes no loading-performance improvement claim; ticket 13 owns measured splitting. The session lifecycle module remains cohesive despite its length: the API parser and navigation responsibilities are already separate, and extracting controller/epoch internals would expose state coordination without a separate consumer.

## Review correction

The initial Spec review found one P2: a manual retry's controller was not owned by the original route effect, so it could load identity after the visitor returned to entry. It also identified renewal during pending logout as a related coordination risk. The Standards review noted a pre-existing Forward-after-cancellation ordering problem within the same navigation journey. Three browser regressions reproduced these variants before correction: Forward lost the protected route, the cancelled retry issued one late identity request, and retry remained enabled during logout.

Leaving protected routes now invalidates and aborts the current restoration regardless of how it started. Restoration is guarded while closing, interval renewal pauses during logout/entry, and confirmed logout invalidates any obsolete result again. A derived initial-restoration gate prevents PrivateRoute from redirecting before the restoration effect starts after Forward navigation. All nine retained browser journeys now pass; types and non-mutating lint pass without additional warnings. The full component suite and build are rerun after this correction before ticket closure.

A subsequent Standards review identified a P2 interaction with that new loading gate: an authenticated request could expire a fresh session before any restoration had been attempted, leaving the gate pending. The project-list read is now the minimum real authenticated request consumer for this interface, while its existing error/empty ownership remains for ticket 07. The actual browser regression failed before correction. Expiry now explicitly settles restoration before clearing identity; the ten-journey run passes, including immediate authenticated-request expiry and re-entry. This replaces one request call site, not a broad hook migration.

The full 77-test component/domain suite and 12 snapshots passed after the lifecycle correction. Final request-binding changes also pass all ten browser journeys, types (including browser sources), lint and production build. Both review axes confirmed their findings resolved; [review history](06-review.md) retains the initial findings instead of hiding them.
