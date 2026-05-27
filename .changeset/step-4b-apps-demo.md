---
"@auxiliary/css": patch
---

Add `apps/demo` — a Vite + Vue showcase app that exercises the design system end-to-end. Living artifact for design + engineering review.

What it shows (today):
- **Theme switcher** (system / light / dark / sunlight / darknight) — flips `[data-theme]` on `<html>`; every component re-themes live, including the demo's own chrome
- **5-level status grid** — alarm / warning / caution / advisory / nominal side by side with real operational copy ("Link lost", "Battery low", "Wind > 10 m/s", "New waypoint", "All systems go")
- **Button matrix** — `intent` × `size` from the `@auxiliary/css/recipes/button` tailwind-variants recipe
- **Typography specimen** — Inter Variable for body, Geist Mono + `tabular-nums` for mission IDs and coordinates; `ss02`/`cv01` feature settings disambiguate I/l/1 and O/0
- **Surface hierarchy** — bg-canvas → bg-surface → bg-elevated, with borders and shadow

Also:
- Fixed CSS `@import` order in `@auxiliary/css/theme.css` — Google Fonts import must precede other rules.
- Added `allowBuilds.esbuild: true` to `pnpm-workspace.yaml` so pnpm 11 permits esbuild's postinstall script (Vite dep).

Runs on port 5174 (docs takes 5173). `pnpm --filter @auxiliary/demo dev`.
