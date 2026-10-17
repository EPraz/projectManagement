# 06: Simplify demo sessions and navigation with a compatible request boundary

**What to build:** Entry, refresh, reload, legacy redirects and logout remain reliable while the code reflects the shipped demo instead of unused personal-account flows.

**Blocked by:** 01: Trustworthy checks and isolated startup.

**Status:** resolved

Type: task

- [x] Characterize browser entry, deep links, refresh, independent sessions, logout and unavailable/expired-session feedback.
- [x] Remove unused personal-login/registration screens, context methods and exports together after checking consumers; preserve their redirects to Acceso demo.
- [x] Separate cohesive session/navigation/layout responsibilities where inspection identifies a useful boundary; retain the visual behavior and needed JWT/cookie dependencies.
- [x] Introduce or clarify the minimum shared request/session/error interface with real session consumers, preserving compatibility for hooks not migrated yet.
- [x] Preserve same-origin API/cookie behavior, direct socket configuration, cancellation and useful pending/error states; no duplicate listener/fetch lifecycle or new personal-account feature.
- [x] Keep the compatible boundary available for later workflow migrations; do not perform a codebase-wide hook rewrite in this ticket.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after baseline 01 while the completed 05 correction receives final independent review. Characterize real browser session/navigation transitions before replacing the session boundary. Keep apiUrl compatibility for unmigrated hooks and the existing same-origin cookie/direct socket deployment.

## Answer

Resolved through `aa978cf`, `e64b9bd` and `9c07b72`. Session HTTP/state/navigation now have cohesive owners, real consumers use the compatible request boundary and unused personal screens/methods are removed with redirects preserved. Ten retained browser journeys verify entry, renewal, independent sessions, failure/retry, navigation cancellation and authenticated-request expiry. [Evidence](../evidence/06-session.md) and [review](../evidence/06-review.md) record passing checks and both corrected P2 findings, with no unresolved review finding. No public data restoration, cloud configuration change or recording occurred.
