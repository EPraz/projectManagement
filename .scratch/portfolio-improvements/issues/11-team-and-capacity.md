# 11: Make team and capacity planning reliable

**What to build:** Existing team membership and per-sprint capacity can be inspected and changed with consistent validation, feedback and current selected-sprint data.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** ready-for-agent

Type: task

- [ ] Characterize the supported team/capacity operations and preserve restrictions on fictitious demo identities.
- [ ] Verify the touched membership/user/sprint associations, invalid requests and real persisted outcomes through the API boundary.
- [ ] Clarify UI/form/request responsibilities and reuse the established client behavior instead of duplicating error/pending logic.
- [ ] Sprint/project changes do not display or overwrite stale capacity; relevant confirmed changes reach current views/clients.
- [ ] Cover loading/empty/error/retry, keyboard labels/focus and representative responsive layouts for the affected controls.
- [ ] No personal-account creation, role switching, tenant isolation or new RBAC claim is introduced.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
