---
'@auxiliary/css': patch
'@auxiliary/vue': patch
---

npm-consumer correctness: `theme.css` now also `@source`-scans
`@auxiliary/vue/dist` so component-internal utility classes are generated for
installs where only `dist/` ships (the old `../vue/src` glob silently matched
nothing outside the workspace). `@auxiliary/vue`'s build externalizes all
`@auxiliary/*` subpaths — `@auxiliary/css/format` (and its `mgrs` dependency)
was being vendored into the published dist.
