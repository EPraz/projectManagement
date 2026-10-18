# 08: Explore project hierarchy and open linked tickets

**What to build:** A visitor manages epics/features and follows their tickets using a wide expandable hierarchy or narrow parent-aware level navigation.

**Blocked by:** 04 — Create and edit tickets without losing context.

**Status:** resolved

Type: task

- [x] Project-wide hierarchy uses the C identity, readable wide tree and narrow level navigation with visible parent/return context.
- [x] Preserve search/expansion, epic/feature CRUD, actual states, parent relations, description/acceptance content and existing validation/dependent-deletion information.
- [x] Open linked tickets through the shared editor/deep-link journey, including tickets outside the selected sprint or unplanned tickets. Keep Backlog selected-sprint-only and distinguish project-wide hierarchy scope.
- [x] Save/delete/relationship changes reconcile with the real server; confirm deletion, retain failed drafts and prevent stale outcomes from replacing another selected entity.
- [x] Verify parent changes, empty hierarchy, deletion restrictions and linked-ticket navigation on narrow/wide screens with keyboard and both themes.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 07. Preserve canonical epic/feature CRUD and dependent deletion, add C wide tree/narrow parent-aware navigation and open all linked tickets contextually without changing selected-sprint Backlog scope.

## Answer

- Delivered C project-wide hierarchy: expandable wide epic/feature tree with actual status, description/acceptance content and linked tickets; compact epic → feature → tickets levels retain parent/return context in the URL, survive reload and move keyboard focus to the new level.
- Linked tickets open through the shared editor on the hierarchy route, including other-sprint and unplanned work. Closing restores the hierarchy context; Backlog remains selected-sprint-only. Existing epic/feature creation/editing/status/parent movement and dependent-delete counts/retry remain canonical. Forms now use the C editor with keep/discard/save and invalid-parent recovery; shared exit logic owns reload protection across work-item/hierarchy editors.
- Validation: contextual-link red → green; 25 browser journeys pass, including retained HTTP/WebSocket/project isolation, failed writes/deletion, actual parent movement, unplanned tickets and both themes at 320/390/768/1024/1440. Two follow-up panel/focus checks and frontend types/lint pass (12 retained warnings, no errors). Desktop light/mobile carbon captures inspected; final 12px panel polish retained under `frontend/.tmp/studio/hierarchy-polish/`. No public data/release changes or recording.
