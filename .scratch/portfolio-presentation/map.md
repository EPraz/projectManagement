# Portfolio presentation: README and walkthrough

Status: deferred-until-refactor-and-quality-work

## Notes

- Owner invoked grill-with-docs after the successful cloud deployment and project-list routing fix, asking whether fixes should precede the README rewrite and walkthrough video.
- Goal already established: present the project to recruiters, with a README comparable in purpose to Keelwatch and a populated public demo.
- The public app is a shared editable demo on Vercel/Render/Neon. Personal accounts are disabled. Existing hosting and manual demo restoration decisions remain in force.
- Confirmed defect: the project progress helper counts ticket status `DONE`, but actual ticket statuses use `COMPLETED`. Fresh Datos demo have 6 completed of 18 tickets per project (about 33%), displayed as 0% in both grid and list. The overview measures the selected sprint, so its denominator legitimately differs; matching those percentages is not an acceptance criterion. Full workflow QA and accessibility review are not complete.
- The frontend production-dependency audit reports 9 high and 4 moderate advisories; reachability/compatible remediation are not assessed. The 25 old backend scaffold unit suites remain broken; separate API/seed integration checks pass.
- Source verification found inaccurate README claims: active RBAC is not demonstrated by the demo's guards; charts use Recharts, not Charts.js; the epics route is incorrectly described as retrospective; "production-ready" exceeds the verification evidence. No README rewrite, fixes or video production are authorized by this interview alone.
- The existing Keelwatch README was fetched read-only from GitHub. Its useful pattern is problem/workflow and contribution first, followed by demo, video/transcript, case-study evidence, then setup. Reuse the presentation order, not its project-specific security/authorization claims.

## Decisions so far

- Preserve the existing cloud deployment and demo data while defining the presentation phase.
- Follow the owner's multi-session workflow: complete the interview, confirm shared understanding, then to-spec and to-tickets before implementation.
- Round 1 confirmed by the owner: fix the project-progress defect, verify the chosen recording journey and triage dependency advisories for immediate applicability before final captures/recording. General refactor, bundle work and full scaffold-test repair remain separate work.
- Recruiter-facing presentation emphasizes full-stack work and the owner's contribution, following Keelwatch's evidence-first presentation pattern.
- README and video captions will be in English; the working conversation remains Spanish.
- Walkthrough format: English captions, without voice. Owner confirmed the revised 3:00–3:30 target and approximately 3:30 maximum to include more areas while retaining the central ticket journey.
- Owner confirmed original personal authorship: built from scratch, inspired by an image seen online, using their own implementation rather than a tutorial or starter project. Present the actual full-stack contribution without defensive or unsupported claims.
- Owner confirmed the recruiter README and video package. The README must explain the project without requiring a demo visit and provide a clear path for someone to clone and run it. Include problem, contribution, connected workflows, architecture, current screenshots, evidence/limits and links to reproducible setup.
- Owner accepted isolated local recording and permits the recording's demo edits to remain. Reuse existing populated local Datos demo when suitable; initialization/reset is not needed solely for a take. This does not broaden the recording choice to modifying shared production visitor data.

## Open decision frontier

The presentation grill is complete. The owner approved the proposed test boundaries and six-ticket breakdown, then explicitly changed the sequence to prioritize code refactoring and product quality before the README/video. The presentation decisions remain valid, but its former minimal-preparation scope does not define the expanded refactor effort.

- Approved presentation drafts retained: spec.proposed.md and tickets.proposed.md. Individual issues had not yet been published when the owner changed priority.
- Current work direction: use the existing improvement backlog to define a bounded refactor/quality scope and its own tests/dependencies before implementation.
- Resume the presentation package after the agreed refactor/quality work and verification. Do not repeat already settled authorship, language, video format, recording environment or story decisions unless new evidence requires it.
- No fixes, README rewrite, recording-tool installation or video production have started in this presentation phase.

## Story and presentation notes

- Proposed central story: Explore demo → Orbit → explicitly select Sprint 2 Delivery → inspect the seeded "Build the sprint overview" ticket → change its state from In Progress to Code Review → show the update in a second window without reload → return to overview. Owner accepts the direction but wants the project's other areas represented as well.
- Source confirms Details/Planning/Additional Info are ticket-modal tabs; main board tabs are Board/Backlog/Capacity/Goals. Ticket state uses a selector; drag moves tasks, not tickets. Do not promise unsupported ticket dragging.
- The task-drag helper currently hardcodes an attribution email. The proposed story avoids presenting task dragging or accurate actor attribution; triage separately if later selected for the recording.
- Confirmed README package: concise recruiter-first summary of problem, contribution and connected journey; demo/video links; a small architecture diagram, three current screenshots, technical decisions and honest limits; detailed reproducible setup remains linked. Confirmed video package: MP4 with English captions in the picture plus a Markdown transcript, matching Keelwatch's delivery pattern without a new video-player feature.
- Confirmed recording environment: isolated local demo using the same application revision and seed, with the selected journey separately verified against the cloud app. Recording edits may remain in that local dataset. Do not reset the shared public demo or alter visitor data to capture a scene.

## Confirmed coverage revision

- Target 3:00–3:30, with approximately 3:30 as the editing ceiling rather than a requirement to exhaust every control.
- 0:00–0:20: demo entry, project selection and overview.
- 0:20–0:45: epics/features and backlog connect larger goals to planned work.
- 0:45–1:45: ticket details, estimates, state change and real-time update in a second window.
- 1:45–2:25: current sprint, team/capacity and goals.
- 2:25–2:55: retrospective and feedback.
- 2:55–3:15: overview ties the journey together.
- 3:15–3:30: compact architecture/stack and live-demo invitation.
- Detailed interactions and less central settings are documented in the README/transcript rather than exhausting every UI control in the video.

## Later dependent decisions

- Read-only fact finding complete for a proposed story and Keelwatch's capture/editing pattern. Keelwatch includes capture/recorder/player scripts, caption files and transcripts; reuse the approach with adaptation, not its application-specific script unchanged. No FFmpeg executable is currently on PATH; any recording-tool preparation belongs to later implementation. No video capture or dependency installation is being performed during planning.
- Define final script, frame/caption pacing and detailed acceptance after the story and delivery format are settled.
- Reconcile the approved presentation drafts with the completed refactor/quality work when presentation resumes, then publish the appropriate remaining implementation issues.
