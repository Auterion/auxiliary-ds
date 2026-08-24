# figma-sync — push Auxiliary tokens into Figma Variables

One-way sync: `@auxiliary/tokens` → Figma Variables. Code is the source of truth; never read
Figma back into code (README Principle 1). The push is session-triggered (the Figma MCP is
interactively authenticated — there is no CI path on Org tier).

## Preconditions

- A **plugin-API Figma MCP** is connected (check `mcp__figma__whoami` + that `use_figma`
  exists). **Gotcha:** the connected Figma MCP is often the **read-only Dev Mode** server,
  which has no `use_figma`/`whoami` — only `get_variable_defs`, `get_metadata`, etc. If
  `use_figma` is unavailable, don't push via MCP — use the **dev-plugin fallback** (see below).
- A **target Figma design file URL** (`figma.com/design/<fileKey>/...`). Ask if not given.
- You will run `use_figma`, so the **`/figma-use` skill is mandatory** — load it first.

### Fallback when `use_figma` is unavailable (read-only Dev Mode MCP)

The push program is plain Plugin API code, so it also runs as a one-shot dev plugin — no MCP
write path needed:

1. Build the artifacts (step 1 below).
2. Wrap `dist/push.figma.js` (which uses top-level `await`/`return`) into a plugin: write
   `dist/plugin/manifest.json` (`{ name, id, api: "1.0.0", main: "code.js", editorType:
   ["figma"], documentAccess: "dynamic-page" }`) and `dist/plugin/code.js` =
   `figma.skipInvisibleInstanceChildren = true; (async () => { try { const r = await (async
   () => { <push.figma.js> })(); figma.closePlugin("OK — " + JSON.stringify(r)); } catch (e)
   { figma.closePlugin("FAILED — " + e.message); } })();`. Re-wrap after every rebuild.
3. User runs it: Figma **desktop** → Plugins → Development → Import plugin from manifest →
   pick `manifest.json` → run. The toast carries the same summary object. Re-import isn't
   needed after rebuilds (Figma re-reads `code.js` each run).

## Steps

1. **Build the artifacts** (Bash):
   ```bash
   pnpm --filter @auxiliary/tokens build      # dist/figma-native.json + dist/tokens.json
   pnpm --filter @auxiliary/figma-sync build  # dist/push.figma.js
   ```
2. **Load `/figma-use`** (canonical Plugin API rules) before any `use_figma` call.
3. **Inspect** the target file first (idempotency / safety): a read-only `use_figma` listing
   existing collections via `figma.variables.getLocalVariableCollectionsAsync()`. Expect the push
   to update in place if Primitives/Semantic already exist.
4. **Run the push**: read `packages/figma-sync/dist/push.figma.js` and pass its **entire contents**
   as the `code` to `use_figma` (with `skillNames: "figma-use,figma-sync"` and the target fileKey).
   The program is idempotent and self-contained (data inlined). It returns a summary
   `{ collections, valuesSet, effectStyles, textStyles }` — surface it. `textStyles` is a
   per-role result list; a `{ ok: false }` entry means that role's font wasn't available in
   the file (recorded, not thrown — the rest of the push still applies), and an `ok: true`
   entry's `font` field reveals any weight that silently downgraded (e.g. to Inter Regular).
   - It creates ~350 variables in one atomic script. If `use_figma` errors on size/timeout, the
     program is safe to re-run (idempotent); if it persistently fails, split by editing the
     generated `DATA.collections` to push Primitives first, then Semantic.
5. **Verify**: `get_variable_defs` on a node, or a read-only `use_figma`, to confirm two
   collections, the 4 Semantic modes, a spot-checked alias (e.g. `alarm` → red/700 in light,
   red/800 in dark), the `shadow/*` Effect Styles, and the `Type/*` Text Styles. Re-run the
   push once to confirm no duplicates. (Note: freshly-created variables not bound to any node
   won't appear via `get_variable_defs` — the push summary is the authoritative count.)

## Notes

- Variables are **unitless** — FLOATs are px (spacing/radius/text), rem (breakpoint), em
  (tracking), ms (duration); colors are sRGB `{r,g,b,a}`.
- Idempotency keys on collection + variable **name**. Renaming a token in code orphans the old
  Figma variable (pre-1.0: acceptable; clean up manually if needed).
- `shadow` → Effect Styles and `type/*` typography composites → Text Styles (`Type/*`, font
  size bound to the matching `Primitives/text/*` variable) — both handled by the push.
  `cubicBezier`/easings can't be Variables → see the package README's table; maintain them
  manually in Figma.
- Text Styles need the fonts **installed in the target file**. The push tries each role's
  family/style with fallbacks (→ Regular) and records failures rather than throwing, so a
  missing weight downgrades silently — check the `textStyles` summary after a push.
