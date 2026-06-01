<script setup>
import { ref, computed } from 'vue';

// Command palette
const paletteQuery = ref('');
const commands = [
  'New mission', 'Import waypoints', 'Export telemetry', 'Calibrate sensors',
  'Arm vehicle', 'Return to launch', 'Open settings', 'Invite operator',
];
const paletteResults = computed(() =>
  commands.filter((c) => c.toLowerCase().includes(paletteQuery.value.toLowerCase())),
);

// Filter bar
const chips = ref(['Status: active', 'Site: ZRH', 'Battery > 20%']);
const removeChip = (c) => (chips.value = chips.value.filter((x) => x !== c));

// Data table + toolbar
const rows = [
  { vehicle: 'MX-01', site: 'ZRH', level: 'nominal', status: 'In mission' },
  { vehicle: 'MX-02', site: 'MUC', level: 'caution', status: 'Wind hold' },
  { vehicle: 'MX-03', site: 'ZRH', level: 'warning', status: 'Battery low' },
  { vehicle: 'MX-04', site: 'LON', level: 'alarm', status: 'Link lost' },
];
const search = ref('');
const visibleRows = computed(() =>
  rows.filter((r) => r.vehicle.toLowerCase().includes(search.value.toLowerCase())),
);

// Detail drawer
const drawerOpen = ref(false);
</script>

# App blocks

The composed pieces an application surface (Level-2 *Conventional* — Suite, admin tools) is built from. Docs-first compositions of existing primitives; promote any to a component when a real consumer needs to import it.

## Command palette

Keyboard-first launcher for dense consoles — a `Dialog` over a filter `Input` and a results list. (In production, bind it to a global `⌘K` shortcut.)

<div class="auxiliary-demo vp-raw">
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="secondary" size="sm">Open command palette (⌘K)</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogTitle>Commands</DialogTitle>
      <Input v-model="paletteQuery" placeholder="Type a command…" aria-label="Command" />
      <div role="listbox" style="display:flex; flex-direction:column; gap:0.125rem; margin-top:0.5rem; max-height:12rem; overflow:auto;">
        <button v-for="c in paletteResults" :key="c" role="option" style="display:flex; align-items:center; gap:0.5rem; padding:0.375rem 0.5rem; border:none; background:transparent; border-radius:0.375rem; cursor:pointer; text-align:left; font-size:0.875rem; color:var(--foreground);">
          <Icon name="chevron-right" /> {{ c }}
        </button>
        <p v-if="!paletteResults.length" style="padding:0.5rem; color:var(--muted-foreground); font-size:0.875rem;">No commands match.</p>
      </div>
    </DialogContent>
  </Dialog>
</div>

## Filter bar

A row of filters with removable chips — the saved state of a filtered view. Filters are `DropdownMenu`s; active filters are removable `Badge` chips.

<div class="auxiliary-demo vp-raw" style="gap:0.5rem; flex-wrap:wrap;">
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="sm">Status <Icon name="chevron-down" /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Active</DropdownMenuItem>
      <DropdownMenuItem>Idle</DropdownMenuItem>
      <DropdownMenuItem>Offline</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="sm">Site <Icon name="chevron-down" /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>ZRH</DropdownMenuItem>
      <DropdownMenuItem>MUC</DropdownMenuItem>
      <DropdownMenuItem>LON</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <span style="width:1px; align-self:stretch; background:var(--border); margin:0 0.25rem;"></span>
  <Badge v-for="c in chips" :key="c" variant="secondary">
    {{ c }}
    <button @click="removeChip(c)" :aria-label="`Remove ${c}`" style="margin-left:0.25rem; border:none; background:transparent; cursor:pointer; color:inherit; display:inline-flex;"><Icon name="xmark" /></button>
  </Badge>
</div>

## Data table + toolbar

The dense data surface with its action toolbar: search, column/visibility controls, and primary actions over a [`Table`](/components/table). (Builds on the [fleet table](/patterns/fleet-table) pattern.)

<div class="auxiliary-demo vp-raw" style="padding:0;">
  <div style="width:100%; border:1px solid var(--border); border-radius:0.5rem; overflow:hidden; background:var(--card);">
    <div style="display:flex; align-items:center; gap:0.5rem; padding:0.625rem 0.75rem; border-bottom:1px solid var(--border);">
      <Input v-model="search" placeholder="Search vehicles…" size="sm" aria-label="Search vehicles" style="max-width:14rem;" />
      <div style="flex:1;"></div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm">Columns <Icon name="chevron-down" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Vehicle</DropdownMenuItem>
          <DropdownMenuItem>Site</DropdownMenuItem>
          <DropdownMenuItem>Status</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="primary" size="sm">Export</Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Vehicle</TableHead>
          <TableHead scope="col">Site</TableHead>
          <TableHead scope="col">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="r in visibleRows" :key="r.vehicle">
          <TableHead scope="row" style="font-weight:500; color:var(--foreground);">{{ r.vehicle }}</TableHead>
          <TableCell>{{ r.site }}</TableCell>
          <TableCell><StatusBadge :level="r.level" size="sm" dot>{{ r.status }}</StatusBadge></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</div>

## Notifications center

A `Popover` off a bell trigger holding the recent-notifications list — distinct from the operational [alert model](/components/alert-model) (this is app-level, dismissible history, not safety conditions).

<div class="auxiliary-demo vp-raw">
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="secondary" size="sm" aria-label="Notifications (2 unread)"><Icon name="bell" /> 2</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div style="display:flex; flex-direction:column; gap:0.5rem; min-width:16rem;">
        <div style="font-weight:500;">Notifications</div>
        <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.875rem;">
          <div><div style="font-weight:500;">Export complete</div><div style="color:var(--muted-foreground);">Telemetry for MX-01 is ready.</div></div>
          <Separator />
          <div><div style="font-weight:500;">New operator joined</div><div style="color:var(--muted-foreground);">A. Park accepted your invite.</div></div>
        </div>
        <Button variant="ghost" size="sm">Mark all read</Button>
      </div>
    </PopoverContent>
  </Popover>
</div>

## Detail drawer

A side panel for an item's detail without leaving the list. The demo toggles a slide-in panel; **in production compose a `Dialog`** (or a sheet variant) so it gets focus-trap, `Escape`, and scrim for free.

<div class="auxiliary-demo vp-raw" style="padding:0;">
  <div style="position:relative; width:100%; height:13rem; border:1px solid var(--border); border-radius:0.5rem; overflow:hidden; background:var(--card);">
    <div style="padding:0.75rem;"><Button variant="secondary" size="sm" @click="drawerOpen = true">Open details</Button></div>
    <div v-if="drawerOpen" @click="drawerOpen = false" style="position:absolute; inset:0; background:color-mix(in oklch, var(--foreground) 30%, transparent);"></div>
    <aside :style="{ position:'absolute', top:'0', right:'0', height:'100%', width:'16rem', background:'var(--background)', borderLeft:'1px solid var(--border)', padding:'1rem', transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition:'transform var(--duration-base) var(--ease-out)', display:'flex', flexDirection:'column', gap:'0.5rem' }">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <strong>MX-01</strong>
        <button @click="drawerOpen = false" aria-label="Close" style="border:none; background:transparent; cursor:pointer; color:var(--muted-foreground);"><Icon name="xmark" /></button>
      </div>
      <StatusBadge level="nominal" size="sm" dot>In mission</StatusBadge>
      <TelemetryValue label="Battery" :value="74" unit="%" :precision="0" size="sm" />
      <TelemetryValue label="Altitude" :value="408" unit="m" :precision="0" size="sm" />
    </aside>
  </div>
</div>

## Empty / onboarding state

What a surface shows before it has data — icon, a plain-language heading, one sentence, and the primary action. (Suite uses these throughout; don't leave a blank panel.)

<div class="auxiliary-demo vp-raw">
  <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.625rem; padding:2rem; width:100%;">
    <div style="display:flex; align-items:center; justify-content:center; width:3rem; height:3rem; border-radius:9999px; background:var(--muted); color:var(--muted-foreground);"><Icon name="drone" /></div>
    <div style="font-weight:600;">No vehicles yet</div>
    <p style="margin:0; color:var(--muted-foreground); font-size:0.875rem; max-width:22rem;">Add your first vehicle to start monitoring its telemetry, missions, and alerts.</p>
    <Button variant="primary" size="sm">Add vehicle</Button>
  </div>
</div>

## Notes

- **App-level vs operational.** These are Level-2 conventional patterns. The notifications center is dismissible *history*; safety conditions use the [alert model](/components/alert-model). A command palette belongs in a console, not a flight-critical path.
- **Compose, don't re-solve.** Filters reuse `DropdownMenu`, the toolbar reuses `Button`/`Input`, the drawer should reuse `Dialog`. New primitives the Suite scan surfaced — `CopyField`, `EditableField`, `FileUpload`, `UsageMeter` — are tracked in the §6.1 backlog, not hand-rolled here.
