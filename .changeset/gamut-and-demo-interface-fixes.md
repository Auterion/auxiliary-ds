---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
---

Brand ramp brought into gamut, plus the gate that makes it stay there.

**Five rungs of `auterion-blue` were outside sRGB and three were outside Display
P3** — `.300`, `.400` and `.500` named colours no display can produce, and `.500`
is `dark.brand`, so the company's primary colour was one of them. The token's own
`$description` claimed the ramp "tapers at both ends to stay in sRGB gamut",
which was false as shipped and is why it went unexamined. All six rungs are now
capped at ~95% of the in-gamut maximum chroma at their own (L, H); L and H are
untouched, so the hue and the lightness spine are unchanged. Vividness is now a
steady 91.7–94.9% of max across `100`–`600` instead of swinging 92%→114%.

**Why nothing caught it is the more useful half.** `wcag.ts`'s `oklchToLinear`
clamps its output to `[0,1]` before returning. That is correct for its own
callers — contrast and CVD should measure the colour the screen actually shows —
but it makes an out-of-gamut value indistinguishable from a boundary value
through the helper *every colour gate in the directory is built on*. The new
`gamut.test.ts` therefore carries its own unclamped conversion, gates all 44
rungs of the four authored families, and ships a positive control (the exact
pre-fix `auterion-blue.500`) — which failed on the first attempt and caught the
gate being vacuous before it could ship green and empty.

Also in `@auxiliary/css`:

- `-webkit-font-smoothing: antialiased` / `-moz-osx-font-smoothing: grayscale`
  on the `theme.css` root. There was no smoothing declaration anywhere in the
  package, and one demo surface had patched `antialiased` onto its own shell —
  the per-element pattern `typography.md` prints as its Bad example — so the
  same `.dk-label` class rendered at two different weights depending on which
  page you were on. It bites hardest on the small uppercase mono this system
  leans on for ALT/SPD/HDG units and alert codes.
- `Button` gains `active:not-disabled:scale-[0.96]` with a `motion-reduce`
  opt-out. The recipe had a colour shift and no tactile feedback, and
  `transition-colors` would not have animated a scale even if a consumer added
  one. `transition-colors` is kept rather than replaced with an explicit
  property list, which would silently drop `text-decoration-color`, `fill` and
  `stroke` from Tailwind's colors group. The colour shift stays as the static
  cue, so the state is never carried by motion alone.

BREAKING (pre-1.0, `AD-D-035`): `auterion-blue.100`–`.600` change value. The
shift is a chroma reduction only and is largely invisible on an sRGB display —
those rungs were already being clipped to approximately these colours — but P3
displays were showing something the token did not describe.
