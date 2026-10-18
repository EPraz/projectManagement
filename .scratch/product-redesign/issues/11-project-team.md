# 11: Manage the project's team membership

**What to build:** A visitor searches the project's members, adds people from the existing catalog and removes membership through a clear C team view on all sizes.

**Blocked by:** 02 — Navigate a project with shared sprint context.

**Status:** resolved

Type: task

- [x] Present searchable real project membership with relevant existing member/role information; make project-wide scope explicit.
- [x] Preserve add-from-catalog/remove and current validation/restrictions. Do not create personal accounts, edit roles or add a new user-management feature.
- [x] Search/no matches, empty membership, catalog loading, pending add/remove, duplicate membership, failed confirmation and retry provide useful outcomes without false success.
- [x] Membership changes reconcile affected workspace/capacity data according to existing contracts and cannot appear on the wrong project after navigation.
- [x] Verify add/remove/search and membership consistency in both themes and narrow/wide layouts without changing account permissions.

## Shared completion requirements

- Apply the approved C / Project studio direction: white/azure light and neutral-carbon dark, loaded Plex, full mobile functionality, the real status catalog and every existing supported field/operation. Prototype fixtures and simplified sample controls are not production contracts.
- Keep meaningful loading/empty/no-matches/error/retry/pending/validation and applicable deletion/unsaved-change states. Require real server confirmation, retain failed drafts, prevent duplicate submission and preserve HTTP/WebSocket canonical reconciliation, race protection, focus and navigation context.
- Verify the changed real user journey in both themes and relevant narrow/wide layouts, with keyboard/touch alternatives. Preserve existing behavioral assertions; add targeted browser/calculation/API checks where warranted and record evidence/limitations before resolution. Review common acceptance and visual references in the effort index.
- Stage implementation separately from the public deployment branch until the complete verified release. Preserve shared demo data, free resources and existing permissions. Use only isolated test databases for fixtures; no public Neon resets, personal-account features, unrelated rewrites or walkthrough recording. Publication belongs to ticket 14 after integration.

## Comments

- 2026-10-18: Owner approved the 14-ticket breakdown and requested publication. Published with the approved scope and blocking edges; implementation has not started.

- 2026-10-18: Claimed after 10. Preserve catalog-only membership and all real search/filters/roles, canonical capacity consistency and pending/retry safeguards; implement C responsive team presentation and clear confirmed membership removal without account/role editing.

## Answer

Implemented responsive C member tables/cards, real catalog-only addition, search/name/email/role filters, confirmed membership removal and recoverable pending/error flows. Removed unsupported account-management placeholders. Project context and generation fences retain the chosen person during WebSocket-before-HTTP confirmation and protect another project’s open draft.

Capacity presentation now includes current project members only and refuses writes from a draft whose member has left. Existing persisted capacity remains intact and reappears if that person rejoins: no account deletion, automatic unassignment, backend policy or data migration was introduced.

Verification: 21/22 expanded browser journeys passed before a pending-selection binding fix; focused live-confirmation/search checks then passed. Ten additional capacity/team checks passed, and the final removed-member draft regression passed after correcting its string input assertion. Both-theme 320/390/768/1024/1440 layout/dialog checks passed; inspected desktop light/mobile dark captures. Frontend typecheck/lint pass (12 existing warnings). Full integration/review remains ticket 13; no deployment or recording.
