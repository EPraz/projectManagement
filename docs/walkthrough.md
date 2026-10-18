# Product walkthrough

A silent **3:03, 1920 × 1080, 25 fps H.264** tour with English text embedded in the picture. It follows Orbit and Sprint 2 — Delivery through planning, execution and feedback.

[Watch online](https://project-management-murex-pi.vercel.app/walkthrough) · [Download MP4](../frontend/public/walkthrough/project-management-walkthrough.mp4) · [English captions](../frontend/public/walkthrough/project-management-walkthrough.vtt) · [Full transcript](../frontend/public/walkthrough/transcript.md)

The viewing page is public and uses native browser controls. It does not require or renew a demo session, and its static assets work independently of the API. Chapters seek the same video; the readable transcript and downloads offer alternatives to playback. Captions are already in the picture, so a second subtitle track is not enabled over them.

## Chapters

| Start | Chapter |
| --- | --- |
| 0:00 | A workspace for delivery |
| 0:14 | Project context, sprint focus |
| 0:22 | Connect the bigger picture |
| 0:32 | Plan the selected sprint |
| 0:40 | Requirements, estimates and child tasks |
| 1:00 | Tickets in rows. Tasks by state. |
| 1:08 | Session A · update the ticket |
| 1:16 | Session B · no refresh |
| 1:24 | Session A · move a child task |
| 1:34 | Session B · work stays in sync |
| 1:44 | People behind the work |
| 1:52 | Plan available capacity |
| 2:02 | Track the sprint outcome |
| 2:12 | Make room for feedback |
| 2:26 | Same workflow. Smaller screen. |
| 2:42 | Two complete appearances |
| 2:50 | Built across the stack |

## What the collaboration segment proves

Session A changes a ticket from In Progress to Code Review, then changes one of its child tasks from Todo to In Progress using the task-state editor. The task moves to its own execution column. Session B is a separate authenticated browser context and receives the real Socket.IO updates without refresh or an injected read. Its clips replay those same events from the observer's perspective; they are not a fabricated simultaneous split screen. A separate API read confirms the persisted ticket and task states.

Ticket state and task state remain distinct. Moving work into Code Review does not claim that project completion increased. The mobile segment is an actual 390px browser viewport, including a brief dark appearance, rather than a native app or a physical-device recording.

## Source and editing

Recorded locally on 2026-10-18. Base footage uses application revision `fa754a8c9f6894f98f3111db7d4ff9d7dfa8292d`; the Taskboard/collaboration block (1:00.20–1:44.32) was re-recorded at `2617324` after the owner's ticket-layout feedback. Both use production applications and a dedicated loopback API/PostgreSQL database with fictional data; no public visitor content is changed for filming.

Only those five scenes were re-recorded. Eleven other encoded shots remain byte-identical. Team retains its original footage, with its first 1.8 seconds held on its own first ready frame to remove a brief old-Taskboard flash at the join. Duration, chapters and captions are unchanged. Per-source revisions and hashes are recorded with the composite export.

The capture contains real clicks, editors and backend results. Editing adds pointer/click cues, chapter labels, English captions and one gentle close-up. Independent source clips use pre-roll synchronization markers; the markers are outside the final edit. Desktop/observer clips keep a landscape frame; only mobile uses a portrait composition. Raw takes, logs and tools remain in ignored local storage. The [export record](../.scratch/portfolio-presentation/evidence/05-video.json) records timing, source revision, verification and the final file hash.

## Reproduce a take

Install the application's locked dependencies and prepare a **new dedicated loopback** PostgreSQL database ending in `_presentation`, using the development guide's migrations and explicit seed. Never select the normal private/public database. From the repository root in PowerShell:

```powershell
$env:PRESENTATION_DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:5432/project_management_presentation'
node .scratch/portfolio-presentation/qa/start-local.cjs
```

This builds and starts owned production applications, records only safe local origins/database names, and never seeds or resets a database. Keep it running. In another terminal:

```powershell
node .scratch/portfolio-presentation/qa/record-walkthrough.cjs --rehearsal
node .scratch/portfolio-presentation/qa/record-walkthrough.cjs
```

The recorder stages only its selected fictional local ticket/task and preserves raw takes and timing metadata under `.scratch/portfolio-presentation/recording/`. The selected runtime must be loopback, a presentation database and a production build. An accelerated rehearsal is not a final take.

Python rendering tools are optional and separate from application dependencies. Install them into the ignored tool directory, then pass the actual take directory from `recording/latest-take.json`:

```powershell
python -m pip install --target .scratch/portfolio-presentation/recording/tools imageio-ffmpeg==0.6.0 Pillow==13.0.0
python .scratch/portfolio-presentation/qa/render-walkthrough.py <take-directory>
```

Rendering creates the MP4/poster/VTT/transcript, matching viewer metadata, a full-decode report and chronological review sheets. Review the entire sequence and full-resolution key moments, then run the viewer/browser checks. No recording tool is deployed with the application.

To replace only the Taskboard block after an interface adjustment:

```powershell
node .scratch/portfolio-presentation/qa/record-walkthrough.cjs --taskboard-only
python .scratch/portfolio-presentation/qa/compose-taskboard-retake.py <original-take-directory> <partial-take-directory>
python .scratch/portfolio-presentation/qa/render-walkthrough.py <composite-directory>
```

The composer requires the five real scenes and verified synchronization, retains the original chapter budgets, and hashes the reused encoded shots. Raw sources remain preserved; inspect the joins and verify the actual new export before publication.

## Publication status

This package is prepared locally for the owner's review. The intended online links above become valid after approval and deployment. **Video publication is pending explicit owner approval**; public media delivery is not yet verified. The capture source revision is separate from the eventual publication revision. After approval, verify the deployed viewing page, poster, MP4/VTT downloads, content types, byte-range seeking and playback on existing hosting. See [verification](verification.md).
