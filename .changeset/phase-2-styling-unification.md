---
"@auxiliary/css": minor
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

Phase 2 — unify the styling layer. One styling idiom, one variant vocabulary, every component restyleable by consumers.

**Breaking (pre-1.0, no shim):**

- `<Button>`'s `intent` prop is renamed to `variant` (`primary | secondary | ghost | danger`), matching `<Badge>` and the rest of the system. Update `intent="…"` → `variant="…"`. `level` is retained only on the operational/status family (`StatusBadge`, `AlertBanner`), where severity is a distinct axis.

**`@auxiliary/css`:**

- New `cn()` helper exported from `@auxiliary/css/utils` (`twMerge` + a clsx-style joiner, no new dependency) — the primitive behind every component's `class` passthrough.
- One `tailwind-variants` recipe per styled component, all exported from `@auxiliary/css/recipes`. Previously only `button` was centralized; every other component reinvented its variants locally.
- A shared `Size` vocabulary (`sm | md | lg`) so component sizes stop diverging arbitrarily.
- The `./recipes` export now resolves under `dist/recipes/*` (was `dist/*`) to make room for the `./utils` subpath. Internal layout change — consumer import specifiers (`@auxiliary/css/recipes`) are unchanged.

**`@auxiliary/vue`:**

- Every styled component now reads props → calls its recipe → `cn(recipe(...), props.class)`. The hand-rolled `{ … }[props.x].join(' ')` variant maps and the bare inline Tailwind strings are gone.
- Every component accepts a `class` prop, merged via `cn()`, so consumers can safely override styling (conflicting Tailwind utilities resolve last-wins).
- No behavioral or token changes; the Phase 1 test/a11y gate stays green.
