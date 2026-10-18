# Production design review: Project studio C

Reviewed against: [approved brief](DESIGN_BRIEF.md) and [selected C reference](direction-c/REVIEW.md). Date: 2026-10-18. Production implementation: ad0368f. README and walkthrough remain deferred.

## Screenshots captured

Actual React application, canonical fictional local data, read-only preview isolated from browser fixtures and the public demo. Captures wait for the current page heading and finished deferred surface; meaningful board/planning/category regions are checked before capture. Initial exploratory captures of loading surfaces were rejected and replaced. No video or trace was recorded.

| Area | Light 390 / 768 / 1280 | Dark 390 / 768 / 1280 |
| --- | --- | --- |
| Overview | [390](screenshots/production-c/Overview-light-390.png) · [768](screenshots/production-c/Overview-light-768.png) · [1280](screenshots/production-c/Overview-light-1280.png) | [390](screenshots/production-c/Overview-dark-390.png) · [768](screenshots/production-c/Overview-dark-768.png) · [1280](screenshots/production-c/Overview-dark-1280.png) |
| Taskboard | [390](screenshots/production-c/Taskboard-light-390.png) · [768](screenshots/production-c/Taskboard-light-768.png) · [1280](screenshots/production-c/Taskboard-light-1280.png) | [390](screenshots/production-c/Taskboard-dark-390.png) · [768](screenshots/production-c/Taskboard-dark-768.png) · [1280](screenshots/production-c/Taskboard-dark-1280.png) |
| Backlog | [390](screenshots/production-c/Backlog-light-390.png) · [768](screenshots/production-c/Backlog-light-768.png) · [1280](screenshots/production-c/Backlog-light-1280.png) | [390](screenshots/production-c/Backlog-dark-390.png) · [768](screenshots/production-c/Backlog-dark-768.png) · [1280](screenshots/production-c/Backlog-dark-1280.png) |
| Epics & Features | [390](screenshots/production-c/Epics---Features-light-390.png) · [768](screenshots/production-c/Epics---Features-light-768.png) · [1280](screenshots/production-c/Epics---Features-light-1280.png) | [390](screenshots/production-c/Epics---Features-dark-390.png) · [768](screenshots/production-c/Epics---Features-dark-768.png) · [1280](screenshots/production-c/Epics---Features-dark-1280.png) |
| Goals | [390](screenshots/production-c/Goals-light-390.png) · [768](screenshots/production-c/Goals-light-768.png) · [1280](screenshots/production-c/Goals-light-1280.png) | [390](screenshots/production-c/Goals-dark-390.png) · [768](screenshots/production-c/Goals-dark-768.png) · [1280](screenshots/production-c/Goals-dark-1280.png) |
| Capacity | [390](screenshots/production-c/Capacity-light-390.png) · [768](screenshots/production-c/Capacity-light-768.png) · [1280](screenshots/production-c/Capacity-light-1280.png) | [390](screenshots/production-c/Capacity-dark-390.png) · [768](screenshots/production-c/Capacity-dark-768.png) · [1280](screenshots/production-c/Capacity-dark-1280.png) |
| Team | [390](screenshots/production-c/Team-light-390.png) · [768](screenshots/production-c/Team-light-768.png) · [1280](screenshots/production-c/Team-light-1280.png) | [390](screenshots/production-c/Team-dark-390.png) · [768](screenshots/production-c/Team-dark-768.png) · [1280](screenshots/production-c/Team-dark-1280.png) |
| Retrospective | [390](screenshots/production-c/Retrospective-light-390.png) · [768](screenshots/production-c/Retrospective-light-768.png) · [1280](screenshots/production-c/Retrospective-light-1280.png) | [390](screenshots/production-c/Retrospective-dark-390.png) · [768](screenshots/production-c/Retrospective-dark-768.png) · [1280](screenshots/production-c/Retrospective-dark-1280.png) |

## Assessment

The floating rail, azure project identity, Plex typography and mixed Overview modules preserve the accepted C direction. Carbon surfaces remain neutral in dark appearance. Taskboard retains ticket rows and real task-state columns on wide screens, with local matrix scrolling; narrow work is grouped by ticket state. Backlog, capacity and team adapt into readable compact cards. Hierarchy retains parent-aware levels and project scope. Retrospective uses named category selection below the wide breakpoint.

The 48 populated captures were inspected in both themes and mobile/tablet/desktop contact sheets. Individual retained ticket screenshots cover full-screen/contextual editors and pending/failure states. No material clipping or aesthetic deviation was found in the inspected surfaces. Mobile Overview and populated lists are deliberately long pages rather than squeezed desktop grids. Additional automated width checks cover 320/390/768/1024/1280/1440 CSS px; these are targeted checks, not exhaustive accessibility certification.

## Corrections made

- Replaced numeric MUI sx radii that expanded beyond the brief with literal 12px panels and 8px internal surfaces; retained the distinct floating rail.
- Preserved an honest current-assignee label outside the current project roster rather than showing an empty selector or falsely claiming Unassigned. Stored assignments remain unchanged.
- Kept retrospective display tabs readable at tablet/desktop widths and explained name hiding/blur without promising anonymity.
- Retired nine stylesheets only after confirming no source/test consumers remained.

## Accessibility and limitations

Measured 32 semantic foreground/background/control pairs across both palettes: all pass the selected 4.5:1 text or 3:1 control threshold; lowest measured normal-text ratio is 5.46:1. These measurements cover shared palette pairs, not every possible server-defined status color. Text labels reinforce status/category colors. Global keyboard focus, 44px button/icon targets and reduced-motion overrides are retained. Protected-editor, keyboard, touch/status alternatives and modal-return journeys are tested separately.

Reflow checks model a 1280px viewport at 200% as 640 CSS px and also enlarge root text; landscape editor actions are checked at 780×390. This does not claim assistive-technology or every browser's native zoom certification.

## Remaining improvements

No material design blocker identified. Nonblocking maintenance opportunities from the independent Standards review are recorded in [review evidence](../../.scratch/product-redesign/evidence/13-review.md). Font files are locally hosted licensed TTFs (~205KB per requested weight); a future compressed-font pass may reduce transfer. Current data-router entry is ~471.33KB raw /157.63KB gzip; deferred routes/panels remain separate. No cloud cold-start or latency improvement is claimed.

The owner's explicit final visual/readiness approval is still required before recording the silent walkthrough.
