# Brand asset masters

Drop the master SVGs here, then run `pnpm --filter @auxiliary/brand sync` to inline
them into `src/registry.generated.ts`. The build ships the inlined copies — consumers
never load raw SVGs.

## Naming

```
assets/<id>/<kind>-<tone>.svg
```

- **id** — matches a logo `id` in `../brand.manifest.json`: `auterion`, `mission-control`, `suite`, `os`
- **kind** — `mark` · `wordmark` · `lockup-horizontal` · `lockup-stacked`
- **tone** — `color` · `mono` · `inverse`

Examples:

```
assets/auterion/mark-color.svg
assets/auterion/mark-mono.svg
assets/auterion/lockup-horizontal-color.svg
assets/mission-control/mark-inverse.svg
```

After adding a file, point the matching slot in `brand.manifest.json` at it (replace
`"pending"` with the relative path, e.g. `"auterion/mark-color.svg"`) and run `sync`.

## SVG conventions

- **One single-color master per mark drives both `mono` and `inverse`.** Author it with
  `fill="currentColor"` (no hard-coded hex) so the `<Logo>` component can color it from
  the surface — `tone="auto"` inherits the themed text color, `inverse` forces light ink.
- **`color` is a separate full-color master** — the brand-correct multi-color artwork.
- Set a tight `viewBox`; strip XML prolog, `<title>`, editor metadata, and `width`/`height`
  attributes (the component sizes via `minSize` / CSS).
- Keep paths optimized (run through SVGO before committing if possible).

## Legibility over imagery

Marks placed over photographic / satellite terrain need a contrast scrim or halo — the
basemap is high-variance imagery, not a flat fill. See `foundations/brand.md`.
