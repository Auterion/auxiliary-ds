---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**Step 5e — Tabs + Toast.** Final batch of general primitives from the plan menu.

**Tabs** (4 exports) — panel switching with full keyboard nav (←/→, Home/End).

- `<Tabs>` — root, supports `v-model`, `default-value`, `orientation`, `activation-mode` (`automatic` / `manual`)
- `<TabsList>` — styled container (`bg-surface` + `border-default`, inline-flex padding)
- `<TabsTrigger>` — tab button, active state uses `bg-accent` + `text-accent-fg`
- `<TabsContent>` — panel that renders only for the active value (or always if `force-mount`)

**Toast** (7 exports) — transient notifications. ARIA live-region announcement, auto-dismiss, swipe-to-dismiss, pause-on-hover. Single global `<ToastViewport>` renders fixed at bottom-right.

- `<ToastProvider>` — wraps app, configures `duration` (default 5s), `label`, `swipeDirection`, `swipeThreshold`
- `<ToastViewport>` — placed once at the root; fixed bottom-right, max-width 420px
- `<Toast>` — root, `v-model:open` controlled or `default-open`. Emits `escapeKeyDown`, `pause`, `resume`, `swipeStart/Move/Cancel/End`
- `<ToastTitle>` / `<ToastDescription>` — semantic typography
- `<ToastAction>` — interactive button inside toast (requires `alt-text` for screen readers)
- `<ToastClose>` — built-in close button with X icon (slot to override)

`apps/demo`:

- New **Tabs** section showing Telemetry / Waypoints / Logs panels with mock data
- New **Toast** section with three trigger buttons (info / success / alarm) that fire toasts via `v-model:open` toggling. Demonstrates the re-arm pattern (close → 50ms → open) so repeat clicks restart the timer.
- Demo wrapped in `<ToastProvider>` and a single `<ToastViewport>` for global rendering.

Bundle impact: `@auxiliary/vue` 17.21 → 23.64 KB (wrappers only). Demo 256 → 284 KB (Reka Tabs + Toast primitives).

**End of general-primitives phase.** Next pivot: operational primitives (StatusBadge, TelemetryValue, AlertBanner) — the Auterion-specific differentiator from the plan's post-Step-7 menu.
