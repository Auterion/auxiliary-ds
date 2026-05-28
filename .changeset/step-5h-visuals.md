---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**Step 5h — Visual primitives.** Avatar, Badge (generic), Progress, Spinner, Skeleton. Closes the "universal basics" set vs Radix, Material, Carbon, Polaris, Atlassian DS, Primer.

New `@auxiliary/vue` exports:

**Avatar** (3 exports) — image with initials fallback when the image fails. Reka-backed for the fallback delay/load flow.

```ts
Avatar, AvatarImage, AvatarFallback
```

Sizes: `sm` (24px) / `md` (32px) / `lg` (40px).

**Badge** — generic informational chip, distinct from `<StatusBadge>` (which is status-coded). Variants: `default` / `secondary` / `outline` / `accent`. Sizes: `sm` / `md`.

**Progress** — Reka-backed bar with optional `level` (alarm / warning / caution / advisory / nominal) coloring the fill. Used for battery / mission progress / signal strength.

**Spinner** — pure SVG, no headless dep. Spins via Tailwind's `animate-spin`. Uses `currentColor` so it inherits color from the parent's text color. Accessible via `role="status"` + `aria-label`.

**Skeleton** — single-element loading placeholder with `animate-pulse`. Sized by consumer (e.g. `<Skeleton class="h-4 w-32" />`).

`apps/demo` — new "Visuals" section with two columns: Avatars + Badges + Spinners on the left, Progress (battery thresholds 74/42/18/5%) + Skeletons on the right.

Bundle: `@auxiliary/vue` 42.54 → 46.98 KB. Demo 340 → 349 KB.

**End of "basic controls" phase.** 51 primitives total — covering everything universal across the six major design systems. Next: Step 7 (Figma OKLCH→hex fix + import doc) and Step 8 (FA Pro Sharp icons).
