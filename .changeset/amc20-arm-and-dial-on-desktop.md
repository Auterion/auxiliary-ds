---
'@auxiliary/demo': patch
---

AMC20 — the same two AMC asks, on the desktop that actually ships.

A new surface at `apps/demo/src/amc20/`, reachable from the page switcher as
**AMC20**, with a **before/after switch**. `before` is a faithful redraw of the
AMC FlyView screenshot in the #amc-ui-work thread: the teal vehicle cell, the
plain white "Disarmed" in the middle of the top bar, the five rail discs with
their detached black label pills, the OSM basemap, the video placeholder, the
cyan telemetry cluster and the compass.

`after` changes exactly two things and nothing else:

- the centre of the top bar becomes the **arm plate**, with the arming control
  beside it rather than inside it;
- **right-click on the map** opens the **command dial**, and the rail drops
  `Position & Heading Reset`, which is two commands rather than one and belongs
  behind the dial's fence.

Both are the components `flyview/` already defines — `ArmState` and
`CommandDial`, imported rather than restated — so the tablet and the desktop
cannot drift into two vocabularies for one state.

Holding everything else still is the design work. A proposal that also tidies
the telemetry cluster and re-spaces the rail cannot be approved, because it can
no longer be told apart from a redesign. The `before` build marks the adjacency
the thread opened with — an instant `Mission` start one disc above a silent
estimator reset, same size, same colour, nothing between them.

One deliberate split, documented in `_amc20.css`: the **untouched** chrome is
drawn in AMC's own current palette as raw values, because it is content being
shown rather than styling being invented, and re-drawing it in tokens would
quietly improve the thing the proposal is meant to be measured against.
Everything the proposal **touches** resolves through design-system tokens — so
the changed parts re-theme with the switcher and the rest of the window does
not, and the split is itself the argument.

On the gesture: the thread rules right-click out ("currently occupied by other
functionality for EVO"). The dial is bound to right-click here so the ask can
be judged as asked, and to press-and-hold as well, because the dial does not
care which opens it. The gesture is a binding, not a design.

Demo-layer only: no token, recipe or component changes. Page-local styles are
namespaced `a20-`.
