# 09: Refactor hierarchy and backlog without breaking linked work

**What to build:** Epics, features and their linked backlog remain understandable and editable through cohesive UI/data boundaries with reliable association and error behavior.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** resolved

Type: task

- [x] Characterize the supported hierarchy/backlog interactions and selected-project behavior using populated Datos demo.
- [x] Separate responsibilities and migrate the affected requests using the compatible shared boundary, preserving real callers and existing feature scope.
- [x] Verify touched parent-child validation, missing/invalid identifiers and failed mutations at the API boundary rather than only testing component internals.
- [x] Relevant success, empty, loading and failed/retry states are visible; preserve unsaved values and avoid duplicate mutations.
- [x] Linked tickets still open in the existing editor contract; required hierarchy data and relevant confirmed updates remain available.
- [x] Verify the affected route with keyboard and representative narrow/wide layouts, without a redesign.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after 08 resolved. Characterize the actual backlog and hierarchy route. Initial inspection finds a disabled mock-data hierarchy screen alongside existing real Epic/Feature CRUD APIs; distinguish unsupported mock fields from the existing domain contracts before choosing a bounded correction.

Scope reconciliation: the approved hierarchy slice connects the existing `/epics` route and Epic/Feature CRUD to selected-project data and enables its existing navigation entry. Retain the card layout and real title/description/criteria/status/parent contracts. Remove simulated dates, assignees, priorities, drag handles and inert menu/filter actions that have no corresponding hierarchy capability. This is completion of the approved hierarchy workflow, with no new domain feature, schema or access policy. Linked tickets continue through the existing backlog editor.


## Answer

Resolved in dd61814. The existing hierarchy now reads and edits selected-project data, keeps linked tickets in the existing editor, validates parents/statuses and publishes confirmed scoped events. Backlog filters, tag rendering, keyboard actions and failed deletion recovery have real regressions. [Evidence](../evidence/09-hierarchy.md), [independent review](../evidence/09-review.md). Both review axes have zero actionable findings; all final checks passed.

