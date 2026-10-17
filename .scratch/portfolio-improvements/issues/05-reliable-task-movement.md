# 05: Make task movement truthful and recoverable

**What to build:** A task movement records the authenticated Usuario demo and the UI shows the persisted result or recovers clearly from failure.

**Blocked by:** 01: Trustworthy checks and isolated startup.

**Status:** resolved

Type: task

- [x] Reproduce the hardcoded-actor behavior and lock down the corrected result at the real task-update boundary.
- [x] Attribute the change through the authenticated demo flow, distinguish actor from assignee and make no claim of individual visitor identity.
- [x] Verify task/status/ticket relationships, accepted/rejected updates and the resulting HTTP/socket state for the affected mutation.
- [x] Invalid drops, unchanged state, failed requests and repeated submissions do not leave a false successful move or lose the recoverable board state.
- [x] Another independent client receives the relevant confirmed update; no credential fields are exposed.
- [x] Refactor only the affected interaction/coordination boundaries, preserving the existing task-drag capabilities and ticket ordering limitations.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after baseline 01 while 04 receives independent review. Regress the actual task-update interaction, then verify HTTP/WebSocket relationships and real board success/failure against isolated PostgreSQL fixtures.

## Answer

Resolved in `c420f07` plus review correction `d3cae3a`: actor comes from the session, invalid relationships are rejected, pending/failure/retry preserve truthful state, assignees remain displayed and late responses preserve newer updates/deletions. [Evidence](../evidence/05-task-movement.md) includes 28 backend tests, 77 frontend tests and real pointer/HTTP/socket races. [Independent review](../evidence/05-review.md) has no unresolved finding; its initial P2 was reproduced, fixed and rechecked. No public/personal database or recording was used.
