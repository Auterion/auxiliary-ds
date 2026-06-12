---
'@auxiliary/css': patch
'@auxiliary/vue': patch
'@auxiliary/viz': patch
---

Token-role correctness sweep (the verified-mechanical findings from the
token-role audit; design-shaped findings deferred):

- **Skeleton** `bg-muted` → `bg-input` — muted is identical to `card` in dark,
  so skeletons inside cards were invisible.
- **Gauge track** `var(--border)` → `var(--input)` — the SVG twin of the
  slider-track fix (border is 1.30:1 in light).
- **Table row hover** `bg-muted/50` → `bg-accent` — the hover-tint role;
  muted/50 composited to 1.00:1 inside dark cards.
- **Surface/foreground pairing**: popover, select, combobox, dropdown-menu,
  and toast content now pair `bg-popover` with `text-popover-foreground`
  (toast title inherits); card pairs with `text-card-foreground`. Latent today
  (values coincide in every theme) but locked so a future theme divergence
  can't silently mispair.
- **AlertBanner action/dismiss press states** `active:bg-foreground/10` →
  `active:bg-current/10` — pressing with the page foreground was a white wash
  over yellow caution fills in dark (1.06:1, polarity-wrong).
- **Accordion content** `text-muted-foreground` → `text-foreground` — expanded
  payload text belongs in the primary text role.
- **TimeSeries** axis/grid colors now resolve against the host element (scoped
  `[data-theme]` ancestors are honored) and fall back to the inherited text
  color with a dev warning instead of hardcoded `#888`/`#ccc` hex guesses.
- **Bars** `colorByIndex` uses `seriesVar()` CSS-var references (SVG resolves
  the cascade) instead of module-scope resolved strings.

All locked by new recipes-a11y assertions (skeleton/table-hover/pairing/press
states). 63 css · 341 vue · 36 viz tests pass.
