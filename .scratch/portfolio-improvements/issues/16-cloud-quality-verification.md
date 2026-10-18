# 16: Verify product finish in CI and the cloud, then hand off presentation

**What to build:** The refactored product is demonstrably ready for the saved recruiter-presentation phase, with a bounded quality report and a working public demo.

**Blocked by:** 02: Address applicable dependency findings without uncontrolled upgrades; 03: Enforce the reliable baseline in CI; 04: Make project progress correct in both project views; 05: Make task movement truthful and recoverable; 09: Refactor hierarchy and backlog without breaking linked work; 10: Make sprint planning and goals consistent across views; 11: Make team and capacity planning reliable; 12: Refactor the retrospective with complete recovery behavior; 13: Reduce unnecessary initial and editor code loading; 14: Reduce unnecessary project read payloads and query work; 15: Make bulk ticket operations and their diagnostics predictable. Tickets 01, 06, 07 and 08 are transitively covered.

**Status:** resolved

Type: task

- [x] Run the retained meaningful test baseline and CI gates on the integrated revision, without hidden skips or scaffold-only assurances.
- [x] Recheck a clean contributor start and the selected complete browser journey across entry, project views, hierarchy/backlog, ticket/task edits, sprint/goals, team/capacity, retrospective and existing relevant settings.
- [x] Verify key keyboard/focus, narrow/wide layouts, empty/error/retry, pending and session/reload paths; make bounded acceptance fixes and record broader new scope separately.
- [x] Remove compatibility helpers/exports only when all real consumers have migrated; no unused abstraction or obsolete account path is left solely by the transition.
- [x] Publish through the existing providers and run bounded cloud HTTP/browser/WebSocket checks, including the trailing-slash proxy regression; preserve public/old data and free-hosting boundaries.
- [x] Record performance evidence, advisory dispositions, any unexercised inactivity scenario and unresolved limitations honestly.
- [x] Reconcile the saved README/video plan with the verified application revision. No final presentation media are produced in this ticket.

## Comments

2026-10-17: Additional owner instruction: notify the owner and wait for their design feedback and explicit readiness confirmation before walkthrough recording. Handoff to presentation must preserve this checkpoint; the current authorization to implement quality tickets does not authorize recording past it.

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17 candidate from14consumer mapping: the project-create form still uses a legacy void callback and null-returning create hook. During final complete workflow QA, reproduce whether a failed create incorrectly closes its draft; if confirmed, apply a bounded acceptance correction under the existing truthful error/pending requirement. Not yet reproduced or claimed fixed.

2026-10-17: Claimed after 15 resolved at f82e43c. Add a controlled production-browser runner with explicit NODE_ENV=test and isolated loopback *_browser_test database, owning its child applications and fixture lifecycle. Reproduce the recorded project-create failure before a bounded fix; verify remaining active project/settings actions, clean setup, checks and existing provider deployment. Preserve owner design/readiness checkpoint before all walkthrough recording.

## Answer

Resolved through b2a6191 after all three hosted Quality jobs passed on that revision, both providers served it, and bounded public HTTP/browser/two-client WebSocket checks passed. The complete clean local production lifecycle passes 91 browser journeys; canonical backend 58 tests, frontend 77 tests/12 snapshots and the separate actual env-build regression pass. Both applications pass type/build/lint gates (14 existing frontend warnings, zero backend warnings). All review findings are corrected and independently rechecked; no remaining actionable findings.

Confirmed finish fixes retain failed project-create drafts, reject incomplete create responses, display actual shared demo settings honestly and support keyboard project entry. The fixture runner owns isolated PostgreSQL/apps and CI exercises the same production boundary without loading private env files. Public content is preserved; no seed/reset/load test, paid resource, keepalive, visitor quota or final media was introduced.

See [verification](../evidence/16-finish.md), [independent review](../evidence/16-review.md), and [presentation handoff](../evidence/16-presentation-handoff.md). The owner design-feedback/explicit-readiness checkpoint remains required before recording. Final README and video stay in the separately approved presentation phase.
