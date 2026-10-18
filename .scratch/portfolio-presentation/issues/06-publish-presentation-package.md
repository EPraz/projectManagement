# 06: Deliver the public viewer and coherent publication

Type: task
Status: claimed
Blocked by: 04, 05

## What to build

an Aster-style public viewing page and a published README/media package with actual working links on existing free hosting.

## Acceptance criteria

- [x] Use native browser video controls, a real poster, accessible chapters, readable English transcript, MP4/caption downloads and return-to-demo navigation; no paid service or custom playback engine.
- [x] Enter/reload/watch without demo login, including unavailable/sleeping API and expired session state. Do not destroy an existing demo session or mount authenticated workspace navigation for viewing.
- [x] Verify initially paused playback, seeking, native fullscreen affordance, keyboard reachability, mobile/desktop reflow and understandable media-error/retry/download feedback.
- [ ] Integrate the final poster/primary viewing-page link and transcript/download alternatives into the README. Verify public rendering and real media URLs/content types/byte ranges/playback/download.
- [ ] Record exact captured-source/publication revisions and artifact verification. Preserve visitor data, existing deployment boundaries and unrelated resources; resolve only actual completed outcomes.

## Comments

2026-10-18: Reconciled with the completed quality/redesign and the owner-confirmed Aster/mobile/WebSocket presentation decisions. Preserve the original approved six-ticket breakdown.

2026-10-18 owner addition: explicitly requests an Aster-style web page to view the video. This supersedes the former no-player-page boundary; native browser playback on the existing hosting is now included.

2026-10-18: Owner explicitly accepts the reconciled to-tickets breakdown and dependencies. Acceptance criteria now match the confirmed spec, including the public viewer and complete external verification. The original preparation tickets remain resolved.


2026-10-18:04/05 are resolved with evidence. Native public viewer and final media integration are implemented locally. Complete verification and code-review against2339dbc are underway. The latest owner instruction requires review/approval of the finished export before any push/deploy/upload; final public delivery remains pending that approval.


## Local handoff — awaiting publication approval

All authorized local implementation is ready: README/screenshots, actual final MP4/poster/captions/transcript, anonymous `/walkthrough`, native playback/seek/fullscreen, accessible chapters/downloads, recoverable media errors and session independence.280 complete production-browser journeys,80 frontend tests/12snapshots and58 backend tests pass; final9 viewer cases pass again after the export/fixture polish. Types/lint/builds pass (12pre-existing frontend Fast Refresh warnings). All8 viewer layouts320/768/1024/1440 in both themes pass. [Verification](../../../docs/verification.md).

Owner review server: `http://127.0.0.1:64998/walkthrough` (owned production runtime; safe origin/PID stored only in ignored `recording/runtime.json`). Review artifact: `frontend/public/walkthrough/project-management-walkthrough.mp4`,182.56s/1080p/25fps/silent,5,228,724bytes. Raw sources preserved locally. Capture revisionfa754a8; publication revision still absent. All commits remain local.

Status needs-info means **explicit owner approval of the finished video before publication**, as requested in the latest implement instruction. No remaining implementation question. Do not push/deploy/upload until that approval arrives. Then publish this exact reviewed package via existing GitHub/Vercel flow, verify the actual hosted URLs/content types/byte ranges/native playback/downloads and README links, record the publication commit, and resolve the final two acceptance criteria. Do not reset/change Neon visitor data. Existing backend needs no presentation change.


### Owner feedback incorporated

The owner requested correcting the ticket cell visible at1:05 and re-recording only that part. Compact ticket design and five real scenes (1:00.20–1:44.32) are complete, with a cleaned join into the original Team footage.80frontend tests/12snapshots,16Taskboard/bulk and9viewer journeys pass; full decode/hash/visual joins pass. README Taskboard screenshot updated. [Evidence](../evidence/06-taskboard-feedback.md). Current review server: `http://127.0.0.1:61758/walkthrough`. Publication remains needs-info solely for explicit owner approval and subsequent hosted delivery.


### Publication approved — 2026-10-18

The owner accepts the corrected ticket design/video and explicitly asks implement to finish and publish. This satisfies the finished-video approval gate. Claim06, publish the exact approved composite (SHA2563cf48b72c5dd56c251f7f7ea1c0764d6e764b76b27cf0c1ffdc1195b0fd31e57) and existing frontend changes, then verify actual hosted delivery/README/CI before resolution. No new approval is required for the authorized publication. Preserve shared visitor data and existing free resources.
