---
'@auxiliary/tokens': minor
---

Two new build-time invariants and one removal:

- **Theme-role parity assert** — all four themes must define the identical
  role set with matching `$type`s. A role missing from one theme used to
  silently cascade the light value through (e.g. a darknight theme missing
  `brand` would leak full-blue-energy light brand into the scotopic theme).
- **Source-shape assert** — every token must carry a known `$type` and a
  `$value` shaped for it. Untyped tokens used to flow to Figma as `FLOAT`
  with `null` values, and object values on scalar types emitted
  `[object Object]` into the CSS.
- **Removed the orphaned `density.*` token group** — it duplicated the
  `control.height` vocabulary on a third axis and was referenced nowhere
  downstream. The next Figma push orphans the previously-pushed `density/*`
  variables; delete them manually (pre-1.0 policy).
