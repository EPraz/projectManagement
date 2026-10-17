# Ticket 05 — confirmed task movement

Date: 2026-10-17. All fixtures and browser mutations used the isolated PostgreSQL databases from ticket 01. The public Neon database and personal data were not used.

## Reproduced defects and corrections

- The focused task-update regression first failed because dragging sent `xana@xana.com`. The interaction now receives the authenticated demo email. A separate HTTP regression proved that the server trusted a supplied actor; the guarded controller now takes the author from its authenticated request. Assignee and actor remain separate, and this shared demo identity makes no claim of identifying individual visitors.
- An unknown drop destination previously sent a no-op request. It is now ignored, along with missing actor/task, cancelled and unchanged drops.
- Two drops while a request was pending originally made two requests. A task-specific pending set now guards the request and survives handler recreation through Layout's ref. The guard releases after failure so retry works.
- The old handler sent a stale ticket collection to state after success. It now applies only the confirmed task through a functional update of current ticket state. No optimistic success is displayed.
- An HTTP regression first accepted a task status belonging to another project. The service now resolves the task's ticket project and validates the target status before writing. Unknown statuses return 404; cross-project or empty statuses are rejected. The DTO prevents moving the task to a different ticket through unsupported fields.
- A real drag revealed that the response omitted assignedUser, making a saved card lose its displayed assignee. The update response now includes that relation, with the existing credential filter applied. The HTTP regression and browser check retain the assignee.

## Retained checks

- Nine focused interaction cases pass: actor, invalid destination, one in-flight request, null/undefined save failures and retries, cancelled/unchanged drops, missing actor/task, and a pending guard shared across recreated handlers.
- Three added API cases cover server-controlled actor/persistence, cross-project rejection, and real Socket.IO delivery with an independent client. Rejected unknown-status, unsupported ticket reassignment and unauthenticated mutations retain the original state. One subsequent confirmed mutation yields one event; the independent session reads the persisted result. HTTP and socket payload assertions reject credential fields.
- Socket.IO client 4.8.4 is a backend development dependency solely for the actual protocol test; it matches the existing frontend client. The subsequent full lockfile audit still has zero high/critical findings and the same 20 moderate tooling entries documented in ticket 02.
- Final backend suite: **28 tests, 2 suites**. Final frontend suite in CI mode: **74 tests, 15 suites, 12 preserved snapshots**. Types, lint and production builds pass in the clean Node 22 checkout. Backend lint has zero warnings; frontend retains the same 40 visible warnings owned by later workflow tickets.

## Actual Chrome workflow

Entered through Explore demo and used the task board with real pointer dragging. A task moved into Done, persisted after reload and retained its displayed assignee. A controlled local HTTP 503 kept the prior saved position and showed the existing error message. Removing the failure allowed retry. Finally, delaying one task's HTTP response while a separate authenticated request updated another task demonstrated that the late response preserves the second change received by socket. The temporary concurrent title was restored through the API; no automatic seed reset was used.

The task's existing status-drag capabilities remain; ticket ordering controls stay disabled. Diagnostic browser script, screenshots and logs are ignored local QA artifacts under `backend/.tmp/quality/`. No walkthrough recording occurred.
