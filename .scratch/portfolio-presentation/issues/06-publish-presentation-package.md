# 06: Publish and verify the coherent presentation package

Type: task
Status: ready-for-agent
Blocked by: 04, 05

## What to build

The public repository and existing hosting offer a consistent README, current images, live demo, and an Aster-style public walkthrough page with playable/downloadable video and transcript.

## Acceptance criteria

- [ ] Deliver the owner-requested public walkthrough route in the existing frontend, using native HTML video controls, a reviewed poster and media, chapter access, readable English transcript and MP4/caption downloads.
- [ ] Direct viewing/reload works without an existing demo session or forced authentication; keep a clear return-to-demo path and existing API/deep-link behavior.
- [ ] Integrate the real reviewed artifacts using existing free hosting, without inventing URLs, adding a paid service or writing a custom playback engine.
- [ ] Verify public README/poster links, video playback/seeking and native fullscreen affordance, chapter navigation, readable transcript, downloads, mobile reflow and media byte ranges on the actual deployed page/assets.
- [ ] Record artifact metadata/source revision, exact public verification and any concrete limitations.
- [ ] Preserve shared production visitor data, deployment boundaries and unrelated resources.
- [ ] Leave a clear next-session entry point and resolve tickets only when their actual outcomes are complete.

## Comments

2026-10-18: Reconciled with the completed quality/redesign and the owner-confirmed Aster/mobile/WebSocket presentation decisions. Preserve the original approved six-ticket breakdown.

2026-10-18 owner addition: explicitly requests an Aster-style web page to view the video. This supersedes the former no-player-page boundary; native browser playback on the existing hosting is now included.
