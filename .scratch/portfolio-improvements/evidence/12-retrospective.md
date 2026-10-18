# Ticket 12: retrospective recovery

Review base: f7c71d03ea224cee70e2655e53735abe76ad40ab. Same Windows/Node22.20.0 clean locked install, local PostgreSQL17 port55433 and isolated databases as preceding tickets. Public Neon and owner apps are untouched. No dependencies or schema changed.

## Characterization and corrections

- A real HTTP regression first failed: a POST supplying another fictional author ID persisted that identity. Creation now uses the authenticated demo ID and includes confirmed author data. Editing preserves original author/sprint, rejects reparenting, trims content and rejects blank/null/invalid types. Missing sprint/card IDs return404; missing/empty/repeated collection scope returns400. Existing stored cards remain intact.
- A real browser regression first failed: a503 closed the create form and discarded the draft. The feature-local useRetrospective now owns authenticated explicit commands, response confirmation, keyed pending and recoverable reaction errors. Presentation derives cards directly from the canonical selected sprint. Four unused old request hooks and void outcome/mirror-state helpers were removed with callers migrated. Shared form/delete boundaries await actual outcomes; delete identity is the card ID.
- Reactions submit desired boolean state. The server serializes all retrospective writes with the existing parent-sprint transaction helper, captures the complete sprint inside the transaction and emits after commit. Desired state is idempotent for the shared demo across independent sessions. A legacy client's array can only express that demo's own intent; it cannot erase or impersonate other reactions, and supplied counts cannot override the persisted unique count. There is no invented per-visitor identity.
- The former Anonymous Feedback control was only a visual blur. It is labelled Blurred feedback; Hide Names is separately display-only and hides author headers, reaction attribution and author-specific deletion copy. No anonymity/privacy guarantee or new persistence model is added.
- The header wraps existing controls on narrow screens, actions are named, reactions expose pressed/pending state and card keys use stable IDs. Keyboard form labels/focus and390/1280px layouts pass; the390px form screenshot was inspected. Three existing category styles share one small icon/color map.

## Verification

Initial red evidence: retro-author-red-12.log (1 failed/39 passed HTTP tests, wrong author) and retro-form-red-12.log (failed retained-dialog assertion). Both corrected regressions pass. All42 HTTP/startup tests pass, including validation, persisted edit/list/deletion, concurrent same-demo reactions, legacy preservation and independent credential-free committed socket snapshots.

All nine new browser journeys pass: failed create retention; create/edit/delete failures and persisted retries; reaction failure/retained count/retry/reload/unlike; pending duplicate blocking; two independent browser sessions and sprint-scoped updates; late response preserving the next sprint draft; honest hide/blur display;390/1280px keyboard focus and reachable forms.

Frontend types pass; frontend lint0 errors/15 visible warnings (down from17, no suppressions). Backend types/build pass and final lint is checked after correcting a Jest matcher any-assignment at its response boundary. Full integrated browser/Jest/build and two-axis review results will be appended before closure.

Ticket11 hosted CI39089695839 completed successfully. Final presentation remains deferred through16 and explicit owner design/readiness confirmation before recording.

## Review correction and final verification

Standards P2 exposed a bootstrap/fixture mismatch: production implicit DTO conversion accepted liked="false" as true. A probe against the actual isolated bootstrapped API confirmed200/likes1 before the correction and400 afterward. Main and HTTP fixtures now share createValidationPipe, preserving explicit DTO conversions without implicit JSON-body coercion. The strict string-boolean regression is retained. All42 API/startup tests pass under this shared configuration; backend rebuilt successfully.

The first integrated run passed77/78; the demo-entry failure occurred while this agent restarted the owned backend to apply the validation correction. This overlapping run is not final evidence. An uninterrupted exact rebuilt run is required. All77 Jest tests/15suites/12snapshots, frontend types and build passed; bundle1,627.35kB raw/483.49kB gzip. No snapshots were regenerated.
