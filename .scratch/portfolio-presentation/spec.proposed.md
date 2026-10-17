# Recruiter README and product walkthrough

Status: approved proposal — deferred until the quality/refactor phase is verified

## Problem Statement

The owner has deployed a populated full-stack project but its current presentation does not explain the product, the owner's contribution or the implemented workflows reliably to recruiters. Some recruiters will not open the live demo; developers who inspect the repository also need a reproducible way to run it themselves.

The current README includes inaccurate capability and stack claims. A confirmed visible defect shows project progress as 0% because its calculation expects a different completion-state name from the actual tickets. Dependency advisories need applicability triage, and the exact walkthrough must be verified before it is recorded. General cleanup would delay the presentation without a clear stopping point.

## Solution

Complete a bounded preparation pass, then publish an English recruiter-facing README, three current screenshots, a compact architecture diagram and a silent English-captioned product walkthrough with a Markdown transcript. The video should take about 3:00–3:30 and show both a coherent work-item journey and the breadth of the application.

Use Orbit and its existing Datos demo. Follow a ticket through inspection, a state change and a real-time update in another window, with short connected chapters covering hierarchy/backlog, team/capacity/goals and retrospective. Record the real application in an isolated local demo and verify the corresponding journey against the public deployment. Local recording edits may remain; the public dataset must not be reset for a take.

## User Stories

1. As a recruiter, I want to understand the problem the application addresses without opening the demo, so that I can assess its purpose quickly.
2. As a recruiter, I want a clear account of the owner's full-stack contribution, so that I can distinguish implemented work from generic feature claims.
3. As the owner, I want the project described as a personal implementation built from scratch, so that its authorship is represented accurately.
4. As a recruiter, I want one connected product journey, so that I can see how the application's areas work together.
5. As a recruiter, I want current screenshots with useful context, so that the README communicates the actual product even without video playback.
6. As a technical reviewer, I want a compact architecture explanation, so that I can trace React, the API, persistence and real-time communication.
7. As a technical reviewer, I want claims tied to implemented behavior, so that demo roles are not mistaken for active role-based authorization.
8. As a demo visitor, I want completed tickets reflected in project progress, so that summary information is trustworthy.
9. As a demo visitor, I want consistent project progress in grid and list views, so that switching presentation does not change the result.
10. As a demo visitor, I want safe progress values for empty or fully completed projects, so that edge cases remain understandable.
11. As a demo visitor, I want project and sprint metrics to retain their respective scopes, so that different denominators are not presented as a defect.
12. As a video viewer, I want to see Acceso demo and populated projects, so that I know how to explore the product without creating an account.
13. As a video viewer, I want epics, features and backlog connected to work items, so that I understand planning beyond a task board.
14. As a video viewer, I want to inspect a ticket's requirements, assignment and estimates, so that the depth of its data model is visible.
15. As a video viewer, I want to see a real ticket state change persisted through the application, so that the recording demonstrates working behavior.
16. As a video viewer, I want another independent browser window to receive the change without a reload, so that real-time collaboration is demonstrated.
17. As a video viewer, I want to see team membership, sprint capacity and goals, so that the broader planning capabilities are represented.
18. As a video viewer, I want to see a populated retrospective, so that the journey includes feedback after delivery work.
19. As a video viewer, I want legible English captions without narration, so that I can follow the walkthrough silently.
20. As a reader, I want chapters and a transcript, so that I can understand or revisit the walkthrough without playing the video.
21. As a reader, I want working demo and video links plus a downloadable MP4, so that I can choose how to inspect the project.
22. As a developer, I want clone-to-running instructions with environment examples and database initialization, so that I can run the application without the owner's private credentials.
23. As a developer, I want accurate test and quality information, so that passing integration checks are not confused with the broken scaffold unit suites.
24. As a demo visitor, I want the shared editable identity and hosting wake-up delay explained, so that the demo's limitations are predictable.
25. As the owner, I want dependency advisories classified using the actual deployed dependencies and usage, so that immediate concerns are distinguished from later maintenance.
26. As the owner, I want recording changes confined to an explicit local demo destination, so that existing public visitor work and old databases remain intact.
27. As the owner, I want a bounded readiness check before final media, so that a broad refactor does not postpone the portfolio presentation indefinitely.
28. As the owner, I want persistent decisions, dependencies and verification evidence, so that another session can continue without repeating the interview.

## Implementation Decisions

- Preserve the current React/Vite frontend, modular NestJS backend, Prisma/PostgreSQL model and Vercel/Render/Neon deployment. No architectural rewrite or new paid service.
- Correct the project-progress calculation using the application's actual completed-ticket semantics. For the unchanged initial Datos demo, six completed tickets out of eighteen is approximately 33%. Current data determines the result; do not hardcode a percentage or rewrite ticket records to fit the old helper.
- Keep project-level progress distinct from selected-sprint progress. Cover empty, none-completed, partially completed and fully completed scenarios.
- Triage the observed frontend dependency advisories against the current lockfile, production/build usage, affected behavior and available compatible remedies. Record the inspected revision/date and unresolved uncertainty. Do not equate an advisory count with an exploitable browser path or claim safety without evidence.
- This preparation does not authorize a blanket dependency upgrade. If triage identifies a material concern requiring a broader migration, document the finding and its effect on readiness, then obtain a scope decision rather than silently expanding the work or hiding it.
- Verify the selected journey before producing final screenshots or recording. Repair confirmed, bounded defects directly preventing that journey; record substantial new scope separately.
- Use the same application revision and representative Datos demo for local captures and cloud verification. Check the actual local database destination before any recording mutation; the normal ignored environment currently points to Neon and must not be assumed local.
- Reuse populated local demo data where suitable. The owner permits recording edits to remain there. No reset, automatic restore, production reseed or old-data import is part of recording.
- Use Orbit, explicitly select Sprint 2 — Delivery, and locate the seeded "Build the sprint overview" ticket by title or another stable business identifier rather than a disposable numeric ID.
- Inspect the ticket's Details, Planning and Additional Info, change its state from In Progress to Code Review using the existing selector, and demonstrate the live result in a second independent browser session.
- Cover epics/features and backlog, current sprint, team/capacity/goals, retrospective and resulting overview in concise connected chapters. Planning is a ticket-modal tab; do not invent an application-level Planning page.
- Ticket dragging/reordering is not part of the promised story. Task dragging has an unrelated hardcoded attribution issue and is excluded from this recording unless separately evaluated.
- Target a silent MP4 of approximately 3:00–3:30, with 3:30 as the editing ceiling. Use English captions incorporated into the picture, a matching Markdown transcript and chapters. Keep controls, results and captions readable; do not cover the demonstrated action with text.
- Show genuine application behavior and actual updates. Short edits between scenes are allowed; simulated results, fabricated UI and captions claiming an unverified feature are not.
- Follow Keelwatch's recruiter-first presentation pattern while adapting the story and claims to this project. No custom video player or separate large case-study series is required.
- Explain the problem, original personal contribution, connected workflows, demo entry, stack/architecture, relevant engineering decisions and honest limitations. Include three complementary current screenshots, concise captions and a small architecture diagram.
- Describe the owner's work positively and accurately as a personal full-stack project built from scratch. Visual inspiration from an image does not become a claim of copied application code, a tutorial implementation or affiliation with another product.
- Correct the stack to Recharts and the epics-route description. Do not claim enforced RBAC or unqualified production readiness. Explain that public access uses one shared editable Usuario demo and that personal registration/login are unavailable.
- Provide a clear clone-to-running route using Node 22, lockfile installation, examples for environment variables, a dedicated PostgreSQL database, checked-in migrations, explicit Datos demo initialization and frontend/backend startup. Keep DATABASE_URL as the only database connection variable; never embed deployed credentials.
- Keep detailed setup and maintenance instructions linked so the README remains useful to recruiters and developers. Do not add or change a software license as an incidental documentation edit.
- Publish a coherent package with the live demo, playable/downloadable video, transcript, images and setup links verified. Reuse free existing repository/provider hosting. Any required account interaction happens only once the final artifact is ready for that step; never invent an upload URL.

## Testing Decisions

Proposed boundaries awaiting owner confirmation:

- **Project-progress behavior:** use representative ticket/status data at the existing shared progress boundary, including the real COMPLETED state, and verify its visible result in both project views. Test the user-facing calculation and edge cases rather than function internals or a hardcoded seed percentage.
- **Real application journey:** prefer the existing browser-driven demo path and deployed HTTP regression probe. Exercise entry, session/reload, projects, hierarchy/backlog, the selected ticket transition, independent-window WebSocket delivery, team/capacity/goals and retrospective. Keep database tests separate from production; never run destructive test cleanup against Neon.
- **Presentation package:** inspect the actual exported MP4 and representative frames/caption transitions, compare chapters with the transcript, and verify public README/media/demo links. Validate documented startup with an isolated clone-equivalent workspace and dedicated local database, without the owner's private environment files.
- Prior art includes the existing frontend Jest/Testing Library suites, shared progress helper, API/seed integration suite, deployed HTTP probe and the real-Chrome diagnosis that caught the trailing-slash routing defect. Keelwatch's capture/editing scripts are a reference for tooling, not reusable proof for this application's workflow.
- Run checks appropriate to changed code, including builds and focused regressions. Preserve and report the known broken backend scaffold baseline; do not disable tests or claim the full suite passes. Record any browser, cold-start, access or artifact limitation explicitly.

## Out of Scope

- General frontend/backend refactoring, obsolete-auth cleanup, bundle optimization and broad API payload redesign.
- Repairing all 25 old backend scaffold test suites or introducing a full CI overhaul.
- New product features, personal accounts, tenant isolation, new RBAC, role switching or a change to shared-demo identity.
- New hosting infrastructure, paid services, database migration/import, scheduled reset or keepalive jobs.
- A full security/accessibility certification or an unqualified claim that all advisories are exploitable or harmless.
- Narration, an additional long video, a custom video-player application or an exhaustive demonstration of every setting/control.
- Resetting public data, deleting old resources or rewriting visitors' changes for recording.

## Further Notes

- The owner explicitly confirmed the final expanded coverage and approximately 3:30 maximum after the interview.
- The chapter budget is an editing guide: entry/overview 20 seconds; hierarchy/backlog 25; ticket change and real-time proof 60; team/capacity/goals 40; retrospective 30; overview/result 20; architecture/demo invitation 15.
- The original dependency observation was 9 high and 4 moderate frontend production advisories; those counts must be rechecked during triage rather than treated as permanent facts.
- Existing limitations include the broken backend scaffold unit suite and free-hosting wake-up behavior. The earlier empty project-list bug has already been corrected and has a deployed regression check.
- No new ADR is required for these reversible presentation choices. Existing deployment and demo-data boundaries continue to apply.
- Implementation starts after the spec testing boundaries and ticket breakdown are confirmed and the approved artifacts are published to the local tracker.
