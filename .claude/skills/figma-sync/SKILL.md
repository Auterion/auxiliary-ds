---
name: figma-sync
description: Push Auxiliary design tokens into Figma Variables, one-way (code → Figma), via the Figma MCP. Use when asked to sync/update tokens in Figma, build the Figma Variable collections, or refresh the Figma token library from @auxiliary/tokens. Requires the Figma MCP connected and a target Figma design file URL.
---

# figma-sync — push Auxiliary tokens into Figma Variables

One-way sync: `@auxiliary/tokens` → Figma Variables. Code is the source of truth; never read
Figma back into code (README Principle 1). The push is session-triggered (the Figma MCP is
interactively authenticated — there is no CI path on Org tier).

## Preconditions

- The **Figma MCP** is connected (check `mcp__figma__whoami`). If not, stop and ask the user.
- A **target Figma design file URL** (`figma.com/design/<fileKey>/...`). Ask if not given.
- You will run `use_figma`, so the **`/figma-use` skill is mandatory** — load it first.

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
   `{ collections, valuesSet, effectStyles }` — surface it.
   - It creates ~350 variables in one atomic script. If `use_figma` errors on size/timeout, the
     program is safe to re-run (idempotent); if it persistently fails, split by editing the
     generated `DATA.collections` to push Primitives first, then Semantic.
5. **Verify**: `get_variable_defs` on a node, or a read-only `use_figma`, to confirm two
   collections, the 4 Semantic modes, a spot-checked alias (e.g. `alarm` → red/700 in light,
   red/800 in dark), and the `shadow/*` Effect Styles. Re-run the push once to confirm no
   duplicates.

## Notes

- Variables are **unitless** — FLOATs are px (spacing/radius/text), rem (breakpoint), em
  (tracking), ms (duration); colors are sRGB `{r,g,b,a}`.
- Idempotency keys on collection + variable **name**. Renaming a token in code orphans the old
  Figma variable (pre-1.0: acceptable; clean up manually if needed).
- `shadow` → Effect Styles (handled). `cubicBezier`/easings can't be Variables → see the
  package README's table; maintain them manually in Figma.
