# Ticket13 measured code loading

Base993bf023073fb5828c8208ce241bfd8d4c92bfea. Node22.20.0, same locked dependencies, Windows Chrome fresh context1280x900, local Vite production preview5183 proxying the isolated backend3102; no throttling/cache warmup. Baseline UI is identical to0a9705d. No dependency/schema/data changes.

## Measurement and boundaries

The old production artifact was one1,627,352byte raw script,483,496encodedbodybytes over the local preview. Before splitting, the same script was loaded on entry, projects, overview and board. A constants barrel statically exported panel components through the pages barrel, bridging bootstrap imports back to the full application.

Routes and actual board panels now use React.lazy with a shared Suspense/error surface. Entry providers remain mounted outside route suspension; project providers stay outside child-route boundaries. Direct bootstrap imports and removal of four unused private component exports prevent eager bridges; TaskColumn's real consumer imports it directly. Existing labels/order/routes/editor forms remain. The workspace defers its editor-containing layout from entry/list; there is no heavy standalone editor library justifying a further per-field/chunk framework.

Comparable actual browser resource measurements (encoded body bytes; cumulative fresh-context journey):

|Stage|Before bytes / requests|After bytes / requests|
|---|---:|---:|
|Entry|483496 /1|126982 /1|
|Project list|483496 /1|319491 /22|
|Project overview|483496 /1|460860 /34|
|Board opened|483496 /1|486273 /42|

Initial JavaScript body transfer falls73.7%; project-list cumulative body falls33.9%. Initial raw script is380.53kB /126.98kBgzip (baseline1,627.35/483.50). This is a measured deferral, not a smaller complete application: by overview+board cumulative encoded body is0.6% larger, with more requests/header overhead (498873transferbytes vs483796,3.1% more). Browser/module caching permits reuse on later navigation. No latency or cloud cold-start improvement is claimed. No arbitrary chunk-size target/manual vendor scheme was added.

[Resource evidence](13-loading-measurements.json) records actual asset names, decoded/encoded/transfer sizes and the same stages. Reproduce with a local isolated production preview and `node scripts/measure-code-loading.mjs http://127.0.0.1:5183` from frontend. The tool permits loopbackHTTP only and performs public UI entry/navigation, no resets/load test/media recording. The board stage explicitly waits for Add New Item; the first exploratory after-board snapshot was too early and is excluded. Baseline had no deferred requests, so its complete single asset is unaffected.

## Recovery and verification

The first browser regression was red: blocking Board.tsx prevented even Explore demo from loading. It now passes. A failed route/panel presents a named error and Reload view; full reload retries the current deployment assets because React.lazy caches rejected imports, retaining the cookie/deep URL. Pending module downloads keep workspace navigation available and cannot later replace another selected route. Changing the failed capacity tab to goals recovers without resetting the workspace.

All three new loading journeys pass in development and against actual production chunks (3/3each). Frontend type/build checks pass, no Vite large-chunk warning. Frontend lint0errors/15visiblewarnings, no suppressions. The first Jest run exposed four old PrivateRoute mocks still targeting the prior barrel; mock/import paths were migrated to the same direct auth boundary without changing assertions/snapshots. Final77Jest, types and integrated81browser checks are pending before closure.

Ticket12 hostedCI39090949302 passed. Final presentation remains deferred through16 and the explicit owner design/readiness checkpoint.

Measured implementation revision: **1773bbb873c49c51e4fd50c37d0b5536593b32ea**, compared with **993bf023073fb5828c8208ce241bfd8d4c92bfea** (unchanged baseline UI). The retained portable measurement tool was rerun successfully against this production build and confirms the recorded totals. All77Jest tests/15suites/12snapshots and final types pass; no snapshot changes. Standards reports0findings. Spec reports0implementationfindings; its exact-after-revision documentation detail is now corrected here and in the JSON. The integrated81-browser production run remains in progress.

Matched runtime correction: the first integrated preview attempts were excluded because the owned backend allowed only the dev origin and the first production build used the default localhost:3000 socket URL. No product change was needed: the isolated preview's CLIENT_URL now matches5183 and both before/after builds explicitly use VITE_SOCKET_URL=http://127.0.0.1:3102 plus same-origin /api. The baseline sources were temporarily restored/rebuilt only inside the ignored clean checkout, measured again with the same settings, then current sources restored/rebuilt/re-measured. The table/JSON above supersede exploratory measurements. Socket handshake at the actual preview origin succeeds, and the independent-update regression that failed with the old runtime now passes. The final full run uses the corrected production artifact.

Final integrated evidence: **81/81 actual production-browser journeys pass in2.6minutes** against the matched local preview and correct backend/socket origin. This covers all prior editor draft/retry/concurrency, hierarchy/planning/membership/capacity/retrospective/session workflows, plus all three chunk-loading failures/pending/recovery cases. All77Jest/15suites/12snapshots, final types/build/lint pass (15visiblewarnings,0errors; no suppressions or snapshot changes). Both independent review axes report0remainingfindings after exact-revision evidence correction. No verification remains pending for this slice.
