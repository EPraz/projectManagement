# 15: Make bulk ticket operations and their diagnostics predictable

**What to build:** Existing bulk ticket changes validate the intended records and expose actionable, safe failures without implying a partial failed operation succeeded.

**Blocked by:** 08: Reliable ticket-editing contracts and mutation coordination.

**Status:** ready-for-agent

Type: task

- [ ] Characterize the real bulk operation and its UI consumers, including supported input sizes and ordinary planning usage.
- [ ] Verify invalid identifiers, missing/foreign-parent records, malformed requests and failure behavior at the HTTP/persistence boundary.
- [ ] Keep dependent writes/events coordinated so clients observe the intended confirmed outcome; preserve the existing valid workflow.
- [ ] UI pending/error/recovery behavior and logs distinguish validation, missing data and server/connectivity failures without leaking credentials or raw connection strings.
- [ ] Review expensive/unbounded behavior and record evidence-based safeguard dispositions. A materially new visitor budget or access policy is a separate concrete proposal, not an invented threshold.
- [ ] No load test, cleanup or destructive fixture runs against the public demo.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
