# 13: Reduce unnecessary initial and editor code loading

**What to build:** Initial entry and navigation avoid loading unnecessary heavy routes/editors up front while preserving a smooth session and usable loading/error feedback.

**Blocked by:** 08: Refactored ticket/task editing. Session/navigation compatibility is already a transitive prerequisite.

**Status:** resolved

Type: task

- [x] Capture comparable production-build and browser-network measurements before changing loading boundaries.
- [x] Introduce only justified route/optional-surface boundaries; the selected slice demonstrates a measured initial-load improvement rather than a new chunk count alone.
- [x] First navigation and opening the editor remain correct, with useful loading/failure/retry behavior and preserved form/session state.
- [x] Real-time subscriptions and subsequent data refresh still work across mounting/unmounting and navigation.
- [x] Record before/after revision, environment and results; no arbitrary size target, missing feature data or unmeasured performance claim.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after12resolved at993bf02. Baseline production build UI0a9705d (backend validation compatibility commits do not change frontend):1,627.35kBraw/483.49kBgzip. Fresh Chrome production-preview measurements at entry/projects/workspace/board each download one script483,486encodedbodybytes (483,786transferbytes), without page errors. Inspect actual import boundaries before splitting; preserve providers and session state.

## Answer

Resolved with justified route/panel boundaries and removed eager import bridges. Matched production measurements show73.7%less initial JS body and33.9%less cumulative body at project list, with the full-journey request/byte tradeoff explicit. Entry/session/providers/editors and real-time updates are preserved; failed/pending modules have verified recovery. [Evidence](../evidence/13-loading.md), [measurements](../evidence/13-loading-measurements.json), [review](../evidence/13-review.md).1773bbb/31fd5c6;81production-browser and77Jest checks plus types/build/lint pass, both axes0remaining.
