---
'@auxiliary/css': minor
---

Honor `prefers-reduced-motion` globally (ROADMAP cross-cutting: operational
determinism). `theme.css` now ships an unlayered `@media (prefers-reduced-motion:
reduce)` reset that collapses animation/transition durations to ~0 and stops
looping (`!important`, so it overrides Tailwind's `transition-*`/`animate-*`
utilities) — a state-bearing change can never be hidden behind or obscured by
motion on operational surfaces. A new Vitest gate locks the reset in place so a
refactor can't silently drop it.
