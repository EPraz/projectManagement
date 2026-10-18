# Verified presentation rehearsal

Owner-confirmed review base:2339dbc. Existing application source is identical to the published65fa1ef workspace; these planning/recording changes do not alter product behavior. Runtime explicitly uses loopback API/frontend and `project_management_presentation`, a dedicated copy of the fictional local fixture. No normal private environment or Neon destination is loaded.

All17 accelerated rehearsal scenes pass: entry/Projects/Overview, hierarchy/Backlog, ticket inspection, Taskboard, ticket transition, independent observer, task transition/observer, team/capacity/goals, retrospective, actual390px mobile editing and explicit dark preference. The same recorder will capture at normal pacing for the finished take; this accelerated run is not a final video.

Independent browser contexts receive two actual `ticketUpdated` WebSocket events. The first changes ticket7 (“Build the sprint overview”) to CODE_REVIEW; the second contains task13 (“Implement the workflow”) in IN_PROGRESS. The observer has zero main-frame navigations/reloads after setup; the recorder injects neither reads nor results into it. A separate authenticated API read confirms both persisted states. Zero browser exceptions. See [machine-readable rehearsal](03-rehearsal.json).

The recording's synthetic drag gesture was unreliable under accelerated annotation timing. The retained product drag regression passes independently (failure recovery and canonical task movement). The finished presentation instead uses the existing accessible task-state editor and shows the actual column transition in both sessions. No product behavior/test was changed to accommodate filming, and captions do not claim an onscreen drag gesture.

Public read-only verification visits eight areas at390/1440, with zero browser exceptions or horizontal overflow. Only normal demo session creation occurs; no shared content mutation or reset. See [public navigation](03-public-navigation.json). Public write operations are not staged for this take.

The scene/caption outline is executable in the recorder, with normal pacing targeting about3minutes and a3:30 editing ceiling. Raw clips, tools and runtime logs are isolated in the ignored recording directory. The owner will review the actual export before any push/deploy/upload of the video package.
