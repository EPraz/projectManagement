# 03: See a truthful operational Overview

**What to build:** A visitor can understand the whole project's progress and the selected sprint's execution, attention items, deadlines and workload through the accepted C Overview using real data.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** resolved

Type: task

- [x] Reproduce C's project/profile progress, selected-sprint execution, attention and ticket-state modules, calendar and updates. Mobile prioritizes sprint/attention; descriptive metadata follows lower in the reading order.
- [x] Project progress uses the whole project and the existing completion definition; sprint totals/completion/effort/chart use the selected sprint. Retain the full real status catalog, actual sprint dates and understandable chart labels/legends.
- [x] A ticket is blocked when its flag OR own state says blocked; count it once and count the full collection before limiting a preview. Cover flag-only, state-only, both and totals larger than the displayed preview.
- [x] Separate overdue/upcoming unfinished ticket deadlines; completed tickets do not appear as overdue work. Sprint/project changes, missing dates and no sprint cannot show stale or fabricated values.
- [x] Recent updates describe only known creations/latest modifications from timestamps, without inferring audit events. A sprint name is labeled as sprint context rather than presented as a stored goal.
- [x] Preserve real sprint goals, milestones, team workload, story-point/time information and project metadata already available, using lower-priority areas where needed. The prototype's omitted widgets are not deleted capabilities.
- [x] Regression-check calculation scopes and truthful labels plus a browser journey that changes sprint/work and sees canonical results, with readable charts in both themes/sizes.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 02; implement C operational modules with blocker/deadline/update truth regressions at the approved calculation/browser seams.

## Answer

Delivered C Overview with the real project profile/progress ring, selected-sprint execution, attention, full catalog state chart, overdue/upcoming calendar and timestamp-backed Recent updates. Mobile prioritizes sprint and attention. Retained project metadata, actual goals/checklists/milestones, all member workloads, story points and ticket/task hour information with explicit scope labels. Attention previews count the complete OR-based blocker collection before displaying four; completed tickets are excluded from deadline lists. Updates describe known creation/latest modification only, including real task timestamps, and do not invent assignments/status history.

Validation: blocker, deadline and update-label regressions each failed before their corrections and passed afterward; 11 focused calculation checks pass including prior project-progress cases. Thirty-five relevant browser journeys pass across focused runs (24 existing planning/project/navigation checks and 11 new Overview checks). New checks cover 320/390/768/1024/1440 in both themes plus a disposable project with flag-only/state-only/both blockers, more blockers than preview, completed deadlines, separate project/sprint percentages and a canonical live change. New fixture uses actual required sprint dates and create-then-PATCH status contract. Retained captures: `frontend/.tmp/studio/overview/`; inspected light desktop and neutral-carbon mobile. No measured page overflow. Frontend types, lint (13 existing warnings) and isolated-mode production build pass. Overview route chunk is about 21.83 kB versus 395.38 kB before replacing the overlapping chart; this is a build-size observation, not a runtime benchmark. Full integration/cloud evidence remains 13/14. No public data/deployment changes.
