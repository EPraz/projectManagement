# 14: Reduce unnecessary project read payloads and query work

**What to build:** The project list/detail path loads the data its actual consumers need with less unnecessary transfer/query work and unchanged visible behavior.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** claimed

Type: task

- [ ] Measure representative list/detail payloads, requests and query work before optimizing; distinguish provider wake-up from application cost.
- [ ] Map consumers before changing a projection/response, and migrate real callers/tests in the same compatible slice.
- [ ] Preserve project summaries, hierarchy/sprint requirements, credential exclusion and HTTP/socket contracts used by the affected views.
- [ ] Verify populated, empty and failed/read-retry paths and correct data after relevant mutations.
- [ ] Demonstrate a comparable measured improvement and record the trade-off; do not introduce a general API redesign or silently remove fields a current consumer uses.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after13resolved atc21f8cf. Measure populated list/detail payload and Prisma query work against the isolated local PostgreSQL/application before selecting projections. Map project list/progress/avatar/team and canonical workspace/socket consumers; retain compatibility for default full reads and current stored data.

2026-10-17 review correction: both axes found the summary guard rejected valid nullable Ticket.statusId. A real-browser mixed completed/null payload regression reproduced the list load error (missing50%progress). The summary type/guard and progress helper now preserve nullable/missing-status semantics and retain those tickets in the denominator. A local PostgreSQL HTTP fixture also verifies a stored null-status ticket survives summary/workspace reads. No stored status is renamed or invented. Final84-browser/45API checks required before closure.
