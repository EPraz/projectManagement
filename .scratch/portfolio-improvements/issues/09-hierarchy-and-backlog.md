# 09: Refactor hierarchy and backlog without breaking linked work

**What to build:** Epics, features and their linked backlog remain understandable and editable through cohesive UI/data boundaries with reliable association and error behavior.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** claimed

Type: task

- [ ] Characterize the supported hierarchy/backlog interactions and selected-project behavior using populated Datos demo.
- [ ] Separate responsibilities and migrate the affected requests using the compatible shared boundary, preserving real callers and existing feature scope.
- [ ] Verify touched parent-child validation, missing/invalid identifiers and failed mutations at the API boundary rather than only testing component internals.
- [ ] Relevant success, empty, loading and failed/retry states are visible; preserve unsaved values and avoid duplicate mutations.
- [ ] Linked tickets still open in the existing editor contract; required hierarchy data and relevant confirmed updates remain available.
- [ ] Verify the affected route with keyboard and representative narrow/wide layouts, without a redesign.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after 08 resolved. Characterize the actual backlog and hierarchy route. Initial inspection finds a disabled mock-data hierarchy screen alongside existing real Epic/Feature CRUD APIs; distinguish unsupported mock fields from the existing domain contracts before choosing a bounded correction.

Scope reconciliation: the approved hierarchy slice connects the existing `/epics` route and Epic/Feature CRUD to selected-project data and enables its existing navigation entry. Retain the card layout and real title/description/criteria/status/parent contracts. Remove simulated dates, assignees, priorities, drag handles and inert menu/filter actions that have no corresponding hierarchy capability. This is completion of the approved hierarchy workflow, with no new domain feature, schema or access policy. Linked tickets continue through the existing backlog editor.

