# 12: Run a responsive sprint retrospective

**What to build:** A visitor records and reacts to retrospective notes for the selected sprint through C category columns or a narrow category selector/card list.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** resolved

Type: task

- [x] Wide screens show Positive/Negative/Improvements columns; mobile shows category selection with readable cards, preserving full operations and clear sprint context.
- [x] Preserve existing card create/edit/delete, reactions, retries and display controls. Explain name-hide/blur as presentation, without implying actual anonymity.
- [x] Keep empty/no-sprint, pending reaction/save/delete, failure recovery, retained input and correct canonical results through sprint/project changes.
- [x] Reach actions by touch/keyboard, manage editor focus and keep both themes readable without color-only category meaning.
- [x] Verify notes/reactions/editing, category changes, display semantics and cross-sprint isolation on narrow/wide layouts.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 11. Preserve real sprint-scoped feedback, reactions and display controls while implementing C columns and narrow category selection.

## Answer

Implemented C feedback columns on wide screens and a category selector/card journey on narrow screens. Full create/edit/delete and reactions retain canonical confirmation, retry and pending protections. Editors carry the actual sprint context; category edits reveal their confirmed destination without changing another sprint's selection. Existing discussion/blur/name-display controls remain available with an explicit explanation that these are presentation preferences, not anonymity.

Verification: the new compact-category regression failed before implementation, then passed. All nine retained retrospective journeys and the compact regression passed; 12 additional both-theme layout/editor and category-persistence journeys passed. Frontend typecheck/lint pass (12 existing warnings). Inspected light desktop and dark mobile captures. No backend contract/data change, publication or recording.
