# Design brief: Product redesign

Status: approved design direction and representative screens, 2026-10-18.

Functional direction: Q1–Q31 and shared-understanding confirmation. Visual follow-up: Q32/Q33, explicit C selection, then acceptance of the [extended C preview](direction-c/REVIEW.md) with “acepto, proceda $to-tickets”. This acceptance covers Projects, Overview, Taskboard and ticket/task editor proposals in both themes and responsive sizes. Other areas follow the agreed behavior and the same C identity; the final real-product visual validation still applies.

Selected direction: **C / Project studio**, evolving the original personal identity with a floating rail, mixed-size modules, project context/progress and distinct execution surfaces. Keep the liked light palette and C's neutral carbon dark treatment. A/B and D/E remain exploration history. Prototype data, simplified forms and three sample task states are not production contracts; preserve all real fields, statuses and capabilities. This brief is the approved source for a ticket proposal, not an assertion that the implementation exists.

## Problem

Visitors need to understand the portfolio project quickly and explore real planning and delivery workflows. The current permanent mobile sidebar, duplicate navigation, compressed board/editor and competing dashboard content make those journeys difficult. These are original design limitations, separate from the completed functional refactor.

## Solution

A complete, mobile-first Industrial Carbon & Azure interface with readable task relationships, focused editing and honest operational summaries. Visitors can inspect projects, select a sprint, follow work from tickets to tasks, plan and review it with the same capabilities on every screen size.

## Experience principles

1. Preserve context: keep project, selected sprint, parent ticket and return path clear while changing sections or editing.
2. Show useful information first: execution, blockers and deadlines precede descriptive metadata; secondary fields remain available.
3. Adapt the working surface: wide matrices become narrow ticket/task journeys without losing operations.

## Aesthetic direction

- Selected direction: C / Project studio, evolving the original personal identity with a floating rounded rail, distinct project/sprint modules, circular progress, fine borders, differentiated depth and intentional azure accents. Use 6–8px base controls and the selected C's softer 12px main panels / floating rail treatment.
- Both light and dark use the same identity with separate readable color values. Owner refinement after publication: light is the initial appearance, manual choices are remembered and following the system is opt-in.
- Light baseline: #f3f5f8 background, white surfaces, #205bc8 primary accent, #182432 primary text, #536276 secondary text. Selected C dark: #171717 background, #242424 panels, #2d2d2d raised surfaces and #91b8ff accent; avoid tinting all neutral surfaces blue-gray.
- IBM Plex Sans actually loaded, primary mobile text 16px and secondary 14px. Follow the selected C's heading hierarchy, distinguishing large project/page identity from section/editor headings; the initial pre-prototype 24px / 28–32px heading suggestion is superseded where the owner-approved C reference uses larger identity titles. Wide layouts may use compact readable controls.
- Azure DevOps sprint Taskboard is the relationship reference: ticket rows and task-state columns, with independent ticket state.
- Keep the accepted matrix model; avoid replacing it with ticket cards in status columns. Do not add visual decoration that obscures work.

## Existing patterns

- React/MUI Theme and CssBaseline are the production foundation. Re-theme and adapt existing controls rather than replace the stack.
- Current Inter declaration lacks a loaded font; green button overrides and fixed sidebar/card sizes need replacement during implementation.
- Preserve existing sessions, API contracts, draft protection, deep links, forms and functional regression coverage.
- Prototype code is intentionally separate from production. It uses semantic HTML/CSS and fictional in-memory content to review layout; it is not production component code or a source of live metrics.

## Component inventory

| Component | Status | Direction |
| --- | --- | --- |
| Project navigation | Modify | Single desktop sidebar / mobile section menu |
| Theme system | Modify | Full light/dark semantics and font loading |
| Projects | Modify | Search/create, concise cards and real scoped progress |
| Overview | Modify | Operational summary, separate project/sprint indicators |
| Taskboard | Modify | Sticky ticket column/headers, collapsible ticket rows |
| Narrow work list | New presentation | Ticket-state groups, ticket → tasks |
| Task status action | New presentation | Keyboard/touch alternative to existing state mutation |
| Ticket/task editor | Modify | Contextual panel / full screen, explicit Save/Cancel |
| Backlog/hierarchy | Modify | Wide table/tree, narrow list/level navigation |
| Goals/capacity/team/retro | Modify | Responsive representations of existing capabilities |
| State feedback | Modify | Consistent loading, empty, error, pending and confirmed outcomes |

## Information architecture and scope

Overview; Work → Board, Backlog, Epics & Features; Planning → Goals, Capacity; Team; Retrospective. Overview remains project entry. Board and Backlog show only the selected sprint; do not add a whole-project/unplanned Backlog selector. Existing goals, capacity and retrospective retain shared sprint context. Team/hierarchy remain project-wide.

Taskboard filters by task assignee and keeps parent ticket context. Backlog filters by ticket assignee. Always distinguish ticket status from task status. Ticket details regroup as Details / Planning / Tasks / Additional info while preserving every existing field.

## Key interactions

- Project entry → Overview → selected sprint → Taskboard → ticket → task, with recoverable return context.
- Desktop tasks may drag between states within the same ticket. Explicit Change status serves touch/keyboard. No reparenting, reordering or ticket ordering is added.
- Ticket row shows title, own status, assignee and task completion count. Task shows title, assignee and remaining hours when present.
- One editor at a time; explicit Save/Cancel, dirty-input warning, secondary confirmed deletion. Preserve drafts and errors on failed saves.
- Blocked totals use flag OR ticket state and count each ticket once before preview limits. Separate overdue/upcoming unfinished tickets and project progress/sprint metrics. Recent updates describe known timestamps, not audit events. Do not invent capacity activities or sprint goals.
- Hierarchy uses expandable wide tree/narrow parent-aware level navigation; goals retain checklists; capacity uses member table/cards; team retains catalog membership operations; retrospective uses category columns/selector and honest name-hide/blur behavior.

## Responsive behavior

- Mobile: compact header and section menu; full-width content; ticket-state groups and task drill-in; full-screen editor; reachable actions. Main text 16px, secondary 14px.
- Tablet: validate portrait/landscape; use matrix only where useful content width remains. Otherwise use the narrow ticket/task presentation.
- Desktop: single sidebar, bounded content, readable density; matrix scrolls locally with sticky ticket column/headers; contextual wide editor.
- Representative acceptance widths: 320–390, 768/1024 and 1280/1440 CSS pixels. Prototype demonstrates 375, 768 and 1440 and is additionally checked at 320/390/1024/1280.

## Accessibility requirements

Measure actual text/background and control/focus pairs in both themes; retain visible labels, keyboard operation and understandable focus order. Aim at WCAG AA text contrast (4.5:1 normal / 3:1 large) and 3:1 meaningful non-text boundaries. Product touch target goal is 44–48px, with readable secondary information. Test zoom/reflow, reduced motion and focus entry/return in the real application. Provide non-drag alternatives and do not rely on color alone.

These are targeted acceptance checks; the visual prototype does not establish full accessibility or functional conformance for production.

## Visual review artifact

The selected isolated [direction C preview](direction-c/REVIEW.md) presents populated Projects, Overview, Taskboard and ticket/task editing in both themes at responsive sizes. Owner accepted the representative screens after choosing C from the earlier Overview exploration. Review controls remain outside the product surface. The initial A/B and later D/E explorations are historical evidence, not implementation alternatives.

This adapts the prototype skill's host-route preference to the owner's isolation/pre-implementation checkpoint. Prototype state is in memory; no production build includes these files. Source/verdict/captures are archived on local branch `prototype/product-redesign-project-studio-20261018` at `ada8ab271100fcfbd033b09a166aaedae93fe354`. The actual implementation must be written against the existing React/MUI application and canonical API data.

## Delivery and review boundaries

Shared understanding → representative visual proposals → owner visual review → consolidate spec → tickets → implementation and real validation → coherent publication. Keep the public demo usable and preserve data/free Vercel/Render/Neon infrastructure. README and silent walkthrough follow the final redesign; explicit owner readiness approval remains required before recording.

## Out of scope

Backend/schema rewrite, personal accounts, audit history, task reparenting/order, ticket ordering, automatic data resets, paid services and recording before owner approval. Prototype interactions illustrate presentation only and do not validate the existing live API.

## Owner refinement after publication — 2026-10-18

Remove the desktop workspace header/breadcrumb/demo badge row so Projects and each project section start with their real page content. Place appearance and user controls at the bottom of the floating sidebar; retain refresh there. Mobile keeps a compact navigation entry and places these controls at the bottom of its drawer. The owner explicitly accepts losing breadcrumbs and requests light as the default, while remembered manual choices and an explicit system-follow option remain available.

## Owner detail and entry refinement — 2026-10-18

Center Backlog cell content within each row and group Column Options with the filter actions. Align the calendar date badges and content to the leading edge. Place appearance switching inside the user menu, removing the separate workspace/rail theme button; keep initial light, persisted manual choices and explicit system-follow. Compact epic/feature cards with header actions, aligned content and no reserved collapsed-child padding. Show each Projects metric as an inline icon/count/label, wrapping groups on narrow screens.

Bring demo entry and the legacy hourglass loading surface into the accepted C identity: light editorial layout, local Plex type, shared mark/azure accents and a quiet indeterminate loading bar. Preserve real session entry, unavailable/malformed response feedback, pending guards, warm-up guidance, expiry/restoration and retry. Loading is an accessible status and respects reduced motion. No recording before owner approval.
