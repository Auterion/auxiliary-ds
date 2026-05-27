---
"@auxiliary/css": minor
"@auxiliary/tokens": patch
---

**@auxiliary/css** — wire the Tailwind v4 styling layer (Step 4).

- `theme.css` — single entry consumers import. Bundles Tailwind v4 core, `@auxiliary/tokens` (`@theme` block + theme override selectors), Google Fonts (Inter Variable + Geist Mono), base typography (`font-optical-sizing: auto`, `font-feature-settings` with `cv01`/`cv10`/`ss02`/`ss03`/`calt`/`liga`), and the `tabular`/`font-display`/`font-mono` helpers.
- **Custom `@utility` declarations** — 32 utilities exposing the structured semantic layer cleanly: `bg-canvas`, `bg-surface`, `bg-elevated`, `bg-muted`, `bg-hover`, `text-primary`, `text-secondary`, `text-muted`, `text-inverse`, `bg-accent`, `bg-accent-hover`, `text-accent-fg`, `border-default`, `border-strong`, `border-focus`, `ring-focus`, `bg-input`, `border-input`, plus `bg-/text-/border-{alarm,warning,caution,advisory,nominal}` (15 status utilities). No `bg-background`/`border-border` tautology.
- **First recipe: `recipes/button.ts`** — `tailwind-variants` button with `intent` (`primary/secondary/ghost/danger`), `size` (`sm/md/lg`), and `loading` boolean. Step 5's `<Button>` will wrap this.
- Wired exports for `./theme.css` and `./recipes`; deps on `@auxiliary/tokens` (workspace), `tailwind-variants` ^3.2, `tailwind-merge` ^3.6; peer `tailwindcss` ^4.

**@auxiliary/tokens** — added explicit `exports` map so `@auxiliary/css` (and any other consumer) can `@import "@auxiliary/tokens/dist/tailwind-v4.css"` under strict Node resolution.
