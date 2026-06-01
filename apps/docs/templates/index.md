# Templates

Where [patterns](/patterns/) are individual blocks, **templates** are whole copy-able screens — the blocks assembled into the layout of a real page. Same docs-first stance: copy and adapt; the primitives they compose are the stable surface.

Treat **air-gap / offline / degraded connectivity as a template *state***, not an edge case — each operational template ships its degraded variant.

## Operational

| Template | What it is |
|---|---|
| [GCS layout](/templates/gcs) | The ground-control-station screen — status bar, fleet, map, inspector, timeline + alerts, with a degraded-link state |

*Coming (§6.4 slice 8): mission-planning view, fleet/asset overview, post-flight review.*

## Generic

| Template | What it is |
|---|---|
| [Dashboard](/templates/dashboard) | Overview — stat cards with trend sparklines, a primary chart, status rollup |
| [List + detail](/templates/list-detail) | Master/detail split — selectable list driving a detail panel |
| [Settings](/templates/settings) | Grouped account/usage/feature sections |
| [Auth](/templates/auth) | Centered sign-in card — the task is the whole page |
| [Error / 404](/templates/error) | The dead-end screen — say what happened, offer the way back |

*Coming: multi-step wizard, empty/first-run (see the [empty state](/patterns/app-blocks)).*
