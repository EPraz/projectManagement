# Owner refinement: compact workspace and light default

Owner feedback after the published C redesign removes the desktop header/breadcrumb/demo-badge row. Projects, Overview and all work/planning surfaces now begin directly with their content. Appearance and user actions sit at the bottom of the shared floating rail; project refresh remains there. Mobile retains a compact navigation entry and bottom drawer actions. The owner explicitly accepts losing breadcrumbs.

Light is now the initial appearance even on a dark operating system. Remembered manual choices persist; following system appearance remains an explicit option. Visual checks explicitly select their intended theme so both palettes remain covered after changing the initial default.

Shared StudioRail/WorkspaceActions are used by Projects and project navigation. Existing sessions, API data, refresh/retry, project/sprint selection and user actions remain intact. No backend/schema/environment/data change and no recording.

## Verification

Frontend types and lint pass (zero errors,12 existing warnings). All80 frontend tests/12 snapshots pass; the inspected Sidebar snapshot now includes its bottom controls.36 focused real-browser navigation/session/appearance/layout journeys pass. Production builds and46/47 initial production cases pass; the sole failure selected the now-hidden mobile header text on desktop. Its identity assertion now targets the real page h1, with URL/socket/content assertions retained. The final focused production confirmation passes all5 cases, including the preserved cross-project socket identity assertion and four workspace/control layouts. Public release checks follow after deployment.

Inspected actual [Projects light desktop](../../../.design/product-redesign/screenshots/header-refinement/projects-light-1440.png), [Goals dark desktop](../../../.design/product-redesign/screenshots/header-refinement/goals-1440.png) and [Goals light320](../../../.design/product-redesign/screenshots/header-refinement/goals-320.png) captures. Desktop content starts at the top inset; bottom controls remain reachable. Mobile menu and its controls work at320/768 and desktop at1024/1440. No video/trace.

## Public release

Application revision `27fc3a26e91bfc28d81c98e76aa19494627e50e2` is READY on the existing Vercel production alias https://project-management-murex-pi.vercel.app, deployment `dpl_ALdE9XtSzfRgnMtuqa7S1jofdYLQ`. Backend code/configuration/data are unchanged.

Real public Chrome checks pass at390/1440: initial light despite dark system, controls anchored at the bottom, desktop content starts at the top inset, account menu available and manual dark choice preserved after reload. Zero browser exceptions; public Projects/Goals captures inspected. [Machine-readable result](header-cloud.json). No public mutations beyond normal demo session creation, no video.

Hosted Quality verification for this application revision: https://github.com/EPraz/projectManagement/actions/runs/39131579495. Frontend/backend jobs pass; final browser result is recorded when complete. The following evidence-only commit does not change the deployed application.


The first hosted full run passed259/261 cases. Remaining verification issues were a second old `.first()` project-title selector selecting hidden mobile header text on desktop and a test helper observing the departing Projects user control before the destination workspace mounted. The identity assertion now targets the real h1; the helper waits for the destination project navigation before choosing desktop versus mobile access. URL/content/race/permission assertions and zero retries remain. No production application change is needed for these corrections.

The corrected destination/identity waits pass all13 focused production-browser journeys, including both prior hosted failures and320/768/1024/1440 control layouts. These changes affect tests/documentation only; production application remains27fc3a2. Full hosted CI reruns on the correction commit.

Final hosted Quality run [39132612034](https://github.com/EPraz/projectManagement/actions/runs/39132612034) on3645fac is **SUCCESS** on all three jobs, including all261 production-browser journeys,80 frontend tests/12 snapshots and58 backend tests. Application source is identical to the verified public27fc3a2 deployment. Working tree application changes are complete; this closure records evidence only. Owner feedback/approval remains required before any video.
