# 04: Create and edit tickets without losing context

**What to build:** A visitor opens or creates a ticket from existing work views or a deep link, edits it in the C panel/full-screen surface and returns with confirmed changes or a recoverable draft.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** ready-for-agent

Type: task

- [ ] Use one editor surface at a time: wide contextual panel / full screen on mobile, with Details, Planning, Tasks and Additional info. Preserve every existing field, validation and domain restriction.
- [ ] Keep ticket state, type, responsible member, priority, sprint/feature relations, blocking fields/relations, estimates/story points/time, deadlines, acceptance/design/additional content, notes/discussion and existing metadata accessible.
- [ ] Explicit Save/Cancel and secondary confirmed deletion remain reachable. Pending/duplicate submissions, failed responses, retry and unsaved-change keep/discard/save preserve input and focus. No autosave is introduced.
- [ ] Tasks tab shows real child tasks and can launch the existing task journey until 05 migrates that editor. Ticket creation and deletion remain server-confirmed and reconcile views/live updates.
- [ ] Ticket deep links resolve from the full project collection, including another sprint or an unplanned ticket, without silently broadening Backlog scope or losing the parent/project return path.
- [ ] Verify create/edit/delete, validation/failure recovery, dirty navigation, deep-link/back/reload and preservation of fields omitted by the prototype on mobile and desktop.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.
