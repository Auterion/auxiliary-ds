# Phase 6.1 — Component audit & gap analysis

The states-matrix + a11y-depth audit that opens Phase 6.1 (see [`ROADMAP-6.md`](ROADMAP-6.md)).
Every shipping component was audited by one agent against a 10-state matrix (default, hover,
focus-visible, active, disabled, loading, empty, error, read-only, skeleton) plus API surface and
a11y depth, then synthesized into the gap analysis and prioritized backlog below.

**This is a planning artifact, not a spec.** It prioritizes 6.2+; it does not authorize any change
on its own. The opt-in constraint from `ROADMAP-6.md` still holds: hardening base-primitive *states*
(below) is in scope for 6.2/6.4; turning `AlertBanner`/`StatusBadge` into the operational alert
**model** is not — that stays a separate opt-in piece (6.3).

## Overall health

26 components audited. **Most are solid or have only minor gaps.** Two need work, for real reasons.

| Verdict | Count | Components |
|---|---|---|
| **solid** | 7 | Label, DropdownMenu, StatusBadge, TelemetryValue, AlertBanner, Accordion, Separator |
| **minor-gaps** | 17 | Button, Input, Switch, Slider, RadioGroup, Select, Dialog, Popover, Tooltip, Toast, Progress, Spinner, Skeleton, Badge, Avatar, Card, Tabs |
| **needs-work** | 2 | **Textarea**, **Checkbox** |

> "Missing state" counts below are raw matrix misses; several are *correctly* N/A (a Separator has
> no loading state). The misses that matter are the cross-cutting ones called out under **State gaps**.

## The "$attrs bug" — verified false positive

The audit flagged `Input`/`Textarea` for documenting `$attrs` forwarding (`aria-*`, `data-*`,
`maxlength`, `required`) while never calling `v-bind="$attrs"`. **This was checked and is wrong.**
Both components have a single root element and don't set `inheritAttrs: false`, so Vue 3's implicit
fallthrough forwards every attribute to the `<input>`/`<textarea>` automatically — the docs are
accurate. Regression tests now lock this (see `Input.test.ts` / `Textarea.test.ts`,
*"forwards arbitrary attributes…"*), closing the audit's separate "no `$attrs` coverage" gap.

> Lesson: the audit reasoned from "no explicit `v-bind`" without accounting for implicit
> fallthrough. Treat its findings as leads to verify, not facts.

With that removed, **Textarea** is effectively `minor-gaps` — its remaining gaps (error / read-only
states) are the same cross-cutting ones shared across the form set, below. **Checkbox** stays the
one genuine `needs-work`: no hover/active feedback, no error/invalid path, no read-only, and
accessible-name pairing is advisory rather than enforced.

## State gaps (cross-cutting)

| Gap | Affected | Why it matters |
|---|---|---|
| **Error / `invalid`** | *Entire* form set — Input, Textarea, Select, Checkbox, Switch, RadioGroup | No `aria-invalid`, no error styling, no validation path. Every product form hand-rolls it. **Highest-impact gap.** |
| **`read-only`** | Input, Textarea, Checkbox, Slider, RadioGroup | Distinct from disabled (allows select/copy, blocks edit) — needed for telemetry/data-display surfaces |
| **loading / async** | Switch, Select, Popover, Card content | Async toggles & async-loaded data are common in C2/GCS |
| **hover** | Input, Checkbox | Interactive elements give no pointer feedback before click |
| **active / pressed** | Button, Checkbox, AlertBanner buttons | Weak tactile confidence on slow/high-latency operational networks |
| **skeleton integration** | Avatar, Card | `Skeleton` exists but is not composed into data-display components |

## A11y gaps (cross-cutting)

- **No `prefers-reduced-motion` contract at the recipe layer.** Button (`transition-colors`), Switch,
  Slider, Select, Tabs, Tooltip all animate unconditionally. The global reset in `theme.css` catches
  some, but it's not encoded per-recipe and isn't tested per-component.
- **Validation a11y wiring** (`aria-invalid` + `aria-describedby`) is provided by **no** form
  component — error announcement depends entirely on consumer discipline.
- **Color-only differentiation risk**: Button `ghost` hover (`bg-accent`) and Checkbox checked state
  (color fill + border only) — potential WCAG 1.4.1 misses; add a shape/weight/icon cue.
- **Accessible-name pairing is advisory, not contractual** on Checkbox, Switch, RadioGroupItem,
  Avatar — a component can ship with no accessible name. Consider a `label` prop or enforced binding.
- Minor: `SelectSeparator` lacks `role=presentation`/`aria-hidden`; Dialog disabled-trigger has no
  `aria-disabled`; DropdownMenu disabled-item announcement under-specified.
- **Test depth is shallow** for error states, `$attrs` passthrough, type-ahead, RTL/loop, and
  reduced-motion across Textarea, Input, Select, RadioGroup, Tooltip, Card.

## API consistency

- **`level` vs `variant` is a deliberate split** (operational severity tiers
  `alarm|warning|caution|advisory|nominal` vs design treatment) but is **undocumented as a
  convention**. Toast's `type` (foreground/background → ARIA politeness) is a third spelling.
  → Formalize: *`level` = operational severity, `variant` = design treatment*; annotate Toast `type`.
- **Form controls expose no `size` axis** — Button/Badge do; Input/Textarea/Select/Checkbox/Switch
  don't. Standardize a shared `sm/md/lg` scale for compact GCS/telemetry density.
- **`class` passthrough missing** on `DialogTrigger`, `DialogClose`, `ToastAction` — every leaf
  should accept `class?: HTMLAttributes['class']` merged via `cn()`.
- **Typed `Props`/`Variants` exports inconsistent** — Button exports `ButtonVariants`; Input,
  Textarea, StatusBadge, DropdownMenu, Popover don't, weakening downstream inference.
- `Input.type` is loose `string` — tighten to a union of valid HTML input types.
- **Good and worth keeping**: controlled/uncontrolled support (v-model + `defaultValue`) is
  consistent across families — make it the documented standard for new components.

## Missing primitives — filtered to Auterion operational needs

Not a shadcn/Reka parity checklist; only what GCS/C2/marketing surfaces actually need (Principle 3,
restraint).

| Primitive | Ops value | Effort | Note |
|---|---|---|---|
| **Table / DataGrid** | high | L | *The* top missing surface — fleets, mission logs, telemetry streams, alert history. Build the headless primitive first (sortable, sticky header, density, row selection); defer virtualization. |
| **NumberField** | high | S | Altitude/speed/frequency/step entry — steppers, min/max/step clamp, unit display. Input-as-string is error-prone. Pairs with `TelemetryValue`. |
| **Combobox** | high | M | Type-ahead over large sets (vehicle IDs, waypoints, frequencies) where Select is too slow. Reka provides primitives. |
| Command palette | medium | M | Keyboard-first launcher for dense consoles; composes on Combobox + DropdownMenu |
| Pagination | medium | S | Companion to Table — only valuable once Table lands |
| Toolbar | medium | S | Roving-tabindex action bars (map/console controls); fixes a11y of ad-hoc button clusters |
| Resizable / Splitter | medium | M | Multi-pane operator consoles (map + telemetry + log) |
| Tree | medium | L | Hierarchies (mission plans, layer/asset trees) — narrower than Table; defer unless a surface needs it |

## Prioritized backlog

Ordered by value. Items 1–5 are base-primitive hardening (lands in 6.2 spine / 6.4 depth); 6+ are
new primitives (6.4 compose). None touch the 6.3 opt-in alert model.

1. **Shared validation API** — `invalid`/`error` prop auto-wiring `aria-invalid` + `aria-describedby`
   across Input, Textarea, Select, Checkbox, RadioGroup, Switch. *Single highest-value fix.*
2. ~~Fix the `$attrs` forwarding bug on Input/Textarea~~ — **done & disproven**: not a bug (Vue
   implicit fallthrough already forwards); regression tests added.
3. Add **error / read-only / hover** states to form-control recipes (incl. `border-destructive`
   error styling and a distinct read-only treatment).
4. **Centralize a `prefers-reduced-motion` contract** at the recipe layer; apply to Button, Switch,
   Slider, Select, Tabs, Tooltip; add reduced-motion tests.
5. **Shared `size` axis** (`sm/md/lg`) on interactive controls for compact GCS/telemetry density.
6. **Build Table/DataGrid** headless primitive — top operational surface.
7. **Add NumberField** (steppers, min/max/step clamp, unit display).
8. **Build Combobox** (type-ahead filtered select) on Reka primitives.
9. Add `class` passthrough to `DialogTrigger`, `DialogClose`, `ToastAction`.
10. Add **non-color secondary cues** to Checkbox checked + Button ghost hover (WCAG 1.4.1); verify
    contrast across all Badge variants.
11. Make **accessible-name pairing contractual** (or add a `label` prop) for Checkbox, Switch,
    RadioGroupItem, Avatar; bind `aria-label` across Avatar image + fallback.
12. Tighten `Input.type` to a union; export typed `Props`/`Variants` for Input, Textarea,
    StatusBadge, DropdownMenu, Popover.
13. Add **active/pressed** feedback to Button recipe and AlertBanner action/dismiss buttons.
14. Fix `SelectSeparator` role; document Dialog disabled-trigger `aria-disabled` + DropdownMenu
    disabled-item announcement.
15. **Document the `level`-vs-`variant` vocabulary** as a formal API convention; reconcile/annotate
    Toast `type`.
16. Add **loading/async** states to Switch, Select, and Popover content.
17. **Integrate Skeleton** into Avatar and Card; add a loading control prop to Skeleton to drop the
    `v-if` boilerplate.
18. Add **Pagination** and **Toolbar** once Table lands.
19. **Deepen test coverage**: keyboard / type-ahead / RTL / error / `$attrs` / reduced-motion for
    Select, RadioGroup, Textarea, Input, Tooltip, Card.
20. Evaluate a Card `variant`/`level` axis and optional `CardTitle` tag override for vocabulary
    alignment and heading-hierarchy flexibility.

## Where this routes in Phase 6

- **6.2 Spine** — the validation API, reduced-motion contract, and size axis are spine-level
  conventions (#1, #3, #4, #5, #15).
- **6.3 Defense** — unaffected; the alert *model* and guarded primitives remain separate/opt-in.
- **6.4 Compose** — the missing primitives (#6–#9, #18), per-component a11y/motion depth (#10–#14,
  #19), and Skeleton integration (#17).
- **6.5 Data-viz** — Table/DataGrid (#6) is the natural neighbor; data-display surfaces feed it.
