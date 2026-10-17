# Proposed tickets: product quality and refactor

Status: proposed — awaiting owner approval before individual issue publication

These are quality-phase tickets, distinct from the deferred six-ticket README/video proposal. Each produces a verifiable workflow or delivery capability. Changes to schema/API/UI are included only where that workflow requires them; no artificial work is added to an untouched layer.

Every implementation ticket inherits the spec's data, hosting, demo-only access and testing boundaries. Characterize behavior before risky extraction and write a failing regression before correcting a demonstrated bug. Keep evidence and remaining findings with the relevant ticket. Each slice must fit a fresh implementation context; a substantial newly discovered change requires an explicit split rather than absorbing an unlimited rewrite.

## 01: Establish trustworthy checks and isolated local startup

**What to build:** A developer can start the populated application and run meaningful canonical checks from a clean local setup without using public credentials or data.

**Blocked by:** None (can start immediately).

- [ ] Recheck and record the current frontend/backend test, build, type and lint baseline instead of treating historical counts as current results.
- [ ] Repair shared aliases/provider/test configuration and retire genuinely obsolete scaffolding with mapped behavior coverage; all retained canonical tests pass, without broad skips, hollow construction tests or blanket mock fixes.
- [ ] Preserve the useful existing frontend and API/seed integration tests and provide repeatable isolated PostgreSQL fixtures guarded against remote/shared cleanup.
- [ ] Document/verify lockfile installation, Node 22, Prisma migrations/generation, explicit Datos demo initialization and both application starts using examples only.
- [ ] Missing variables, invalid database configuration and occupied ports produce actionable feedback; keep DATABASE_URL as the sole database connection variable.
- [ ] Canonical verification commands are non-mutating where appropriate and runnable without the owner's private environment files. No product behavior defect is silently bundled into baseline repair.

## 02: Address applicable dependency findings without uncontrolled upgrades

**What to build:** The existing demo continues to work with applicable dependency findings addressed through justified compatible changes and an honest disposition for any remainder.

**Blocked by:** 01: Trustworthy checks and isolated startup. Advisory inspection may start earlier, but dependency-changing completion requires the behavior baseline.

- [ ] Inspect the current lockfiles/advisories and distinguish production/browser usage, server usage and build/development-only paths with revision/date evidence.
- [ ] Assess the previously observed frontend findings; record usage/reachability evidence and uncertainty rather than equating severity with exploitability.
- [ ] Apply justified compatible remedies or remove verified-unused dependencies; run the affected workflow, reliable tests and production builds afterward.
- [ ] Give each remaining finding a documented disposition and identify any genuinely required incompatible migration as separate scope.
- [ ] No forced blanket audit fixes, major framework/ORM migration, hidden suppression or unsupported claim that all findings are harmless.

## 03: Enforce the reliable baseline in CI

**What to build:** A proposed change is checked reproducibly before publication using the same meaningful gates available locally.

**Blocked by:** 01: Trustworthy checks and isolated startup.

- [ ] CI uses Node 22 and lockfile installation for both applications, with Prisma generation/schema validation and builds/type checks.
- [ ] Run non-mutating lint and the canonical reliable test commands, including isolated API/seed coverage with ephemeral PostgreSQL.
- [ ] Keep all CI fixtures separate from Neon, existing local databases and provider credentials; use no production environment file.
- [ ] A real failed gate causes CI failure with useful diagnostics; do not skip retained tests or mark failures as successful to create a green badge.
- [ ] Record a successful CI run and the local reproduction commands. This gate automatically includes later tests through the normal test configuration.

## 04: Make project progress correct in both project views

**What to build:** Visitors see accurate project-wide completion in grid and list without altering Datos demo or confusing project progress with selected-sprint progress.

**Blocked by:** 01: Trustworthy checks and isolated startup.

- [ ] Add a regression for actual ticket completion states before correcting the calculation.
- [ ] Grid and list agree for the same data; the unchanged initial six-of-eighteen scenario is approximately 33%.
- [ ] Empty, none-completed, partially completed, fully completed and unrecognized/non-completed status cases yield valid results.
- [ ] Preserve the distinction between ticket COMPLETED and task DONE; no global stored-status rename or hardcoded percentage.
- [ ] Preserve selected-sprint denominators and verify the visible summary in the running application.

## 05: Make task movement truthful and recoverable

**What to build:** A task movement records the authenticated Usuario demo and the UI shows the persisted result or recovers clearly from failure.

**Blocked by:** 01: Trustworthy checks and isolated startup.

- [ ] Reproduce the hardcoded-actor behavior and lock down the corrected result at the real task-update boundary.
- [ ] Attribute the change through the authenticated demo flow, distinguish actor from assignee and make no claim of individual visitor identity.
- [ ] Verify task/status/ticket relationships, accepted/rejected updates and the resulting HTTP/socket state for the affected mutation.
- [ ] Invalid drops, unchanged state, failed requests and repeated submissions do not leave a false successful move or lose the recoverable board state.
- [ ] Another independent client receives the relevant confirmed update; no credential fields are exposed.
- [ ] Refactor only the affected interaction/coordination boundaries, preserving the existing task-drag capabilities and ticket ordering limitations.

## 06: Simplify demo sessions and navigation with a compatible request boundary

**What to build:** Entry, refresh, reload, legacy redirects and logout remain reliable while the code reflects the shipped demo instead of unused personal-account flows.

**Blocked by:** 01: Trustworthy checks and isolated startup.

- [ ] Characterize browser entry, deep links, refresh, independent sessions, logout and unavailable/expired-session feedback.
- [ ] Remove unused personal-login/registration screens, context methods and exports together after checking consumers; preserve their redirects to Acceso demo.
- [ ] Separate cohesive session/navigation/layout responsibilities where inspection identifies a useful boundary; retain the visual behavior and needed JWT/cookie dependencies.
- [ ] Introduce or clarify the minimum shared request/session/error interface with real session consumers, preserving compatibility for hooks not migrated yet.
- [ ] Preserve same-origin API/cookie behavior, direct socket configuration, cancellation and useful pending/error states; no duplicate listener/fetch lifecycle or new personal-account feature.
- [ ] Keep the compatible boundary available for later workflow migrations; do not perform a codebase-wide hook rewrite in this ticket.

## 07: Make project loading, selection and recovery coherent

**What to build:** Visitors can load, navigate and recover project views without mistaking an API failure for an empty workspace or receiving another project's state.

**Blocked by:** 06: Demo sessions and compatible request boundary.

- [ ] Use the established request boundary for the project list/detail path and distinguish loading, empty, failed and background-refresh states.
- [ ] A failed or non-JSON API response remains a visible recoverable error rather than a successful empty list; retry works and retained content is not unnecessarily blanked.
- [ ] Keep route/project/sprint selection and fetched state aligned; cancel or ignore stale work after switching projects or navigating away.
- [ ] Socket updates affect the relevant selected project and listeners clean up correctly; verify independent sessions and unrelated-project events.
- [ ] Simplify project state ownership and data/navigation responsibilities without parallel sources of truth or changed public capabilities.
- [ ] Preserve populated views, progress contracts, same-origin routes with/without trailing slash and deep-link reload behavior.

## 08: Refactor ticket and task editing as a reliable workflow

**What to build:** A visitor can inspect and edit a ticket's requirements, assignment, estimates and state through a focused editor that preserves input and reports real outcomes.

**Blocked by:** 07: Coherent project loading and selection.

- [ ] Characterize the existing ticket tabs and related task-edit dialogs before extracting form/domain/presentation responsibilities; migrate their real request consumers together.
- [ ] Use the shared request boundary and clarify touched HTTP validation, response and error contracts with their real editor consumers.
- [ ] Preserve validation and unsaved data on failure, show actionable feedback/retry and guard duplicate pending submissions.
- [ ] Confirm saved changes, appropriate socket delivery and updates in the relevant board/overview; failed writes must not emit a false success.
- [ ] Preserve keyboard/focus behavior and usable dialogs at representative widths; keep sensitive fields excluded.
- [ ] The decomposition has a documented responsibility/interface benefit rather than only smaller files or a new abstraction with one trivial caller.

## 09: Refactor hierarchy and backlog without breaking linked work

**What to build:** Epics, features and their linked backlog remain understandable and editable through cohesive UI/data boundaries with reliable association and error behavior.

**Blocked by:** 07: Coherent project loading and selection.

- [ ] Characterize the supported hierarchy/backlog interactions and selected-project behavior using populated Datos demo.
- [ ] Separate responsibilities and migrate the affected requests using the compatible shared boundary, preserving real callers and existing feature scope.
- [ ] Verify touched parent-child validation, missing/invalid identifiers and failed mutations at the API boundary rather than only testing component internals.
- [ ] Relevant success, empty, loading and failed/retry states are visible; preserve unsaved values and avoid duplicate mutations.
- [ ] Linked tickets still open in the existing editor contract; required hierarchy data and relevant confirmed updates remain available.
- [ ] Verify the affected route with keyboard and representative narrow/wide layouts, without a redesign.

## 10: Make sprint planning and goals consistent across views

**What to build:** Selecting a sprint, planning its work and updating its goals produces consistent board/overview/checklist results through maintainable state and request boundaries.

**Blocked by:** 07: Coherent project loading and selection.

- [ ] Characterize selected-sprint, backlog-assignment and goal/checklist behavior using the existing supported controls.
- [ ] Verify touched associations, malformed/missing identifiers and partial failures through HTTP/persistence; preserve confirmed state and useful errors.
- [ ] Consolidate duplicated request/selection/calculation logic where justified, preserving distinct project-wide and sprint-scoped metrics.
- [ ] Confirm goal/task updates and sprint changes reach the relevant views/independent client without stale cross-sprint state.
- [ ] Cover empty/loading/error/retry/pending behavior and retain unsaved form values; keep keyboard and narrow-layout controls reachable.
- [ ] Do not add a new top-level Planning feature or change stored completion-state names.

## 11: Make team and capacity planning reliable

**What to build:** Existing team membership and per-sprint capacity can be inspected and changed with consistent validation, feedback and current selected-sprint data.

**Blocked by:** 07: Coherent project loading and selection.

- [ ] Characterize the supported team/capacity operations and preserve restrictions on fictitious demo identities.
- [ ] Verify the touched membership/user/sprint associations, invalid requests and real persisted outcomes through the API boundary.
- [ ] Clarify UI/form/request responsibilities and reuse the established client behavior instead of duplicating error/pending logic.
- [ ] Sprint/project changes do not display or overwrite stale capacity; relevant confirmed changes reach current views/clients.
- [ ] Cover loading/empty/error/retry, keyboard labels/focus and representative responsive layouts for the affected controls.
- [ ] No personal-account creation, role switching, tenant isolation or new RBAC claim is introduced.

## 12: Refactor the retrospective with complete recovery behavior

**What to build:** Visitors can use the existing sprint retrospective through cohesive components and state, with truthful feedback for supported card/reaction operations.

**Blocked by:** 07: Coherent project loading and selection.

- [ ] Characterize the actual supported retrospective interactions and selected-sprint context before extraction.
- [ ] Separate request/domain/state/presentation responsibilities where useful and migrate affected consumers to the shared boundary.
- [ ] Verify touched card/author/sprint relationships, validation and failure outcomes through the API; preserve credential filtering and confirmed socket updates.
- [ ] Empty and failed collections are distinct; retries and pending interactions do not erase recoverable input or create misleading duplicate success.
- [ ] Switching sprint/project and receiving another session's updates do not leave the wrong retrospective on screen.
- [ ] Verify the workflow with keyboard/focus and representative narrow/wide layouts; preserve the existing visual direction.

## 13: Reduce unnecessary initial and editor code loading

**What to build:** Initial entry and navigation avoid loading unnecessary heavy routes/editors up front while preserving a smooth session and usable loading/error feedback.

**Blocked by:** 08: Refactored ticket/task editing. Session/navigation compatibility is already a transitive prerequisite.

- [ ] Capture comparable production-build and browser-network measurements before changing loading boundaries.
- [ ] Introduce only justified route/optional-surface boundaries; the selected slice demonstrates a measured initial-load improvement rather than a new chunk count alone.
- [ ] First navigation and opening the editor remain correct, with useful loading/failure/retry behavior and preserved form/session state.
- [ ] Real-time subscriptions and subsequent data refresh still work across mounting/unmounting and navigation.
- [ ] Record before/after revision, environment and results; no arbitrary size target, missing feature data or unmeasured performance claim.

## 14: Reduce unnecessary project read payloads and query work

**What to build:** The project list/detail path loads the data its actual consumers need with less unnecessary transfer/query work and unchanged visible behavior.

**Blocked by:** 07: Coherent project loading and selection.

- [ ] Measure representative list/detail payloads, requests and query work before optimizing; distinguish provider wake-up from application cost.
- [ ] Map consumers before changing a projection/response, and migrate real callers/tests in the same compatible slice.
- [ ] Preserve project summaries, hierarchy/sprint requirements, credential exclusion and HTTP/socket contracts used by the affected views.
- [ ] Verify populated, empty and failed/read-retry paths and correct data after relevant mutations.
- [ ] Demonstrate a comparable measured improvement and record the trade-off; do not introduce a general API redesign or silently remove fields a current consumer uses.

## 15: Make bulk ticket operations and their diagnostics predictable

**What to build:** Existing bulk ticket changes validate the intended records and expose actionable, safe failures without implying a partial failed operation succeeded.

**Blocked by:** 08: Reliable ticket-editing contracts and mutation coordination.

- [ ] Characterize the real bulk operation and its UI consumers, including supported input sizes and ordinary planning usage.
- [ ] Verify invalid identifiers, missing/foreign-parent records, malformed requests and failure behavior at the HTTP/persistence boundary.
- [ ] Keep dependent writes/events coordinated so clients observe the intended confirmed outcome; preserve the existing valid workflow.
- [ ] UI pending/error/recovery behavior and logs distinguish validation, missing data and server/connectivity failures without leaking credentials or raw connection strings.
- [ ] Review expensive/unbounded behavior and record evidence-based safeguard dispositions. A materially new visitor budget or access policy is a separate concrete proposal, not an invented threshold.
- [ ] No load test, cleanup or destructive fixture runs against the public demo.

## 16: Verify product finish in CI and the cloud, then hand off presentation

**What to build:** The refactored product is demonstrably ready for the saved recruiter-presentation phase, with a bounded quality report and a working public demo.

**Blocked by:** 02, 03, 04, 05, 09, 10, 11, 12, 13, 14 and 15. Tickets 01, 06, 07 and 08 are transitively covered.

- [ ] Run the retained meaningful test baseline and CI gates on the integrated revision, without hidden skips or scaffold-only assurances.
- [ ] Recheck a clean contributor start and the selected complete browser journey across entry, project views, hierarchy/backlog, ticket/task edits, sprint/goals, team/capacity, retrospective and existing relevant settings.
- [ ] Verify key keyboard/focus, narrow/wide layouts, empty/error/retry, pending and session/reload paths; make bounded acceptance fixes and record broader new scope separately.
- [ ] Remove compatibility helpers/exports only when all real consumers have migrated; no unused abstraction or obsolete account path is left solely by the transition.
- [ ] Publish through the existing providers and run bounded cloud HTTP/browser/WebSocket checks, including the trailing-slash proxy regression; preserve public/old data and free-hosting boundaries.
- [ ] Record performance evidence, advisory dispositions, any unexercised inactivity scenario and unresolved limitations honestly.
- [ ] Reconcile the saved README/video plan with the verified application revision. No final presentation media are produced in this ticket.

## Dependency frontier and scope coverage

- Initially: 01.
- After 01: 02, 03, 04, 05 and 06 can progress independently.
- After 06: 07; after 07: 08, 09, 10, 11, 12 and 14.
- After 08: 13 and 15.
- After the listed independent branches finish: 16.
- CI is enabled early but is not an artificial prerequisite for every independent code slice; each slice still runs the meaningful checks established in 01.
- Dependency changes use the behavior baseline, but their assessment can begin before 01 completes. Feature slices do not wait for unrelated advisories or performance work unless actual findings introduce a documented blocking edge.
- The compatible request boundary is established in a real session flow before workflow migrations; untouched consumers keep working. Final contraction happens only after consumer migration, not via a codebase-wide breaking edit.
- No wide mechanical refactor is currently justified by evidence. If one becomes necessary, propose an expand–migrate–contract breakdown instead of fitting it into a misleading feature ticket.

## Review requested

Confirm whether these 16 context-sized tickets have appropriate granularity, whether each blocker is a genuine prerequisite, and whether any tickets should be merged or split. Only after approval will each ticket be published as its own ready-for-agent issue; the source spec stays unchanged.
