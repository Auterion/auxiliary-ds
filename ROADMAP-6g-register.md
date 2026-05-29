# 6g — The expressive ↔ operational register (decision record)

**Status: DECIDED (2026-05-29), design only.** Implementation is 6.2 (Spine). This record locks the
*architecture* so 6.2 builds without re-litigating it. See [`ROADMAP-6.md`](ROADMAP-6.md) for where
6g sits; [`ROADMAP.md`](ROADMAP.md) §6g for the original framing.

## The decision

Model the register as a **token-mode layer**: a `[data-register]` attribute that re-resolves a set
of *flex* semantic tokens — exactly the way `[data-theme]` re-resolves color. Components do **not**
change; they already consume semantic tokens, which now resolve differently per register.

```html
<div data-theme="darknight" data-register="operational">
  <!-- dense, motion-restrained, tight radii -->
</div>
<section data-register="expressive">
  <!-- roomy, animated, softer -->
</section>
```

**Rejected:** per-component `density=` props (churn ×N components, repeat ×N instances, no subtree
default, no inter-component rhythm) and a Vue context provider as the *primary* mechanism (per-
component inject wiring; Vue-only, which violates Principle 2 — tokens stay framework-agnostic). A
thin `<Register>` provider may later be added purely as ergonomics (it just sets the attribute), but
it is not the source of truth.

## Why

- **Mirrors the proven `[data-theme]` system** — same build path, same mental model, same testing
  approach. No new paradigm.
- **Near-zero component churn** — components consume `--control-height`, `--radius-md`, etc.; they
  don't know or care which register is active.
- **Framework-agnostic** (Principle 2) — the axis lives in `@auxiliary/tokens` / CSS, not in Vue.
- **One library, two registers** (Principle 4) — not two parallel systems.
- It is the roadmap's own hint: *"likely a mode/register layer over the semantic tokens, not two
  parallel systems."*

## The two axes are orthogonal

| Axis | Attribute | Controls | Values |
|---|---|---|---|
| **Theme** | `[data-theme]` | **color** | light · dark · sunlight · darknight |
| **Register** | `[data-register]` | **everything non-color** (density, rhythm, radius, motion) | expressive · operational |

They compose freely (`[data-theme=darknight][data-register=operational]`) and never overlap:
**register never touches color; theme never touches density/motion.** A gate will assert this
separation (no color token varies by register; no density/motion token varies by theme).

## Registers

Two poles for the first cut (the underlying `density` scale already has 4 rungs —
`compact/default/comfortable/editorial` in `density.tokens.json` — which the registers map onto):

- **`expressive`** — the **default** (no attribute needed). Roomy spacing, softer radii, full
  motion, larger type rhythm. Marketing, web, brand, onboarding.
- **`operational`** — **opt-in**. Compact density, tight radii, suppressed/short motion, glance-able
  rhythm. GCS, telemetry, C2, mission-critical surfaces.

Default = expressive so every existing surface is unchanged until it opts in. Operational being
opt-in mirrors the air-gap / defense-layer philosophy (additive, never imposed) and is consistent
with the 6.3 opt-in constraint.

## What flexes by register (the "register-variable" token set)

To be finalized with values in 6.2; the *set* is fixed here:

- **Density / control height** — wire up the existing `density.control-height` scale
  (operational → `compact` 28px, expressive → `default`/`comfortable`).
- **Spacing rhythm** — a multiplier on the spacing scale (the `density.scale` factor).
- **Radius** — operational tightens (`--radius-md` smaller); expressive softens.
- **Motion** — operational shortens or zeroes durations. *Distinct from* `prefers-reduced-motion`
  (a user/OS preference, already globally honored): register motion is a **design** choice, the
  reduced-motion reset is an **accessibility** override. They're independent and both can suppress
  motion; the global reset always wins when the user asks for it.
- **Type scale step** (candidate, decide in 6.2) — operational may compress the modular scale.

**Does NOT flex by register:** all color (theme's job), and the reserved status ladder
(`alarm→…→nominal`) which is invariant everywhere.

## Register-*guided*, not register-*tokenized*

Some of the expressive/operational split can't be a token and stays **convention + per-component
guidance** (documented in 6f/6h, enforced by review, not the cascade):

- decorative imagery / photography / illustration — allowed expressive, **forbidden** operational
  (no decoration in a GCS).
- animation choreography (what animates, not just how fast).
- copy voice/tone (6h).

Each component's docs will state which register(s) it serves and how it adapts.

## Implementation shape for 6.2 (not built yet)

1. Promote the flex tokens to **register-aware semantic tokens** in `@auxiliary/tokens`: base
   (expressive) values in `:root`, an `[data-register="operational"]` override block — mirroring the
   `[data-theme]` blocks in `build.mjs`.
2. Point recipes at those semantic vars where they currently hardcode height/radius/motion (most
   already use tokens; the gap is control-height + motion duration).
3. Add a gate: **orthogonality test** (no color varies by register; no density/motion varies by
   theme) + a per-register contrast/legibility spot-check.
4. Optional ergonomics: a `<Register>` provider / composable that just sets the attribute on a
   subtree. Pure convenience over the attribute.

## Open questions deferred to 6.2

- Exact token list + values per register (especially the spacing multiplier and whether type scale
  flexes).
- Whether operational motion is **0ms** or merely **shortened** (leaning shortened, so state-change
  affordances still read; full-zero is what reduced-motion is for).
- Whether a neutral middle register is ever needed, or two poles suffice (start with two).
