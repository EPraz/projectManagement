# Product quality and code refactor before portfolio presentation

Status: ready-for-agent

## Problem Statement

The owner has built and published an original full-stack project and wants a dependable, well-finished product before preparing its recruiter README and walkthrough. The application already supports Acceso demo with populated Datos demo, but structural cleanup, correctness, testing, error recovery and delivery quality remain uneven.

Confirmed issues include project summaries counting the wrong completed-ticket state, task dragging submitting a hardcoded attribution identity, obsolete personal-account code and a broken legacy backend scaffold test suite. Large frontend surfaces combine several responsibilities, repeated request/state handling obscures failures, the initial bundle is substantial, and project reads return broad nested data. These are starting points for focused inspection and improvement, not grounds for rewriting every module.

The owner needs a persistent, bounded refactor plan that preserves working product behavior, keeps the public demo usable, distinguishes demonstrated defects from improvement hypotheses and provides trustworthy evidence that the finished application is ready for presentation.

## Solution

Complete a product-quality phase before final README, screenshots or video. Establish reliable behavior checks, correct confirmed defects, refactor the existing frontend/backend along observed responsibility boundaries, remove unused paths, improve user feedback and measured loading costs, evaluate dependency/demo-protection concerns and introduce reproducible local and CI checks.

Keep the current React/Vite frontend, modular NestJS API, Prisma/PostgreSQL persistence and free Vercel/Render/Neon deployment. Work in independently verifiable slices: establish the relevant behavior, make a bounded change and re-run the same checks. Preserve existing records and the shared Usuario demo model. Resume the separately agreed recruiter presentation only after the quality-phase acceptance evidence is recorded.

## User Stories

1. As the owner, I want the working application improved before recording, so that presentation materials reflect a dependable product.
2. As a demo visitor, I want Acceso demo to remain available without personal registration, so that I can explore immediately.
3. As a demo visitor, I want projects and Datos demo to remain populated through refactors and deployments, so that I can inspect meaningful workflows.
4. As a demo visitor, I want project progress to reflect actual completed tickets, so that summaries are trustworthy.
5. As a demo visitor, I want grid and list progress to agree for the same project, so that presentation choice does not change the result.
6. As a demo visitor, I want empty and fully completed projects to have valid progress values, so that edge cases remain understandable.
7. As a demo visitor, I want project-wide and selected-sprint metrics to retain their distinct scopes, so that their different percentages remain meaningful.
8. As a demo visitor, I want task changes attributed to the authenticated Usuario demo rather than an unrelated hardcoded identity, so that change metadata is consistent.
9. As a demo visitor, I want a failed task movement to leave recoverable, accurate state, so that the board does not imply an unsaved change succeeded.
10. As a demo visitor, I want ticket requirements, estimates, assignment and state changes to survive frontend cleanup, so that the existing workflow remains complete.
11. As a demo visitor, I want hierarchy and backlog views to stay connected to the right project, so that planning remains coherent.
12. As a demo visitor, I want sprint selection, capacity and goals to remain consistent across navigation and edits, so that I can plan without contradictory state.
13. As a demo visitor, I want team and retrospective workflows to remain usable, so that the product retains its breadth.
14. As a demo visitor, I want another session to receive confirmed changes without reloading, so that collaboration remains real-time.
15. As a demo visitor, I want project changes and socket events to affect the appropriate current view, so that unrelated updates do not replace my workspace.
16. As a demo visitor, I want reload, session refresh and logout to work predictably, so that navigation does not lose or confuse my session.
17. As a demo visitor, I want a loading failure distinguished from an empty collection, so that an unavailable API is not presented as missing data.
18. As a demo visitor, I want visible errors and a useful retry path, so that a transient failure does not require guessing or restarting the app.
19. As a demo visitor, I want pending submissions guarded and unsaved input retained on failures, so that retries do not create duplicates or erase my work.
20. As a demo visitor, I want stable content preserved during background refresh, so that an existing view does not unnecessarily disappear.
21. As a keyboard or smaller-screen user, I want the primary controls and feedback reachable, so that the core workflows remain usable across supported layouts.
22. As a demo visitor, I want shared editing and hosting wake-up limitations represented honestly, so that normal demo behavior is understandable.
23. As a developer, I want focused frontend components, hooks and state boundaries, so that changes can be made without understanding an entire large screen at once.
24. As a developer, I want consistent API/session/error handling, so that the same network condition does not require separate fixes in many hooks.
25. As a developer, I want unused personal-login and registration code removed together with obsolete consumers, so that the code reflects the shipped demo product.
26. As a developer, I want backend request validation, response contracts and error mapping to be clear, so that the frontend receives predictable outcomes.
27. As a developer, I want persistence and socket changes coordinated, so that clients observe confirmed state rather than misleading partial results.
28. As a technical reviewer, I want sensitive credential fields excluded from both HTTP and socket payloads, so that cleanup does not weaken an existing boundary.
29. As a developer, I want meaningful tests replacing misleading scaffold checks, so that a green test command indicates behavior rather than merely mocked construction.
30. As a developer, I want repeatable build, type, lint and test gates, so that regressions are caught before publication.
31. As the owner, I want dependency findings classified and addressed proportionately, so that applicable risks receive attention without an uncontrolled upgrade project.
32. As the owner, I want the public demo's expensive or excessive operations reviewed, so that useful access is preserved within the existing free-hosting model.
33. As a visitor, I want less unnecessary initial code and data loading, so that the application responds more promptly without losing required information.
34. As a developer, I want measurements before and after performance changes, so that optimization is justified by evidence.
35. As a new contributor, I want a fresh local setup with actionable environment/port/database errors, so that I can run the project without the owner's private files.
36. As the owner, I want safe diagnostic information, so that failures can be distinguished without logging credentials or private connection strings.
37. As the owner, I want tests and cleanup confined to isolated local/CI databases, so that public visitor work and older data remain intact.
38. As the owner, I want explicit completion criteria and remaining findings, so that the refactor has an end and the README/video phase can resume.
39. As a future agent or collaborator, I want decisions, dependencies and verification evidence recorded, so that work can continue across sessions.

## Implementation Decisions

### Scope and sequencing

- This is the quality/refactor phase preceding presentation. Preserve the approved English recruiter README, captions, original-authorship statement, local-recording approach and approximately 3:30 walkthrough scope for the later phase; do not produce final media now.
- Use the existing improvement backlog as the inventory, then implement bounded vertical slices. Structural changes preserve intended behavior; each confirmed bug is an explicit behavior correction with a regression.
- Begin by establishing reproducible current checks and characterizing the workflows affected by each slice. Repair shared test/configuration problems before using that test baseline as evidence for wider cleanup.
- Inspect module responsibilities, coupling, duplication and consumers before extracting code. File length alone is not a reason to split code, and introducing a new abstraction is justified only by a clearer interface or removed duplication.
- Keep independently useful changes reviewable. If a mechanical change cannot land incrementally, use a compatible transition rather than breaking every consumer at once.

### Correctness and state

- Fix project completion semantics using actual ticket states. Tickets use COMPLETED while task completion can use DONE; do not globally rename stored statuses or hardcode a percentage. The unchanged initial Datos demo yield approximately 33% project completion from six of eighteen tickets.
- Keep project metrics and selected-sprint metrics separate. Preserve correct handling of zero tickets, missing/non-completed statuses, partial completion and all-completed work.
- Remove the hardcoded task-update actor. Use the authenticated Usuario demo through the existing update flow and distinguish actor metadata from an assigned team member. Do not claim that a shared identity identifies an individual visitor.
- Verify movement success/failure, repeated submissions, cancellation and server responses before changing optimistic state. The view must reconcile to confirmed data after a failure or a socket update.
- Keep project/sprint selection, fetched data and socket subscriptions aligned. Clean up listeners and stale requests on navigation; do not apply a different project's update to the current workspace.

### Frontend refactor and feedback

- Review the ticket editor, layout/navigation, hierarchy view, dialogs and retrospective container for separable responsibilities. Extract cohesive presentation, form/domain transformation and data/state behavior where the inspection demonstrates a useful boundary.
- Consolidate repeated request/session/error patterns at existing public hooks or a small shared client boundary. Preserve same-origin API requests, cookie credentials, authentication semantics and the separate direct socket origin.
- Make hook/context dependencies and cancellation reflect the values they actually use. Avoid hidden routing-state dependencies, duplicate fetch/subscription effects and unnecessary mirror state when a single source of truth is sufficient.
- Remove unrouted personal-login/registration screens and their unused exports/context methods together, after checking consumers. Preserve legacy URL redirects to Acceso demo and do not remove JWT/session dependencies that are still required.
- Distinguish loading, empty, failed and refreshing states in active workflows. A parse/network/backend failure must not silently become an empty successful collection. Provide actionable feedback and retry; preserve existing content and form data when appropriate.
- Guard pending mutations against accidental duplicates. Use the application's existing feedback patterns; keep persistent failures visible near the affected content rather than relying solely on an expiring toast.
- Preserve the visual direction and responsive behavior. Fix demonstrated keyboard, focus, label, overflow or feedback-access problems in the affected workflows without a visual redesign.

### Backend and contracts

- Keep the NestJS modular backend, existing Prisma persistence and current domain boundaries. Do not add repository/service layers merely to satisfy a generic pattern.
- Review controllers, services, validation and shared error helpers at the boundaries touched by the selected slices. Keep request parsing/validation explicit, business coordination cohesive and known domain/database errors mapped deliberately.
- Check malformed identifiers, missing records, parent-child associations and failed mutations at the HTTP boundary. Improve consistency without flattening meaningful HTTP statuses or exposing raw exceptions.
- Keep response contracts and credential filtering explicit for HTTP and WebSocket consumers. Any response/query projection change must migrate its real consumers and verify the resulting screens/events in the same slice.
- Review transaction and event timing where a workflow performs multiple dependent writes. Emit the intended confirmed state and avoid a success response/event for a partial failed operation.
- Preserve demo-only authorization boundaries. Do not add personal accounts, tenant isolation, role selection or a new RBAC model as part of cleanup.

### Reliability, dependencies and operational quality

- Establish a trustworthy canonical backend test baseline. Repair alias/provider/configuration problems and replace obsolete construction/Hello World scaffolding with relevant behavior coverage. Do not hide failures by broad skips, empty tests, blanket mocks or excluding active application code.
- Retain useful frontend tests and the separate API/seed integration coverage. Tests requiring destructive cleanup may target only a verified isolated local/CI database; they must reject Neon and other shared destinations.
- Add CI using Node 22, lockfile installs, Prisma generation/validation and ephemeral PostgreSQL where required. Include non-mutating lint, types/builds and reliable tests; never use production environment files, secrets or data for CI.
- Recheck the observed dependency advisories at the current revision. Classify affected usage, runtime versus development/build dependencies, compatible remedies and uncertainty; remove unused dependencies only after checking actual imports/build behavior.
- Apply justified compatible remediation with relevant regressions. Do not run forced blanket audit fixes or silently expand into major framework/ORM migrations; a necessary incompatible migration becomes a separately evidenced scope decision.
- Review existing demo operations for unreasonable request sizes, expensive unbounded behavior and inconsistent validation. Preserve the complete normal demo journey. New visitor budgets, distributed throttling or materially different access policies require a concrete proposal instead of invented limits in this spec.
- Keep manual explicit demo restoration and preservation across deploys/restarts. Do not introduce automated reset, keepalive traffic, external anti-abuse infrastructure or paid services.
- Improve safe, useful error diagnostics at affected boundaries. Log actionable context without passwords, JWTs, refresh cookies, full database URLs or needless dump-all payloads.
- Make fresh local startup reproducible using existing environment examples and the single DATABASE_URL connection variable. Detect missing/invalid configuration and occupied ports with actionable messages; do not require a new setup framework or Docker.

### Measured performance and completion

- Record comparable production-build and representative request measurements before optimization: initial JavaScript/chunk loading, requests and payload sizes for project list/detail and key navigation. Distinguish provider cold starts from application work.
- Introduce route/optional-surface loading boundaries or query projections where measurements and consumer inspection show unnecessary work. Preserve loading feedback, session continuity, validation and real-time updates.
- Require documented before/after evidence for each performance change; avoid arbitrary targets inferred from the earlier approximate 1.6 MB bundle. The selected optimization slice must demonstrate an actual improvement without missing UI data or a regression in its tested journey.
- Completion requires corrected confirmed defects, a trustworthy passing retained test/check baseline and CI, completed bounded structural slices with behavior evidence, working core UI/error/recovery paths, dependency dispositions, reproducible setup and post-deploy verification.
- Further cosmetic, speculative or newly discovered large improvements are recorded separately. Do not declare completion by silently dropping an agreed acceptance item; do not let unrelated cleanup prevent a reviewed quality-phase finish.
- After the quality work is verified in the cloud, reconcile and resume the saved presentation plan using the resulting application revision.

## Testing Decisions

Boundaries explicitly approved by the owner for this expanded phase:

- **Primary boundary — real user workflows:** drive the application through Acceso demo, project grid/list, reload/session, hierarchy/backlog, board/ticket/task changes, sprint selection, capacity/goals, team and retrospective. Use actual browser behavior to verify visible data, error/empty distinctions, retry, pending states, keyboard access and selected viewport layouts. A successful HTTP response alone is not proof that the UI renders the result.
- **Backend complement — HTTP/WebSocket with isolated PostgreSQL:** extend the existing Nest/Supertest API/seed boundary for changed validation, CRUD relationships, error statuses, credential filtering, independent sessions and persisted changes/events. Verify a second real client receives the relevant confirmed update; test duplicates/failure cases as the touched workflow requires. Keep cleanup local/ephemeral and never aim this suite at the public demo.
- **Focused regression complement — existing domain/interaction boundaries:** cover project progress with actual ticket-state values and task movement with the authenticated actor plus success/failure results. Prefer real input/output or rendered consumers; do not assert internal hook composition, private methods, arbitrary file size or a mocked copy of the implementation.
- Prefer existing Jest/Testing Library, Nest/Supertest, deployment HTTP probes and real-Chrome reproduction patterns. Introduce only the minimum shared browser/test infrastructure needed to make the verified journeys reproducible across sessions and CI.
- Write a regression before correcting a demonstrated defect. Capture relevant intended behavior before risky structural changes, then re-run the same boundary after the change. A refactor should not require rewriting assertions simply because functions/files moved.
- Repair meaningful test configuration and obsolete scaffolding rather than manufacturing green construction tests. Record the original backend failures as a baseline and require the retained active suite to pass before treating it as a CI gate.
- Run non-mutating lint, types, builds, schema validation and the relevant reliable tests as delivery checks. Validate lockfile/setup changes with an isolated clean-start scenario and checked-in migrations.
- Use bounded browser and HTTP smoke checks after deployment, including the API proxy with/without trailing slash, direct/deep-link navigation, session refresh, populated views and WebSocket delivery. Do not perform destructive fixtures, blanket cleanup or load tests against Neon/public hosting.
- Keep viewport, keyboard, recovery and performance evidence tied to the inspected revision/environment. Inspect the produced UI and request outcomes, and report any unexercised provider-inactivity scenario rather than claiming it passed.

## Out of Scope

- Final recruiter README rewrite, screenshots, walkthrough recording/editing and transcript production during this quality phase.
- Replacing React, NestJS, Prisma, PostgreSQL or the current frontend/backend deployment arrangement; a broad architectural rewrite or automatic major-version migration.
- New business features, personal-account support, per-visitor data isolation, tenant/account models, newly promised RBAC or commercial-grade abuse infrastructure.
- A full redesign, exhaustive accessibility/security certification, arbitrary coverage/file-size targets or a claim that zero audit entries proves security.
- Automatic resets, old-data import, destructive shared-database tests, cleanup of unrelated resources, keepalive jobs or added hosting cost.
- An unlimited rewrite of every file or speculative abstraction without a demonstrated maintenance, correctness or performance benefit.

## Further Notes

- The owner explicitly changed priority after approving the presentation proposal: improve/refactor the product first, then verify it in the cloud, then return to the English README and silent approximately 3:30 walkthrough. The earlier six presentation tickets do not define this expanded quality-phase breakdown.
- This spec synthesizes the existing backlog and that priority change. It does not claim every candidate is already a reproduced defect. Implementation tickets should make each investigation/change finite and independently verifiable.
- Prior recorded baselines include 57 frontend tests, 8 API/seed integration tests and 25 failing legacy backend scaffold suites; these are historical observations to recheck, not a claim that checks were rerun while writing this spec.
- Prior dependency observation: 9 high and 4 moderate frontend production advisories. Current applicability and remediation are implementation-time evidence, not fixed conclusions.
- Initial source orientation found a large ticket editor, layout and hierarchy screen; backend services are comparatively smaller. Refactor by responsibilities and real dependencies, not by a uniform line-count rule.
- Existing ADR decisions remain in force: free provider domains/plans, one shared Usuario demo, no personal accounts, explicit manual restoration and preservation of data on deployment.
- No product code, dependencies, database contents or cloud resources are changed by publishing this spec. Implementation decomposition belongs to the subsequent to-tickets step.

## Comments

2026-10-17: Owner invoked to-spec for the refactor-first phase and explicitly confirmed the proposed real-browser, isolated HTTP/WebSocket and focused regression boundaries ("Sí, validar así"). Published to the configured local tracker with ready-for-agent status. No implementation tickets or product changes are included in this step.
