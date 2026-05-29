---
'@auxiliary/vue': minor
---

Phase 3 — library-grade packaging: `@auxiliary/vue` now tree-shakes.

- Add `"sideEffects": false` and switch the Vite build to `preserveModules`, so
  the package ships one JS chunk per component (mirroring `src/`) instead of a
  single bundle. Importing one component — even from the barrel — no longer pulls
  in the others.
- Add a per-component export subpath for every barrel component
  (`@auxiliary/vue/Button`, `@auxiliary/vue/Dialog`, …) alongside the `.` barrel.
  The map is generated from `src/index.ts` (`pnpm gen:exports`) and a test fails
  CI if it drifts.
- New tree-shaking smoke test bundles the built `dist` with a real bundler and
  asserts a single import excludes unrelated components.

Note: the main entry is now `./dist/index.js` (was `./dist/auxiliary-vue.js`);
consumers importing from `@auxiliary/vue` are unaffected (the `.` export resolves
automatically).
