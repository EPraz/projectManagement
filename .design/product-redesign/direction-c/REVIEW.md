# Selected direction C: Project studio

Prepared: 2026-10-18.

Owner decision: **C is selected**, explicitly: “si, la C me gusta, me encanta, usaremos la C”. Owner then accepted the extended Projects, Taskboard and ticket/task editors with “acepto, proceda $to-tickets”. The representative-screen checkpoint is complete; proceed to the ticket proposal using the approved conversation and brief. Real-product validation and the final pre-recording checkpoint remain required.

## Open the selected direction

Preview: http://127.0.0.1:5196/direction-c/ . Choose Projects, Overview, Taskboard, Ticket editor or Task editor, either theme, and mobile/tablet/desktop. [Capture gallery](gallery.html): http://127.0.0.1:5196/direction-c/gallery.html . The selected C Overview composition remains the visual reference.

To restart from the repository root:

```powershell
python -m http.server 5196 --bind 127.0.0.1 --directory .design/product-redesign
```

The server serves only the design directory. No app/backend/database needs to start. Data and fonts are local, edits stay in memory and reload resets them. This code is disposable visual scaffolding and must not be promoted as production components.

## How C carries across the product

- Shared shell: floating dark rail, purposeful active marker, neutral carbon dark panels, white/azure light surfaces, loaded Plex, softer main panels and precise form controls. Narrow layouts use the section menu.
- Projects: distinct project emblem/name, project progress ring, concise description, meaningful work/team counts and visible entry. Core mobile text stays readable; project information replaces ornamental filler.
- Overview: keep C's profile/progress module, sprint execution summary, attention/state modules and calendar/updates. Mobile prioritizes selected sprint and attention before project metadata.
- Taskboard: ticket rows, task-state columns, sticky ticket column/headers and local board scrolling on wide screens. Ticket state/flag stay separate from task states. Task cards have state accents as reinforcement, readable title/assignee/remaining effort, with labels and column headers carrying meaning. Narrow layouts group tickets by their own state and drill into tasks.
- Editors: contextual wide panel / full-screen mobile editor, parent context, preserved field groups, explicit task status, reachable Save/Cancel, dirty-change protection and secondary deletion. The chosen C appearance does not replace field or domain contracts.

## Prototype interactions and limits

Projects search → project → Overview → Taskboard → ticket/task editor is navigable. Search/filter/sprint selection/collapse and core in-memory ticket/task edits remain available; task status changes preserve the ticket. Dirty-change warning offers keep/discard/save. Task → parent returns to Tasks. Preview notices explicitly cover unrepresented creation/deletion/other sections.

The second project tile also opens the representative Orbit workspace. Overview is a visual fixture; its sample summary is not a live reconciliation of every edit made elsewhere in this disposable preview. Supplementary form fields demonstrate layout; only core fields are wired to sample mutations. Remaining production behavior includes full field persistence, recoverable save failures, drag/drop, loading/errors and live navigation/data integration.

Only three task-state columns are populated in this sample. **Production must preserve the project's full existing status catalog**, including additional states; the sample is not a decision to reduce it. Preserve all existing fields, operations, deep links and capabilities, the selected-sprint-only Backlog, true scope/indicator definitions and full mobile functionality.

## Verification

- 30 captures: five screens, both themes, at 375/768/1440; extra document-width checks at 320/390/1024/1280 for each screen.
- No page-level horizontal overflow, loaded Plex font and no Chrome page errors in the checked captures/journey. Corrected an inherited unwrapped action label that caused mobile Overview text overflow.
- Preview journey checks pass: project search/entry, task status within its parent row, task-assignee filter retaining the five matching sample parent tickets, dirty warning/kept draft, task→parent, mobile menu and review screen controls.
- 22 selected token pairs pass their 4.5:1 text / 3:1 control targets. Targeted preview evidence does not establish production accessibility conformance.
- Representative light/dark desktop, mobile and tablet captures manually inspected. No production build/test suite or live deployment was run for these isolated artifacts. No video/trace recorded.

Evidence: [metrics](captures/metrics.json), [contrast](captures/contrast.json), [gallery](gallery.html). To regenerate the disposable preview: `python .design/product-redesign/build-direction-c.py`; after starting the server, `node .design/product-redesign/capture-c.cjs` then `python .design/product-redesign/evaluate-c.py`.

## Next step and preservation

Representative screens are accepted. Prepare and review a tracer-bullet ticket breakdown around selected C, then publish approved tickets. The implementation must be written properly against the real React/MUI app; inherited prototype CSS and in-memory mutations are not the production architecture.

Keep the selected identity/verdict and prior alternatives as source evidence on a local throwaway prototype branch, with its pointer recorded in the effort map. This preserves session continuity without publishing prototype routes or triggering deployment. The final explicit owner design/readiness checkpoint before walkthrough recording remains required.

Source snapshot saved locally: branch `prototype/product-redesign-project-studio-20261018`, commit `ada8ab271100fcfbd033b09a166aaedae93fe354`. The current checkout and main index were preserved; the archive was not pushed or deployed. The effort map is the cross-session context pointer. Archive contents precede this pointer-only note.
