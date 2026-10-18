# 15: Make bulk ticket operations and their diagnostics predictable

**What to build:** Existing bulk ticket changes validate the intended records and expose actionable, safe failures without implying a partial failed operation succeeded.

**Blocked by:** 08: Reliable ticket-editing contracts and mutation coordination.

**Status:** resolved

Type: task

- [x] Characterize the real bulk operation and its UI consumers, including supported input sizes and ordinary planning usage.
- [x] Verify invalid identifiers, missing/foreign-parent records, malformed requests and failure behavior at the HTTP/persistence boundary.
- [x] Keep dependent writes/events coordinated so clients observe the intended confirmed outcome; preserve the existing valid workflow.
- [x] UI pending/error/recovery behavior and logs distinguish validation, missing data and server/connectivity failures without leaking credentials or raw connection strings.
- [x] Review expensive/unbounded behavior and record evidence-based safeguard dispositions. A materially new visitor budget or access policy is a separate concrete proposal, not an invented threshold.
- [x] No load test, cleanup or destructive fixture runs against the public demo.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after14resolved atfab824c. Existing bulk PATCH accepts an array of ticket updates; its sole wired UI callback is the known-broken reorder helper behind deliberately disabled board arrows. Preserve the spec's ticket-ordering limitations; do not enable a new reorder feature. Characterize and harden the retained API with real HTTP/PostgreSQL/socket tests, remove unreachable request/context/helper wiring after confirming consumers, and keep disabled controls honest. Review existing body-size and global cleanup behavior with explicit dispositions, without inventing per-visitor budgets or access policy.

2026-10-17 bounded safeguard proposal: remove the unused global all-ticket cleanup route/service (no UI or documented consumer) and validate numeric ticket route IDs. Existing per-ticket/project deletion and explicit private seed restoration remain supported. This removes obsolete global cleanup rather than adding a visitor quota, role or tenancy policy. Keep the bulk-update array contract, legacy order field and default request-byte protection; validate each target's relationships without inventing a same-project batch restriction.

## Answer

Resolved with cebb8d3: validated atomic bulk commands, authenticated attribution, confirmed events and safe diagnostics; unreachable ordering plumbing removed with disabled controls preserved. 51 API/startup, 85 production-browser and 77 frontend tests (12 snapshots) pass; both type/build/lint gates pass, with 14 existing frontend warnings and zero backend warnings. Independent Standards and Spec reviews have zero actionable findings. See [evidence](../evidence/15-bulk.md) and [review](../evidence/15-review.md). No public destructive fixtures or new quota policy.
