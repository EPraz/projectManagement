# 02: Navigate a project with shared sprint context

**What to build:** A visitor enters Overview and moves between project work, planning, team and retrospective through one coherent C navigation while keeping the correct project and sprint context.

**Blocked by:** 01 — Enter the demo and use Projects in C.

**Status:** resolved

Type: task

- [x] Use the C floating rail on wide screens and compact header/section menu on narrow screens. Provide usable labels, focus and active state without duplicated header/sidebar navigation or dead Settings entries.
- [x] Expose Overview; Work → Taskboard, Backlog, Epics & Features; Planning → Goals, Capacity; Team; Retrospective. Overview remains project entry.
- [x] Shared sprint selection affects only sprint-scoped areas. Team/hierarchy remain clearly project-wide. Preserve existing sprint creation/deletion with pending, confirmation, failure recovery and a valid selection fallback.
- [x] Project changes cannot inherit another project's selection/data; delayed loads and live updates cannot overwrite the current workspace. Keep known URLs/deep links/back/reload compatible while moving presentation.
- [x] Theme/demo preferences remain accessible on all layouts, navigation does not strand focus, and mobile width is available to content rather than a permanent rail.
- [x] Verify project entry, section changes, selection switching, empty/no-sprint and recovery journeys against the real app; legacy surfaces remain usable until their own C slices land.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after ticket 01; preserve project providers, scoped sprint persistence and known URLs while replacing duplicate navigation.

## Answer

Delivered one shared project navigation: C floating rail on wide screens and a labeled, focus-managed drawer on narrow screens. All eight work/planning/project destinations use the existing paths/query tabs. A single shared sprint bar drives sprint areas, while Team and hierarchy explicitly show project-wide scope. Removed header/sidebar duplication and unavailable Settings/account placeholders; the user menu retains real demo identity, shared-editing information, sign-out and system appearance preference.

Preserved scoped providers, sprint persistence, creation/deletion/fallback, refresh and deep links. Query-section navigation now closes the old planning dialog, retaining the prior late-response isolation guarantee. Browser navigation helpers wait for the real header before opening the mobile menu; all prior assertions remain, with selectors reflecting the approved navigation.

Validation: new navigation regression failed before implementation. Final native isolated production build and fixture isolation pass; 23 focused browser journeys pass, including all eight sections at 390/1440 in both themes, sprint creation/deletion/reload, failed and pending planning forms, keyboard entry, unrelated project loads and shared demo information. Twenty existing focused component checks and all four snapshots pass; frontend types/lint pass (13 existing warnings). Shell captures inspected; Overview's old composition is intentionally next in ticket 03. No public deployment/data changes.
