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
@auxiliary/tokens build ──▶ dist/figma-native.json   (Primitives + 4-mode Semantic + aliases)
                            dist/tokens.json          (shadows)
        │
   figma-sync build ──▶ dist/push.figma.js            (self-contained use_figma program)
        │
   /figma-sync skill ──▶ use_figma(push.figma.js) ──▶ Figma file
                              ├─ Collection "Primitives" (Base)
                              ├─ Collection "Semantic"   (light / dark / sunlight / darknight)
                              └─ Effect Styles  shadow/sm · shadow/md · shadow/lg
```

The `json/figma-native` build format (in `@auxiliary/tokens/build.mjs`) is the contract; the push
program is idempotent (matches collections/variables by name, two-pass alias resolution), so
re-running updates in place — no duplicates.

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

Figma Variables can't model composite `shadow` or `cubicBezier` — even the Enterprise REST API
can't. Shadows are pushed as **Effect Styles** by this tool; **easings remain documentation**.
`packages/tokens/src/primitive/shadow.tokens.json` and `motion.tokens.json` are authoritative.

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
