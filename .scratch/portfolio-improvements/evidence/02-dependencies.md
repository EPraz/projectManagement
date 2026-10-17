# Ticket 02: dependency assessment and remediation

Date: 2026-10-17. Base: 772453d. The owner explicitly authorized necessary current package versions, including major updates, after the initial assessment. All changes preserve the application architecture, shared demo, database connection convention and hosting model.

## Assessment and changes

The dated [before snapshot](02-before.json) records original lockfile hashes and audit counts. The [package/disposition ledger](02-package-dispositions.json) records changed package locations, final hashes and every remaining reported package's root/disposition. Raw registry reports and local validation logs remain ignored task artifacts.

- Backend: update the Nest 11 family together, JWT integration, Express/body parsing, validation and Socket.IO transport/parser dependencies within the existing application framework majors. Direct ranges now reflect the tested patched versions. Prisma/client stay on the existing Prisma 6.5 lock; no schema/migration or database change is part of dependency remediation.
- Remove backend TypeORM integration, TypeORM, pg, bcrypt/password types and passport-local after checking source/scripts for consumers: the shipped application uses Prisma and demo/JWT authentication. Remove unused backend SWC tooling and ts-loader after checking the standard Nest/TypeScript build configuration and verifying clean production compilation.
- Declare dotenv directly because existing seed/maintenance commands import it; those scripts previously relied on a transitive dependency.
- Frontend: update React Router 7, Socket.IO client, styled-components 6 and the applicable production transitive packages. Preserve React 18, MUI 6 and the existing routes/components.
- Update the affected compatible lint/build dependency chains and Vite 6.4.4; keep their real checks enabled.
- Migrate both test runners/types to current Jest 30.5.2 and the frontend environment/globals together. ts-jest 29.4.15 explicitly supports Jest 30. Update the frontend React/SWC Vite plugin to current 4.3.3, which supports the retained Vite 6.
- The SWC 1.16 native carrier rejects this Windows filesystem's ancestor cache permissions. Reproduce the actual native-loader error, inspect the upstream carrier requirements, then constrain SWC to compatible 1.15.47 with a scoped dependency override. It satisfies plugin 4's declared `^1.15.46` requirement and passes clean native installation/build. No filesystem permission change or disabled native-cache security check is required. [SWC carrier behavior](https://github.com/swc-project/swc/blob/main/docs/native-addon-carriers.md).
- Jest's newer JSDOM serializes red as RGB. A retained status-indicator test exposed that representation difference. Update its expected canonical RGB value; preserve the red-color assertion and all twelve original snapshots without regeneration. [Jest 30 migration guidance](https://jestjs.io/docs/upgrading-to-jest30).

## Applicability

Lockfile production classification is not proof of reachability. Inspection distinguished the server request/JWT/validation/socket stack, bundled browser navigation/styling/socket dependencies, and build/test tools. The unused TypeORM graph was removable rather than a reason to migrate ORMs.

- Nest's file-type advisory concerns upload validation; this application exposes no file-upload workflow. The compatible Nest family is nevertheless updated. This is not a claim that an upload exploit was reproduced in the application. [Advisory](https://github.com/advisories/GHSA-cj7v-w2c7-cp7c).
- React Router's server/framework-mode advisories do not by themselves establish exposure in this static BrowserRouter SPA. Navigation dependencies were patched without claiming every listed SSR issue was reachable. [SSR hydration advisory](https://github.com/advisories/GHSA-337j-9hxr-rhxg).
- Socket parsing is relevant to the real transport. Update both sides and verify an independent actual client receives a confirmed, credential-filtered event. No malicious traffic/load test is sent to the public deployment. [Parser advisory](https://github.com/advisories/GHSA-2m8v-j782-fhvr).

## Results and remaining disposition

| Audit | Backend | Frontend |
| --- | --- | --- |
| Original complete lockfile report | 102 entries, including 5 critical / 63 high | 69 entries, including 1 critical / 55 high |
| Final complete lockfile report | 20 moderate, zero high/critical | 20 moderate, zero high/critical |
| Final `--omit=dev` report | Zero entries | Zero entries |

The twenty moderate entries per application propagate from **one remaining origin**, sprintf-js through argparse → js-yaml CLI metadata → Istanbul's configuration loader → test transforms. The final ledger maps every reported dependent to that origin. npm reports the latest upstream sprintf-js as 1.1.3, still in the advisory's affected range; no supported patched upstream version is recorded. Updating Jest to current 30.5.2 does not remove this entire indirect tooling chain. Do not follow npm's suggested test-runner downgrades or force an incompatible parser override merely to erase the report. [sprintf-js advisory](https://github.com/advisories/GHSA-hp3w-g68c-fv3c).

Disposition: keep this known development/build-tool limitation visible and revisit a supported upstream removal/fix when available. It is not a public HTTP handler or browser data feature. Tests/configuration operate on repository-owned inputs; this assessment does not certify arbitrary hostile inputs as safe. Render's build still installs development dependencies, so production audit classification does not claim those files are physically absent from the deployment. No advisory is suppressed.

ESLint remains on the compatible 9.39.5 line and its support warning is recorded; evaluating its newer major and accompanying frontend rule-policy changes remains a maintenance follow-up. SWC's override must be revisited when the current carrier can load under the contributor's standard Windows environment. These do not require a framework or ORM rewrite to deliver the approved product workflows.

## Validation

- Node 22 clean lockfile installs for both applications. The installed package graph is checked against the final lockfiles; later direct-range synchronization changes root metadata only.
- Backend: Prisma client generation/schema validation, types, non-mutating lint and production build pass; all 25 HTTP/seed/startup tests pass with the new Nest/Jest stack and isolated PostgreSQL.
- Frontend: types, non-mutating lint and production build pass; all 57 tests and 12 unchanged snapshots pass with current Jest/JSDOM. The 40 existing workflow warnings remain visible and assigned to later tickets.
- Real Chrome at 1440×1000: demo entry, both fully rendered populated project cards, navigation to Orbit and authenticated deep-link reload pass. The resulting screenshot was visually inspected; existing appearance is retained. No video was recorded.
- Separate actual Socket.IO client: confirmed authenticated local project mutation → expected independent project update, with password/refresh fields absent. Only the isolated clean demo's metadata was touched; public and old databases remain untouched.
- Updated build remains one main asset, 1,615.98 kB raw / 477.77 kB gzip. No loading improvement is claimed here; ticket 13 owns measured code loading.

No forced audit fix, credential disclosure, global Node/Windows permission change, public fixture cleanup or hosting cost was introduced. The owner's explicit design/readiness checkpoint remains required before recording.
