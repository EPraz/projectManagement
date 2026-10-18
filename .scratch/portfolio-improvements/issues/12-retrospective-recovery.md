# 12: Refactor the retrospective with complete recovery behavior

**What to build:** Visitors can use the existing sprint retrospective through cohesive components and state, with truthful feedback for supported card/reaction operations.

**Blocked by:** 07: Coherent project loading and selection.

**Status:** claimed

Type: task

- [ ] Characterize the actual supported retrospective interactions and selected-sprint context before extraction.
- [ ] Separate request/domain/state/presentation responsibilities where useful and migrate affected consumers to the shared boundary.
- [ ] Verify touched card/author/sprint relationships, validation and failure outcomes through the API; preserve credential filtering and confirmed socket updates.
- [ ] Empty and failed collections are distinct; retries and pending interactions do not erase recoverable input or create misleading duplicate success.
- [ ] Switching sprint/project and receiving another session's updates do not leave the wrong retrospective on screen.
- [ ] Verify the workflow with keyboard/focus and representative narrow/wide layouts; preserve the existing visual direction.

## Comments

2026-10-17: Owner approved the 16-ticket breakdown and blocking edges ("acepto"). Published from the approved quality/refactor proposal. Implementation has not started.

2026-10-17: Claimed after ticket 11 passed the 69-journey integrated run and independent review. Characterize the existing card/reaction/privacy-display controls and author/sprint API relationships before choosing bounded corrections; preserve the shared demo identity and stored data.


2026-10-17 characterization: supported operations are create/edit/delete feedback in three fixed categories and toggle the shared demo's reaction in the selected sprint. The former Anonymous Feedback tab only blurred text and author display; it now honestly says Blurred feedback. Hide Names remains display-only and also suppresses reaction-name tooltips and deletion attribution. No anonymous storage, identity switching or private-feedback policy is introduced. Cards retain their original author and sprint when edited; create attribution is authenticated. Existing deployed payloads remain accepted where safe, with legacy reaction arrays reduced to the session user's desired reaction rather than replacing other reactions.
