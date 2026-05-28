---
'@auxiliary/vue': patch
'@auxiliary/demo': patch
---

Fix StatusBadge: pill shape + visible foreground dot on solid variant.

- **Shape:** StatusBadge now uses `rounded-full` (pill) instead of `rounded` (4 px corners). This is the convention for operational status indicators (shadcn, Material, Carbon, every aerospace MMI) — pills signal "live state" where rounded-squares signal "static tag." The generic `Badge` keeps `rounded` for that exact reason — different shape, different semantic.
- **Dot color:** solid-variant dots were `bg-{level}` against a `bg-{level}` parent — same color as the background, so invisible. Solid-variant dots now use `bg-{level}-foreground` (white for alarm/nominal, black for warning/caution/advisory) — contrasts cleanly with the colored fill. Outline-variant dots keep `bg-{level}` since there's no fill to clash with.
- **Dot size:** bumped from 6 px (`h-1.5 w-1.5`) to 8 px (`h-2 w-2`) so it reads as an indicator, not a smudge.
- **Padding:** small bump on horizontal padding (px-2 sm / px-2.5 md) so pills don't look pinched.

Also: aliased `@auxiliary/vue` and `@auxiliary/icons` at source in [apps/demo/vite.config.ts](apps/demo/vite.config.ts) so HMR reaches across workspaces. Without the alias the demo resolved both packages to their published `dist/` bundles via the pnpm symlink, which meant local edits to component sources never appeared until the workspace package was rebuilt. This was the reason the StatusBadge bug stayed hidden during prior demo runs.
