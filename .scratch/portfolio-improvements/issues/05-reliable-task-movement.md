# 05: Make task movement truthful and recoverable

**What to build:** A task movement records the authenticated Usuario demo and the UI shows the persisted result or recovers clearly from failure.

**Blocked by:** 01: Trustworthy checks and isolated startup.

**Status:** claimed

Type: task

- [ ] Reproduce the hardcoded-actor behavior and lock down the corrected result at the real task-update boundary.
- [ ] Attribute the change through the authenticated demo flow, distinguish actor from assignee and make no claim of individual visitor identity.
- [ ] Verify task/status/ticket relationships, accepted/rejected updates and the resulting HTTP/socket state for the affected mutation.
- [ ] Invalid drops, unchanged state, failed requests and repeated submissions do not leave a false successful move or lose the recoverable board state.
- [ ] Another independent client receives the relevant confirmed update; no credential fields are exposed.
- [ ] Refactor only the affected interaction/coordination boundaries, preserving the existing task-drag capabilities and ticket ordering limitations.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after baseline 01 while 04 receives independent review. Regress the actual task-update interaction, then verify HTTP/WebSocket relationships and real board success/failure against isolated PostgreSQL fixtures.
