# Ticket 08 independent review

Initial fixed comparison: `git diff 6eb6d9b...99b5574`, implementation 99b5574. Correction: `git diff 99b5574...d89a537`.

## Standards

Initial P2: a nonempty partial response with only id/title/updatedAt was cast to a complete task/ticket and could display success or remove metadata. Separate actual response guards now reject incomplete representations. Both task/ticket browser regressions failed before correction and pass afterward; the original empty-object case remains. Reviewer confirmed the P2 resolved with no additional actionable findings or heuristic smells. Four real update/delete consumers justify shared per-item pending tracking.

## Spec

Initial P2: a pending old save could close a later editor/clear its query after browser navigation. Opened-item generations now invalidate completion on identity changes/unmount. Per-item request flags allow a different editor to remain usable while blocking duplicate same-item submissions. The real Back/open/type/release regression reproduces and verifies the correction. Reviewer confirmed resolution with no new actionable findings or scope expansion.

Totals: Standards 1 initial P2, fixed; Spec 1 initial P2, fixed. Outstanding 0 on each axis. Verification is recorded in [evidence](08-editors.md).
