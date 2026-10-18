# Ticket13 measured code loading

Base993bf023073fb5828c8208ce241bfd8d4c92bfea. Node22.20.0, same locked dependencies, Windows Chrome fresh context1280x900, local Vite production preview5183 proxying the isolated backend3102; no throttling/cache warmup. Baseline UI is identical to0a9705d. No dependency/schema/data changes.

## Measurement and boundaries

The old production artifact was one1,627,352byte raw script,483,486encodedbodybytes over the local preview. Before splitting, the same script was loaded on entry, projects, overview and board. A constants barrel statically exported panel components through the pages barrel, bridging bootstrap imports back to the full application.

Routes and actual board panels now use React.lazy with a shared Suspense/error surface. Entry providers remain mounted outside route suspension; project providers stay outside child-route boundaries. Direct bootstrap imports and removal of four unused private component exports prevent eager bridges; TaskColumn's real consumer imports it directly. Existing labels/order/routes/editor forms remain. The workspace defers its editor-containing layout from entry/list; there is no heavy standalone editor library justifying a further per-field/chunk framework.

Comparable actual browser resource measurements (encoded body bytes; cumulative fresh-context journey):

|Stage|Before bytes / requests|After bytes / requests|
|---|---:|---:|
|Entry|483486 /1|126981 /1|
|Project list|483486 /1|319505 /22|
|Project overview|483486 /1|460888 /34|
|Board opened|483486 /1|486303 /42|

Initial JavaScript body transfer falls73.7%; project-list cumulative body falls33.9%. Initial raw script is380.53kB /126.98kBgzip (baseline1,627.35/483.49). This is a measured deferral, not a smaller complete application: by overview+board cumulative encoded body is0.6% larger, with more requests/header overhead (498903transferbytes vs483786,3.1% more). Browser/module caching permits reuse on later navigation. No latency or cloud cold-start improvement is claimed. No arbitrary chunk-size target/manual vendor scheme was added.

[Resource evidence](13-loading-measurements.json) records actual asset names, decoded/encoded/transfer sizes and the same stages. Reproduce with a local isolated production preview and `node scripts/measure-code-loading.mjs http://127.0.0.1:5183` from frontend. The tool permits loopbackHTTP only and performs public UI entry/navigation, no resets/load test/media recording. The board stage explicitly waits for Add New Item; the first exploratory after-board snapshot was too early and is excluded. Baseline had no deferred requests, so its complete single asset is unaffected.

## Recovery and verification

The first browser regression was red: blocking Board.tsx prevented even Explore demo from loading. It now passes. A failed route/panel presents a named error and Reload view; full reload retries the current deployment assets because React.lazy caches rejected imports, retaining the cookie/deep URL. Pending module downloads keep workspace navigation available and cannot later replace another selected route. Changing the failed capacity tab to goals recovers without resetting the workspace.

All three new loading journeys pass in development and against actual production chunks (3/3each). Frontend type/build checks pass, no Vite large-chunk warning. Frontend lint0errors/15visiblewarnings, no suppressions. The first Jest run exposed four old PrivateRoute mocks still targeting the prior barrel; mock/import paths were migrated to the same direct auth boundary without changing assertions/snapshots. Final77Jest, types and integrated81browser checks are pending before closure.

Ticket12 hostedCI39090949302 passed. Final presentation remains deferred through16 and the explicit owner design/readiness checkpoint.
