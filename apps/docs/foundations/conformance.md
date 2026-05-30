# Conformance

Where Auxiliary stands against the accessibility and human-factors standards that
matter for Auterion's surfaces: **WCAG 2.2 Level AA**, **Section 508**, and the
relevant human-factors clauses of **MIL-STD-1472**.

::: warning Pre-1.0 — this is a conformance *posture*, not a certified VPAT
APIs and tokens still change without notice before the first tagged release. This page
records what the design system **verifies in CI today** and what is **designed toward but
awaits human/expert sign-off**. It is not a Voluntary Product Accessibility Template, and
nothing here self-certifies a MIL-STD-1472 or DO-178C pass — those require review by a
qualified human-factors engineer (see [MIL-STD-1472](#mil-std-1472-human-factors)).
:::

Two honesty rules govern every table below:

- A row is only **Supported** when something — a CI gate or a documented component pattern —
  actually substantiates it. Otherwise it is **Partial**, **Pending review**, or **App-level**.
- Success criteria that can only be satisfied by a *composed page* (landmarks, page titles,
  heading order, bypass blocks) are the **consuming app's responsibility**, not the component
  library's. They are listed as such rather than claimed — see
  [Consumer responsibilities](#consumer-responsibilities).

## How conformance is enforced

Most of the contract is machine-checked, so a regression fails the build rather than waiting
for a manual audit:

- **Token-layer contrast gates** ([`packages/tokens/test/`](https://github.com/Auterion/auxiliary-ds/tree/main/packages/tokens/test)) —
  computed from the OKLCH source, across all four themes including the `sunlight` (glare) and
  `darknight` (scotopic) operational themes that axe never exercises. They cover per-theme text
  contrast, focus/structural non-text contrast, the night-vision blue cap + luminance ladder, and
  severity separation. Floors only ever ratchet up.
- **Per-component axe** ([`packages/vue` test-utils](https://github.com/Auterion/auxiliary-ds/tree/main/packages/vue/src/test-utils/a11y.ts)) —
  every shipping primitive mounts under `vitest-axe`, checking names/roles, `aria-*`, label
  associations, and contrast. Page-level rules (`region`, `html-has-lang`, `document-title`,
  `landmark-one-main`, `page-has-heading-one`) are deliberately disabled — they are page concerns,
  not component concerns, and belong to the [consuming app](#consumer-responsibilities).

When this page cites a gate, that gate runs in CI on every PR.

## WCAG 2.2 Level AA

| SC | Criterion | Status | Evidence |
| --- | --- | --- | --- |
| 1.3.1 | Info & relationships | Supported | Reka UI semantics + `aria-*`; verified per component by axe. Page-region structure is [app-level](#consumer-responsibilities). |
| 1.4.1 | Use of color | Supported | Status is never color-alone: the [alarm ladder](/foundations/colors#alarm-hierarchy) pairs each severity with a distinct glyph shape, gated for grayscale-distinctness and OKLab ΔEok separation. |
| 1.4.3 | Contrast (minimum) | Supported | Per-theme text-contrast gate — every surface/status pair ≥ 4.5:1 in all four themes (`contrast.test.ts`). |
| 1.4.6 | Contrast (enhanced, AAA) | Partial | Not a Level-AA requirement; the `sunlight` theme's body is raised toward 7:1 to offset veiling glare. Other themes target AA only. |
| 1.4.11 | Non-text contrast | Supported | Focus `ring` ≥ 3:1 vs. background in every theme; `border`/`input` ≥ 3:1 in the operational themes (`sunlight-night-gates.test.ts`). |
| 2.1.1 | Keyboard | Supported | Reka UI primitives are keyboard-operable; [`GuardedAction`](/components/guarded-action) ships a keyboard equivalent for its hold/confirm gesture. Verified by component tests. |
| 2.4.7 | Focus visible | Supported | Tokenized focus `ring`, contrast-gated at 1.4.11 across all themes. |
| 2.4.11 | Focus not obscured (min) — *2.2* | App-level | Component focus rings are visible; whether sticky/overlay chrome obscures focus depends on app layout. The z-index scale ([Layering](/foundations/layering#z-index)) is provided to keep overlays ordered. |
| 2.5.7 | Dragging movements — *2.2* | Supported | No primitive requires a drag to operate; `Slider` and similar expose keyboard alternatives. |
| 2.5.8 | Target size (minimum) — *2.2* | Partial | Default control heights meet the 24×24 CSS-px minimum; consumers overriding sizing via the [register](/foundations/registers) layer own their own targets. |
| 3.3.1 | Error identification | Supported | Shared `invalid` prop sets `aria-invalid` + a destructive border/ring on `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`; `RadioGroup` marks the group. |
| 3.3.2 | Labels or instructions | Supported | `Label` primitive + form-control association; verified by axe label-assoc checks. |
| 4.1.2 | Name, role, value | Supported | Reka UI roles + `aria-*` across primitives; verified per component by axe. |

App-context criteria — **1.4.10** (reflow), **1.4.4** (resize text), **2.4.1** (bypass blocks),
**2.4.2** (page titled), **3.1.1** (language of page) — depend on the composed page and are the
[consuming app's responsibility](#consumer-responsibilities). The system supplies the means
(rem-based [breakpoints](/foundations/layering#breakpoints), semantic tokens) but cannot satisfy
them in isolation.

## Section 508 (Revised, 2017)

The Revised Section 508 standards **incorporate WCAG 2.0 Level A and AA by reference** for web
content (E205.4). Auxiliary targets **WCAG 2.2 AA**, a superset — so the
[WCAG table above](#wcag-2-2-level-aa) is the substantive 508 mapping for the component layer.

The 508 **functional performance criteria** (§302 — without vision, with limited vision, without
hearing, with limited manipulation, etc.) are satisfied at the *product* level by composing
conformant components into a conformant page; they cannot be certified for a component library in
isolation. A consuming Auterion product builds its 508 conformance statement on top of this posture
plus its own page-level structure and content.

## MIL-STD-1472 (human factors)

Auxiliary is **designed toward** the operationally-relevant human-factors clauses below. Per the
roadmap, formal conformance is **not self-certified**: a MIL-STD-1472 / DO-178C pass requires review
by a qualified human-factors engineer. Each row records *how the system addresses the clause* and is
marked **Design-conformant — pending expert review**.

| Area (MIL-STD-1472 H) | How Auxiliary addresses it | Status |
| --- | --- | --- |
| §5.2.4 Visual alerts / coding | The 5-level [alarm hierarchy](/foundations/colors#alarm-hierarchy) (alarm→warning→caution→advisory→nominal) is anchored to FAA 14 CFR 25.1322, EASA AMC 25.1322, and MIL-STD-1472H §5.2.4; color is never the sole channel (redundant glyphs + ΔEok separation). | Design-conformant — pending expert review |
| Legibility under environmental extremes | `sunlight` (veiling-glare-hardened) and `darknight` (scotopic, low-blue, monotonic luminance ladder) themes, each certified by token-layer gates. | Design-conformant — pending expert review |
| Accidental-actuation prevention | [`GuardedAction`](/components/guarded-action) — hold/double/confirm guard for irreversible commands (arm, RTL, release), keyboard-equivalent, tap-proof, reduced-motion-safe. | Design-conformant — pending expert review |
| Units, scales & coordinate readout | [`TelemetryValue`](/components/telemetry-value), [`CoordinateValue`](/components/coordinate-value) (lat/long DD·DMS·DDM + MGRS), and the metric/aviation-imperial unit system with locale-aware formatting. | Design-conformant — pending expert review |

The mission-critical benchmarking behind this orientation (Palantir Blueprint, Esri Calcite,
OpenBridge, NASA Open MCT, MIL-STD-1472H) is tracked in the roadmap's references.

## Consumer responsibilities

Some conformance can only be satisfied by the composed application, not by an isolated component.
These mirror the page-level axe rules the component suite deliberately disables. A consuming
Auterion surface owns:

- **Landmark structure** — wrap content in `<main>`/`<nav>`/`<header>` regions (WCAG 1.3.1, 2.4.1).
- **Document shell** — a unique `<title>` per view (2.4.2) and `lang` on `<html>` (3.1.1).
- **Heading order** — a single `<h1>` and a logical heading outline (best practice; 2.4.6 AA).
- **Bypass blocks** — a skip-to-content mechanism for keyboard users (2.4.1).
- **Focus management** — restoring focus on route changes and ensuring overlays don't obscure focus
  (2.4.11); use the [z-index scale](/foundations/layering#z-index) to keep overlays ordered.
- **End-to-end audit** — run an automated *and* manual pass on the assembled product; component-level
  gates do not substitute for a page-level review.

## Pre-1.0 status

This posture will be revisited as the system approaches 1.0 — when APIs settle, the remaining
criteria can be tightened from Partial/Pending toward Supported, and the MIL-STD-1472 / DO-178C
rows can be put in front of a qualified reviewer. Until then, treat this page as an honest snapshot
of what is verified, not a conformance guarantee.
