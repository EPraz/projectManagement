# Published portfolio presentation — 2026-10-18

The owner accepted the corrected Taskboard design and final video, then explicitly authorized publication. Published application/package revision: `298580bfb1d809f8c06340906c2005b1185ee594` on GitHub main. Earlier approval-gate notes are history; approval is now satisfied.

## Existing production hosting

- Viewer: https://project-management-murex-pi.vercel.app/walkthrough
- Interactive demo: https://project-management-murex-pi.vercel.app
- Repository/README: https://github.com/EPraz/projectManagement
- Vercel reports success for298580b through its GitHub integration: https://vercel.com/eprazs-projects/project-management/3tWcy6oWy8wf7tYrZH4UX8qKKmio
- No new provider resource, domain, plan or environment setting. Backend source is unchanged; its existing API and Vercel REST proxy are verified. No database seed/reset or visitor-content mutation.

## Actual public delivery

The public MP4 is exactly the approved export:5,175,291bytes,182.56seconds, SHA-256 `3cf48b72c5dd56c251f7f7ea1c0764d6e764b76b27cf0c1ffdc1195b0fd31e57`. Requests return `video/mp4`; a real bytes0–1023 request returns206 and the correct Content-Range/body. Poster JPEG matches the reviewed image. English VTT and Markdown transcript have matching content; Windows/Linux Git newline differences are normalized in text comparisons, while video/JPEG remain byte-verified.

[Public viewing result](06-public-delivery.json): actual Chrome at 390/1440px in light/dark; direct entry/reload with an expired/untrusted cookie and API requests blocked; initially paused playback, chapter seeking, real playback, native fullscreen, visible transcript and all three actual downloads pass. Download contents are verified rather than assuming the platform's filename hint. Four layouts have zero API calls/browser exceptions/horizontal overflow. An existing demo cookie survives viewing and return-to-demo works.

[Published README](06-published-readme.json): inspected actual GitHub rendering; overview, poster, current Taskboard and mobile images all load and the primary video link opens the real viewing page. GitHub's rendered HTML contains the architecture Mermaid block.

[Public navigation](06-public-navigation.json): eight project areas at 390/1440px remain usable, with zero exceptions/overflow/content mutations. The public Taskboard displays the compact ticket summary and no unavailable ordering controls. Existing `frontend/scripts/check-deployment.mjs` also passes JSON/slash routing, secure demo sessions, populated project/user reads, errors and SPA deep links. These checks perform session operations and reads only.

## Hosted quality

Quality run: https://github.com/EPraz/projectManagement/actions/runs/39151051953 at `298580bfb1d809f8c06340906c2005b1185ee594` is completed successfully. All three jobs pass: frontend (16 suites, 80 tests, 12 snapshots), backend (two suites, 58 tests), and browser (280 production journeys, 7.9 minutes). Types, lint, builds and isolation checks pass; the 12 existing frontend Fast Refresh warnings remain unchanged. PostgreSQL fixtures are disposable GitHub services, never Neon.

## Capture versus publication

Base footage source `fa754a8`; Taskboard retake source `2617324`. The published composite preserves 17 chapters/21 English cues and includes real two-context WebSocket events/API persistence. Team's own ready-frame transition is ordinary editing; eleven other encoded shots are identical. [Media provenance](05-video.json) and [owner feedback verification](06-taskboard-feedback.md) distinguish recording from the publication revision.

The backend can still sleep on free hosting. The static walkthrough does not require it. Keep the existing plans, data and deployment boundaries; no keepalive/reset was introduced.

## Final review and closure

Two independent read-only review axes cover `018ac51..40d7def` and the overall owner-confirmed2339dbc baseline: Standards 0, Spec 0 material findings. Ticket 06 is resolved; all six presentation outcomes are complete. Subsequent commits update only QA/evidence/documentation, with frontend/backend/deployment files and approved media unchanged from298580b. The complete hosted suite therefore remains tied to the exact application/package release, without representing documentation closure as a new application test run.
