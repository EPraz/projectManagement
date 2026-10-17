# 13: Reduce unnecessary initial and editor code loading

**What to build:** Initial entry and navigation avoid loading unnecessary heavy routes/editors up front while preserving a smooth session and usable loading/error feedback.

**Blocked by:** 08: Refactored ticket/task editing. Session/navigation compatibility is already a transitive prerequisite.

**Status:** ready-for-agent

Type: task

- [ ] Capture comparable production-build and browser-network measurements before changing loading boundaries.
- [ ] Introduce only justified route/optional-surface boundaries; the selected slice demonstrates a measured initial-load improvement rather than a new chunk count alone.
- [ ] First navigation and opening the editor remain correct, with useful loading/failure/retry behavior and preserved form/session state.
- [ ] Real-time subscriptions and subsequent data refresh still work across mounting/unmounting and navigation.
- [ ] Record before/after revision, environment and results; no arbitrary size target, missing feature data or unmeasured performance claim.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
