# 11: Make team and capacity planning reliable

**What to build:** Existing team membership and per-sprint capacity can be inspected and changed with consistent validation, feedback and current selected-sprint data.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** resolved

Type: task

- [x] Characterize the supported team/capacity operations and preserve restrictions on fictitious demo identities.
- [x] Verify the touched membership/user/sprint associations, invalid requests and real persisted outcomes through the API boundary.
- [x] Clarify UI/form/request responsibilities and reuse the established client behavior instead of duplicating error/pending logic.
- [x] Sprint/project changes do not display or overwrite stale capacity; relevant confirmed changes reach current views/clients.
- [x] Cover loading/empty/error/retry, keyboard labels/focus and representative responsive layouts for the affected controls.
- [x] No personal-account creation, role switching, tenant isolation or new RBAC claim is introduced.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after ticket10 passed all60 retained browser journeys and independent re-review. Characterize existing membership and capacity controls, shared-state consumers and API associations. Preserve demo identity restrictions and existing hosted data.


Bounded correction: capacity progress now reflects completed work; the existing table's invalid Per Day division by days off is replaced with Completed work from stored hours, retaining all writable capacity fields and adding no calendar/domain feature. Evidence includes a red25% versus expected75% browser regression.

## Answer

Resolved in 84ef59c. Membership and capacity now use canonical scoped data and the shared request boundary, preserve failed input, guard pending writes and synchronize confirmed changes. API validation covers relationships, numeric bounds, duplicates and missing scope; progress and completed-hour reporting are truthful. All 69 retained browser journeys, 39 API/startup tests, 77 frontend tests, types, lint and builds pass. Both review axes have zero actionable findings. [Evidence](../evidence/11-team-capacity.md), [review](../evidence/11-review.md).

