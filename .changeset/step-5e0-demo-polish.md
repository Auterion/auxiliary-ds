---
"@auxiliary/demo": patch
---

**Demo polish (Step 5e.0).** Three small structural improvements without touching tokens or components.

1. **Sticky left sidebar with section nav** — 8 anchor links (`#status`, `#buttons`, `#form`, `#typography`, `#dialog`, `#floating`, `#menus`, `#surfaces`) for fast jumping. Hidden on small screens. Hover state uses `bg-hover`.
2. **Section index numbers** — each `<section>` gets a `01` / `02` / … mono tabular index before the heading. Adds visual rhythm without redesigning.
3. **Breathing room** — section spacing `space-y-12 → space-y-20`; heading-to-intro `mb-1 → mb-2`; intro-to-content `mb-5 → mb-6`; max width `max-w-6xl → max-w-7xl` for the wider layout with sidebar.

Also refreshed the header subtitle to surface inventory: "16 primitives · 5-level status · 4 themes".

Deferred per the chat: density toggle (needs token-side wiring first) and "Golden Screen" mission-control mockup (waits for operational primitives to land).
