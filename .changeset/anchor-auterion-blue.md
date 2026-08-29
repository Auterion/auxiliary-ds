---
'@auxiliary/tokens': minor
'@auxiliary/brand': minor
'@auxiliary/demo': patch
---

tokens(color): anchor `auterion-blue` on the blue the products already ship

Mission Control declares `#1475ff` for `primaryButton`, `colorBlue` and
`checkedColor` (`QGCPalette.cc:62,75,84`); Nemyx declares the identical value as
`--highlight` (`main.css:68`). Two teams, two languages, four years apart, same
blue — and `auterion-blue` did not contain it. The ramp held hue at 264°, which
is Tailwind `blue.700`'s hue, while the shipped blue is at 259.3° and falls
*between* rungs 500 and 600.

The ramp is re-tuned to hue **259.3°**, lightness regularized, chroma a single
hump peaking at rung **600** — which is now the product blue. `ring` already
resolved to 600, so the focus ring and Mission Control's `checkedColor` become
one value instead of two near-misses. See `AD-D-015` (proposed).

Two things this turned up, both recorded in the decision:

- `#1475ff` sits at **99.9% of the sRGB chroma maximum** at its own lightness
  and hue, and `gamut.test.ts` requires 97% headroom because anything nearer is
  silently clipped. The literal hex cannot be a token. Rung 600 is `#1b76fb` —
  the nearest value that clears the gate, **ΔE00 0.52** away, half a
  just-noticeable difference.
- The semantic `brand` role stays on rung 700, not 600. `#1475ff` carries white
  text at **4.18:1**; the products ship a primary button that fails AA, and the
  design system must not inherit that.

One semantic repoint follows from the retune: light `accent-foreground` moves
from `auterion-blue.700` to `.800`, because rung 700 lifting to L 0.520 took
`accent`/`accent-foreground` to 4.01:1.

All 464 token gates pass — contrast floors, gamut headroom, ramp shape,
sunlight/darknight, CVD. The lightness ladder is more regular than the one it
replaces (max/min step ratio 2.93 against 3.09).

Stale literals naming the old value are corrected in `brand.manifest.json` and
both Brand pages.

Visual regression: all **48** committed screenshots pass **unchanged**. The
specimen set is the operational-critical components — status badge, alert
banner, alert annunciator, guarded action, telemetry value, table — which are
drawn from the status ladder and the neutrals, not from the brand ramp. Worth
stating, because a brand-hue change is exactly the kind of thing that ought to
move them and here demonstrably does not.
