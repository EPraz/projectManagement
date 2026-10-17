# 12: Refactor the retrospective with complete recovery behavior

**What to build:** Visitors can use the existing sprint retrospective through cohesive components and state, with truthful feedback for supported card/reaction operations.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** ready-for-agent

Type: task

- [ ] Characterize the actual supported retrospective interactions and selected-sprint context before extraction.
- [ ] Separate request/domain/state/presentation responsibilities where useful and migrate affected consumers to the shared boundary.
- [ ] Verify touched card/author/sprint relationships, validation and failure outcomes through the API; preserve credential filtering and confirmed socket updates.
- [ ] Empty and failed collections are distinct; retries and pending interactions do not erase recoverable input or create misleading duplicate success.
- [ ] Switching sprint/project and receiving another session's updates do not leave the wrong retrospective on screen.
- [ ] Verify the workflow with keyboard/focus and representative narrow/wide layouts; preserve the existing visual direction.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.
