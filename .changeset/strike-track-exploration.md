---
'@auxiliary/demo': patch
---

SW-3136 Strike + Track — the chosen strike control, ported into the demo.

A new surface at `apps/demo/src/strike/`, reachable from the page switcher as
**Strike**, carrying the final design from the Claude Design doc "SW-3136
Final": the fullscreen AMC video view running the control live, and the
guidelines that pin it down. A control sheet proves a control is coherent with
itself; only an in-situ frame proves it is coherent with the twelve other
things already on the screen, which is where strike controls actually go wrong.

AMC's Dragon Strike control today is a red button that reads STRIKING. The
problem was never the red — it is that the control is still a button, in a row
of buttons, firing on one press. What replaces it:

- **Strike is the one octagon in the UI** — the universally pre-loaded "stop
  and think" silhouette — committed only by a 1.5 s press-and-hold whose
  *perimeter arc is the progress*, so the guard is readable with no colour at
  all. Over video the silhouette carries a 72% black scrim, so it is read
  against a known black rather than against terrain. Inside it is a reticle,
  not an arrow: an arrow says "down", a reticle says "this point, this target"
  — the same thing the track brackets and the lock box on the feed are saying.
- **Track is a camera plate whose aperture closes as it engages**, brackets
  stepping 4 → 10 → 14 → 21 from unavailable to locked. Releasing carries no
  guard: releasing is the safe direction.
- **One right-edge rail, ordered by consequence**: strike 64 px (label above),
  track 56 px, a hairline fence, then the 48 px vertical zoom stepper. The
  bottom of a right-edge rail is where a two-handed grip already rests, so the
  control that ends a life is the one furthest from it while still being the
  largest thing in the column. The fence says a press above is not the same
  *kind* of act as a press below, and costs no colour and no label to say it.
- **Zoom is one stepper** — `+` · readout · `−` in a single hairline column —
  putting the current factor at the point of control instead of in the OSD
  burn-in at the far corner. Tap steps 0.5×, press-and-hold runs, the segments
  dim at the 1.0× / 8.0× stops, and the OSD's FOV readout follows the lens.

The interlock is live: arm Track, click the feed to lock, hold the octagon.
Releasing the lock takes the guard down with it, and a hold aborts when the tab
is hidden — `requestAnimationFrame` stops there, and a guard that pauses is a
guard that lies. Four aircraft on station under the frame, because a rail that
only works over an empty dock has not been tested.

Demo-layer only: no token, recipe or component changes. Page-local styles are
namespaced `sk-` in `apps/demo/src/strike/_strike.css`, whose header documents
the one deliberate split — the guidelines panel is drawn in DS semantic tokens
and carries its own dark / darknight / sunlight switch, because surviving a
theme is the claim being made, while the in-situ frame reproduces AMC's current
C2 palette, which is content being shown rather than styling being invented
(the same exemption `amc/CameraView.vue` already takes for simulated sensor
imagery).
