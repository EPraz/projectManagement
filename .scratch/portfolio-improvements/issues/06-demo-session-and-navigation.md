# 06: Simplify demo sessions and navigation with a compatible request boundary

**What to build:** Entry, refresh, reload, legacy redirects and logout remain reliable while the code reflects the shipped demo instead of unused personal-account flows.

**Blocked by:** 01: Trustworthy checks and isolated startup.

**Status:** ready-for-agent

Type: task

- [ ] Characterize browser entry, deep links, refresh, independent sessions, logout and unavailable/expired-session feedback.
- [ ] Remove unused personal-login/registration screens, context methods and exports together after checking consumers; preserve their redirects to Acceso demo.
- [ ] Separate cohesive session/navigation/layout responsibilities where inspection identifies a useful boundary; retain the visual behavior and needed JWT/cookie dependencies.
- [ ] Introduce or clarify the minimum shared request/session/error interface with real session consumers, preserving compatibility for hooks not migrated yet.
- [ ] Preserve same-origin API/cookie behavior, direct socket configuration, cancellation and useful pending/error states; no duplicate listener/fetch lifecycle or new personal-account feature.
- [ ] Keep the compatible boundary available for later workflow migrations; do not perform a codebase-wide hook rewrite in this ticket.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
