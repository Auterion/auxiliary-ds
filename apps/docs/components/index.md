# Components

Every Auxiliary primitive, grouped by job. Each page documents when to use it, when
not to, a generated props table, live examples, accessibility notes, and the tokens
it consumes. All are built on [Reka UI](https://reka-ui.com) where a headless
primitive exists, styled through the [`@auxiliary/css`](/foundations/colors) recipes.

## Forms

| Component | What it's for |
| --- | --- |
| [Input](/components/input) | Single-line text field, `v-model`-bound. |
| [Textarea](/components/textarea) | Multi-line text field. |
| [NumberField](/components/number-field) | Numeric entry with steppers, bounds, and a unit. |
| [Label](/components/label) | Accessible `<label>` tied to a control via `for`. |
| [Checkbox](/components/checkbox) | Tri-state checkbox (on / off / indeterminate). |
| [Switch](/components/switch) | Binary on/off toggle. |
| [Slider](/components/slider) | Range input with keyboard + drag, one or more thumbs. |
| [RadioGroup](/components/radio-group) | Single choice from a small mutually-exclusive set. |
| [Select](/components/select) | Dropdown picker for one value from many. |
| [Combobox](/components/combobox) | Type-ahead select that filters a large option set as you type. |

## Actions

| Component | What it's for |
| --- | --- |
| [Button](/components/button) | The primary clickable action — four variants, three sizes. |
| [DropdownMenu](/components/dropdown-menu) | A menu of actions anchored to a trigger. |

## Overlays

| Component | What it's for |
| --- | --- |
| [Dialog](/components/dialog) | Modal, focus-trapped panel for a decision the user must resolve. |
| [Popover](/components/popover) | Non-modal floating panel anchored to a control. |
| [Tooltip](/components/tooltip) | Brief hover/focus hint for an otherwise-unlabeled control. |
| [Toast](/components/toast) | Transient, self-dismissing notification. |

## Feedback

| Component | What it's for |
| --- | --- |
| [Progress](/components/progress) | Determinate or indeterminate progress bar. |
| [Spinner](/components/spinner) | Indeterminate loading indicator with an `aria-live` label. |
| [Skeleton](/components/skeleton) | Shimmer placeholder while content loads. |

## Operational

The defense-oriented core — built around the
[5-level alarm hierarchy](/foundations/colors) (alarm · warning · caution · advisory
· nominal) and the color-blind-safe, non-color-cue contract.

| Component | What it's for |
| --- | --- |
| [StatusBadge](/components/status-badge) | Compact status pill carrying a level, with an intrinsic glyph + label. |
| [AlertBanner](/components/alert-banner) | Inline, dismissible alert carrying a severity level. |
| [TelemetryValue](/components/telemetry-value) | Numeric readout with unit, label, trend, and optional level. |

## Data display

| Component | What it's for |
| --- | --- |
| [Avatar](/components/avatar) | User image with an initials/text fallback. |
| [Badge](/components/badge) | Small non-interactive label, count, or tag. |
| [Table](/components/table) | Composable data table — sorting/selection wired via slots. |

## Layout

| Component | What it's for |
| --- | --- |
| [Card](/components/card) | Surface container with header / content / footer slots. |
| [Accordion](/components/accordion) | Vertically stacked, collapsible sections. |
| [Tabs](/components/tabs) | Switch between peer panels in the same space. |
| [Separator](/components/separator) | Horizontal or vertical divider between content. |
