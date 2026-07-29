# Layering & breakpoints

Two foundational scales that keep composed surfaces predictable: a **z-index**
layering order so overlays stack consistently, and the **breakpoints** the
responsive system is built on. Both are DTCG tokens in `@auxiliary/tokens` — change
them once and every surface follows.

## Z-index

A semantic layering scale, low → high. Each overlay primitive binds to a level
rather than a magic number, so stacking is coherent across the system: a scrim sits
below its dialog, a tooltip is always on top, and **toasts surface above modals** —
an operational rule, so an alert is never hidden behind a dialog.

Use via the CSS variable: `z-[var(--z-modal)]` (or `var(--z-modal)` in raw CSS).

| Token | Value | Used for |
| --- | --- | --- |
| `--z-base` | 0 | Default content plane. |
| `--z-raised` | 10 | Subtle in-flow elevation (raised cards). |
| `--z-sticky` | 20 | Sticky section headers / toolbars. |
| `--z-nav` | 30 | App top bar / primary navigation. |
| `--z-dropdown` | 40 | Anchored poppers — `DropdownMenu`, `Select`, `Popover`. |
| `--z-overlay` | 50 | Modal scrim / backdrop (`Dialog` overlay). |
| `--z-modal` | 60 | Modal content above its scrim (`Dialog` content). |
| `--z-toast` | 70 | Notifications — above modals so alerts always surface. |
| `--z-tooltip` | 80 | Transient hints — always on top. |

## Blur

The backdrop scale that separates a floating surface from what's behind it. Used
through Tailwind's `blur-*` and `backdrop-blur-*` utilities.

| Token | Value | Used for |
| --- | --- | --- |
| `--blur-xs` | 4px | Barely-there separation. |
| `--blur-sm` | 8px | The dialog / popover scrim (`backdrop-blur-sm`) — the only blur in the system today. |
| `--blur-md` | 12px | — |
| `--blur-lg` | 16px | — |
| `--blur-xl` | 24px | — |

> **`--blur-*` overrides Tailwind's built-ins.** Unlike `--z-*`, blur *is* a Tailwind
> v4 theme namespace, so these declarations replace the defaults: changing a value
> here changes every `blur-*` and `backdrop-blur-*` utility in the system, including
> in code that never heard of Auxiliary. The five values above match Tailwind v4's
> defaults **exactly** (verified against `tailwindcss/theme.css`), so adopting the
> tokens is a no-op today — the point is that the values are now ours to change.
> Tailwind's `2xl` (40px) and `3xl` (64px) are deliberately not restated: nothing uses
> them, and they keep working from the defaults.

The scrim itself is a colour, not a blur: `--overlay` is black at a fixed alpha in
every theme (see [Colors](/foundations/colors)). Blur softens what's behind the scrim;
the scrim is what darkens it.

## Breakpoints

The min-width breakpoints behind Tailwind's responsive variants (`sm:`, `md:`, …)
and container queries. Defined in `rem` so they respect the user's root font size.
They match the conventional scale — tokenized here so product, marketing, and
internal tools share one set instead of redefining per surface.

| Token | Value | ≈ px |
| --- | --- | --- |
| `--breakpoint-sm` | 40rem | 640 |
| `--breakpoint-md` | 48rem | 768 |
| `--breakpoint-lg` | 64rem | 1024 |
| `--breakpoint-xl` | 80rem | 1280 |
| `--breakpoint-2xl` | 96rem | 1536 |

```vue
<!-- Tailwind responsive variants read these breakpoints -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">…</div>
```
