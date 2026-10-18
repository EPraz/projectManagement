# Product redesign C: effort map

Status: ready-for-agent

## Notes

- Owner explicitly requests a complete visual redesign before README/walkthrough: mobile first, new palette, typography, sizing and component treatment; page organization may change where useful.
- Owner identifies these as original design limitations, not regressions caused by the completed quality/refactor phase. Keep that distinction in the presentation narrative.
- The 16 quality tickets remain resolved. Functional regressions and clean CI/browser infrastructure are the baseline to preserve during design work; passing those checks does not establish visual quality.
- Existing shared demo, English product/recruiter content, original personal authorship, free Vercel/Render/Neon, data preservation and manual restore remain in force. No schema/backend rewrite is requested by this interview.
- README/video presentation now follows the redesign. The explicit owner design/readiness checkpoint before recording remains required.
- Read-only baseline captured on the public app: projects, overview, board and ticket editor at 375, 768 and 1280 CSS pixels. No business record was edited; no video/trace was captured. See [visual audit](../../.design/product-redesign/DESIGN_REVIEW.md).

## Decisions so far

- Confirmed by owner: mobile-first is required; visual language can change completely. Round 1 confirms structural freedom to regroup pages/navigation while preserving the existing functionality.
- Round 1 Q1 accepted: Industrial Carbon & Azure is the selected visual direction. Charcoal & Amethyst Dusk is retained only as a discarded exploration, not a second theme identity.
- [Side-by-side color exploration](../../.design/product-redesign/palette-options.svg) uses the same sample work item for both directions; it is not a product prototype or final layout.
- Round 1 Q2 accepted: complete light and dark themes, system preference initially and remembered manual choice. Owner asks whether dark uses a different palette; answer: one Carbon & Azure family, with theme-specific neutral, foreground, accent and semantic values rather than automatic inversion. Exact colors remain proposals until checked in real surfaces.
- Round 1 Q3 accepted: navigation and page organization can change, preserving capabilities.
- Round 1 Q4 accepted: the complete working journey must remain available on mobile, including creation, editing and planning, with device-appropriate presentation.
- Keep brand/accent colors distinct from status/error/warning/success and chart semantics. Color must not become the sole explanation of state.
- Round 2 Q5 accepted: one project navigation, desktop sidebar and compact mobile header with section menu; remove duplicated project navigation and the permanent mobile sidebar.
- Round 2 Q6 accepted: mobile tickets grouped by their own state; opening a ticket exposes its tasks and their own states. Preserve the ticket/task distinction and all operations.
- Round 2 Q7 accepted: full-screen editing on mobile and a wide contextual side panel on desktop, preserving return context, recoverable drafts and findable actions.
- Round 2 Q8 accepted: IBM Plex Sans, 16px primary mobile text, 14px secondary information, 24px mobile page headings and 28–32px desktop page headings; comfortable mobile controls and compact readable desktop density. Exact token mapping remains a design task.
- Round 2 Q9 accepted: keep Overview as the inside-project entry, prioritizing selected sprint, progress, blockers, deadlines and actions; descriptive project metadata follows lower down.
- Round 3 Q10 accepted: Overview; Work (Board, Backlog, Epics & Features); Planning (Goals, Capacity); Team; Retrospective, with shared sprint context where appropriate.
- Round 3 Q11 corrected by owner: preserve the Azure DevOps-style sprint Taskboard: one row per ticket, columns for task states. The proposed Trello-like ticket-card board was rejected. Rebuild visual density, spacing, row/card treatment and responsive presentation around this relationship; do not convert desktop into ticket-status columns.
- The prior accepted mobile ticket list/task drill-in remains in force; Q11 corrects the desktop proposal, not Q6. Round 4 confirms tablet adaptation by useful available width; final transitions will be validated in visual proposals.
- Round 3 Q12 accepted: visible search/status/assignee, identifiable selected sprint, secondary filters in a panel and preserved navigation context.
- Round 3 Q13 accepted: explicit Save/Cancel, reachable action bar, unsaved-change warning and secondary confirmed deletion.
- Round 3 Q14 accepted: sober industrial treatment, fine borders, moderate 6–8px base corners, differentiated surfaces, restrained shadows, brief feedback motion and reduced-motion support.
- Round 3 Q15 accepted: remove nonfunctional Settings/navigation placeholders from primary navigation; useful demo information and theme preference belong in the user menu.
- Round 3 Q16 accepted: verify and correct misleading inferred activity labels, hardcoded capacity activity and inconsistent/truncated blocker counts, using existing data and clear scope. No audit-history feature or invented records are authorized by this.
- Round 4 Q17 accepted: sticky desktop ticket column/task-state headers; content-sized collapsible rows, initially expanded; local board horizontal scrolling.
- Round 4 Q18 accepted: preserve the matrix wherever available width is useful, otherwise use the accepted narrow ticket-list/task-drill-in presentation; verify tablet portrait/landscape in actual designs.
- Round 4 Q19 accepted: desktop task drag and an explicit Change status action for touch/keyboard, keeping the task within its parent ticket. No task reparenting/reordering or newly enabled ticket ordering.
- Round 4 Q20 accepted: ticket summary prioritizes title, own state, assignee and completed/total tasks; task card prioritizes title, assignee and remaining hours when present; secondary metadata remains available in the editor.
- Round 5 Q21 accepted: keep project progress separate from selected-sprint indicators; a ticket is blocked when its flag or own state indicates blockage, counted once; calculate totals before preview limits; label timestamp-backed updates honestly; separate overdue/upcoming unfinished tickets.
- Round 5 Q22 accepted: project cards prioritize title, concise description, real progress and relevant counts; search/create/entry remain findable and low-priority metadata follows secondary reading order.
- Round 5 Q23 accepted: wide collapsible hierarchy and narrow level-by-level navigation with parent context; desktop backlog table and mobile list, preserving filters and operations.
- Round 5 Q24 accepted: goals with checklists, per-member capacity table/wide and expandable cards/narrow, searchable team membership using existing catalog. Retain real fields/actions, not hardcoded fictitious activity.
- Round 5 Q25 accepted: retrospective category columns on wide screens and Positive/Negative/Improvements category selector plus card list on mobile, preserving sprint context, editing and reactions.
- Round 5 Q26 accepted: review representative Projects, Overview, Taskboard and editor proposals in both themes and representative sizes before implementing. Close shared understanding, validate proposals, then consolidate spec/tickets/implementation; this is separate from the final pre-video checkpoint.
- Round 6 Q27 accepted: Details / Planning / Tasks / Additional info preserve all fields, with one editor surface at a time, task-to-parent return context and unsaved-change protection.
- Round 6 Q28 accepted: Taskboard assignee filters target tasks while preserving the parent ticket row; Backlog assignee filters target tickets. Distinguish ticket state from task state in labels and results.
- Round 6 Q29 corrected by owner: Backlog shows only the project's tickets belonging to the selected sprint. Reject the proposed whole-project default and extra whole-project/unplanned scope choices; retain the shared selected-sprint context.
- Round 6 Q30 accepted: validate both themes across mobile/tablet/desktop, contrast, keyboard, focus, zoom, touch and reduced motion, plus loading/empty/error/pending states and existing functional regressions.
- Round 6 Q31 accepted: keep the current public demo available while building and validating the redesign separately; publish the complete verified redesign preserving public data and free infrastructure, then prepare README/walkthrough after final design approval.
- The durable Taskboard-versus-ticket-Kanban trade-off is recorded in [ADR 0002](../../docs/adr/0002-taskboard-por-ticket-y-presentacion-adaptada.md). Palette/font tokens remain reversible design documentation, not ADRs or glossary definitions.

## Design tree / current frontier

Round 1 settled: Q1 Carbon & Azure; Q2 both themes/system/remembered preference; Q3 structural freedom; Q4 complete mobile functionality.

Round 2 settled:

5. Navigation: one project navigation, desktop sidebar and compact mobile header with section menu, replacing duplicate navigation and permanent mobile sidebar.
6. Mobile work presentation: usable ticket list/grouping with task drill-in rather than shrinking the desktop ticket/task matrix; preserve ticket-versus-task distinction and operations.
7. Editing: full-screen mobile editing and a contextual desktop side panel, preserving draft/error/return context.
8. Typography/density: IBM Plex Sans, readable 16px primary mobile text / 14px secondary / 24px mobile headings and 28–32px desktop headings, with deliberate comfortable mobile and compact readable desktop density.
9. Inside-project default: retain Overview as an operational entry prioritizing selected sprint, summary, blockers/deadlines and next actions; move descriptive project metadata lower.

Round 3 settled:

10. Destination grouping: Overview; Work (Board, Backlog, Epics & Features); Planning (Goals, Capacity); Team; Retrospective. Keep sprint selection as shared context rather than inventing a new sprint-management capability.
11. Desktop board model: owner rejects ticket cards grouped by ticket state. Preserve ticket rows / task-state columns, in the style of Azure DevOps sprint Taskboard. Changes to dragging/order are not implied.
12. Filters: prominent search/status/assignee, visible selected sprint, with secondary filters in a compact panel; preserve project-scoped context while navigating.
13. Editing outcomes: explicit Save/Cancel, reachable action bar, unsaved-change warning and secondary confirmed deletion rather than silently introducing autosave.
14. Visual treatment: precise industrial surfaces, fine borders, moderate 6–8px corners, restrained elevation and brief purposeful motion; preserve reduced-motion support.
15. Unavailable destinations: remove nonfunctional Settings/navigation placeholders from primary navigation; retain useful shared-demo information/theme preference under the user menu, without creating personal account features.
16. Truthful display scope: verify and correct misleading inferred activity labels, hardcoded capacity activity and inconsistent/truncated blocker counts using existing data, without adding an audit-history feature or inventing records.

Round 4 settled:

17. Desktop readability: sticky ticket column and task-state headers, content-sized collapsible rows, concise card metadata and work-area-only horizontal scrolling.
18. Tablet/mobile transition: preserve the matrix where available width is useful; use the already approved ticket list/task drill-in on narrow layouts. Validate transition with prototypes rather than device names alone.
19. Task movement: retain desktop task drag between states, add a clear Change status alternative for touch/keyboard; keep tasks in their current parent and do not silently add reordering/reparenting.
20. Information priorities: ticket row summary shows title/own status/assignee and task completion count; task cards show title/assignee/remaining hours where present, with secondary metadata in the editor.

Round 5 settled:

21. Overview truth and scope: separate project progress from selected-sprint indicators; count each ticket as blocked once when its flag or ticket state indicates blockage, count before preview limits; label timestamp-based project updates honestly; show overdue and upcoming unfinished tickets distinctly.
22. Project entry: responsive project cards prioritize title, concise description, real progress and counts, with immediate project entry/create/search; move low-priority audit metadata out of the card's primary reading order.
23. Hierarchy/backlog: collapsible epic/feature/ticket hierarchy on wide screens and level-by-level navigation with visible parent context on narrow screens; readable desktop backlog table and mobile work-item list, preserving existing edits/relations/filters.
24. Planning/team: goal cards with checklists; member capacity table on wide screens and expandable per-member cards on mobile; team membership as a searchable member list using the existing catalog. Retain existing fields/actions/calculations, do not introduce account/role-management features.
25. Retrospective: categories remain visible as columns on wide screens, mobile uses Positive/Negative/Improvements category selection and a readable card list; retain sprint scope, reactions, editing and honest name-hide/blur display behavior.
26. Visual validation checkpoint: after shared understanding, review representative Projects/Overview/Taskboard/editor proposals in light/dark and mobile/tablet/desktop before implementing/publishing the redesign; document agreed scope through spec/tickets.

Round 6 settled:

27. Detail flow: Details / Planning / Tasks / Additional info, preserving all existing fields; one editor surface at a time, returning from a task to its parent ticket/context and warning before abandoning dirty input.
28. Explicit filtering scope: taskboard assignee filters target tasks while preserving their parent row; backlog assignee filters target tickets; distinguish ticket state from task state in labels and results.
29. Backlog scope, corrected by owner: only the project's tickets in the selected sprint, retaining the shared sprint selection. Do not add whole-project or unplanned scope choices.
30. Acceptance: concrete contrast/keyboard/focus/reduced-motion/touch/zoom checks, representative 320–390px mobile, 768/1024 tablet and 1280/1440 desktop views, both themes and key loading/empty/error/pending states; retain meaningful functional regressions. These are targeted checks, not a certification claim.
31. Rollout: preserve the currently published demo while developing/validating the complete redesign in isolation, then publish the coherent verified design preserving public data and existing free resources; README/walkthrough follow the final approved design.

## Additional source findings for upcoming layout decisions

- Shared selected-sprint context already drives board/backlog, goals, capacity and retrospective. Hierarchy and team membership are project-wide; their presentation must not imply the same sprint scope.
- Current task drag changes task status only; it does not reparent or reorder. Ticket ordering remains disabled. A different desktop board representation must explicitly preserve existing task operations and must not silently enable ticket ordering.
- Recent Activity reconstructs entries from current timestamps and can infer assignment/status verbs from an unrelated update (`RecentActivity.helpers.ts:65,130`); it is not an audit history.
- Capacity's Activity cell always says Development (`CapacityBoardTable.tsx:119`), not a stored member activity.
- Overview's blocked KPI uses ticket status, while the blocker widget uses isBlocked and limits the collection before announcing a count (`DashBoard.tsx:165`, `BlockersAndImpediments.tsx:16,32`). Upcoming deadlines exclude overdue work. The displayed Sprint Goal currently uses the sprint name (`SprintGoalsAndMilestones.tsx:15`). These are static findings to verify and define before changing behavior, not newly passed regression tests.
- Team operates on existing catalog membership, not account creation or role editing. Retrospective name hiding/blur are display preferences, not anonymity guarantees.

## Shared-understanding checkpoint

- All interview questions Q1–Q31 are answered. Q11 preserves ticket rows/task-state columns; Q29 limits Backlog to the selected sprint. No unanswered product decision remains in the current interview frontier.
- Owner confirmed the consolidated shared understanding on 2026-10-17. Interview is closed; representative visual proposals are now authorized. Unseen layouts still require the agreed visual review before spec/tickets/implementation.
- Visual direction: Industrial Carbon & Azure, full light/dark themes and IBM Plex Sans, with complete mobile functionality and device-appropriate density/layouts.
- Product structure: one navigation; Overview, Work, Planning, Team and Retrospective. Preserve existing capabilities and fields; Board and Backlog use the selected sprint, while project-wide areas retain their actual scope.
- Working model: wide Taskboard matrix of ticket rows/task-state columns, narrow ticket list/task drill-in, separate ticket/task states, desktop task drag and an explicit status action for touch/keyboard.
- Editing and information: contextual desktop/full-screen mobile editor, preserved return context and drafts, explicit save/cancel, confirmed deletion, truthful scoped indicators and timestamp-backed updates.
- Delivery: representative Projects/Overview/Taskboard/editor visual proposals in both themes and mobile/tablet/desktop → owner visual review → consolidated spec → tickets → implementation and validation → complete publication. Keep public demo/data/free resources during development.
- Final README and silent walkthrough follow the redesign. Explicit owner design/readiness approval before recording is still mandatory.
- Exact reversible color/spacing tokens are design work within the accepted direction, validated in visual proposals rather than a new questionnaire for every value.
- Additional source discovery for hierarchy/backlog/planning/team/retro is complete; preserve the recorded real capabilities and scope distinctions in the proposals/spec.

## Comments

- 2026-10-17: Owner accepts Q27/Q28/Q30/Q31 and corrects Q29 to selected-sprint-only Backlog. Recorded all answers and prepared the shared-understanding checkpoint; no product UI changes or publication performed.
- 2026-10-17: Owner explicitly confirms shared understanding. Preparing an isolated visual prototype and design brief; no production UI changes. Next checkpoint: owner review of the actual visual proposals.
- 2026-10-18: [Design brief](../../.design/product-redesign/DESIGN_BRIEF.md) and [visual proposal handoff](../../.design/product-redesign/PROPOSAL_REVIEW.md) prepared. Isolated interactive HTML compares Projects/Overview compositions A and B and shares the accepted Taskboard/editor model. Fictional in-memory data only; no live mutations. Captured 36 theme/device proposals, checked additional widths and 24 selected contrast pairs, and verified core preview interactions. Await owner visual feedback/selection before spec/tickets/implementation. No recording.
- 2026-10-18: Owner rejects both the dark treatment and overall first-proposal direction: generic, missing the original design's intended personal/innovative character. Withdraw A recommendation; A/B are history, not approved directions. Revisited original desktop Projects/Overview/Taskboard captures: floating rounded dark navigation rail, mixed-size modules, distinct icon/color accents, chart and layered cards are observable reference ingredients, not yet owner-selected elements to retain. Reopen aesthetics, not the full functional interview. No production changes.
- 2026-10-18: Q32 accepted, Q33 clarified: evolve original identity; preserve liked light appearance, rebuild dark. Prepared [Overview exploration 02](../../.design/product-redesign/exploration-v2/REVIEW.md), with C Project studio, D Sprint panorama and E Delivery canvas. Shared light palette; different compositions and neutral/graphite/warm dark surfaces. 18 captures, extra width checks and 78 selected contrast-pair checks recorded; preview interactions pass, no page errors/width overflow in the measured journey. Await owner visual feedback; no production changes or recording.
- 2026-10-18: Owner explicitly chooses C / Project studio. Extended it to [Projects, Overview, Taskboard and ticket/task editing](../../.design/product-redesign/direction-c/REVIEW.md), retaining the selected identity and both themes. Concrete extended views now await feedback. 30 captures, extra widths, core preview journey and 22 selected token checks recorded. No production UI/deployment/data changes or recording.
- 2026-10-18: Captured the disposable source artifacts and owner's C verdict on local branch `prototype/product-redesign-project-studio-20261018`, commit `ada8ab271100fcfbd033b09a166aaedae93fe354`. Created with an isolated index; current `main`, HEAD and main staging index were preserved. No push/deployment. Retrieve prototype code/captures from that branch if they are later removed from the implementation checkout; keep only validated decisions/spec in production history.
- 2026-10-18: Owner accepts the extended C screens and invokes `$to-tickets`. Visual checkpoint is complete. Prepared [14 proposed vertical-slice tickets](tickets.proposed.md) from the accepted conversation/brief, with immediate blocking edges, complete acceptance criteria and per-slice validation. Includes all existing project/work/planning/team/retro capabilities, truthful Overview corrections, final integration and coherent cloud publication; excludes README/video work. Breakdown approval is still pending under the explicitly invoked to-tickets skill; no individual implementation issues have been published.
- 2026-10-18: Owner explicitly approves the 14-ticket breakdown and requests publication. Published one file per ticket under the local issues directory, with the approved criteria, immediate blocking edges, `Type: task`, `ready-for-agent` status and approval comments. [Approved ticket index](tickets.md) records the shared scope/completion contract and current frontier. All 14 are open/unclaimed; 0/14 resolved. No implementation or deployment performed in this publication turn.

## Reopened visual frontier

- Q32 accepted: use the original design as the identity reference and evolve its floating navigation, varied module hierarchy, layered surfaces and distinctive accents, retaining the agreed responsive/usability corrections.
- Q33 clarified by owner: the light palette/treatment was liked; the dark treatment was the main color concern. The attached screenshot is the rejected blue-gray dark Overview, not a new inspiration reference. Preserve the liked light palette as the color starting point while improving composition/personality. Keep dark mode and explore neutral carbon, clear surface separation and intentional accent use. This does not approve all of the original prototype's light layouts or reopen every functional decision.
- After clarification: explore genuinely different visual compositions on one populated Overview first; validate character before expanding another direction to all four representative screens. Do not simply recolor/rearrange A/B. Palette/font/layout aesthetics remain reviewable. Preserve ticket-row/task-state-column model, full mobile operations and the selected-sprint-only Backlog.
- Owner selected C / Project studio explicitly: “si, la C me gusta, me encanta, usaremos la C”. C is the visual reference going forward, including its light/neutral carbon themes, floating rail, project identity and mixed module hierarchy. D/E and earlier A/B remain exploration history.
- Representative-screen checkpoint completed: owner accepted [selected C extended preview](../../.design/product-redesign/direction-c/REVIEW.md). C and the agreed operating priorities remain the design reference. Areas without separate visual samples inherit that identity and the already accepted behavior; validate their real journeys during implementation.
- Breakdown approved and published: [14-ticket index](tickets.md). The archived [proposal](tickets.proposed.md) preserves what was reviewed; individual issue files are now the operational tracker. There is no pending design/breakdown approval.
- Current frontier: [01 — Enter the demo and use Projects in C](issues/01-demo-entry-projects.md). All tickets are `ready-for-agent`; blocker edges control claim eligibility. Nothing is claimed or resolved. After 01/02, work can continue through the numbered available frontier without intermediate owner review between implementation tickets.

## Resume

C / Project studio, extended representative screens and all 14 tickets are approved; publication is complete. Start a future implementation run from the ticket index and first open/unblocked/unclaimed issue (currently 01); follow local claim/resolve conventions and append real evidence as work proceeds. Preserve the approved brief, selected C light/neutral-carbon appearance, current quality guarantees, selected-sprint-only Backlog and full real status catalog/fields/capabilities. Keep staged implementation separate from the production deployment branch until the verified coherent release in 14. Prototype source/verdict/captures remain archived. The final pre-recording approval still applies; do not repeat completed design/breakdown approval, record a video early or reopen the 16 completed quality tickets.

## Implementation run

- 2026-10-18: Owner authorizes all 14 tickets without intermediate reviews unless a genuine owner decision is needed. Work branch: `feat/project-studio-redesign`; baseline `d355d98fe617a78680de0d2d334868b241832078`. Final code-review base confirmation requested asynchronously per skill. Ticket 01 claimed. Preserve public deployment until the verified complete release; no walkthrough recording.

- 2026-10-18 implementation: owner explicitly confirms `d355d98` as final code-review base. Ticket 01 resolved: C demo entry/Projects, real progress, system/manual themes, confirmed project deletion; 30 relevant browser checks, types and lint pass. Public deployment/data preserved. Ticket 02 claimed for the shared project navigation/sprint journey; final video-readiness checkpoint remains required.

- 2026-10-18 implementation: ticket 02 resolved. Single C navigation and shared sprint context, mobile drawer and useful demo/appearance menu; native production build plus 23 focused browser journeys and 20 component checks pass. Query-section planning cleanup preserves late-response isolation. Ticket 03 claimed; 2/14 resolved. Public release remains staged until 14.

- 2026-10-18 implementation: ticket 03 resolved. Real C Overview modules, OR blocker totals, unfinished overdue/upcoming deadlines and honest Recent updates; 35 relevant browser journeys, 11 calculation checks, types/lint/build pass. Captures retained under `frontend/.tmp/studio/overview/`. Ticket 04 claimed; 3/14 resolved. Publication and recording remain deferred.

- 2026-10-18 implementation: ticket 04 resolved. C create/edit panel, all ticket field groups/deadline, unsaved browser navigation, one child editor/parent return and confirmed deletion with scoped late-response link cleanup. Native build/45 focused browser checks plus two follow-up deletion checks, six component checks, frontend/backend types/lint pass. Ticket 05 claimed; 4/14 resolved. Preserve app URLs/data and defer full review/publication to 13/14 and recording until owner approval.
- Integration note for 13: evaluate the new data-router bundle cost and convert the licensed production Plex TTFs to WOFF2 if local tooling supports lossless conversion; no runtime-performance claim has been made from chunk sizes alone. Retire obsolete TicketEditDialog/Header/Sidebar/Overview styles only when final caller checks establish they are unused.

- 2026-10-18 implementation: [ticket 05](issues/05-task-editor-status.md) resolved: contextual task CRUD/full catalog, protected parent return and canonical creation reconciliation. 35 editor regressions, 13 isolated production journeys, 16 component/move checks, types/lint/build pass. Ticket 06 claimed; 5/14 resolved. Final review base remains owner-confirmed d355d98.
