# 14: Reduce unnecessary project read payloads and query work

**What to build:** The project list/detail path loads the data its actual consumers need with less unnecessary transfer/query work and unchanged visible behavior.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** ready-for-agent

Type: task

- [ ] Measure representative list/detail payloads, requests and query work before optimizing; distinguish provider wake-up from application cost.
- [ ] Map consumers before changing a projection/response, and migrate real callers/tests in the same compatible slice.
- [ ] Preserve project summaries, hierarchy/sprint requirements, credential exclusion and HTTP/socket contracts used by the affected views.
- [ ] Verify populated, empty and failed/read-retry paths and correct data after relevant mutations.
- [ ] Demonstrate a comparable measured improvement and record the trade-off; do not introduce a general API redesign or silently remove fields a current consumer uses.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
