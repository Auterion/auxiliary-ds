---
'@auxiliary/css': patch
'@auxiliary/vue': patch
---

AlertBanner's action and dismiss buttons are now styled by `action`/`dismiss`
slots on the `alertBanner` recipe (which becomes slot-based: `root`, `icon`,
`action`, `dismiss`) instead of hand-rolled Tailwind strings in the component
— the one violation of the recipes-only styling rule.
