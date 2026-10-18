# 13: Verify coherent C journeys across the complete product

**What to build:** A visitor completes the real demo-to-delivery journey across every redesigned area with consistent interaction, truthful feedback and the approved visual identity.

**Blocked by:** 03 — See a truthful operational Overview; 06 — Execute a sprint through the responsive Taskboard; 07 — Work from a selected-sprint Backlog; 08 — Explore project hierarchy and open linked tickets; 09 — Plan sprint goals and checklists; 10 — Plan member capacity for the selected sprint; 11 — Manage the project's team membership; 12 — Run a responsive sprint retrospective.

**Status:** ready-for-agent

Type: task

- [ ] Run integrated entry → Projects → Overview → Taskboard/Backlog → ticket/task → hierarchy/planning/team/retrospective journeys, including project/sprint changes, deep links, return paths and canonical live updates.
- [ ] Check both themes at representative 320–390 mobile, 768/1024 tablet and 1280/1440 desktop widths; verify zoom/reflow, portrait/landscape behavior, contrast, reduced motion, touch targets, keyboard, visible focus and modal focus return. Allow only intentional local two-dimensional scrolling.
- [ ] Validate real loading/empty/no matches/error/retry/pending/unsaved/deletion states across surfaces, not only populated happy-path screenshots. Each earlier ticket already owns its local checks; this ticket covers integration gaps.
- [ ] Preserve meaningful HTTP/WebSocket PostgreSQL regressions and existing browser guarantees, plus targeted new blocker/deadline/state/filter tests. Use isolated local test databases, never the public/private Neon database for fixtures or resets.
- [ ] Pass current frontend/backend builds, types, lint and required CI checks; review against approved behavior and documented conventions and resolve material findings. Check loading/bundle/performance regressions where changes warrant comparison against recorded quality baselines.
- [ ] Remove old duplicate navigation, obsolete styles/components/compatibility paths only when no caller remains; keep retained functionality and CI green. Exclude disposable prototype routes/controls/data from production builds.
- [ ] Record final screenshots, verification evidence and material limitations for handoff. README/walkthrough remain deferred and no video is recorded here.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.
