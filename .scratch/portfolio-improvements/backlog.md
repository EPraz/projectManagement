# Portfolio improvements after the first cloud deployment

Status: draft

## Timing and workflow

First publish to Vercel, Render and Neon with the agent-assisted deployment authorized by the owner, verify the cloud application, and add it to the portfolio. This document records later improvement candidates; it does not authorize implementation and is not an approved ticket graph. For subsequent work that can span sessions, use grill-with-docs where decisions are open, then to-spec and to-tickets before implementation.

## First cloud deployment

- Publish the local implementation commits to the repository connected to the providers.
- Replace the Render URL template in the frontend proxy configuration and set the real frontend/backend origins in the provider variables.
- Configure Neon connections and initialize its schema and Datos demo. The populated local database does not populate Neon automatically. Do not upload local environment files or database backups.
- Verify cloud health directly and through the frontend proxy, demo entry, session refresh after reloading an internal route, and updates between two browser windows.
- Verify the first visit after backend inactivity. Document any provider-specific issue discovered during those checks before expanding scope.

The deployment guide is the operational reference. Cloud-provider behavior has not yet been tested; the preparation and populated workspace have been verified locally.

## Proposed priorities

1. **Keep the public demo useful.** Limit request rates, excessive record creation and bulk operations; review the experience after visitor edits. Preserve the agreed manual restoration model unless the owner chooses another policy. A dedicated shared demo identity is already implemented; this item does not introduce personal accounts.
2. **Repair the existing backend test suite.** The 25 scaffold unit suites fail at the review base as well as the current version. Replace or repair misleading scaffolding with meaningful checks at public boundaries, and cover critical CRUD/parent-child interactions as the next changes touch them. The separate eight-test API/seed integration suite already passes.
3. **Add CI gates.** Run builds, typechecking and reliable tests before deployment. Establish a trustworthy baseline rather than hiding existing failures behind broad skips.
4. **Improve the recruiter-facing presentation.** Rewrite the README around the problem, demo link, representative workflows, architecture choices and the owner's contribution. Add current screenshots and a short walkthrough. Use Keelwatch as a reference only when its material is available.
5. **Review loading, error and recovery flows.** Check API failures, unavailable demo data, session expiry, network interruptions and failed mutations. Make retries and feedback consistent across screens; retain the existing initial wake-up explanation.
6. **Reduce unnecessary loading and API payloads.** The measured frontend build is about 1.6 MB before compression. Consider route-based splitting and deferred heavy dialogs/charts. Review nested project payloads before changing query shapes.
7. **Perform visual, responsive and accessibility QA.** Check real browsers, mobile/tablet/desktop layouts, keyboard navigation, focus, labels and contrast. These are verification candidates, not confirmed visual defects; no connected browser was available during the local preparation.
8. **Make diagnosis easier.** Improve structured logs and consistent API errors without logging credentials; make it easier to distinguish application failures, database connectivity and cold starts.
9. **Remove obsolete code and clarify contracts.** Remove the unrouted personal login/register pages and their context methods together. Review response DTOs and leftover dependencies. Keep the existing modular backend architecture unless a concrete problem calls for changing it.
10. **Simplify fresh local setup.** Add a focused environment/port/database preflight or one-command development entry point. The recent missing variables and occupied frontend ports show why early actionable feedback would help.

## Scope boundaries

- Do not implement this backlog before the owner verifies the first cloud deployment.
- Keep personal-account support, tenant isolation, paid hosting and architectural rewrites outside this backlog unless separately requested.
- Reprioritize using problems observed on the deployed demo and recruiter-facing impact.
