# Table

Composable, styled semantic table parts — `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`. This is the **structure and surface** primitive: it owns the markup, density, and theming. Sorting and row selection are behaviors you wire through the slots (a `<Button>` in a `TableHead`, a `<Checkbox>` in a `TableCell`) — kept out of the primitive by design (restraint; a richer DataGrid can layer on top later).

<div class="auxiliary-demo vp-raw" style="max-width: 32rem;">
  <Table>
    <TableCaption>Active fleet</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Vehicle</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Battery</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>MSN-204</TableCell>
        <TableCell><StatusBadge level="nominal">Nominal</StatusBadge></TableCell>
        <TableCell>82%</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>MSN-118</TableCell>
        <TableCell><StatusBadge level="caution">Caution</StatusBadge></TableCell>
        <TableCell>34%</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>

## When to use

- For **tabular data** — fleets, mission logs, telemetry streams, alert histories, settings rows. Anything with a consistent set of columns per row.
- When the data has real row/column structure that screen-reader users navigate as a table (header association, row/column count).

## When *not* to use

- For a list of cards or non-tabular records — use a layout of `<Card>`s.
- For key/value detail of a *single* item — a description list or `<Card>` reads better than a one-row table.
- Don't reach for a table just to align things; that's a layout job (grid/flex utilities).

## Examples

### Sticky header

Put a bounded height on `<Table>` (the scroll container) and add `sticky` to `<TableHeader>` — the header stays visible while the body scrolls.

```vue
<Table class="max-h-72">
  <TableHeader sticky>
    <TableRow>
      <TableHead>Vehicle</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <!-- many rows -->
  </TableBody>
</Table>
```

### Sortable / selectable (composed, not built-in)

Sorting and selection are wired through the slots — the primitive stays behavior-free:

```vue
<TableHead>
  <Button variant="ghost" size="sm" @click="sortBy('vehicle')">
    Vehicle <Icon name="chevron-up" />
  </Button>
</TableHead>
...
<TableRow :data-state="selected.has(row.id) ? 'selected' : undefined">
  <TableCell><Checkbox :model-value="selected.has(row.id)" @update:model-value="toggle(row.id)" /></TableCell>
  <TableCell>{{ row.vehicle }}</TableCell>
</TableRow>
```

`TableRow` styles `data-state="selected"` for you; you own *when* a row is selected.

### Row headers

For tables whose first column identifies the row, use `<TableHead scope="row">` inside the body so screen readers associate each row with its label.

```vue
<TableBody>
  <TableRow>
    <TableHead scope="row">MSN-204</TableHead>
    <TableCell>Nominal</TableCell>
  </TableRow>
</TableBody>
```

## Props

### Table

<PropsTable name="Table" />

`class` styles the **scroll container** (e.g. `max-h-96` to bound height for a sticky header).

### TableHeader

<PropsTable name="TableHeader" />

### TableBody

<PropsTable name="TableBody" />

### TableRow

<PropsTable name="TableRow" />

### TableHead

<PropsTable name="TableHead" />

### TableCell

<PropsTable name="TableCell" />

### TableCaption

<PropsTable name="TableCaption" />

## Accessibility

- Renders real `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>` / `<caption>`, so the native table model (row/column count, navigation) comes for free.
- `<TableHead>` defaults to `scope="col"`; use `scope="row"` for row-identifying headers. Scope is what lets a screen reader announce "Vehicle: MSN-204" instead of a bare cell.
- Add a `<TableCaption>` to name the table — it's the table's accessible name and reads first.
- Interactive content (sort buttons, selection checkboxes) carries its own semantics; keep an accessible name on each.
- Sticky headers are visual only — they don't change the semantic structure.

## Tokens consumed

| Slot | Token |
| --- | --- |
| Cell / head text | `--foreground` / `--muted-foreground` |
| Row & header borders | `--border` |
| Row hover | `--muted` |
| Selected row | `--accent` |
| Sticky header background | `--card` |
| Footer background | `--muted` |
