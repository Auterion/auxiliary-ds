# Auterion custom glyphs

Hand-authored SVGs for operational concepts that have no Font Awesome equivalent
(drone, geofence, RTL, RTH, GPS state, waypoint, etc.).

## Format

Each file is `<name>.svg`, where `name` matches its entry in [`src/config.ts`](../src/config.ts)
under `CUSTOM_ICONS`.

Authoring rules:

1. **`viewBox` is required.** `sync.mjs` reads it directly. Prefer a square viewBox
   (`0 0 24 24` is the default for the operational set).
2. **Fill, not stroke, when possible.** Icons inherit `fill="currentColor"` from the
   outer `<svg>` rendered by `Icon.vue`. Pure-fill icons recolor cleanly across themes.
   When a stroke is needed, set `stroke="currentColor"` explicitly on the element.
3. **No `<defs>`, no gradients, no clip paths.** The renderer drops the outer `<svg>`
   tag and inlines the inner content verbatim — anything that depends on referenced
   IDs will break across multiple instances of the same icon on a page.
4. **No `width`/`height` on the `<svg>`.** Those come from the `size` prop at render
   time. The `viewBox` is the only sizing source of truth.
5. **No `fill` attribute on the root `<svg>`.** Same — the renderer sets it.

## After authoring

1. Add the name to `CUSTOM_ICONS` in [`src/config.ts`](../src/config.ts).
2. Run `pnpm --filter @auxiliary/icons sync` to regenerate the registry.
3. Verify the icon renders at 12/16/24 px in the demo app.
