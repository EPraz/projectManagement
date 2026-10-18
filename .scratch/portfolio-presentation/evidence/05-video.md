# Silent walkthrough export — 2026-10-18

Actual take: `recording/take-1792340777018`. Source application revision: `fa754a8c9f6894f98f3111db7d4ff9d7dfa8292d`. Local API/frontend only; dedicated `project_management_presentation`; fictional data. Raw desktop, observer and 390px mobile sources/timing metadata remain ignored and preserved locally.

Export: **182.56 seconds**, 1920×1080, 25fps, H.264/yuv420p, fast-start MP4, no audio. Final size/hash and exact chapter timings are in [05-video.json](05-video.json). Poster, embedded English text, VTT, downloadable transcript and viewer metadata match. All chapter durations are contiguous and remain under the 3:30 ceiling; mobile/light-to-dark has 24.04 seconds.

Two actual ticketUpdated events reach an independent observer, with zero observer reloads and API-confirmed CODE_REVIEW/IN_PROGRESS. Observer scenes show the same real events again from Session B, not synthetic UI. Task movement uses the state editor; the separately retained real drag regression also passes.

The complete export decodes successfully. Inspected all eight chronological sheets (a frame every two seconds), then corrected an observer/portrait overlay condition and reinspected both affected sheets plus full-resolution key frames at 78/100/166 seconds. Desktop observer clips now keep landscape composition, English captions remain clear of the bottom control area, and mobile/dark transitions have no blank frames. Other scenes retain the same source/timing/content. No private data/authentication state is present in the exported assets. Scene-by-scene owner pacing/design feedback is still welcome.

All artifacts stay local. The owner's explicit pre-publication review/approval remains pending; this evidence does not claim a published URL has passed media delivery.


Final native-player pass: raised the caption band and adjusted the actual footage frame so Chromium's paused controls/gradient do not dim the text. Re-rendered the same raw take/timings, decoded the complete export again, inspected all eight new chronological sheets, then inspected paused and native-fullscreen collaboration/mobile frames at102/169s. The final file is5,228,724bytes; the reviewed production build contains the same SHA-256. All9 viewer journeys pass against this final export, including the actual `jwt` cookie name with an expired/untrusted payload fixture. This strengthens the cookie setup without changing application behavior. The original complete280-journey run already passed; focused9 rechecks cover these final media/fixture changes.
