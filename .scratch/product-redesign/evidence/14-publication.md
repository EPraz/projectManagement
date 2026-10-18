# Ticket 14: public release verification

Release revision: `0d32eb3ae2b6c8a7341d92dddcf8eefb8f8ab517`, fast-forwarded from the verified feature branch to GitHub main. Final code review compares with the owner-confirmed d355d98. No unrelated local/prototype artifacts were published.

## Provider revisions

- Frontend: https://project-management-murex-pi.vercel.app. Existing Vercel project `prj_MA4JnbztEkSLNthWBEEAAPkKSaYs`, production deployment `dpl_9NVwSr7oLJHy1mx86NnRY9Pr11uA`, READY. API inspection confirms the release SHA and production alias.
- Backend: https://project-management-api-5xe1.onrender.com. Existing Render Free service `srv-db9shbmq1p3s739eivp0`, deploy `dep-dba9cd3ncjis73cn5h1g`, live at the same release SHA.
- Both were triggered against the published Git revision through authenticated existing provider clients. No service/plan/domain/configuration was added or changed. Current DATABASE_URL/Neon data are preserved; startup/build does not reset/reseed visitor content. No new migrations were needed.

## Public verification

[HTTP/session/socket results](14-cloud-http-socket.json): direct/proxied health, anonymous rejection, disabled personal auth, populated2-project reads, credential exclusion, SPA deep link, secure host-only cookies, independent visitors, refresh/logout behavior and two real direct WebSocket clients receiving a confirmed update all pass. The bounded update resubmitted existing project description/actor: content stayed intact, normal modification metadata may advance. No fixture/reset/load test.

[Real Chrome production journey](14-cloud-browser.json): both themes at390/1280, all8 project sections populated, board reload, ticket/task deep links including reload, retrospective editor/footer,32 still captures and zero browser exceptions. Initial QA used an exact required-field label that included an asterisk; it was corrected to the existing real Ticket title/Task title selectors and the entire journey passed. No application fix or relaxed behavior assertion was needed. Public Taskboard light1280, retrospective dark390 and team dark1280 captures were inspected. Diagnostic captures stay under ignored `backend/.tmp/studio/cloud-c`; local full visual evidence remains in the committed [production review](../../../.design/product-redesign/PRODUCTION_REVIEW.md).

## Hosted CI

Required Quality run: https://github.com/EPraz/projectManagement/actions/runs/39116778240 at the release SHA. All three jobs finished **SUCCESS** from fresh locked installs: frontend (80 tests/12 snapshots, types/lint/env-isolation/build), backend (58 tests, schema/types/lint/build) and isolated production browser (257 journeys). The final capture waits/path were exercised against production assets in the hosted run. The subsequent closure commit changes tracker/evidence only; deployed application revision remains the verified release.

## Preserved limits and rollback

The release retains shared fictional demo access, free Vercel/Render/Neon infrastructure, existing domains/session/proxy/socket configuration and manual restoration only. No paid resources, keepalive automation, public data reset or recording. Bounded active checks do not exercise provider idle/cold-start latency. Existing wake-up/retry feedback is retained and covered locally; hosting may still sleep.

Rollback references: previous Vercel production deployment `dpl_HQWmE9bBcc1bgbcVcr5Bbn1QdCop`; previous live Render deploy `dep-dba4ai6q1p3s73a95mdg` at b2a6191. Repository baseline d355d98 is preserved. Prior deployments can be restored without resetting Neon; no rollback was necessary.

The deferred English recruiter README and silent walkthrough follow owner feedback. The explicit owner final visual/readiness confirmation remains mandatory before recording. No walkthrough, video or trace has been recorded.
