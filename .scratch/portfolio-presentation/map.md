# Portfolio presentation: README and walkthrough

Status: implementing

## Current presentation handoff — 2026-10-18

The owner reviewed the redesigned application and now explicitly says we may proceed with the walkthrough and README. This satisfies the previously requested owner design/readiness checkpoint; do not ask for the same recording permission again. The active grill reconciles the existing presentation decisions with the final product and the newly requested Aster reference, before agreeing the final production plan.

The published application is65fa1ef, with [final refinement evidence](../product-redesign/evidence/owner-ui-refinement.md): all271 browser journeys,80 frontend tests/12 snapshots and58 backend tests pass in hosted Quality39139027327. Earlier defect/advisory/scaffold notes below are historical and must not become current README claims. The approved presentation drafts require reconciliation with the completed quality/refactor and redesign work; their preparation tickets must not be implemented again.

Retain already settled English recruiter/developer README, original authorship, silent English-captioned video,3:00–3:30 target, isolated populated local recording, real ticket change/independent-session synchronization, transcript/chapters and free hosting. README should stand alone without requiring the viewer to visit the demo. No media has been recorded during this renewed interview.

The owner points to the sibling `dashboard` / Aster walkthrough as the new presentation-quality reference. Inspect its actual video/storyboard/tooling read-only before proposing changes to pacing or packaging. Reuse a method or visual grammar only where it fits this product, without importing Aster's product claims.


Historical status: deferred-until-product-redesign

## Prior quality handoff (historical)

The owner now requests a complete mobile-first visual redesign before final README/walkthrough. Continue [the redesign interview](../product-redesign/map.md); the previous quality phase remains resolved. Final presentation should use the resulting reviewed design. This does not waive explicit owner readiness confirmation before recording.

All 16 quality/refactor tickets are resolved. Verified application b2a6191 is live on the existing Vercel/Render domains; hosted CI39095797406 passed all three jobs. See [final evidence](../portfolio-improvements/evidence/16-finish.md) and [reconciled presentation handoff](../portfolio-improvements/evidence/16-presentation-handoff.md).

Earlier notes below describe the pre-quality baseline and must not be reused as current audit/test/bug claims. Presentation preparation slices 01/02 are covered by quality evidence. Remaining work starts with final story rehearsal/design feedback, then the approved English README and silent captioned local walkthrough/package. Before recording, wait for the owner's design feedback and explicit readiness confirmation. No final video or presentation captures have been produced.

## Notes

- Owner invoked grill-with-docs after the successful cloud deployment and project-list routing fix, asking whether fixes should precede the README rewrite and walkthrough video.
- Goal already established: present the project to recruiters, with a README comparable in purpose to Keelwatch and a populated public demo.
- The public app is a shared editable demo on Vercel/Render/Neon. Personal accounts are disabled. Existing hosting and manual demo restoration decisions remain in force.
- Confirmed defect: the project progress helper counts ticket status `DONE`, but actual ticket statuses use `COMPLETED`. Fresh Datos demo have 6 completed of 18 tickets per project (about 33%), displayed as 0% in both grid and list. The overview measures the selected sprint, so its denominator legitimately differs; matching those percentages is not an acceptance criterion. Full workflow QA and accessibility review are not complete.
- The frontend production-dependency audit reports 9 high and 4 moderate advisories; reachability/compatible remediation are not assessed. The 25 old backend scaffold unit suites remain broken; separate API/seed integration checks pass.
- Source verification found inaccurate README claims: active RBAC is not demonstrated by the demo's guards; charts use Recharts, not Charts.js; the epics route is incorrectly described as retrospective; "production-ready" exceeds the verification evidence. No README rewrite, fixes or video production are authorized by this interview alone.
- The existing Keelwatch README was fetched read-only from GitHub. Its useful pattern is problem/workflow and contribution first, followed by demo, video/transcript, case-study evidence, then setup. Reuse the presentation order, not its project-specific security/authorization claims.

## Decisions so far

- 2026-10-17: Before recording the walkthrough, notify the owner and wait for their design feedback and explicit confirmation that the application is ready. Approval of the story, tickets or refactor does not satisfy this recording checkpoint. Continue quality work and verification in the meantime.

- Preserve the existing cloud deployment and demo data while defining the presentation phase.
- Follow the owner's multi-session workflow: complete the interview, confirm shared understanding, then to-spec and to-tickets before implementation.
- Round 1 confirmed by the owner: fix the project-progress defect, verify the chosen recording journey and triage dependency advisories for immediate applicability before final captures/recording. General refactor, bundle work and full scaffold-test repair remain separate work.
- Recruiter-facing presentation emphasizes full-stack work and the owner's contribution, following Keelwatch's evidence-first presentation pattern.
- README and video captions will be in English; the working conversation remains Spanish.
- Walkthrough format: English captions, without voice. Owner confirmed the revised 3:00–3:30 target and approximately 3:30 maximum to include more areas while retaining the central ticket journey.
- Owner confirmed original personal authorship: built from scratch, inspired by an image seen online, using their own implementation rather than a tutorial or starter project. Present the actual full-stack contribution without defensive or unsupported claims.
- Owner confirmed the recruiter README and video package. The README must explain the project without requiring a demo visit and provide a clear path for someone to clone and run it. Include problem, contribution, connected workflows, architecture, current screenshots, evidence/limits and links to reproducible setup.
- Owner accepted isolated local recording and permits the recording's demo edits to remain. Reuse existing populated local Datos demo when suitable; initialization/reset is not needed solely for a take. This does not broaden the recording choice to modifying shared production visitor data.

## Prior decision frontier (historical)

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

## Aster reference and renewed decision frontier — 2026-10-18

Read-only inspection located the sibling at `../dashboard`. Its reviewed walkthrough is186.56s,1920×1080,H.264,25fps and silent (6.85MB). Inspected `docs/walkthrough.md`, README, renderer, poster and chronological review sheets03/08. Useful presentation grammar: short connected chapters, deliberate pauses on actual changed values, smooth pointer/click emphasis, restrained zoom, two-line English captions clear of player controls, genuine mobile capture and a brief dark-theme segment. Use this project's Plex/carbon/azure identity. Existing FFmpeg/Pillow tooling is available in Aster's ignored recording tools, without adding application dependencies. No recording or installation was performed.

The remaining proposed frontier (not yet accepted):

- Q1: adapt Aster's1080p cinematic presentation, short chapters, pointer/click cues, restrained zooms and English captions to Project Management's identity.
- Q2: reserve20–25s within the existing3:30 ceiling for genuine mobile workflow and a brief dark-theme view, retaining light as the main recording appearance and concise coverage of all agreed areas.
- Q3: strengthen the central verified full-stack story with a real task move plus ticket-state change (distinct concepts), and show the genuine result in a second independent session without reload. Keep all staged recording mutations local.

README scope remains confirmed: problem/contribution, demo/video/transcript, connected workflows, three complementary current images, concise architecture/engineering explanation, reproducible linked local setup and honest shared-demo/free-hosting limits. Reconcile historical claims with current code/verification; no new player page or license change is implied by the Aster reference. No new domain term or hard-to-reverse architectural trade-off requires a glossary entry/ADR for these presentation choices.

## Confirmed presentation frontier — 2026-10-18

Owner answers:Q1 yes (Aster-style1080p polish),Q2 yes (20–25s genuine mobile/dark within3:30),Q3 yes specifically to highlight WebSockets (actual ticket state/task move and independent-session updates). Shared understanding is reached; no unanswered presentation decision remains and the recording-readiness approval has already been satisfied.

Published the reconciled [current spec](spec.md) and the original approved six tickets individually. [01](issues/01-accurate-project-progress.md) and [02](issues/02-dependency-disposition.md) are resolved by linked existing evidence. Remaining execution frontier is [03: verified rehearsal](issues/03-rehearse-verified-journey.md); after03, [04: README/setup](issues/04-recruiter-readme-setup.md) and [05: walkthrough](issues/05-silent-captioned-walkthrough.md); [06: publication](issues/06-publish-presentation-package.md) waits for04/05. Four presentation tickets remain. Prior draft files are explicitly historical; current spec removes obsolete baseline/scaffold/task-drag limitations.

No final media has been recorded and no runtime/product behavior changed while reconciling this plan. Implementation can proceed from03 using the confirmed scope and existing test boundaries, without repeating interview, preparation tickets or owner readiness permission.

### Public viewing page added by the owner

After confirming Q1/Q2/Q3, the owner explicitly asks for an Aster-style website extension to watch the video. The current spec and tickets04/06 now include a public walkthrough route, native HTML video playback, poster, chapter access, readable English transcript, direct MP4/caption downloads and return to the live demo. It must work without joining/restoring a demo session. The README poster opens this page. Verify native playback/seeking, direct entry/reload, reflow and media byte ranges. Existing free Vercel hosting is sufficient; no custom playback engine or paid service is implied. This owner instruction supersedes the former no-player-page boundary. The six-ticket sequence remains coherent;04/05 still gate06's complete publication outcome.

## Explicit to-spec consolidation — 2026-10-18

The owner now explicitly invokes to-spec. Reused the current spec instead of duplicating it. Product scope, six-ticket history and recording-readiness authorization remain confirmed. Verified current routing/authentication and static-hosting boundaries: the public viewing page must work independently of a sleeping API or expired demo session.

The consolidated test boundaries are real browser product/viewing journeys, exported/published media, and reproducible README/setup. Existing highest-level browser/HTTP/WebSocket and artifact checks are retained; no private implementation seam is introduced. One testing-expectation question is pending per to-spec's explicit check requirement, including public viewing with backend unavailable. The spec is temporarily needs-info until that answer, then it can be published ready-for-agent without another scope interview. No implementation or recording has started in this pass.

### To-spec validation confirmed

The owner replies “Sí, validar así” to the consolidated external verification. The [current spec](spec.md) is now ready-for-agent in the local tracker. It includes the real independent-session WebSocket journey, public viewing without login/with unavailable backend, complete exported-media review, actual delivery links and reproducible README/setup. No additional test seam, scope decision or recording-readiness confirmation remains pending. This closes the explicit to-spec pass; keep the existing six-ticket history for the subsequent to-tickets reconciliation.

## Explicit to-tickets reconciliation — 2026-10-18

Prepared [the reconciled breakdown](tickets.reconciled.proposed.md) against the confirmed spec, preserving six original IDs and two evidence-backed resolutions. Four outcomes remain:03 verified rehearsal,04 README/setup,05 final walkthrough,06 public viewing/publication.03's blockers01/02 are done;04/05 depend only on03;06 needs both finished artifacts. Final poster/video-link integration belongs to06 so04 is not accidentally blocked by05. Added the confirmed unavailable-backend/expired-session, media failure, native-player, chapter/download and deployed byte-range checks to06's proposed acceptance. No parent-spec change or implementation occurred.

Await the to-tickets granularity/dependency/merge-split confirmation, then apply these refinements to the existing individual issues and leave them ready-for-agent. Do not duplicate tickets or reopen01/02.

### To-tickets approved and published

The owner explicitly accepts the proposed granularity and blocking edges (“acepto”). Applied the approved acceptance criteria to the existing individual issues03–06, all ready-for-agent, without duplicating tickets or changing the parent spec.01/02 remain resolved by their existing evidence. [03: verified rehearsal](issues/03-rehearse-verified-journey.md) is the sole currently unblocked work item; after03,04/05 can proceed independently;06 depends on both. The four presentation outcomes are pending implementation, not already recorded/delivered. No new recording-readiness or scope approval is needed for the confirmed work.

## Implementation run — 2026-10-18

Owner explicitly invokes implement for all remaining tickets and additionally requires reviewing/approving the finished video before publication.03 claimed. Continue all local rehearsal, README, recording/rendering, public-viewer implementation and verification autonomously; do not push/deploy/upload the video or its package until the owner reviews the concrete final export and approves publication. Recording readiness remains authorized; this new gate is publication approval. Proposed final code-review base2339dbc is awaiting the owner's confirmation while implementation progresses.

Owner confirms final review base2339dbc. All commits and media stay local until explicit approval of the finished video before publication.

- Implementation03 resolved:17 real local rehearsal scenes pass with independent-context ticket/task WebSocket transitions, zero observer reloads and canonical API confirmation; read-only cloud eight-area navigation passes at390/1440. The recording uses the task-state editor for a readable reliable transition, while the retained actual drag regression passes separately. [Evidence](evidence/03-rehearsal.md).04/05 claimed;06 stays gated by both. All media/package commits remain local until owner publication approval.


## Presentation artifacts prepared — 2026-10-18

04 resolved: [README/setup evidence](evidence/04-readme.md), real screenshots, Mermaid rendering and successful clean example-only installation.05 resolved: [actual export](evidence/05-video.md),182.56s/1080p/no audio,17chapters/21English cues,24.04s actual mobile/dark, full decode and chronological/key-frame inspection. Two real independent-session events and persisted states remain verified. The final file is about6MB.

06 claimed: public viewer outside AuthProvider, native playback/chapters/transcript/downloads, media-error recovery and preserved sessions. Local viewer tests pass at390/1440 in both appearances, including keyboard and fullscreen. Full production-browser suite and final two-axis review against2339dbc are in progress.80frontend tests/12snapshots and58backend tests pass; types/lint pass with only12existing frontend Fast Refresh warnings. No dependencies/schema/API changes.

All source/media/docs commits remain local. Owner must review the finished MP4 and local viewer and explicitly approve publication before push/deploy/upload. Final hosted delivery checks/publication revision remain outstanding under06. No cloud visitor-data reset/staging is authorized or needed.


## Owner-review handoff — local preparation complete

Full isolated production-browser run:280passed (9.2m). Final viewer run:9passed (11.3s) after strengthening the real-cookie fixture and moving the video caption band clear of paused native controls. Video is now5,228,724bytes,182.56s/1080p/silent; raw source/timings unchanged. Re-decoded/reviewed all8 chronological sheets and actual paused/fullscreen key moments. Final production build matches reviewed media hash. Viewer additionally passes all8 layouts320/768/1024/1440 × light/dark without API calls or overflow. [Complete verification](../../docs/verification.md), [local checks](evidence/06-checks.json).

Standards and Spec reviews against2339dbc have no material findings; final small fixture/export adjustments also passed their follow-up review.01–05 resolved.06 needs-info solely for the owner's explicit finished-video publication approval and subsequent actual hosted-delivery checks; local implementation is complete. No push/deploy/upload occurred. Review locally at `http://127.0.0.1:64998/walkthrough` or open the repository MP4. Preserve the owner's unrelated untracked design/history files; suite-generated tracked historical screenshots were restored to their initial versions.


Final Standards0/Spec0 review is recorded in [06-code-review.md](evidence/06-code-review.md). Final reviewed media is served by the owned production runtime with matching SHA-256 and real206byte ranges. No publication has occurred.


## Owner feedback — Taskboard ticket and partial retake

Owner requests correcting the ticket-cell design visible around1:05 before approval, then re-recording only the affected part. Preserve the ticket-row/task-state matrix, real interactions and genuine independent-session updates. Compact identity/expansion, title, state/priority and metadata; remove unavailable order controls. The same component spans1:00.20–1:44.32, so replace only those five Taskboard/collaboration scenes with a real partial take; preserve all other footage/timing/captions. Publication remains unapproved. This is review feedback under06, not a new broad refactor or full recording request.
