# @auxiliary/figma-sync

**Session-triggered sync of Auxiliary tokens → Figma Variables, via the Figma MCP, plus a
read-only drift report in the other direction.**

Writes flow one way. `push` applies the token contract to a Figma file; `diff` reads a Figma
file and *reports* how it has drifted, applying nothing. Code stays the source of truth —
the line is at application, not observation (README Principle 1).

---

## Why MCP, not REST

`file_variables:write` (the Variables REST API) is Figma **Enterprise**-only; Auterion is on
**Organization** tier, so a headless "sync on merge to `main`" isn't possible. The Figma **MCP**
exposes the full Plugin API from an agent session (`use_figma`), which collapses the
"build & publish a custom plugin" path — we reach a multi-mode collection + cross-collection
aliases + Effect Styles without shipping a plugin. Trade-off: the push is **session/agent-
triggered**, not CI-automated (the MCP is interactively authenticated). Revisit CI automation
only if Auterion moves to Enterprise — at which point the same `figma-native.json` contract
feeds a REST action.

## How it works

```
@auxiliary/tokens build ──▶ dist/figma-native.json   (3 collections + aliases + text styles)
                            dist/tokens.json          (shadows)
        │
   figma-sync build ──▶ dist/push.figma.js            (self-contained use_figma program)
        │
   /figma-sync skill ──▶ use_figma(push.figma.js) ──▶ Figma file
                              ├─ Collection "Global"    (Base)                              412 vars
                              ├─ Collection "Theme"     (light / dark / sunlight / darknight)  53
                              ├─ Collection "Component" (sm / md / lg)                         146
                              ├─ Text Styles    Type/product/* · Type/marketing/*               14
                              └─ Effect Styles  shadow/sm · shadow/md · shadow/lg
```

The `json/figma-native` build format (in `@auxiliary/tokens/build.mjs`) is the contract; the push
program is idempotent (matches collections/variables by name, two-pass alias resolution), so
re-running updates in place — no duplicates.

### The three collections

They are named for the **GTC tiers** they carry, so a Figma binding path and a token path read the
same thing. (Unlike a variable path, a collection name is safe to change: Figma binds by variable
id, not by qualified name. They were `Primitives` / `Semantic` until the component-schema work.)

- **Global** (single mode `Base`) — every scalar global token as a COLOR / FLOAT / STRING
  variable. Figma variables are unitless, so dimension and duration collapse to FLOAT (px for
  spacing/radius/text, rem for breakpoint, em for tracking, ms for duration).
- **Theme** (4 modes) — each of the 53 theme roles as one COLOR variable whose per-mode value
  is a cross-collection alias into Global.
- **Component** (3 modes: `sm` / `md` / `lg`) — the component tier's **size axis as Figma modes**.
  The token source carries size as a path segment (`component.button.padding-x.md`) because the
  `$extensions.mode` mechanism was not adopted; Figma models exactly this natively, so the export
  collapses the segment into modes — the same transform the Theme collection already performs
  across four theme files. It's what lets a designer flip one frame's mode and have every bound
  radius, padding and height resize together. A size-less token (`component.button.radius`) gets
  the same value in all three modes, and a two-size component (Badge, StatusBadge) carries its
  nearest declared rung outward rather than inventing a third size: *"Badge at lg looks like Badge
  at md"* is the truth, and Figma requires a value per mode.

**GTC groups are carried by the collection, not the variable path.** `{global.color.primitive.red.700}`
pushes as `Global/color/primitive/red/700`, `theme.light.card` as `Theme/card`,
`component.button.padding-x.md` as `Component/button/padding-x`. That follows GTC's own taxonomy
rule ("in Figma the collection name is the Group and variable paths start at Element") — and it is
what kept every existing variable path stable across the GTC restructure. Renaming a Figma variable
path does **not** move the bound instances; it orphans them and silently creates a duplicate
alongside.

### What is deliberately not synced

`register.*` — the `[data-register]` axis (expressive ↔ operational: control height, radius, motion
duration). Figma has no second orthogonal mode concept that *composes* with the size modes the
Component collection already uses: a variable's value is selected by one mode per collection, so an
operational register would have to be either a fourth Component mode (colliding with size — you
could not have "operational **and** lg") or a parallel collection that no Auxiliary variable binds
to. Registers stay a code-side axis; Figma files are authored in the expressive register, which is
the default and therefore the global value.

## Run it

Use the **`/figma-sync` skill** (`.claude/skills/figma-sync`) in a session where the Figma MCP is
connected. In short:

```bash
pnpm --filter @auxiliary/tokens build      # → figma-native.json + tokens.json
pnpm --filter @auxiliary/figma-sync build  # → dist/push.figma.js
```

then the skill feeds `dist/push.figma.js` to `use_figma` against a target file URL and verifies
with `get_variable_defs`.

## Component sets — `dist/push-components.figma.js`

The token push gives Figma the vocabulary. This gives it the components, built from
`@auxiliary/css`'s generated `component-schema.json` so a Figma component and the
shipped component are the same component.

```bash
pnpm --filter @auxiliary/css build      # regenerates component-schema.json
pnpm --filter @auxiliary/figma-sync build
# run dist/push.figma.js FIRST, then dist/push-components.figma.js
```

**Order is not optional.** Every binding addresses a variable by qualified name
(`Theme/primary`), and a variable that does not exist yet cannot be bound — the program
reports it in `missingVariables` rather than silently producing a component that looks
right and carries no tokens.

Scope is the **nine flat recipes** — Button, Badge, Input, Textarea, Label, Avatar,
Separator, Skeleton, Tooltip — 88 variants across nine sets on a `Components` page.
Idempotent: sets are matched by name and reconciled in place (variants updated, missing
ones added, extras removed), so re-running is how a recipe change reaches Figma.

The other 23 recipes have schema coverage but no generated component, and that is a
judgement rather than a gap: they declare `slots:`, and a slotted recipe's frame tree
cannot be derived. Card ships as six separate Vue components, so how they nest is the
consumer's choice. A plausible guess would be a component that quietly disagrees with
every real usage.

Two translation decisions worth knowing, both made in `src/component-spec.mjs` (pure,
unit-tested — the plugin program interprets nothing):

- **A size variant binds a MODE, not three variables.** `Size=md` sets the Component
  collection's `md` mode on the frame, so every bound structural variable resolves at
  that size together.
- **`rest` and `disabled` become variants; `hover` and `active` do not.** Disabled is
  carried by a real token (`Global/opacity/disabled`). Hover is an opacity modifier over
  a token with none of its own, so materialising it would write a literal colour that
  `figma:diff` then correctly reports as untokenised drift. It stays in the schema, where
  it is true.

## Reading back — `pnpm figma:diff`

Designers explore in Figma by hand. Without a read path that exploration is invisible to the
repo until someone re-types it from memory, so this reports what a file actually contains
against what the contract says it should.

```
dist/figma-expected.json ─┐
                          ├─▶ src/diff.mjs (pure) ─▶ report
dist/figma-actual.json ───┘
        ▲
   use_figma(dist/pull.figma.js)
```

```bash
pnpm --filter @auxiliary/tokens build && pnpm --filter @auxiliary/figma-sync build
# → run dist/pull.figma.js through use_figma, save the result to dist/figma-actual.json
pnpm figma:diff            # report
pnpm figma:diff --check    # exit 1 on drift
pnpm figma:diff --json     # raw findings
```

**The fetch is interactive; the comparison is not.** `src/diff.mjs` is pure — no I/O, no MCP —
which is the only reason any of this is testable. See the CI note below.

### The read program

`dist/pull.figma.js` mirrors the push: read-only Plugin API, returning **the same shape**
`figma-native.json` uses. That reuse is the whole trick — the export collapses a component
token's size segment into a Figma *mode* and every dimension into a unitless FLOAT, and
re-deriving that inverse by hand would be a bug farm. Two transports must match
`push-logic.mjs` exactly or everything reports as drift: colours round-trip through the same
`round(x * 255)` hex, and aliases resolve to a qualified `Collection/name` rather than a
file-local id.

It chunks per collection (`pull.01.primitives.js` …) for the opposite reason the push does:
the push's *code* is too big once data is inlined; the pull's *response* is, at ~617 variables.
Styles ride with the last payload. A per-collection payload still names alias targets in
collections it didn't return.

### Findings

| Kind | Meaning |
|---|---|
| `changed` | present both sides; a mode's value or alias target differs |
| `new-in-figma` | Figma has it, code doesn't |
| `missing-in-figma` | code has it, Figma doesn't (push never ran, or partially) |
| `type-mismatch` | e.g. FLOAT in code, COLOR in Figma — values aren't then compared |
| `mode-mismatch` | a mode added/renamed/removed; reported once per collection |
| `missing-collection` | reported once, instead of once per variable |
| `changed-text-style` · `missing-text-style` | `Type/*`, matched by re-applying the push's own name transform |
| `changed-effect-style` · `missing-effect-style` | `shadow/*`, numerics compared at 4dp so a nudged shadow doesn't drown the report |
| `probable-rename` | a missing name and a gained one holding identical values in every mode |

`new-in-figma` covers two cases the report deliberately does not claim to tell apart: a
variable the designer added, and one **orphaned** by a code-side rename (renaming a token
leaves the old Figma variable behind with its bindings live — see the idempotency note above).
Telling them apart needs history nobody has. `probable-rename` is the honest hint instead, and
it only fires when the pairing is unambiguous — exactly one candidate on each side — because
"renamed to one of these four" helps nobody. It is never applied.

Collections absent from the contract are ignored outright: a designer's scratch collection is
not drift.

### Why there is no CI gate on this

There cannot be an honest one. The Figma MCP is interactively authenticated, and the Variables
REST API is Enterprise-only while Auterion is Organization tier (same constraint that makes the
push session-triggered — see *Why MCP, not REST* above). So CI gates the **comparator**, via
fixture tests in `test/diff.test.mjs` covering every finding kind plus a positive control that
fails if the comparator ever goes silent. The live check is a session command.

## What can't be a Variable (still designer-maintained)

Figma Variables are COLOR, FLOAT, STRING or BOOLEAN — nothing composite, and no keywords. Four
token types are therefore skipped by the export (`FIGMA_SKIP` in `build.mjs`):

| `$type` | Why it can't be a Variable | Where it goes instead |
|---|---|---|
| `shadow` | composite (colour + 4 dimensions, sometimes multi-layer) — not even the Enterprise REST API can model it | pushed as **Effect Styles** by this tool |
| `typography` | composite (family + size + weight + leading + tracking) | pushed as **Text Styles** (`Type/product/*`, `Type/marketing/*`) |
| `cubicBezier` | four-number curve, no variable type for it | **documentation** — set by hand as a Smart Animate custom bezier |
| `strokeStyle` | a **keyword** (`solid` / `dashed` / `dotted`), not a number or a colour | **documentation** — designers set stroke style by hand |

`strokeStyle` is skipped explicitly rather than by omission: without it the type would fall through
to FLOAT and produce a variable with a null value — exactly the junk `assertSourceShapes` exists to
prevent.

`packages/tokens/src/global/shadow.tokens.json`, `motion.tokens.json` and `border-style.tokens.json`
are authoritative.

### Shadows → Effect Styles (created by the push)

| Style name | Type | Color | X | Y | Blur | Spread | Notes |
|---|---|---|---|---|---|---|---|
| `shadow/sm` | Drop shadow | `#000` 8% | 0 | 1 | 2 | 0 | single layer |
| `shadow/md` (layer 1) | Drop shadow | `#000` 10% | 0 | 4 | 8 | −2 | composite |
| `shadow/md` (layer 2) | Drop shadow | `#000` 6% | 0 | 2 | 4 | −2 | same style |
| `shadow/lg` (layer 1) | Drop shadow | `#000` 12% | 0 | 12 | 24 | −6 | composite |
| `shadow/lg` (layer 2) | Drop shadow | `#000` 8% | 0 | 4 | 8 | −4 | same style |

### Easings → Smart Animate custom bezier (manual)

| Token | Bezier | Use case |
|---|---|---|
| `ease/out` | `0.16, 1, 0.3, 1` | UI entering view |
| `ease/in-out` | `0.65, 0, 0.35, 1` | UI moving between two states |
| `duration/fast` | 120 ms | small UI nudges |
| `duration/base` | 200 ms | most transitions |
| `duration/slow` | 320 ms | layout-level transitions |
