# Ticket 13 integration evidence

Implementation through ad0368f; final bounded verification-only delta reviewed independently before release. Fixed owner-approved review base: d355d98.

## Required checks

- Native isolated production browser lifecycle: **257/257 passed in 9.0 minutes**, one worker, zero retries/skips, video/trace off. Real PostgreSQL `project_quality_browser_test` on loopback; private Vite env loaders disabled by the retained actual asset-build sentinel. Both applications build before Chrome journeys and owned processes stop afterward.
- Final capture-wait/path correction: **15/15 additional integration checks passed**, including eight sections across both themes/six CSS widths, preserved former-member assignment, 200%-equivalent reflow/root-text enlargement and landscape editor keyboard/footer focus. No application source changed after the production run. Hosted CI reruns the final waits against production assets.
- Frontend: **80 tests /16 suites /12 snapshots passed**. Two inspected presentation snapshots were updated (navigation radius and Task columns label); original behavioral assertions remain, with a single-toggle assertion added. Types pass. Lint: zero errors, 12 existing visible warnings; no suppressions. Browser environment-isolation build check passes.
- Backend: Prisma schema valid; types/lint/build pass. **58 HTTP/WebSocket/startup tests /2 suites pass** against the separate guarded `project_quality_test` loopback database. No fixture points at Neon or normal user data.
- All application builds pass under Node22 and committed lockfiles. The serial browser global budget is now20min and its CI job30min for expanded257-journey coverage; per-test/action limits, guards and zero retries remain.

## Visual/workflow review

[Production review and48 populated screenshots](../../../.design/product-redesign/PRODUCTION_REVIEW.md) cover Overview, Taskboard, Backlog, hierarchy, goals, capacity, team and retrospective in light/dark at390/768/1280. Additional retained per-ticket captures cover Projects/entry/editors and320/1024/1440 layouts and failure/pending states. All32 measured shared semantic contrast pairs pass; [measurements](13-contrast.json). This is targeted verification, not exhaustive accessibility certification.

Initial exploratory integration captures used a stale/parent heading and sometimes caught deferred loaders. Those images were rejected. The corrected test waits for the expected heading, completed deferred surface and relevant functional regions; captures now resolve from the module path regardless of invocation cwd. Independent read-only captures and the final15 checks confirm populated surfaces.

Project/sprint changes, deep links, protected draft/save/delete return paths, status separation, canonical socket reconciliation, no-matches/loading/error/retry/pending conditions are covered across the retained and new browser journeys. Desktop task drag remains within a ticket, with explicit status change for touch/keyboard. No public fixture/reset/media recording was performed.

## Code/conventions

[Independent Standards and Spec reviews](13-review.md), including the final bounded verification delta: Standards zero hard violations/two nonblocking maintenance judgments; Spec zero material findings. Their axes remain separate. Nine obsolete stylesheets were removed only after confirming no source/test consumers. Prototype routes/data/controls remain outside production.

Existing large coordination/composition files are retained as scoped exceptions: Layout569 lines coordinates the canonical workspace, DialogsContainer400 composes existing forms, DialogForm295 owns protected schema forms, and BacklogBoard285 composes its responsive representations. Their real contracts are verified; a mechanical split during visual delivery would not establish a deeper boundary. Future editor-link and draft-change deduplication is recorded without broadening this release.

## Resource measurement and limits

[Fresh local production resource measurements](13-loading.json), Node22/Chrome, no throttling: entry157624 encoded JavaScript body bytes/1request; Projects291985/23; Overview343182/38; Taskboard368876/45. Entry artifact471.33KB raw/157.62KB gzip; no browser exceptions. Routes and board panels remain deferred, including tested download failure/reload recovery. The data router supports real draft navigation guards; entry cost is a tradeoff, not a claimed speed improvement. Historical quality measurements are not presented as a controlled same-revision benchmark. Locally hosted licensed TTF weights are~205KB each; compression is a future optimization.

No cloud idle/cold-start latency, exhaustive device/assistive technology coverage or faster hosted performance is claimed. Hosted CI and actual deployed revision/HTTP/browser/socket checks belong to ticket14. Shared free demo data, domains and permissions remain preserved. No video before the owner's explicit final visual/readiness approval.
