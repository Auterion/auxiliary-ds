# Voice & lexicon

Content is a designed surface. In an operational context it is also
**safety-relevant**: a word that means two things, or two words that mean the
same thing, costs an operator time they may not have. This page sets the voice
per register and the canonical lexicon every surface must use.

## Voice & tone by register

| | Expressive | Operational |
|---|---|---|
| **Goal** | invite, explain, persuade | inform, confirm, never mislead |
| **Tone** | warm, confident, human | terse, neutral, unambiguous |
| **Person** | "you", active voice | imperative for actions ("Arm", "Abort") |
| **Length** | full sentences welcome | shortest correct phrasing wins |
| **Humor** | sparingly | never |

The voice shifts with `data-register`, but the **terminology never does** — a
concept has exactly one name in both worlds.

## Microcopy standards

- **Buttons / actions** — verb-first, title case, no trailing punctuation:
  *Save changes*, *Add waypoint*, *Arm*. Destructive actions name the
  consequence: *Delete mission* (not *OK*).
- **Labels** — sentence case, noun phrases, no colon: *Coordinate format*.
- **Placeholders** are examples, not instructions, and never replace a label:
  `e.g. 47.3977° N`.
- **Help text** states the rule once, in plain language, below the field.
- **Errors** say *what* happened and *how to fix it*, never blame the user:
  *Altitude must be between 0 and 500 m* (not *Invalid input*).
- **Empty states** tell the user what goes here and how to add the first item.
- **Component overrides** — `NumberField` accepts `decrementLabel`/`incrementLabel` for its stepper buttons; `GuardedAction` accepts `cancelText` and `instructionText` to match the operational context. Defaults are generic English; override in product code with the specific action (*"Minus"*, *"Abort"*, *"Press and hold to ARM"*).

## Operational lexicon

One word per concept, everywhere. The reserved **status ladder** is the
backbone — it maps 1:1 to the `--alarm/--warning/--caution/--advisory/--nominal`
tokens and the `StatusBadge` / `AlertBanner` / `level` props, and must not be
paraphrased:

| Level | Means | Do **not** also call it |
|---|---|---|
| `alarm` | immediate action required; loss imminent | critical, emergency, fatal, danger |
| `warning` | action required soon; degraded | alert, severe |
| `caution` | attention; potential problem | warn, notice |
| `advisory` | informational; no action | info, note, tip |
| `nominal` | operating normally | ok, healthy, good, success |

Other concepts, fixed spelling:

- **Actions**: *Arm* / *Disarm*, *Take off* / *Land*, *Return to launch* (RTL),
  *Abort*, *Acknowledge* (ack). Pick one and never alternate (*ack* ≠ *dismiss* ≠
  *clear*).
- **States**: *Connected* / *Disconnected*, *Armed* / *Disarmed*, *In flight* /
  *On ground*. Avoid synonyms (*online*, *linked*, *live*).

## Units, numbers & coordinates

Operational data is only as trustworthy as its formatting. These conventions are
documented here and **enforced** by the operational layer (Phase 6.3 / `6i`) in
`TelemetryValue` and friends:

- **Unit system** is explicit and consistent — metric or imperial per
  deployment, never mixed in one view; always show the unit.
- **Numbers** use `tabular-nums` and a fixed precision per quantity, so a value
  doesn't reflow or imply false precision as it updates.
- **Coordinates** support decimal lat/long and **MGRS**; the chosen format is
  consistent across a surface and labelled.
- **Date & time** default to 24-hour and an unambiguous, zone-qualified format
  (UTC / Zulu in operational contexts).

These are conventions today; the [Operational layer](./registers) and the
forthcoming defense phase turn the unit/coordinate rules into verified behavior.
