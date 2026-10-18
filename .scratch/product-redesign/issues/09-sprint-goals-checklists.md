# 09: Plan sprint goals and checklists

**What to build:** A visitor creates and updates the selected sprint's real goals/checklists and understands their progress through C goal cards and responsive editing.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** claimed

Type: task

- [ ] Preserve goal title/description/status, progress and checklist create/edit/delete/toggle operations using clear cards and responsive forms.
- [ ] Checklist state and goal progress follow existing domain rules; a sprint name is never substituted for a stored goal.
- [ ] Selected-sprint, no-sprint, empty, pending, failed-save/delete and late-response journeys retain correct ownership, entered data and server-confirmed results.
- [ ] Maintain explicit actions, confirmations, accessible focus and mobile touch targets in both themes.
- [ ] Verify a complete goal/checklist journey plus sprint-switch isolation and failure recovery against the existing planning contracts.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 08. Apply C goal/checklist cards and responsive protected forms while preserving canonical goal progress/status, all planning operations and sprint/late-response isolation.
