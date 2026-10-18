# Owner feedback: compact Taskboard ticket and partial retake

The owner flagged the ticket cell around1:05 as visually awkward and requested correcting the product UI and re-recording only that part.

The matrix remains ticket rows × task-state columns. The expansion control shares the identity row; the title leads the cell; a compact accessible state selector shares a row with priority; the assignee has initials/name; task completion and deadline share the footer. Removed the two unavailable ordering controls. Existing accessible ticket-state/collapse/editor actions, pending/blocked behavior, filters and canonical updates are retained. Narrow groups reuse the same compact summary and retain their task expansion. The bulk-event regression now verifies that unsupported ordering is not presented, while preserving its independent confirmed/rejected mutation assertions.

Verification: types and lint pass (the existing12Fast Refresh warnings remain);80frontend tests/12snapshots pass;16Taskboard/bulk browser journeys pass, including task drag, state changes, filters, collapse and320–1440px layouts in both themes. Inspected real1440px light,320px light and768px dark captures. Both applications build for production. No backend/schema/dependency change.

Actual partial take at source revision2617324 contains only the five Taskboard/collaboration scenes. Independent writer/observer contexts receive two real ticketUpdated events with zero observer reloads and separate API-confirmed CODE_REVIEW/IN_PROGRESS persistence. No public content mutation/reset. The original raw take and previous MP4 are preserved locally.

Replaced1:00.20–1:44.32. All17chapter positions,21captions and182.56s total duration remain unchanged. Eleven unaffected encoded shots are byte-identical to the previous approved-for-review export. Team was not re-recorded: only its first1.8s now hold its own first ready Team frame, removing a brief old-Taskboard flash at the join. No fabricated interface/results or extra recording. Updated the README's Taskboard screenshot from the actual new production capture.

The full composite decodes. Inspected affected chronological sheets, full-resolution1:05/1:19/1:44join frames and actual paused/fullscreen playback. All9viewer journeys pass again against this composite; the served build matches its media hash. [Current media/provenance](05-video.json), [machine-readable feedback result](06-taskboard-feedback.json). The earlier280-journey full run is historical; current targeted checks are reported separately rather than described as another complete run.

Review at http://127.0.0.1:61758/walkthrough. No push/deploy/upload; publication still requires the owner's explicit approval.
