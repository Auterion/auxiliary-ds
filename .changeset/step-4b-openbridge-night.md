---
"@auxiliary/tokens": patch
---

Rewrite the **darknight** semantic theme with values sourced from the [OpenBridge web components](https://github.com/Ocean-Industries-Concept-Lab/openbridge-webcomponents) Night palette (`:root[data-obc-theme="night"]` in `packages/openbridge-webcomponents/src/palettes/variables.css`).

Replaces the previous principled-approximation OKLCH values with the maritime-grade real palette: pure black canvas, warm amber text (rgb 234/167/94 = `#eaa75e`) that preserves dark adaptation, warm-brown raised surfaces (`rgb(39, 27, 16)`), and the standard maritime alert tuple (alarm vivid red, warning dimmed orange, caution dimmed olive). Advisory uses OpenBridge's categorical-qualitative-01 dimmed blue; nominal uses the running indicator green (the only colors permitted by the spec at those roles).

Mapping documented in PR #6.
