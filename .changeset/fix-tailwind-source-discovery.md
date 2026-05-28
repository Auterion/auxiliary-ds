---
"@auxiliary/css": patch
---

**Fix:** scan `@auxiliary/vue` source and `@auxiliary/css/recipes` for Tailwind utility class names.

Tailwind v4's default content discovery only scans the consuming app's own files, not workspace or installed dependencies. As a result, every utility class used **inside** an `@auxiliary/vue` component (`bg-alarm`, `text-alarm`, `border-alarm`, `bg-accent-hover`, `ring-focus`, etc.) or inside the button recipe (`hover:bg-accent-hover`) was never compiled into CSS — so `<StatusBadge>`, `<AlertBanner>`, and `<Button>` hover states all rendered with no color.

Added two `@source` directives to `theme.css`:

```css
@source "../vue/src/**/*.{vue,ts}";
@source "./recipes/**/*.ts";
```

Paths resolve relative to the installed `theme.css` location so this works for any consumer via the standard `import '@auxiliary/css/theme.css'` entry. Demo CSS bundle grew 19.75 → 26.65 KB — those are the rules that should have been there from the start.
