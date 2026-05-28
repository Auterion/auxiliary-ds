# @auxiliary/figma-sync

One-way push of Auxiliary tokens into Figma Variables. **Code is the source of truth.** This package never pulls Figma into the repo.

---

## Import workflow (current — DTCG Design Token Manager)

Verified working as of Step 7. Free Figma plugin; no GitHub auth required.

### One-time setup

1. In any Figma file: **Plugins** menu → search and run **DTCG Design Token Manager**.
2. Optional: pin the plugin to your account for fast access.

### Import / re-import

1. From the repo root, build the tokens:

   ```bash
   pnpm --filter @auxiliary/tokens build
   ```

   This regenerates `packages/tokens/dist/figma.tokens.json` from the DTCG source files in `packages/tokens/src/`.

2. Open the target Figma file → run the plugin.

3. In the plugin: **Import** → **Single file** → choose `packages/tokens/dist/figma.tokens.json` from your local disk.

4. The plugin creates Figma Variables matching the DTCG token tree:
   - `color/primitive/zinc/50` through `color/primitive/zinc/950`
   - `color/primitive/red|orange|yellow|blue|green/{300,500,700}`
   - `light/bg/canvas`, `light/text/primary`, … and the same for `dark/`, `sunlight/`, `darknight/`
   - `spacing/0` through `spacing/24`, `radius/none`–`radius/full`, etc.

5. Apply variables to layers as you would any Figma variable. Publish the file as a Library so consuming design files inherit.

### What gets through correctly

- ✅ **Colors** — Auxiliary builds emit **hex** (sRGB) into `figma.tokens.json`, even though our source uses OKLCH. Conversion via `culori` in [`packages/tokens/build.mjs`](../tokens/build.mjs). Hex is what the plugin (and Figma Variables in general) parse.
- ✅ **Dimensions** (spacing, radius, font sizes) — passed through as-is.
- ✅ **Numbers** (line heights, density scalars, font weights).
- ✅ **References** — DTCG `{token.path}` references resolve to their target value in the emitted JSON (so Figma sees concrete values, not aliases).

### What does NOT round-trip

- ❌ **Themes as Figma Modes.** Light / Dark / Sunlight / Darknight arrive as four parallel top-level groups, not as Modes on a single set of variables. Figma's Modes feature requires the **Variables REST API**, which is **Figma Enterprise only**. Defer until Auterion goes Enterprise.
- ❌ **Easing curves (`cubicBezier`)** and **shadows** are *intentionally excluded* from the figma artifact (controlled by `FIGMA_SKIP_TYPES` in `packages/tokens/build.mjs`). Figma Variables don't have these types — designers apply easing via Smart Animate timing and shadows via the Effect panel, neither of which binds to variables. Filtering them out keeps the import clean (no plugin warnings). They remain in the CSS/TS artifacts where code actually consumes them.
- ❌ **Plugin-managed history.** The plugin does not pull from GitHub; re-importing replaces values. Keep the import as a manual step until we automate via REST.

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
