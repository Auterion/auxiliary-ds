# Visual language

The tokens make Auxiliary *correct*; this page is about making it *designed*.
It states the **why** behind the look — the rules a contributor should be able
to apply without a designer in the room — and sets the bar every component is
held to: does it look **designed**, or merely **unbroken**?

The thesis: **operational truth, expressed with precision.** Auxiliary draws on
the Swiss / NASA-JPL traditions — restraint, grid discipline, typographic
clarity — and refuses ornament that doesn't carry meaning. Everything below
derives from `@auxiliary/tokens`; this page never introduces new values, it
explains how to *apply* the ones we have.

## Type

- **Families.** `--font-sans` (Inter) for UI and prose; `--font-mono`
  (Geist Mono) for any value a human reads as data — coordinates, IDs,
  telemetry. Pair them deliberately; don't set body copy in mono.
- **Scale.** Use the semantic roles (`caption`, `label`, `body`, `body-lg`,
  `title`, `heading`, `display`) rather than raw sizes, so type stays on the
  modular scale. The scale is the same in both registers — operational gains
  density from spacing, not smaller type (see [Registers](./registers)).
- **Tabular numerals.** Any changing or column-aligned number uses `tabular-nums`
  (the `.tabular` helper) so digits don't jitter as values update — essential for
  telemetry readouts.

## Spacing & rhythm

- Compose layouts on the spacing scale; avoid arbitrary pixel values. Consistent
  rhythm is what reads as "designed."
- Density is a property of the **surface**, not the component: an operational
  panel tightens its controls via `data-register`, not by hand-picking smaller
  sizes per element.
- Whitespace is a feature in expressive surfaces and a cost in operational ones —
  generous on marketing, economical in a GCS where screen real estate is scarce.

## Radius

- `sm`/`md` cover almost everything; `lg` for large containers and dialogs; `xl`
  is marketing-only ("consumer-soft"); `full` for pills and avatars.
- Radius **tightens** in the operational register — corners read as more
  mechanical and precise. This is automatic via `--radius-*`; don't hard-code
  pixel radii in components.

## Elevation & borders

- Prefer a **single 1px border** (`--border`) to separate surfaces; reach for
  shadow only when something genuinely floats (popovers, dialogs, toasts).
- Operational surfaces lean on borders and contrast, not drop shadows — shadow
  is an expressive affordance.
- Borders default to the semantic `--border` token globally, so plain `border`
  utilities are correct without restating the color.

## Color application

Color is owned entirely by the theme axis (`data-theme`) — never by register.
Apply it by **role**, not by hue:

- **Neutral** carries 90% of the UI — text, surfaces, borders. Most of any screen
  should be neutral.
- **Accent** (`--primary`) marks the single most important action in a view. If
  everything is accented, nothing is.
- **Semantic status** uses the reserved ladder
  (`alarm → warning → caution → advisory → nominal`) and **only** for genuine
  status. Never borrow `caution` yellow as a decorative highlight — in an
  operational context that is a safety hazard. See
  [Voice & lexicon](./voice-and-lexicon) for the naming contract.
- Status is **never color-only**: every status cue carries a non-color signal
  (icon/shape/label) so it survives color-vision deficiency, glare, and night
  modes.

## The visual-QA bar

Before a component ships, it should pass a quick read:

1. Is every value on a scale (type, spacing, radius), or are there magic numbers?
2. Is color applied by role, with neutral dominating and accent used once?
3. Does it hold up in all four themes — including `sunlight` glare and `darknight`
   scotopic constraints — and in both registers?
4. Does motion clarify a state change, or merely decorate?
5. Would it look at home next to the rest of the system, or does it announce
   itself?
