---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**Step 5g — Structural primitives.** Card + Separator + Accordion. The compositional layer for any content surface.

New `@auxiliary/vue` exports:

**Card** (6 exports) — content container with header/title/description/content/footer compound parts. No headless dep; just styled divs that compose cleanly with everything else.

```ts
Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
```

**Separator** — horizontal or vertical divider. Backed by Reka's `Separator` for ARIA correctness (`role="separator"` or decorative).

```ts
Separator   // <Separator orientation="vertical" class="h-4" />
```

**Accordion** (4 exports) — collapsible sections with full keyboard nav (↑/↓ between triggers, Home/End, Space/Enter to toggle), ARIA region semantics, single or multiple open. Backed by Reka.

```ts
Accordion, AccordionItem, AccordionTrigger, AccordionContent
```

`apps/demo`:

- New "Structure" section between Toast and Surfaces with two side-by-side cards:
  - **Vehicle MX-01 card** — shows `<Card>` composing `<StatusBadge>` + `<TelemetryValue>` + `<Separator orientation="vertical">` + `<Button>` in header/content/footer pattern
  - **Pre-flight checks card** — `<Accordion type="single" collapsible>` with 4 items (airspace, weather, vehicle systems, payload). Demonstrates `disabled` item and `default-value="airspace"` for the open-by-default item.

Bundle: `@auxiliary/vue` 37.72 → 42.54 KB. Demo 324 → 340 KB.
