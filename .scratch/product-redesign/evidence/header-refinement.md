# Owner refinement: compact workspace and light default

Owner feedback after the published C redesign removes the desktop header/breadcrumb/demo-badge row. Projects, Overview and all work/planning surfaces now begin directly with their content. Appearance and user actions sit at the bottom of the shared floating rail; project refresh remains there. Mobile retains a compact navigation entry and bottom drawer actions. The owner explicitly accepts losing breadcrumbs.

Light is now the initial appearance even on a dark operating system. Remembered manual choices persist; following system appearance remains an explicit option. Visual checks explicitly select their intended theme so both palettes remain covered after changing the initial default.

Shared StudioRail/WorkspaceActions are used by Projects and project navigation. Existing sessions, API data, refresh/retry, project/sprint selection and user actions remain intact. No backend/schema/environment/data change and no recording.

## Verification

Frontend types and lint pass (zero errors,12 existing warnings). All80 frontend tests/12 snapshots pass; the inspected Sidebar snapshot now includes its bottom controls.36 focused real-browser navigation/session/appearance/layout journeys pass. Production builds and46/47 initial production cases pass; the sole failure selected the now-hidden mobile header text on desktop. Its identity assertion now targets the real page h1, with URL/socket/content assertions retained. The final focused production confirmation passes all5 cases, including the preserved cross-project socket identity assertion and four workspace/control layouts. Public release checks follow after deployment.

Inspected actual [Projects light desktop](../../../.design/product-redesign/screenshots/header-refinement/projects-light-1440.png), [Goals dark desktop](../../../.design/product-redesign/screenshots/header-refinement/goals-1440.png) and [Goals light320](../../../.design/product-redesign/screenshots/header-refinement/goals-320.png) captures. Desktop content starts at the top inset; bottom controls remain reachable. Mobile menu and its controls work at320/768 and desktop at1024/1440. No video/trace.
