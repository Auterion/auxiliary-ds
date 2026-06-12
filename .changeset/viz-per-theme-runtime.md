---
'@auxiliary/viz': minor
---

**Per-theme palette runtime.** The viz scales are now four-mode semantic
roles (see `@auxiliary/tokens`), and the package resolves them accordingly:

- `categoricalVars`/`sequentialVars`/`divergingVars` and `seriesVar()` are
  unchanged — SVG/DOM consumers re-theme automatically via the cascade.
- New `resolveScale(el, scale)` / `resolveSeries(el, i)` resolve the CURRENT
  values from a host element's computed style for canvas renderers (uPlot),
  honoring scoped `[data-theme]` ancestors; new `observeTheme(el, cb)`
  re-fires on live theme switches.
- `TimeSeries` uses both: series/axis/grid colors resolve against its host
  and the chart re-initializes when `data-theme` changes anywhere above it —
  live theme switches recolor without a remount.
- The resolved `categorical`/`sequential`/`diverging` arrays are now
  explicitly the LIGHT-theme values, kept as static/SSR fallbacks only.
