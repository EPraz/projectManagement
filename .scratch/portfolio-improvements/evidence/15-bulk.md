# Ticket 15: bulk commands and safe persistence failures

Baseline: fab824c. All fixtures use guarded loopback PostgreSQL, never Neon.

## Observed boundary and corrections

The retained PATCH array endpoint bypassed element DTO validation, trusted a caller-provided actor, accepted foreign-project associations and emitted no confirmed updates. Four HTTP/PostgreSQL/WebSocket regressions initially failed (45 existing tests passed). These now pass with explicit per-element validation, authenticated attribution, association checks, ordered target locks and an atomic transaction. Final snapshots are captured after all writes; events follow commit. Response order follows command order. Mixed-project commands remain supported when each association belongs to its target's project.

Real SQL failure injection reproduces rollback and verifies no partial events, a useful operation label and no raw query/DSN secret in either HTTP or captured server logs. The logger sink is an actual Nest logging adapter, not a mocked persistence service. Shared Prisma failure mapping preserves validation/not-found/conflict/unavailable distinctions without logging raw exceptions.

The only UI bulk callback was unreachable behind deliberately disabled board ordering arrows. Its hook/helper/context plumbing is removed; named disabled controls remain. No active bulk submission form exists, so no new reorder or pending UI is invented. A browser journey observes a confirmed external batch, excludes the other project's changes, and reloads after rejection to verify unchanged persisted state.

## Safeguards and compatibility

- No new visitor quota, same-project batch restriction, role or tenant policy.
- The existing Express JSON request-byte boundary rejects a 120,000-character request with 413. Ordinary multi-record planning, nullable estimates, additive tags and legacy order updates remain supported.
- Remove the unused global all-ticket cleanup scaffold, as proposed in the issue before implementation. Invalid numeric routes and `/tickets/all` reject with 400; individual/project deletion and explicit private seed restoration remain available.
- Two reversed overlapping batches with scoped SQL delays complete without deadlock and return internally complete results. Validation/missing-record failures leave earlier records unchanged.
- No schema, dependency, seed or hosting change. No load or destructive test against shared data.

## Verification

51 API/startup tests pass (two suites); backend types, lint and build pass. The focused real Chrome production-browser journey passes. Full integrated browser/frontend results and independent review are recorded before closure.

Ticket 14 hosted CI also passed: https://github.com/EPraz/projectManagement/actions/runs/39093187665.
