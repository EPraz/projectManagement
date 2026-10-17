# Proposed tickets: portfolio presentation

Status: approved proposal — deferred until the quality/refactor phase is verified

Each ticket delivers a verifiable outcome. Schema/API changes are not invented for documentation or video work. The two preparation slices can start independently; final README captures and video depend on the verified journey, and final publication depends on both artifacts.

## 01: Show accurate project progress in grid and list

**Blocked by:** None (can start immediately).

**What it delivers:** A visitor sees completed work reflected accurately in project summaries without changing the demo records or conflating project and sprint progress.

- [ ] A regression using actual ticket completion states fails before the fix and passes afterward.
- [ ] Grid/list reflect the same project completion calculation; the unchanged initial demo scenario is approximately 33%, not a hardcoded result.
- [ ] Empty, none-completed, partial and fully completed scenarios produce valid progress values.
- [ ] Selected-sprint calculations retain their own scope.
- [ ] Focused checks and the frontend build pass; verify the corrected summary in the running demo.

## 02: Establish a documented dependency disposition for presentation

**Blocked by:** None (can start immediately).

**What it delivers:** The owner has an evidence-based account of the observed dependency advisories and whether any material issue must be resolved before presentation.

- [ ] Recheck the known findings with an inspected revision/date and distinguish runtime from build-only usage.
- [ ] Record affected usage/reachability evidence, compatible remedy options and uncertainty; do not infer exploitability from severity alone.
- [ ] Give findings explicit dispositions: addressed by existing state, safely deferred with rationale, or requiring a scope/readiness decision.
- [ ] No forced audit fix, blanket major upgrade, hidden suppression or unsupported assurance of safety.
- [ ] Substantial newly required work is surfaced with evidence instead of being silently added to this ticket.

## 03: Verify and rehearse the complete presentation journey

**Blocked by:** 01: Show accurate project progress; 02: Dependency disposition.

**What it delivers:** A demonstrably working, reproducible Orbit journey is ready for final captures and recording, covering the agreed application areas and real-time behavior.

- [ ] Explicitly verify an isolated local recording destination with populated Datos demo; do not write to Neon through an assumed local environment.
- [ ] Entry, session/reload and project summaries work; check the corresponding public journey and record any wake-up limitation.
- [ ] Rehearse epics/features/backlog, Sprint 2 Delivery, ticket details/estimates, team/capacity/goals and retrospective with visible populated results.
- [ ] Change "Build the sprint overview" through the existing state selector and observe the actual update in another independent window without reload.
- [ ] Confirm result/overview behavior; make only bounded repairs required for the selected journey and keep substantive new findings separately scoped.
- [ ] Record reproducible steps, final chapter/caption outline, evidence and remaining limitations. Local recording edits may remain; no public reset/reseed.

## 04: Deliver an accurate recruiter README and reproducible setup

**Blocked by:** 03: Verified presentation journey. A provisional text outline may be drafted earlier; final screenshots and claims depend on 03.

**What it delivers:** A recruiter understands the original full-stack project without visiting the app, and another developer can clone and run it from the documented instructions.

- [ ] English recruiter-first narrative covers the problem, owner's original contribution, connected journey, demo access and implemented capabilities.
- [ ] Three complementary current screenshots and a compact architecture diagram match the verified build.
- [ ] Correct Recharts/epics details and remove unsupported RBAC/production-ready claims; explain shared demo, hosting delay and honest quality limits.
- [ ] A clear clone-to-running path is checked with isolated setup, a dedicated database and example variables only; no secrets or old data are required.
- [ ] Detailed technical setup is linked, terminology is consistent, and no unrequested license change is made.
- [ ] Leave stable integration points for the final video/transcript package without presenting placeholder links as published artifacts.

## 05: Deliver the silent captioned product walkthrough

**Blocked by:** 03: Verified presentation journey. Ticket 04 does not gate recording; both artifacts follow the same approved story.

**What it delivers:** A viewer can watch the real application across its main areas in approximately 3:00–3:30 and follow its product value without audio.

- [ ] Before recording, notify the owner, collect their design feedback and wait for explicit confirmation that the application is ready. Prior story/ticket approval does not waive this checkpoint (owner instruction, 2026-10-17).
- [ ] Capture the agreed Orbit story and coverage using the verified local environment; recording edits may remain there.
- [ ] Produce an MP4 with legible English captions in the picture and no narration, plus matching Markdown transcript/chapters.
- [ ] The video includes an actual ticket state change and a real second-window update, with no fabricated UI/results or unsupported feature claims.
- [ ] Hierarchy/backlog, team/capacity/goals and retrospective receive concise context; final stack/demo invitation is readable.
- [ ] Inspect the exported artifact, playback, representative frames, pacing, caption timing and duration; keep private data and credentials out of capture.
- [ ] Adapt reusable capture/editing patterns and prepare tools only as needed; no custom player or paid service.

## 06: Publish and verify the coherent presentation package

**Blocked by:** 04: Recruiter README and setup; 05: Captioned walkthrough.

**What it delivers:** The public repository offers a consistent README, current screenshots, architecture, live demo, video, transcript and download path that recruiters can actually use.

- [ ] Integrate the final media/transcript into the README using existing free hosting; verify real URLs and repository-compatible artifact size/format.
- [ ] If final hosting/account interaction requires the owner, request that precise step with the finished artifact already available; do not substitute a fabricated upload link.
- [ ] Verify public reading, image rendering, playback/download, transcript chapters and live-demo navigation from the published package.
- [ ] Record verification, source revision, any required follow-up and the next-session entry point; preserve known limitations honestly.
- [ ] Do not change unrelated deployments, old resources or public visitor data during presentation publication.

## Proposed execution frontier

- Initially: 01 and 02.
- After 01 and 02: 03.
- After 03: 04 and 05.
- After 04 and 05: 06.

Approval requested: confirm the test boundaries in the proposed spec, ticket granularity and blocking edges; identify any ticket to merge or split before individual tracker issues are published.
