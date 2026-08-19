# Deck 07b — the portfolio grammar

> ## The two standards, and why they don't compete
>
> Going forward the house runs on two standards that answer **different questions**:
>
> - **07b is the overall design language** — *what it looks like.* The ink ramp, the
>   display cut, the mono pointer-labels, the bracket, the rationed signal, hairlines
>   over shadows. It governs every surface: product, editorial, brand.
> - **Console is how we build product and editorial UIs** — *how it is constructed.*
>   The page-local layer pattern of `console/_console.css`: one named ladder per axis,
>   a palette keyed to `[data-theme]` so it re-resolves in step with the DS tokens,
>   repeating structures as grids with fixed slots, one focus ring, named easings, and
>   nothing improvised at the call site.
>
> They are orthogonal. 07b is the vocabulary; Console is the grammar-of-construction.
> A surface is right when it **speaks 07b, built the Console way** — and `_deck07b.css`
> is itself authored to the Console method, which is why the two compose instead of
> colliding.
>
> The corollary matters: a surface's existing local layer (`.bp-*`, `.ix-*`) is **not a
> rival language to be retired**. It is the same method. Product devices that 07b has no
> opinion about — a fleet health bar, a map ping, a feed row, a severity rail — stay.
> What changes is that they now *speak* 07b: their type, ink, rule and radius values
> come from the `--dk-*` ladders instead of a parallel set.

Source: MagicPath board **"Deck System 07b Portfolio"** (`eagerly-door-2982`), the
editorial-portfolio study absorbed into **Flight Manual v0.5** on 2026-07-23. Its own
footer reads *"studied in the browser · rebuilt in the house inks"* — and it is literally
true: 07b's ink ramp is `--color-primitive-ink-*` (hue 265) and its signal is
`--color-primitive-auterion-blue-*`, both already emitted by `@auxiliary/tokens`.

This document is the contract. The implementation is `apps/demo/src/_deck07b.css`
(namespace `dk-`). **Compose the classes; do not re-derive the values.**

---

## 1. The five devices (07b's own "permission slips")

07b introduced exactly five new devices, each with a written scope limit. The limits are
the point — a device used outside its slip is the failure mode.

| Device | What it is | Permission slip |
| --- | --- | --- |
| **Pointer-label** `.dk-pointer` | `↳ OPERATOR` — the ledger variant of the bracket | labels **table fields only**; never a headline |
| **Header ledger** `.dk-ledger` | `operator / mission / completed` — a 3-up hairline row | **tops** a case layout; not a body element |
| **Numeral card** `.dk-numeral` | a light card carrying a giant folio, overlapping a plate | **one per spread**, never two |
| **Signal plate** `.dk-plate-signal` | a solid auterion-blue surface | **chapter dividers and partner tiles ONLY** |
| **Ghost line** `.dk-ghost` | a subtitle at 32% ink | **covers and section titles only** |

Two devices carried over from the earlier boards and still hold:

- **Bracket** `.dk-bracket` — `[ 312 KM · 11 SORTIES · 0 INCIDENTS ]`. Wraps **measured
  facts only**. Never an opinion, never a label, never a nav item.
- **Spread caption** `.dk-caption` — `P-04 · MISSION REPORT — HEADER LEDGER + NUMERAL CARD`.
  A mono rule-line naming what a block *is*. Only in study/reference contexts.

## 2. Type

Three families, three jobs. *Grotesque speaks, mono measures.*

| Role | Class | Family | Size / line | Weight | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display | `.dk-display` | `--font-display` | 44–54px / 1.0 | 600 | `-0.035em` |
| Section | `.dk-h1` | `--font-display` | 30–34px / 1.0 | 600 | `-0.03em` |
| Sub | `.dk-h2` | `--font-display` | 24–26px / 1.15 | 600 | `-0.02em` |
| Field value | `.dk-value` | `--font-sans` | 14px / 1.5 | 600 | `-0.01em` |
| Body | `.dk-body` | `--font-sans` | 13–15.5px / 1.5 | 400 | normal |
| Small | `.dk-small` | `--font-sans` | 11.5px / 1.6 | 400 | normal |
| Label | `.dk-label` | `--font-mono` | 9–10px / 1.5 | 500 | `0.14em`, uppercase |
| Micro | `.dk-micro` | `--font-mono` | 8px / 1.5 | 400 | `0.10em` |

`Inter Tight` in the source becomes `--font-display` here — Inter with the optical
display cut (opsz 32), which is the same job done by the family the repo already
self-hosts. Do not add a webfont.

**The display cut is 600.** That is a deliberate divergence from `theme.css`'s "all titles
are medium (500)" rule, and it is scoped to `.dk-*` — outside the deck grammar, 500 still
governs.

## 3. Ink

Two exposures of one material, switched by **`[data-theme]`** — the design system's
own axis, set on the *same element* as `.dk`. This is the Console layer's rule and it
is the important one: because both layers key off one attribute, the semantic tokens
(`Card`, `StatusBadge`, `Switch`) and the `--dk-*` palette re-resolve **together** and
cannot drift out of step. Never introduce a second mode attribute.

All four DS themes get their **own** block. `light` and `dark` are the two editorial
exposures of the hue-265 material. `sunlight` and `darknight` are not variants of those
— they are the operational themes, and each has a physical job that outranks the look:

- **`sunlight`** — glare hardening. Direct sun collapses the low end of the ramp, so a
  soft `ink-200` hairline vanishes and a 4.5:1 tertiary is unreadable. The tertiary ink
  therefore collapses *up* to the secondary rather than pretending a third step exists.
- **`darknight`** — scotopic, low-blue. Blue light is exactly what destroys dark
  adaptation, so the theme is amber-on-black with no blue at any strength.

| Alias | `light` | `dark` | `sunlight` | `darknight` |
| --- | --- | --- | --- | --- |
| `--dk-bg` | `#fff` | `ink-950` | `#fff` | `black` |
| `--dk-bg-2` | `ink-50` | `ink-900` | `zinc-100` | `stone-950` |
| `--dk-fg` | `ink-950` | `ink-50` | `black` | `amber-500` |
| `--dk-fg-2` | `ink-600` | `ink-400` | `zinc-700` | `amber-600` |
| `--dk-fg-3` | `ink-500` | `ink-500` | `zinc-700` | `amber-700` |
| `--dk-line` | `ink-200` | `ink-800` | `zinc-500` | `amber-950` |
| `--dk-line-2` | `ink-100` | `ink-850` | `zinc-400` | `stone-900` |
| `--dk-signal` | `blue-600` | `blue-500` | `black` | `amber-600` |
| `--dk-signal-ink` | `blue-700` | `blue-400` | `black` | `amber-400` |

**The signal is a position, not a pigment.** In the two operational themes the signal
plate is black and amber respectively — because that is what each theme's own `brand`
token resolves to. The device keeps its meaning in the hierarchy; only its colour
changes. Never reintroduce blue into `sunlight` or `darknight` to "keep the brand".

`--dk-signal` is the **surface** blue (plates, fills). `--dk-signal-ink` is the **text**
blue, stepped for contrast against the mode's background. Never swap them.

### The signal budget

**One signal per view, spent where it matters.** In 07b's own eight spreads, blue appears
exactly twice: the chapter plate (P-02) and the partner tile (P-04). A third occurrence is
a defect, not a flourish. If everything is signalled, nothing is.

The **status ladder is not the signal** and is exempt from the budget: `alarm / warning /
caution / advisory / nominal` keep their semantic hues wherever operational state is being
reported. Blue never encodes state; the ladder never encodes brand.

## 4. Structure — the Console layer's principles, applied

`console/_console.css` is the house standard for a page-local layer. Same rules here:

- **One ladder per axis, named in the layer, never improvised at the call site.**
  Control height (`--dk-control-sm|md`), radius (`--dk-r-sm|--dk-r|--dk-r-lg|--dk-r-pill`),
  duration (`--dk-dur|--dk-dur-slow`), easing (`--dk-ease|--dk-ease-in-out`), gutter
  (`--dk-gutter|--dk-gutter-sm`). A magic number in a template is a bug.
- **Strict alignment. Repeating structures are grids, not flex rows.** `.dk-ledger` and
  `.dk-row` have fixed slots; `.dk-table` is `table-layout: fixed`. Every label starts on
  the same x and every numeral ends on the same x — *down the whole page, across blocks*.
  This is what separates a deck from a stack of cards.
- **Hairlines, not shadows.** `1px solid var(--dk-line)`. No `box-shadow` in this grammar
  — including on hover: `.dk-lift` lifts a hairline.
- **Right-aligned measured columns.** `data-align="end"` + tabular-nums. `.dk-num` on any
  figure that appears more than once.
- **Motion 120–160ms**, two named easings, **state change only**. Nothing draws in on
  load — an editorial page is already finished when you arrive. Everything collapses
  under `prefers-reduced-motion`.
- **One focus ring** for the whole grammar, never transitioned.

## 5. Composing with a surface's own layer

Every surface keeps a local layer for what is genuinely local to it. That layer is built
the Console way and now speaks 07b:

- **Keep** the product devices 07b has no opinion about — `.bp-healthbar`, `.bp-map-ping`,
  `.bp-feed-row`, `.ix-edge-*`, `.ix-grid`. These encode product behaviour, not brand.
- **Restate** their values in the `--dk-*` ladders. One radius ladder on the page, one
  duration, one easing, one gutter. Two parallel ladders is the actual defect — not the
  existence of a second namespace.
- **Retire** only what is now a straight duplicate: a local `--bp-r-card` that means the
  same thing as `--dk-r-lg`, a local mono-label class that duplicates `.dk-label`.
- **Never** let a surface carry two mode attributes. `[data-theme]` alone.

## 6. What this is not

- Not a token change. `packages/tokens` and `packages/css` are untouched — this is a
  demo-scoped layer, exactly like `suite/_instrument.css` and `console/_console.css`.
- Not a component rewrite. `@auxiliary/vue` components stay; they get the grammar's
  surroundings, and where a DS component fights the grammar the *layout* yields, not the
  component.
- Not a licence to hand-roll hex. Every value in `_deck07b.css` resolves to a token
  primitive. A raw `#rrggbb` in a `.dk-*` rule is a bug.
