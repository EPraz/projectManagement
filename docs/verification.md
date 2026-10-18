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
| Public viewer implementation | Retained browser journeys cover anonymous entry, unavailable API, expired/existing cookies, preserved session, native playback/seek/fullscreen, keyboard chapters, 390/1440px in both themes, remembered preference, media error/retry and HTTP byte-range/caption/transcript delivery. Full suite completion is recorded below. |

The video records application source `fa754a8c9f6894f98f3111db7d4ff9d7dfa8292d`, matching the shipped redesigned workspace. Presentation/routing changes are subsequent local commits reviewed against the owner-confirmed base `2339dbc`. Capture and eventual publication revisions must not be conflated.

## Automated checks

- Frontend: typecheck passes; ESLint has zero errors and the existing 12 Fast Refresh warnings; 16 Jest suites, 80 tests and 12 snapshots pass.
- Backend: typecheck and lint pass; two guarded PostgreSQL-backed suites, 58 tests pass.
- Production application builds and complete isolated browser suite: **running at preparation time; final outcome will be appended before owner handoff**.

No runtime dependency or database/schema/API change is introduced by this presentation package. The browser runner owns production applications and a separate disposable local PostgreSQL database; API tests use another dedicated local database. See [development](development.md) for exact commands, safety boundaries and CI. Local results do not imply a hosted CI run has completed.

## Publication gate and delivery checks

**Prepared locally; not published.** The owner explicitly requires reviewing/approving the finished video before push, deploy or upload. The README contains intended deployment URLs; their new video/page assets are not yet claimed to be live. Ticket06 remains open for this approval and final public checks.

After approval and deployment to the existing Vercel hosting, record the exact publication commit and verify:

1. Direct entry and reload of `/walkthrough` without a demo session, including a sleeping/unavailable API.
2. Correct poster, native play/pause/fullscreen, chapter seeking and readable web transcript on narrow/wide screens.
3. MP4 `video/mp4`, VTT `text/vtt`, actual downloads, and a real `Range: bytes=0-1023` request receiving 206 plus the matching `Content-Range`.
4. The deployed MP4 hash matches [the reviewed export](../.scratch/portfolio-presentation/evidence/05-video.json); README images, demo/video links and existing API/deep links remain usable.
5. No visitor data was reset or changed for publication.

Do not resolve publication solely because local checks passed. The static video/viewer work independently of Render, while joining the interactive demo can still incur its free-service wake-up delay.
