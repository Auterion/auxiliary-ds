---
'@auxiliary/tokens': patch
---

Darknight theme: align green & warmth toward OpenBridge night (warm black + bat-signal gold).
`nominal` now reads as green — a dim green surface (`green.900`) with vivid mint text
(`emerald.300`, 5.98:1) — instead of amber-on-green. Neutrals warm toward amber-brown
(`secondary`/`accent`/`border` → `amber.950`, `input` → `amber.900`) and the focus `ring`
brightens to `amber.400`. Amber stays the UI accent; green is still regulated to `nominal` only;
all pairs clear the 4.5:1 floor and the night-vision blue cap (≤0.15). Other themes and the
non-nominal status tiers are unchanged. (darknight-only edit in `darknight.tokens.json`.)
