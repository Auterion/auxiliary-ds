---
'@auxiliary/icons': minor
'@auxiliary/demo': patch
---

Step 8: `<Icon>` contract over Font Awesome Pro Sharp + Auterion custom kit.

- Typed `<Icon name weight size label>` Vue component backed by a static, committed registry — runtime carries no `@fortawesome/*` dependency; consumers do not need FA Pro access to use the package, only to extend it.
- `src/config.ts` is the curated allow-list (Step 0 set: 36 FA Sharp glyphs across navigation / action / status / identity, restrained per CLAUDE.md principle 3). `scripts/sync.mjs` regenerates `src/registry.ts` from the allow-list + hand-authored SVGs in `inputs/`.
- Initial state: 1 custom glyph (`drone`). Setting `FONTAWESOME_PACKAGE_TOKEN` and running `pnpm sync` populates the 36 FA-sourced icons across thin / light / regular / solid weights.
- Demo: size scale strip + alarm-tier pairing + full registry coverage grid.
