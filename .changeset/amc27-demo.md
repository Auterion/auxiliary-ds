---
'@auxiliary/demo': patch
---

AMC27 — a redesign of the Auterion Mission Control GCS, on three devices.

A new demo surface at `apps/demo/src/amc27/`, added alongside the existing
tablet Mission Control view rather than replacing it. It is a direct answer to
the shipping desktop AMC: a video with controls scattered on top of it in six
unrelated shapes and seven decoratively-used hues, developer telemetry burned
into the frame in a bitmap face, and a strike command the same size as a zoom
button.

Three theses, applied at two scales:

- **Frame the picture** (console) — an opaque command bar, two docked rails and
  an instrument strip on one grid; the video keeps a clear centre and only two
  things float on it. **Frame nothing** (tablet) — the tactical map is the whole
  screen and every control overlays it, on the conventions mobile shooter HUDs
  settled on: world as background, minimap corner inverted to the sensor feed,
  streaks down one edge, stick bottom-left, fire column bottom-right, vitals
  bottom-centre, full-screen overlays for anything you step out of the fight to
  do. **Invert the frame** (handheld) — full-bleed picture, two thumb zones,
  fanned satellites, bottom sheets.
- **Budget the colour** — ink carries structure, the reserved five-level ladder
  carries severity and nothing else, `--brand` is spent on ownship and
  selection. No hue on any of the three surfaces is decorative.
- **Give consequence weight** — arm state and engage authority are the only
  heavy marks, behind the design system's guarded control. The handheld's
  strike control does not exist until authority is armed in the sheet; the
  tablet's flight-terminate lives in an action sheet behind a 2.5 s hold.

Six views: sensor, tactical map and mission plan on the console; a full tablet
HUD (map-as-world, swappable corner window, popover menus, action sheet,
full-screen overlays); a handheld sensor HUD. All four themes and the
operational register render from the same markup — every colour, radius,
control height and duration resolves through Auxiliary tokens. A
`Rationale → notes` overlay annotates the decisions against the incumbent on
each device.

Demo-layer only: no token, recipe or component changes. Page-local styles are
namespaced `a27-` in `apps/demo/src/amc27/_amc27.css`.
