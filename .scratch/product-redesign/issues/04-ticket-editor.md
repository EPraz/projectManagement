# 04: Create and edit tickets without losing context

**What to build:** A visitor opens or creates a ticket from existing work views or a deep link, edits it in the C panel/full-screen surface and returns with confirmed changes or a recoverable draft.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** resolved

Type: task

- [x] Use one editor surface at a time: wide contextual panel / full screen on mobile, with Details, Planning, Tasks and Additional info. Preserve every existing field, validation and domain restriction.
- [x] Keep ticket state, type, responsible member, priority, sprint/feature relations, blocking fields/relations, estimates/story points/time, deadlines, acceptance/design/additional content, notes/discussion and existing metadata accessible.
- [x] Explicit Save/Cancel and secondary confirmed deletion remain reachable. Pending/duplicate submissions, failed responses, retry and unsaved-change keep/discard/save preserve input and focus. No autosave is introduced.
- [x] Tasks tab shows real child tasks and can launch the existing task journey until 05 migrates that editor. Ticket creation and deletion remain server-confirmed and reconcile views/live updates.
- [x] Ticket deep links resolve from the full project collection, including another sprint or an unplanned ticket, without silently broadening Backlog scope or losing the parent/project return path.
- [x] Verify create/edit/delete, validation/failure recovery, dirty navigation, deep-link/back/reload and preservation of fields omitted by the prototype on mobile and desktop.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 03; preserve all real ticket fields and canonical mutation/draft protections while implementing the C panel, Tasks context and unsaved-navigation/deletion flows.

## Answer

Delivered the C contextual desktop/full-screen mobile ticket editor for creation and editing, with Details, Planning, Tasks and Additional Info; the footer keeps Save/Cancel and secondary confirmed deletion reachable. Field groups retain real state/type/priority/assignment, sprint/feature/blocking relations, story points/time, all requirement/design/notes/discussion content and metadata. Added the agreed missing deadline control using the existing API field; nullable DTO/model/payload annotations now explicitly support clearing it, with no schema change. New-ticket creation retains the existing New default and validates a real confirmed response through the authenticated request layer.

Unsaved close and SPA/browser Back offer keep/discard/save, preserve failed drafts and guard duplicate submissions; native unload also warns. A data router supplies the installed router's supported navigation blocker while preserving URLs/providers/session behavior. Task links open one editor and return to the parent's Tasks context; deep links resolve against the full project. Canonical deletion cleans only the matching current link even if a socket event unmounts the editor first. Late responses cannot clear another project's editor/draft. If a sprint disappears independently during creation, the draft stays recoverable and the visitor can choose a valid replacement.

Validation: close, Back, deadline and independently deleted-sprint regressions failed before fixes and pass. Native isolated PostgreSQL/API/frontend production build and 45 focused browser checks pass, including ten session/renewal/logout checks, existing editor/race regressions, creation failure/pending recovery, parent return and ten C theme/width captures. Two follow-up real deletion checks pass after correcting link cleanup, including a delayed response after switching projects. Six retained component checks/snapshot, frontend types/lint (13 existing warnings) and backend types/lint pass. Captures inspected at mobile dark/desktop light and retained under `frontend/.tmp/studio/ticket-editor-production/` plus `frontend/.tmp/studio/ticket-editor/`. Whole-product CI/review/release still belong to 13/14; no public deployment/data changes.
