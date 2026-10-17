# 09: Refactor hierarchy and backlog without breaking linked work

**What to build:** Epics, features and their linked backlog remain understandable and editable through cohesive UI/data boundaries with reliable association and error behavior.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** ready-for-agent

Type: task

- [ ] Characterize the supported hierarchy/backlog interactions and selected-project behavior using populated Datos demo.
- [ ] Separate responsibilities and migrate the affected requests using the compatible shared boundary, preserving real callers and existing feature scope.
- [ ] Verify touched parent-child validation, missing/invalid identifiers and failed mutations at the API boundary rather than only testing component internals.
- [ ] Relevant success, empty, loading and failed/retry states are visible; preserve unsaved values and avoid duplicate mutations.
- [ ] Linked tickets still open in the existing editor contract; required hierarchy data and relevant confirmed updates remain available.
- [ ] Verify the affected route with keyboard and representative narrow/wide layouts, without a redesign.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
