# figma-sync — push Auxiliary tokens into Figma, and report drift back

Two directions, only one of which writes:

- **push** — `@auxiliary/tokens` → Figma Variables. The subject of most of this skill.
- **diff** — read a Figma file and **report** how it drifted from the token contract.
  Applies nothing. A human moves values into `packages/tokens` by hand, through the gates.

Code is the source of truth; the line is at *application*, not *observation* (README
Principle 1). Both directions are session-triggered — the Figma MCP is interactively
authenticated, so there is no CI path on Org tier.

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
   pnpm --filter @auxiliary/css build         # component-schema.json (the component contract)
   pnpm --filter @auxiliary/figma-sync build  # dist/push.figma.js + dist/push-components.figma.js
   ```
2. **Load `/figma-use`** (canonical Plugin API rules) before any `use_figma` call.
3. **Inspect** the target file first (idempotency / safety): a read-only `use_figma` listing
   existing collections via `figma.variables.getLocalVariableCollectionsAsync()`. Expect the push
   to update in place if Global/Theme already exist.
4. **Run the push**: read `packages/figma-sync/dist/push.figma.js` and pass its **entire contents**
   as the `code` to `use_figma` (with `skillNames: "figma-use,figma-sync"` and the target fileKey).
   The program is idempotent and self-contained (data inlined). It returns a summary
   `{ collections, valuesSet, effectStyles, textStyles }` — surface it. `textStyles` is a
   per-role result list; a `{ ok: false }` entry means that role's font wasn't available in
   the file (recorded, not thrown — the rest of the push still applies), and an `ok: true`
   entry's `font` field reveals any weight that silently downgraded (e.g. to Inter Regular).
   - It creates ~350 variables in one atomic script. If `use_figma` errors on size/timeout, the
     program is safe to re-run (idempotent); if it persistently fails, split by editing the
     generated `DATA.collections` to push Global first, then Theme.
5. **Verify**: `get_variable_defs` on a node, or a read-only `use_figma`, to confirm the three
   collections, the 4 Theme modes, a spot-checked alias (e.g. `alarm` → red/700 in light,
   red/800 in dark), the `shadow/*` Effect Styles, and the `Type/*` Text Styles. Re-run the
   push once to confirm no duplicates. (Note: freshly-created variables not bound to any node
   won't appear via `get_variable_defs` — the push summary is the authoritative count.)
6. **Push the component sets** — `dist/push-components.figma.js`, or the nine per-set payloads
   (`push-components.NN.<name>.js`) when the combined file exceeds use_figma's 50k code limit.
   **Only after step 4**: every binding addresses a variable by qualified name, and a variable
   that doesn't exist yet can't be bound. Returns
   `{ page, sets: [{ set, created, updated, removed, total }], missingVariables, fontFailures }` —
   a non-empty `missingVariables` means the token push didn't land, not that the component is
   wrong. Idempotent: sets reconcile in place on the `Components` page.

## Reading drift back (`pnpm figma:diff`)

Use this when someone has been exploring **by hand in Figma** and you need to know what
changed. It never writes to `packages/tokens` — surface the report and let the human decide.

1. **Build** (same step 1 as the push) — produces `dist/pull.figma.js`, the per-collection
   `dist/pull.NN.*.js`, and `dist/figma-expected.json` (the contract to compare against).
2. **Run the read program**: pass the entire contents of `dist/pull.figma.js` as `code` to
   `use_figma`. It is read-only — a test asserts it calls no mutating API.
   - If the response is truncated or the call times out, use the per-collection payloads
     (`pull.01.primitives.js` → `pull.02.semantic.js` → `pull.03.component.js`) and merge
     their `collections` arrays into one object. The last one carries `effectStyles` +
     `textStyles`; earlier ones return `null` for both, which the comparator reads as
     "not carried", not "deleted".
3. **Save** the returned object verbatim to `packages/figma-sync/dist/figma-actual.json`.
4. **Compare**: `pnpm figma:diff` (add `--json` for raw findings, `--check` for an exit code).

**Round-trip sanity check.** If you have just pushed, an immediate pull + diff must report
**zero findings**. Anything there is a transport asymmetry between `push-logic.mjs` and
`pull-logic.mjs` (colour rounding, alias resolution, mode naming) — a bug in this package, not
drift in the file. Fix it before trusting any other output.

Read the finding vocabulary in the package README before interpreting a report — in particular
that `new-in-figma` cannot distinguish "designer added this" from "code renamed and orphaned
this", and that `probable-rename` is a hint, never applied.

## Notes

- Variables are **unitless** — FLOATs are px (spacing/radius/text), rem (breakpoint), em
  (tracking), ms (duration); colors are sRGB `{r,g,b,a}`.
- Idempotency keys on collection + variable **name**. Renaming a token in code orphans the old
  Figma variable (pre-1.0: acceptable; clean up manually if needed).
- `shadow` → Effect Styles and `type/*` typography composites → Text Styles (`Type/*`, font
  size bound to the matching `Global/text/*` variable) — both handled by the push.
  `cubicBezier`/easings can't be Variables → see the package README's table; maintain them
  manually in Figma.
- Text Styles need the fonts **installed in the target file**. The push tries each role's
  family/style with fallbacks (→ Regular) and records failures rather than throwing, so a
  missing weight downgrades silently — check the `textStyles` summary after a push.
