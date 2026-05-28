---
'@auxiliary/docs': minor
---

Step 6: VitePress documentation site at `:5173`.

**What ships:**

- **Foundations** — Colors (3-tier surfaces / intents / 5-level alarm hierarchy, live token values that recompute on theme switch), Typography (Inter Variable opsz spec + Geist Mono identifier examples + `ss02` disambiguation table), Spacing (4 px linear scale with "when which step" guidance), Radii (six-step scale + the load-bearing Badge-vs-StatusBadge shape distinction).
- **Components** — Button and StatusBadge as the doc template: one-line summary, when to / when not to use, props table, three usage examples with live renders, a11y notes, "Tokens consumed" mapping. The remaining ~18 primitives will follow this shape incrementally.
- **Theme switcher** in the docs chrome — flip between light / dark / sunlight / darknight and every swatch, every component preview, every token value on the page recomputes.
- **VitePress chrome bridged to Auxiliary tokens** — `--vp-c-*` mapped to `--background`, `--card`, `--primary`, etc. so the docs site visually matches the design system it documents.
- **Source aliasing** — `@auxiliary/vue` and `@auxiliary/icons` resolved to source via the vite config, so HMR reaches across workspaces during docs authoring.

**What's next** (deferred):
- The remaining component pages (Input, Label, Dialog, Popover, Tooltip, DropdownMenu, Select, Tabs, Toast, Card, Accordion, Avatar, Badge, Progress, Spinner, Skeleton, Checkbox, Switch, RadioGroup, Slider, Textarea, TelemetryValue, AlertBanner).
- Pattern pages (app shell, command palette, entity list-detail).
- A11y CI gate (axe-core) — needs the docs to exist before it can assert against rendered pages.
