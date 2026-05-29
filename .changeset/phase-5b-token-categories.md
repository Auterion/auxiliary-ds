---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
---

Phase 5b — fill the missing foundational token categories (ROADMAP Phase 5b).

**`@auxiliary/tokens`** gains three DTCG token groups, emitted to every artifact
(CSS vars, Tailwind `@theme`, `tokens.json`, `tokens.ts`):

- **z-index** — a semantic layering scale `--z-base … --z-tooltip` (0–80): base,
  raised, sticky, nav, dropdown, overlay, modal, toast, tooltip. Coherent stacking
  with a deliberate operational rule: toasts surface above modals so alerts are
  never hidden.
- **breakpoints** — `--breakpoint-sm … --breakpoint-2xl` (rem), wired into Tailwind
  v4's responsive variants/container queries; tokenized so all surfaces share one set.
- **semantic typography roles** — named `--text-*` roles (`caption`, `label`, `body`,
  `body-lg`, `title`, `heading`) aliasing the t-shirt scale, generating `text-*`
  utilities so you size by intent.

**`@auxiliary/css`** — the overlay recipes (Dialog, Popover, Tooltip, DropdownMenu,
Select, Toast) now bind their stacking to the z-index scale (`z-[var(--z-*)]`)
instead of ad-hoc `z-50`/`z-[100]`. Net stacking change: dialog content sits above
its scrim, toasts above modals, tooltips on top.
