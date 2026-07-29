# @auxiliary/figma-sync

**One-way, session-triggered sync of Auxiliary tokens → Figma Variables, via the Figma MCP.**
Code is the source of truth; this pushes into Figma and never reads back (README Principle 1).

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
                              ├─ Collection "Primitives" (Base)                            412 vars
                              ├─ Collection "Semantic"   (light / dark / sunlight / darknight)  53
                              ├─ Collection "Component"  (sm / md / lg)                        146
                              ├─ Text Styles    Type/product/* · Type/marketing/*               14
                              └─ Effect Styles  shadow/sm · shadow/md · shadow/lg
```

The `json/figma-native` build format (in `@auxiliary/tokens/build.mjs`) is the contract; the push
program is idempotent (matches collections/variables by name, two-pass alias resolution), so
re-running updates in place — no duplicates.

### The three collections

- **Primitives** (single mode `Base`) — every scalar global token as a COLOR / FLOAT / STRING
  variable. Figma variables are unitless, so dimension and duration collapse to FLOAT (px for
  spacing/radius/text, rem for breakpoint, em for tracking, ms for duration).
- **Semantic** (4 modes) — each of the 53 theme roles as one COLOR variable whose per-mode value
  is a cross-collection alias into Primitives.
- **Component** (3 modes: `sm` / `md` / `lg`) — the component tier's **size axis as Figma modes**.
  The token source carries size as a path segment (`component.button.padding-x.md`) because the
  `$extensions.mode` mechanism was not adopted; Figma models exactly this natively, so the export
  collapses the segment into modes — the same transform the Semantic collection already performs
  across four theme files. It's what lets a designer flip one frame's mode and have every bound
  radius, padding and height resize together. A size-less token (`component.button.radius`) gets
  the same value in all three modes, and a two-size component (Badge, StatusBadge) carries its
  nearest declared rung outward rather than inventing a third size: *"Badge at lg looks like Badge
  at md"* is the truth, and Figma requires a value per mode.

**GTC groups are carried by the collection, not the variable path.** `{global.color.primitive.red.700}`
pushes as `Primitives/color/primitive/red/700`, `theme.light.card` as `Semantic/card`,
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
