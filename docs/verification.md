# Verification record

Evidence date: **2026-10-18**. This is scoped verification of the delivered portfolio application, not a security/accessibility certification or a guarantee about later changes to shared demo content.

## Presentation package

| Boundary | Evidence |
| --- | --- |
| Actual product rehearsal | 17 real browser scenes; independent writer/observer sessions; ticket and child-task updates received through Socket.IO; zero observer reloads; persisted states confirmed separately through the API. [Rehearsal](../.scratch/portfolio-presentation/evidence/03-rehearsal.md). |
| Published application navigation | Eight areas, read-only, at 390/1440px; no browser exceptions or horizontal overflow. Session creation only, no content staging/reset. [Public navigation](../.scratch/portfolio-presentation/evidence/03-public-navigation.json). |
| Clean local setup | Both locked npm installs, example-only configuration with generated local secret, Prisma generation, 19 committed migrations, explicit seed, backend build, both startups and populated demo entry. Archive source `fa754a8`, Node 22, new empty local PostgreSQL database. [Setup](../.scratch/portfolio-presentation/evidence/04-setup.json). |
| README | Locally rendered Markdown, tables, all four embedded images and actual Mermaid graph; inspected overview, engineering and setup. Repository-relative links checked. This is local preview evidence, not a claim about a new GitHub publication. |
| Video | 182.56s; 1920×1080; H.264/yuv420p, 25fps, no audio, fast-start. Full decode; chronological review every two seconds; full-resolution collaboration/mobile key frames. 17 chapters and 21 English captions match the transcript. [Media evidence](../.scratch/portfolio-presentation/evidence/05-video.md), [hash/metadata](../.scratch/portfolio-presentation/evidence/05-video.json). |
| Public viewer implementation | Retained browser journeys cover anonymous entry, unavailable API, expired/existing cookies, preserved session, native playback/seek/fullscreen, keyboard chapters, 390/1440px in both themes, remembered preference, media error/retry and HTTP byte-range/caption/transcript delivery. Full suite completion is recorded below. A separate static production review also covers320/768/1024/1440px in both themes, with no API calls, overflow or browser exceptions. |

The base footage records application source `fa754a8c9f6894f98f3111db7d4ff9d7dfa8292d`; its Taskboard block was subsequently re-recorded at `2617324` for owner-requested ticket-layout feedback. Eleven other encoded shots are unchanged; Team only has its opening transition held on its own ready frame. See the [partial-retake evidence](../.scratch/portfolio-presentation/evidence/06-taskboard-feedback.md). Presentation/routing changes are subsequent local commits reviewed against the owner-confirmed base `2339dbc`. Capture and eventual publication revisions must not be conflated.

## Automated checks

- Frontend: typecheck passes; ESLint has zero errors and the existing 12 Fast Refresh warnings; 16 Jest suites, 80 tests and 12 snapshots pass.
- Backend: typecheck and lint pass; two guarded PostgreSQL-backed suites, 58 tests pass.
- Production builds pass; **280 browser journeys pass** in the complete isolated run (9.2 minutes): the retained271 journeys plus9 viewing-page journeys. The final export and strengthened expired/untrusted `jwt` cookie fixture also pass all9 focused viewer journeys on the final production build. Native paused/fullscreen key moments are visually inspected after the caption-band adjustment.

No runtime dependency or database/schema/API change is introduced by this presentation package. The browser runner owns production applications and a separate disposable local PostgreSQL database; API tests use another dedicated local database. See [development](development.md) for exact commands, safety boundaries and CI. Local results do not imply a hosted CI run has completed.

## Publication gate and delivery checks

**Owner publication approval received on 2026-10-18.** The corrected video and ticket design were accepted. Ticket06 is claimed for publication and actual hosted-delivery checks; completion will be recorded only after those checks and hosted CI pass.

After approval and deployment to the existing Vercel hosting, record the exact publication commit and verify:

1. Direct entry and reload of `/walkthrough` without a demo session, including a sleeping/unavailable API.
2. Correct poster, native play/pause/fullscreen, chapter seeking and readable web transcript on narrow/wide screens.
3. MP4 `video/mp4`, VTT `text/vtt`, actual downloads, and a real `Range: bytes=0-1023` request receiving 206 plus the matching `Content-Range`.
4. The deployed MP4 hash matches [the reviewed export](../.scratch/portfolio-presentation/evidence/05-video.json); README images, demo/video links and existing API/deep links remain usable.
5. No visitor data was reset or changed for publication.

Do not resolve publication solely because local checks passed. The static video/viewer work independently of Render, while joining the interactive demo can still incur its free-service wake-up delay.


## Owner Taskboard feedback — subsequent focused verification

The compact ticket summary and actual partial retake pass typecheck/lint/builds,80frontend tests/12snapshots,16Taskboard/bulk browser journeys and9viewer journeys. Layout captures cover320–1440px and both themes. The composite remains182.56s, with unchanged chapters/captions, full decode and inspected join/paused/fullscreen frames. Its hash matches the locally served build. The280-journey run above predates this small UI adjustment; these subsequent focused checks are not represented as another full run. No backend code, schema or dependencies changed. The owner subsequently approved this corrected export and authorized publication.
