# 01: Enter the demo and use Projects in C

**What to build:** A visitor opens the demo, finds and enters a real project through the C project list, and can perform the existing project-list operations on any supported screen.

**Blocked by:** None (can start immediately).

**Status:** resolved

Type: task

- [x] Demo entry and Projects use the selected light/neutral-carbon identity and a genuinely loaded Plex font; system/manual theme choice is readable and retained without disturbing sessions.
- [x] C project cards show real title, concise description, project-wide progress/counts, team summary and clear entry. No prototype percentages, project names, emblems-as-data or sample counts are hardcoded.
- [x] Preserve search, refresh, grid/list choice and its existing persistence, favorite ordering with its existing semantics, project creation and permitted deletion. Deletion is secondary and confirmed; preserve role restrictions.
- [x] Remove disabled project-menu placeholders rather than implementing new Edit Project, personal-account or Settings features. Useful demo/theme information remains discoverable.
- [x] Distinguish opening/waking demo, session recovery, first load, refreshing with retained content, empty/no matches, create/delete pending and recoverable failures. No duplicate submissions or lost creation input on failure.
- [x] Entry → Projects → correct real project works in both themes and narrow/wide layouts. Existing summary reads and session protections remain verified; other application areas keep working during staged migration.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed for implementation on the isolated Project studio branch. Approved test seams: real browser workflows, canonical HTTP/WebSocket integration with isolated PostgreSQL, and targeted progress/calculation regressions.

## Answer

Implemented C entry and Projects using locally hosted, licensed IBM Plex Sans, white/azure and neutral-carbon themes, system-first appearance and a persisted manual choice. Project cards derive progress/counts/team from summary data; retained search, refresh, favorite semantics, persisted grid/list, keyboard project links and creation. Removed project-menu placeholders; deletion now has cancel, pending, failure and confirmed retry through the shared confirmation component. Initial loading/error and filtered no-results are distinct from a confirmed empty workspace.

Validation: the new appearance browser regression failed before implementation, then passed. 25 real browser checks passed for Projects/navigation and C at 320/390/768/1024/1440 in both themes; four existing creation-draft/keyboard-entry checks and the added deletion-recovery check passed (30 checks total). Native production browser fixture isolation/build passed before UI checks; final slice typecheck and lint passed (the existing 14 warnings remain). Captures were inspected at 320/1440; no page-width overflow at the ten measured theme/width combinations. Tests use fictional local PostgreSQL, never public Neon. Full integration/review/cloud publication remain tickets 13/14.
