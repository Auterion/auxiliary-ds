---
'@auxiliary/demo': patch
---

FlyView — the two AMC asks from #amc-ui-work, answered in situ.

A new surface at `apps/demo/src/flyview/`, reachable from the page switcher as
**FlyView**, built on the AMC27 tablet. It takes the two UI/UX items the UA
team's product review routed to design and answers each one on the device,
because a control sheet proves a control is coherent with itself and only a
frame proves it is coherent with the eleven other things already on the screen.

**Arm state.** The ask is "ARM: RED | DISARM: GREEN, prominent in the Top Bar,
Deep Red once armed and in flight". Three things had to be settled first:

- **The plate is not the button.** "ARM: RED" reads two ways — the state is red
  once armed, or the button that arms is red — and an operator holding the
  second reading presses the red thing to make the danger stop. Split by form
  before colour: the plate has no hover, no press and no focus ring, arming is
  a guarded hold shaped nothing like it, and disarming is a plain button
  because disarming is the safe direction.
- **The aircraft has three states, not two.** Armed on the ground is when a
  person can walk into a turning rotor, and it lasts seconds; armed airborne
  has taken that hazard 118 m away, and it lasts the sortie. The `proposed`
  scheme therefore puts its loudest treatment — a hazard hatch, the one channel
  nothing else on the surface uses — on armed-on-ground, inverting the request
  on purpose, and leaves disarmed quiet rather than green: green already means
  *nominal* on the reserved ladder, so a green arm plate reads "arming is fine"
  rather than "not armed". Red and green are also the pair one man in twelve
  cannot separate, so the plate carries the word, the fill weight and the hatch
  before it carries a hue.
- **Deep Red costs a token, not a CSS line.** Both schemes ship side by side
  with a **live contrast readout** that measures each rendered plate's own text
  against its own fill and re-measures on every theme switch. The gated pairs
  hold; `--fv-hazard-deep` is mixed by hand and gated by nothing, which is the
  costed argument for a real `--hazard` pair before it ships.

Arm state is aliased to `--fv-hazard`, not spent as `--alarm`: an armed
aircraft is not a fault, and lighting the ladder's top rung for most of every
sortie leaves it nothing to say when something fails.

**The command dial.** "Quick commands for HOLD / EIGHT — four actions, we want
two" and "RESET VEHICLE POSITION should open a window with six modes" are one
feature. A pointer-anchored ring of six: the press is action one, the sector is
action two.

- **Press-and-hold, not right-click** — the thread rules right-click out
  (occupied by EVO) and a tablet has no right button to argue over. Nothing is
  reassigned.
- **A ring, not a list** — six is under the count where a ring stops paying;
  every item is the same distance from the pointer and direction becomes muscle
  memory, after which the labels stop being read.
- **A drawn fence** splits the everyday half from the two estimator
  corrections, which are guarded and never fire on release. The complaint that
  opened the thread was LAND next to RESET VEHICLE POSITION with nothing
  between them; the fence says a press here is not the same *kind* of act as a
  press there, and costs no colour and no label to say it.
- **Speed and altitude are not commands but numbers**, so they open the hub
  into a stepper with a type-in field — which is also SW-3160, in a gesture
  that was being built anyway.

The dial is keyboard-driven as well as pointer-driven (arrows walk the ring,
Enter commits, Escape backs out one level at a time) and the left rail drops
from six circles to three, per the thread's "use now only 3 modes".

Demo-layer only: no token, recipe or component changes. Page-local styles are
namespaced `fv-` in `apps/demo/src/flyview/_flyview.css`, whose header
documents the one raw colour on the surface — the hand-mixed deep red, present
precisely so the contrast readout has something real to measure — and the
simulated map raster, the same exemption `amc27/TabletView.vue` already takes.
