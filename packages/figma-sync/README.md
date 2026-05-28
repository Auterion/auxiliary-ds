# @auxiliary/figma-sync

**Status: parked.** This package is reserved for future Figma sync tooling but is not actively developed.

---

## Why

We evaluated two paths for pushing Auxiliary tokens into Figma Variables and rejected each for Auterion's current context:

- **REST API + GitHub Action** — gold standard, but `file_variables:write` is Enterprise-only. Auterion is on Organization tier.
- **DTCG Design Token Manager plugin** — free, but can't produce a multi-mode collection from a single file. Themes arrive as folders, defeating the point of theming.

Building our own plugin (~250 LOC) was scoped but deferred.

## What we ship instead

The tokens package emits a **DTCG-spec-compliant** JSON at `packages/tokens/dist/tokens.json`. Any design tool that consumes DTCG tokens — Paper, Magic Path, Pencil, future Figma plugins, etc. — can read this directly. Code stays the source of truth; downstream tools own their import.

```bash
pnpm --filter @auxiliary/tokens build
```

## When to revisit Figma sync

Reopen this package when ANY of:

- Auterion moves to Figma Enterprise → wire a GitHub Action that calls the Variables REST API on merge to `main`.
- The team decides Figma Variables are operationally required and the one-time setup cost is justified → build a custom one-way push plugin.
- A second Figma file needs syncing (manual cost multiplies).
- Semantic theme mappings start changing more than ~once a month.

## Open follow-up: Figma MCP exploration

Track separately. Approach: use the Figma MCP (already loaded in the Claude environment) to programmatically build a small test file with primitives + 4-mode semantic collection + cross-collection aliases, then read it back via `get_variable_defs` to capture Figma's actual native variable JSON shape. Use the captured shape as the contract for a `json/figma-native` build format in `@auxiliary/tokens` that emits matching JSON. This bypasses third-party plugin format guesswork and gives us a deterministic round-trip with Figma Variables on the Organization tier.

Out of scope for the current PR; tracked here so we can pick it up without re-scoping.

---

## Shadows + easings in Figma (still relevant for designers)

Figma Variables can't model `cubicBezier` or composite multi-layer `shadow` types — even Enterprise REST API doesn't. If a designer mirrors Auxiliary tokens into a Figma file by hand, they need to maintain these as **Figma Effect Styles** (shadows) and **Smart Animate** custom beziers (easings). Update these styles whenever the code values change — `packages/tokens/src/primitive/shadow.tokens.json` and `motion.tokens.json` are authoritative.

### Shadows → Effect Styles

| Style name | Type | Color | X | Y | Blur | Spread | Notes |
|---|---|---|---|---|---|---|---|
| `shadow/sm` | Drop shadow | `#000` 8% | 0 | 1 | 2 | 0 | single layer |
| `shadow/md` (layer 1) | Drop shadow | `#000` 10% | 0 | 4 | 8 | −2 | composite |
| `shadow/md` (layer 2) | Drop shadow | `#000` 6% | 0 | 2 | 4 | −2 | same style |
| `shadow/lg` (layer 1) | Drop shadow | `#000` 12% | 0 | 12 | 24 | −6 | composite |
| `shadow/lg` (layer 2) | Drop shadow | `#000` 8% | 0 | 4 | 8 | −4 | same style |

### Easings → Smart Animate custom bezier

| Token | Bezier | Use case |
|---|---|---|
| `ease/out` | `0.16, 1, 0.3, 1` | UI entering view |
| `ease/in-out` | `0.65, 0, 0.35, 1` | UI moving between two states |
| `duration/fast` | 120 ms | small UI nudges |
| `duration/base` | 200 ms | most transitions |
| `duration/slow` | 320 ms | layout-level transitions |
