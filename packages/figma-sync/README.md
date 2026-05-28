# @auxiliary/figma-sync

One-way push of Auxiliary tokens into Figma Variables. **Code is the source of truth.** This package never pulls Figma into the repo.

---

## Import workflow (current — DTCG Design Token Manager)

Verified working as of Step 7. Free Figma plugin; no GitHub auth required.

### One-time setup

1. In any Figma file: **Plugins** menu → search and run **DTCG Design Token Manager**.
2. Optional: pin the plugin to your account for fast access.

### Import / re-import

The build emits a **single file** — `packages/tokens/dist/figma.tokens.json` — in the **DTCG Design Token Manager's native Figma-export format** (NOT generic DTCG). One import creates two collections with the right modes and real cross-collection variable aliases.

1. From the repo root, build the tokens:

   ```bash
   pnpm --filter @auxiliary/tokens build
   ```

   This regenerates `packages/tokens/dist/figma.tokens.json` (~80 primitive variables + 32 theme variables × 4 modes).

2. Open the target Figma file → run the **DTCG Design Token Manager** plugin.

3. In the plugin: **Import** → **Single file** → choose `packages/tokens/dist/figma.tokens.json`.

4. The plugin creates:
   - A **Primitives** collection with one mode (`Mode 1`), containing all primitive colors (`color/primitive/zinc/*`, `color/primitive/red|orange|yellow|blue|green/*`, `color/primitive/white`, `color/primitive/black`) plus numeric tokens (`spacing/*`, `radius/*`, `text/*`, `font-weight/*`, `duration/*`, `density/*`).
   - A **Themes** collection with **four modes** (`Light`, `Dark`, `Sunlight`, `Darknight`), each populated with 32 semantic variables (`bg/canvas`, `text/primary`, `accent/default`, `border/default`, `status-alarm-bg`, etc.) — same variable, four mode values per variable.
   - **Cross-collection aliases**: most theme values point at primitives via `VARIABLE_ALIAS` — e.g. `bg/canvas` in Dark mode is bound to the `color/primitive/zinc/950` primitive variable. Editing the primitive cascades.
   - **Direct values** for the few semantic tokens that don't reference a primitive (currently: most of the Darknight theme, which uses OpenBridge-sourced literal RGB values rather than primitives).

5. In Figma, layers reference `bg/canvas` once; switching the Themes mode at the page or document level flips every layer.

6. Publish the file as a Library so consuming design files inherit both collections.

### Format notes

The emitted JSON is **Figma's native variable shape**, captured by inspecting an actual DTCG Design Token Manager export from a hand-built template:

- Top-level: `{ variables, collections, exportedAt, pluginVersion }`
- Variables: `{ id, name, resolvedType, variableCollectionId, valuesByMode, scopes }`
- Colors: `{ r, g, b, a }` 0-1 floats (NOT hex)
- Aliases: `{ type: "VARIABLE_ALIAS", id: "<other-variable-id>" }`
- Collections: `{ id, name, modes: [{modeId, name}], defaultModeId }`

The synthetic IDs in our emitted JSON (`var_prim_color_primitive_zinc_900`, `mode_light`, …) are only used to wire references internally — the plugin assigns Figma-real IDs at import time.

### What gets through correctly

- ✅ **Colors** — Auxiliary builds emit **hex** (sRGB) into `figma.tokens.json`, even though our source uses OKLCH. Conversion via `culori` in [`packages/tokens/build.mjs`](../tokens/build.mjs). Hex is what the plugin (and Figma Variables in general) parse.
- ✅ **Dimensions** (spacing, radius, font sizes) — passed through as-is.
- ✅ **Numbers** (line heights, density scalars, font weights).
- ✅ **References** — DTCG `{token.path}` references resolve to their target value in the emitted JSON (so Figma sees concrete values, not aliases).

### What does NOT round-trip

- ❌ **Themes as Figma Modes.** Light / Dark / Sunlight / Darknight arrive as four parallel top-level groups, not as Modes on a single set of variables. Figma's Modes feature requires the **Variables REST API**, which is **Figma Enterprise only**. Defer until Auterion goes Enterprise.
- ❌ **Easing curves (`cubicBezier`)** and **shadows** are *intentionally excluded* from the figma artifact (controlled by `FIGMA_SKIP_TYPES` in `packages/tokens/build.mjs`). Figma Variables don't have these types — even the Enterprise REST API doesn't model them as variables. See [Shadows + easings in Figma](#shadows--easings-in-figma) below for the manual mapping designers maintain.
- ❌ **Plugin-managed history.** The plugin does not pull from GitHub; re-importing replaces values. Keep the import as a manual step until we automate via REST.

---

## Shadows + easings in Figma

Because these can't be Variables, designers maintain them as **Figma Effect Styles** (shadows) and apply easings manually in Smart Animate. Update these styles whenever the code values change — `packages/tokens/src/primitive/shadow.tokens.json` and `motion.tokens.json` are authoritative.

### Shadows → Effect Styles

Create three Effect Styles in the Foundations file, named to match the token paths:

| Style name | Type | Color | X | Y | Blur | Spread | Notes |
|---|---|---|---|---|---|---|---|
| `shadow/sm` | Drop shadow | `#000` 8% | 0 | 1 | 2 | 0 | single layer |
| `shadow/md` (layer 1) | Drop shadow | `#000` 10% | 0 | 4 | 8 | −2 | composite |
| `shadow/md` (layer 2) | Drop shadow | `#000` 6% | 0 | 2 | 4 | −2 | same style |
| `shadow/lg` (layer 1) | Drop shadow | `#000` 12% | 0 | 12 | 24 | −6 | composite |
| `shadow/lg` (layer 2) | Drop shadow | `#000` 8% | 0 | 4 | 8 | −4 | same style |

`md` and `lg` are composite (two stacked shadows on the same Effect Style — Figma supports this natively via the "+" button in the Effect panel).

### Easings → Smart Animate custom bezier

When prototyping interactions, in the Easing dropdown choose **Custom bezier** and enter:

| Token | Bezier | Use case |
|---|---|---|
| `ease/out` | `0.16, 1, 0.3, 1` | UI entering view (default for most transitions) |
| `ease/in-out` | `0.65, 0, 0.35, 1` | UI moving between two states |
| `duration/fast` | 120 ms | small UI nudges |
| `duration/base` | 200 ms | most transitions |
| `duration/slow` | 320 ms | layout-level transitions, page changes |

### When code changes

If a value in `shadow.tokens.json` or `motion.tokens.json` changes:

1. CI is not aware of these (they're excluded from the figma artifact)
2. A designer manually updates the corresponding Effect Style or transition timing
3. Republish the Foundations library

This is operationally fine at the current scale (5 shadow values, 3 easings). When/if Figma adds variable types for these, we'll re-enable them in `FIGMA_SKIP_TYPES`.

### Round-trip verification (sanity check)

Same flow the v0.1 gate uses ([build plan, Step 7](../../.claude/plans/auxiliary-build-plan.md)):

1. Edit a token value in `packages/tokens/src/` (e.g. bump `accent.default` in any theme).
2. `pnpm --filter @auxiliary/tokens build`.
3. Re-import the JSON via the plugin.
4. Verify the variable updated in Figma. Republish the library.

---

## Alternative path: Tokens Studio for Figma

Bi-directional sync with a GitHub PAT. Originally in the build plan but deprioritized because:

- **GitHub auth required** — PAT with repo scope, stored per-designer.
- **Bi-directional sync is a footgun for our model** — we want code → Figma only. Tokens Studio's sync model encourages designers to edit values in the plugin and push back, which violates "code is source of truth."
- **Higher operational complexity** — for a free-tier file, the friction outweighs the GitHub-integration benefit.

Keep as an escape hatch if a designer specifically needs branch-aware token syncing.

---

## Future path: Figma Variables REST API (Enterprise)

When/if Auterion moves to Figma Enterprise, this package will host a GitHub Action that:

1. Reads `packages/tokens/dist/figma.tokens.json` on merge to `main`.
2. Calls the Variables REST API to update the Auterion-managed Figma file.
3. Maps our theme groups (`light/`, `dark/`, `sunlight/`, `darknight/`) onto Figma **Modes** — the real fix for the theme round-trip gap.

Not built yet. Lives in this package's roadmap.

---

## Why this exists as a package today

The README and the (future) action both live with the rest of the system so the round-trip is reproducible and version-controlled — not a one-off in someone's local Figma.
