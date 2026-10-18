# 01: Enter the demo and use Projects in C

**What to build:** A visitor opens the demo, finds and enters a real project through the C project list, and can perform the existing project-list operations on any supported screen.

**Blocked by:** None (can start immediately).

**Status:** claimed

Type: task

- [ ] Demo entry and Projects use the selected light/neutral-carbon identity and a genuinely loaded Plex font; system/manual theme choice is readable and retained without disturbing sessions.
- [ ] C project cards show real title, concise description, project-wide progress/counts, team summary and clear entry. No prototype percentages, project names, emblems-as-data or sample counts are hardcoded.
- [ ] Preserve search, refresh, grid/list choice and its existing persistence, favorite ordering with its existing semantics, project creation and permitted deletion. Deletion is secondary and confirmed; preserve role restrictions.
- [ ] Remove disabled project-menu placeholders rather than implementing new Edit Project, personal-account or Settings features. Useful demo/theme information remains discoverable.
- [ ] Distinguish opening/waking demo, session recovery, first load, refreshing with retained content, empty/no matches, create/delete pending and recoverable failures. No duplicate submissions or lost creation input on failure.
- [ ] Entry → Projects → correct real project works in both themes and narrow/wide layouts. Existing summary reads and session protections remain verified; other application areas keep working during staged migration.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed for implementation on the isolated Project studio branch. Approved test seams: real browser workflows, canonical HTTP/WebSocket integration with isolated PostgreSQL, and targeted progress/calculation regressions.
