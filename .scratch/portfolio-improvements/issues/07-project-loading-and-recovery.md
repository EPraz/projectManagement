# 07: Make project loading, selection and recovery coherent

**What to build:** Visitors can load, navigate and recover project views without mistaking an API failure for an empty workspace or receiving another project's state.

**Blocked by:** 06: Demo sessions and compatible request boundary.

**Status:** resolved

Type: task

- [x] Use the established request boundary for the project list/detail path and distinguish loading, empty, failed and background-refresh states.
- [x] A failed or non-JSON API response remains a visible recoverable error rather than a successful empty list; retry works and retained content is not unnecessarily blanked.
- [x] Keep route/project/sprint selection and fetched state aligned; cancel or ignore stale work after switching projects or navigating away.
- [x] Socket updates affect the relevant selected project and listeners clean up correctly; verify independent sessions and unrelated-project events.
- [x] Simplify project state ownership and data/navigation responsibilities without parallel sources of truth or changed public capabilities.
- [x] Preserve populated views, progress contracts, same-origin routes with/without trailing slash and deep-link reload behavior.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after 06 resolved. Reuse its retained browser runner and authenticated request boundary. Regress false-empty failures and unrelated-project socket state, then align project/sprint ownership with compatible setters for existing workflows.

## Answer

Resolved with one canonical project owner, compatible sprint/ticket views, scoped/cancelled reads and events, explicit retry/refresh, and per-project selection. See [verification](../evidence/07-project-state.md) and [independent review](../evidence/07-review.md). Implementation ff4ecab, correction d3b2f27. All 24 retained browser journeys have passed (23 together plus the new deletion regression), 77 frontend tests/12 snapshots, 29 backend tests, types, lint and builds. No schema migration or production fixture changes.

