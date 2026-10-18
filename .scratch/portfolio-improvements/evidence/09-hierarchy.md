# Ticket 09 — real hierarchy and linked backlog

Date: 2026-10-17. All mutation fixtures and cleanup use the isolated local PostgreSQL databases. No private environment, public Neon cleanup, schema migration or recording.

## Bounded scope and boundaries

The existing `/epics` route rendered a simulated authentication hierarchy for every project, had inert creation/menu controls and a disabled navigation entry. The approved ticket explicitly covers understandable/editable epics, features and linked backlog. It now uses selected-project data and the existing Epic/Feature CRUD domain, with the original card layout. Unsupported simulated dates, avatars, priorities, drag handles and inert filters were removed rather than promised as capabilities. The existing navigation entry is enabled.

The page composes hierarchy presentation, editor and cascade confirmation. Its local hook owns canonical project projections and the shared authenticated request boundary; React Hook Form owns draft validation/submission, preserving failed input. Both dialogs invalidate completion on unmount and guard pending actions. No parallel fetched hierarchy state or new form/query framework was added. Styles consolidate the formerly duplicated inline and separate definitions.

Linked tickets use the existing backlog editor. Board tab selection is derived from the URL, preserving links from another route. Both task board and backlog now consume canonical tickets directly; Layout's copied array and redundant synchronization were removed. Types caught the task-board consumer during this migration, and it was migrated before the passing integrated run.

## Demonstrated corrections

- Real hierarchy browser regression failed on missing stored epic text while the mock page rendered. It now passes with actual features and linked tickets.
- Opening the linked backlog exposed a blank-screen React error: tag response objects were rendered as strings. Ticket's read type and tag rendering now use stored tag IDs/names. Zero estimates use nullish fallback, and missing statuses have a readable fallback.
- Backlog priority changes did not recompute visible rows; the browser regression retained two LOW rows after selecting HIGH. Filtering now depends on current tickets and filters. The blocked All option separately reproduced false-only filtering and now clears the condition. Columns/filter/expand/edit/delete controls have meaningful accessible labels, and empty results/hidden columns explain what to do.
- Failed backlog deletion closed confirmation immediately. The shared confirmation now awaits the callback, retains explicit false failures with retry feedback, blocks duplicate pending actions and invalidates stale completion by item identity. Legacy void callbacks remain compatible; this ticket migrates real backlog outcomes, not a claim that later workflows are finished.
- Hierarchy GET list endpoints expected GET bodies. Query DTOs now implement the usable parent query contract. Updating an unchanged title returned conflict because duplicate detection matched itself; update callers exclude their current ID. Whitespace titles are normalized/rejected. Existing project/epic/status relationships are checked before writes, including rejection of cross-project reparenting. The API fixture verifies linked ticket cascade deletion and missing parents.
- An independent socket client initially received no hierarchy event. Successful writes now publish a small project-ID change only after persistence; rejected writes do not publish it. The project subscriber filters its scope and reloads confirmed hierarchy and ticket state.

## Verification and test corrections

The integrated browser run passed **48 journeys**. Two more backlog keyboard journeys (390/1280px) and the extended blocked-filter regression then passed, for **50 retained journeys verified**. The hierarchy subset covers actual empty data, create pending/failure/retry, feature edit/delete failure/retry, parent links, selected/unrelated project events, real ticket editor links, search empty feedback, keyboard focus and narrow/wide forms. Temporary projects/epics/features were removed; failed deletion checks do not delete seeded work.

The initial independent browser check could race the initial project read. It now waits for loaded hierarchy, actual socket connection and a matching confirmed frame; that stronger case reproduced missing reactive content before the scoped subscriber was synchronized. No claim relies on the earlier insensitive check. The event test's first global timeout masked its missing-frame diagnostic; a shorter bounded event wait exposed the specific failure before correction.

Visual inspection caught mobile card actions clipped inside their card even though their viewport bounds passed. A stricter card-containment regression failed (374.9px > 358px); responsive wrapping preserves the layout and now passes. Screenshots disable animations to capture settled dialogs rather than the opening fade. The mobile read/form screenshots were inspected. The generic app header remains outside this bounded card adjustment.

All **32 API/startup tests** passed after the product corrections; a few additional missing-parent assertions and the final canonical run are pending at this commit. Backend types/lint pass, and its final build is running. Frontend types/lint pass with **29 visible warnings**, down from 31 without suppressions. The first full Jest run had 76 passes and one expected navigation snapshot difference: Epics & Features changed from disabled/nonfocusable to enabled/focusable. Only those attributes were manually updated; Sidebar/delete confirmation then pass their eight tests and two snapshots. The final 77-test run is pending. Initial build passes at 1,630.85 kB raw / 482.95 kB gzip; final correction output will be recorded before closure.

Independent Standards/Spec review and the final verification outcomes will be appended before resolving this ticket. Existing manual demo restoration, demo-only access, stored data and free-hosting decisions remain unchanged. README/video stay deferred until integrated cloud verification and owner design feedback/confirmation.
