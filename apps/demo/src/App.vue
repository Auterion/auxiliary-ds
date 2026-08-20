<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { tokens } from '@auxiliary/tokens';
import {
  Button,
  Input,
  Label,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Popover,
  PopoverTrigger,
  PopoverContent,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  StatusBadge,
  TelemetryValue,
  AlertBanner,
  Checkbox,
  Switch,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Avatar,
  AvatarFallback,
  Badge,
  Progress,
  Spinner,
  Skeleton,
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  NumberField,
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@auxiliary/vue';
import { Icon, ICON_NAMES } from '@auxiliary/icons';

const THEMES = ['system', 'light', 'dark', 'sunlight', 'darknight'] as const;
type Theme = (typeof THEMES)[number];

const theme = ref<Theme>('system');

watchEffect(() => {
  const html = document.documentElement;
  if (theme.value === 'system') html.removeAttribute('data-theme');
  else html.setAttribute('data-theme', theme.value);
});

// --- Color palette construction (driven by @auxiliary/tokens) ---
const PALETTE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
// The grayscale spine + the status hues the operational palette actually draws from.
const RAMP_FAMILIES = [
  'zinc', 'neutral', 'red', 'orange', 'amber', 'yellow',
  'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
] as const;
const primitive = tokens.color.primitive as unknown as Record<string, Record<string, string>>;
const primitiveRamps = RAMP_FAMILIES.map((family) => {
  const ramp = primitive[family] ?? {};
  return { family, steps: PALETTE_STEPS.map((step) => ({ step, value: ramp[step] ?? 'transparent' })) };
});

// Reverse-lookup: which primitive step a resolved semantic value came from.
const primitiveByValue = new Map<string, string>();
for (const [family, ramp] of Object.entries(tokens.color.primitive)) {
  if (typeof ramp === 'string') primitiveByValue.set(ramp, family);
  else for (const [step, value] of Object.entries(ramp)) primitiveByValue.set(value, `${family}.${step}`);
}
const SEMANTIC_ROLES = [
  'background', 'foreground', 'primary', 'secondary', 'muted', 'accent',
  'border', 'ring', 'alarm', 'warning', 'caution', 'advisory', 'nominal',
] as const;
const activeThemeName = computed<'light' | 'dark' | 'sunlight' | 'darknight'>(() => {
  if (theme.value !== 'system') return theme.value;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});
const semanticMap = computed(() => {
  const t = tokens[activeThemeName.value] as Record<string, string>;
  return SEMANTIC_ROLES.map((role) => {
    const value = t[role] ?? 'transparent';
    return { role, value, source: primitiveByValue.get(value) ?? 'custom' };
  });
});

const STATUSES = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
const STATUS_LABELS: Record<(typeof STATUSES)[number], string> = {
  alarm: 'Link lost',
  warning: 'Battery low',
  caution: 'Wind > 10 m/s',
  advisory: 'New waypoint',
  nominal: 'All systems go',
};

const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

// Sample mission ID showing ss02 / cv01 disambiguation
const MISSION_ID = 'MSN-IO1l0-2026-05-27';

// Form state for the composition example
const callsign = ref('');
const altitude = ref('');
const vehicleMode = ref('auto');

// Form input demo state
const armed = ref(false);
const geofenceEnabled = ref(true);
const flightMode = ref('auto');
const maxAltitude = ref([120]);
const failsafeNote = ref('');

// Combobox (type-ahead) state — radio frequency search
const FREQUENCIES = [
  { value: '433.000', label: '433.000 MHz · Telemetry' },
  { value: '868.000', label: '868.000 MHz · Telemetry (EU)' },
  { value: '915.000', label: '915.000 MHz · Telemetry (US)' },
  { value: '2400.000', label: '2.400 GHz · Control link' },
  { value: '5800.000', label: '5.800 GHz · Video downlink' },
] as const;
const radioFreq = ref('');

// NumberField state — altitude / throttle with min/max clamp
const targetAlt = ref(120);
const throttle = ref(80);

// Form-control size axis
const FIELD_SIZES = ['sm', 'md', 'lg'] as const;

// Validation demo — invalid when altitude exceeds the airframe ceiling
const ceiling = 400;

// Skeleton loading toggle
const skeletonLoading = ref(true);

// Data table — fleet overview with row selection
interface FleetRow {
  id: string;
  vehicle: string;
  level: (typeof STATUSES)[number];
  status: string;
  battery: number;
  altitude: number;
}
const FLEET: FleetRow[] = [
  { id: 'mx01', vehicle: 'MX-01', level: 'nominal', status: 'In mission', battery: 74, altitude: 408 },
  { id: 'mx02', vehicle: 'MX-02', level: 'caution', status: 'Wind hold', battery: 41, altitude: 122 },
  { id: 'mx03', vehicle: 'MX-03', level: 'warning', status: 'Battery low', battery: 18, altitude: 95 },
  { id: 'mx04', vehicle: 'MX-04', level: 'alarm', status: 'Link lost', battery: 63, altitude: 0 },
  { id: 'mx05', vehicle: 'MX-05', level: 'advisory', status: 'Returning', battery: 88, altitude: 210 },
];
const selectedVehicles = ref<Set<string>>(new Set(['mx01']));
function toggleVehicle(id: string) {
  const next = new Set(selectedVehicles.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedVehicles.value = next;
}

// Toast state
const toastOpen = ref(false);
const toastVariant = ref<'info' | 'success' | 'alarm'>('info');

function showToast(variant: 'info' | 'success' | 'alarm') {
  toastVariant.value = variant;
  toastOpen.value = false;
  // re-open on next tick so repeat clicks restart the timer
  setTimeout(() => (toastOpen.value = true), 50);
}
</script>

<template>
  <TooltipProvider>
  <ToastProvider :duration="4000">
  <main class="min-h-dvh bg-background text-foreground">
    <header
      class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 px-8 py-4 backdrop-blur"
    >
      <div>
        <h1 class="font-display text-2xl">Auxiliary</h1>
        <p class="text-sm text-muted-foreground">System showcase · pre-1.0</p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground uppercase tracking-wide">Theme</span>
        <div class="flex gap-1 rounded-md border border-border bg-card p-1">
          <button
            v-for="t in THEMES"
            :key="t"
            type="button"
            class="rounded px-3 py-1 text-sm capitalize transition-colors"
            :class="
              theme === t
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent'
            "
            @click="theme = t"
          >
            {{ t }}
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-6xl space-y-12 px-8 py-10">
      <!-- Status -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Status hierarchy</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;StatusBadge&gt;</code> — five levels, populated
          per theme. Solid for active state; outline for muted contexts. The vocabulary
          nobody else in the Vue ecosystem ships.
        </p>
        <div class="space-y-3 rounded-md border border-border bg-card p-5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="w-16 text-xs uppercase text-muted-foreground">Solid</span>
            <StatusBadge v-for="s in STATUSES" :key="`s-${s}`" :level="s" dot>{{ STATUS_LABELS[s] }}</StatusBadge>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="w-16 text-xs uppercase text-muted-foreground">Outline</span>
            <StatusBadge
              v-for="s in STATUSES"
              :key="`o-${s}`"
              :level="s"
              variant="outline"
            >{{ STATUS_LABELS[s] }}</StatusBadge>
          </div>
          <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-border mt-3">
            <span class="w-16 text-xs uppercase text-muted-foreground">In situ</span>
            <span class="text-sm text-muted-foreground">Link status:</span>
            <StatusBadge level="alarm" size="sm" dot>Lost</StatusBadge>
            <span class="text-sm text-muted-foreground ml-3">Battery:</span>
            <StatusBadge level="warning" size="sm" dot>Low</StatusBadge>
            <span class="text-sm text-muted-foreground ml-3">GPS:</span>
            <StatusBadge level="nominal" size="sm" dot>12 sats</StatusBadge>
          </div>
        </div>
      </section>

      <!-- Telemetry -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Telemetry</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;TelemetryValue&gt;</code> — mono tabular readouts
          with optional unit, label, precision, and trend arrow. Colors by status when
          a value crosses a threshold.
        </p>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4 rounded-md border border-border bg-card p-5 sm:grid-cols-4">
          <TelemetryValue label="Altitude" :value="408.2" unit="m" trend="up" />
          <TelemetryValue label="Ground speed" :value="12.4" unit="m/s" trend="stable" />
          <TelemetryValue label="Heading" :value="247" unit="°" :precision="0" />
          <TelemetryValue label="Battery" :value="74" unit="%" :precision="0" trend="down" />
          <TelemetryValue label="Sats" :value="12" :precision="0" level="nominal" />
          <TelemetryValue label="RSSI" :value="-87" unit="dBm" :precision="0" level="caution" />
          <TelemetryValue label="Wind" :value="11.2" unit="m/s" trend="up" level="warning" />
          <TelemetryValue label="Link" value="LOST" level="alarm" />
        </div>
      </section>

      <!-- Alerts -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Alert banners</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;AlertBanner&gt;</code> — persistent, severity-coded
          banners. Use for in-flight conditions that need visible acknowledgement, not
          dismiss-after-N-seconds toasts.
        </p>
        <div class="space-y-2">
          <AlertBanner
            level="alarm"
            title="Telemetry link lost"
            description="No packets received for 3.4s. Failsafe will trigger in 5s."
            action-label="Override"
          />
          <AlertBanner
            level="warning"
            title="Battery below 30%"
            description="Estimated 4 minutes of flight remaining at current draw."
            dismissible
          />
          <AlertBanner
            level="caution"
            title="Wind exceeds operational limits"
            description="Sustained 11.2 m/s; recommended max for this airframe is 10 m/s."
          />
          <AlertBanner
            level="advisory"
            title="New waypoint queued"
            description="WP-06 (47.380° N, 8.543° E) added from ground station."
            dismissible
          />
          <AlertBanner
            level="nominal"
            title="Mission complete"
            description="All 5 waypoints reached. Vehicle returning to home."
          />
        </div>
      </section>

      <!-- Buttons -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Buttons</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;Button&gt;</code> from
          <code class="font-mono">@auxiliary/vue</code>. Variant × size.
        </p>
        <div class="space-y-4">
          <div
            v-for="size in BUTTON_SIZES"
            :key="size"
            class="flex flex-wrap items-center gap-3"
          >
            <span class="w-12 text-xs uppercase text-muted-foreground">{{ size }}</span>
            <Button
              v-for="variant in BUTTON_VARIANTS"
              :key="variant"
              :variant="variant"
              :size="size"
            >
              {{ variant }}
            </Button>
          </div>
        </div>
      </section>

      <!-- Form composition -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Form composition</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;Label&gt;</code> +
          <code class="font-mono">&lt;Input&gt;</code> +
          <code class="font-mono">&lt;Button&gt;</code>. Click the label and focus jumps
          to the input.
        </p>
        <form
          class="flex max-w-md flex-col gap-3 rounded-md border border-border bg-card p-5"
          @submit.prevent
        >
          <div class="flex flex-col gap-1.5">
            <Label for="callsign">Callsign</Label>
            <Input id="callsign" v-model="callsign" placeholder="MSN-..." />
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="altitude">Altitude (m)</Label>
            <Input id="altitude" v-model="altitude" type="number" placeholder="408" />
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm">Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Launch</Button>
          </div>
          <p v-if="callsign || altitude" class="font-mono tabular text-xs text-muted-foreground">
            v-model echo — callsign: <span class="text-muted-foreground">{{ callsign || '(empty)' }}</span>,
            altitude: <span class="text-muted-foreground">{{ altitude || '(empty)' }}</span>
          </p>
        </form>
      </section>

      <!-- Form inputs (checkbox / switch / radio / slider / textarea) -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Form inputs</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;Checkbox&gt;</code>,
          <code class="font-mono">&lt;Switch&gt;</code>,
          <code class="font-mono">&lt;RadioGroup&gt;</code>,
          <code class="font-mono">&lt;Slider&gt;</code>,
          <code class="font-mono">&lt;Textarea&gt;</code>. The selection + range
          surface for forms beyond text inputs.
        </p>
        <div class="grid max-w-2xl gap-5 rounded-md border border-border bg-card p-5">
          <div class="flex items-center gap-3">
            <Checkbox id="armed" v-model="armed" />
            <Label for="armed">Arm vehicle on launch</Label>
            <span class="ml-auto font-mono tabular text-xs text-muted-foreground">
              {{ armed ? 'true' : 'false' }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <Switch id="geofence" v-model="geofenceEnabled" />
            <Label for="geofence">Geofence active</Label>
            <span class="ml-auto font-mono tabular text-xs text-muted-foreground">
              {{ geofenceEnabled ? 'enabled' : 'disabled' }}
            </span>
          </div>

          <div>
            <Label class="mb-2 block">Flight mode</Label>
            <RadioGroup v-model="flightMode" orientation="horizontal">
              <label class="flex items-center gap-2 text-sm">
                <RadioGroupItem id="rm-auto" value="auto" />
                <span>Auto</span>
              </label>
              <label class="flex items-center gap-2 text-sm">
                <RadioGroupItem id="rm-manual" value="manual" />
                <span>Manual</span>
              </label>
              <label class="flex items-center gap-2 text-sm">
                <RadioGroupItem id="rm-loiter" value="loiter" />
                <span>Loiter</span>
              </label>
            </RadioGroup>
            <p class="mt-1 font-mono tabular text-xs text-muted-foreground">
              v-model: <span class="text-muted-foreground">{{ flightMode }}</span>
            </p>
          </div>

          <div>
            <Label for="max-alt" class="mb-2 block">
              Max altitude
              <span class="font-mono tabular text-xs text-muted-foreground ml-2">
                {{ maxAltitude[0] }} m
              </span>
            </Label>
            <Slider id="max-alt" v-model="maxAltitude" :min="10" :max="400" :step="10" />
          </div>

          <div>
            <Label for="failsafe" class="mb-2 block">Failsafe note (operator)</Label>
            <Textarea
              id="failsafe"
              v-model="failsafeNote"
              placeholder="Free-text instructions on link-loss behavior..."
              :rows="3"
            />
          </div>
        </div>
      </section>

      <!-- Validation & size -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Validation &amp; size</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          The shared <code class="font-mono">invalid</code> flag (aria-invalid + destructive
          border/ring) and <code class="font-mono">size</code> axis (<code class="font-mono">sm
          / md / lg</code>) added across the form set in Phase 6.1 — one vocabulary for every
          control.
        </p>
        <div class="grid max-w-3xl gap-6 rounded-md border border-border bg-card p-5 sm:grid-cols-2">
          <div class="space-y-3">
            <div class="text-xs uppercase text-muted-foreground">invalid</div>
            <div class="flex flex-col gap-1.5">
              <Label for="v-call">Callsign</Label>
              <Input id="v-call" model-value="" invalid placeholder="Required" />
            </div>
            <div class="flex flex-col gap-1.5">
              <Label for="v-mode">Mode</Label>
              <Select model-value="">
                <SelectTrigger id="v-mode" invalid class="w-full">
                  <SelectValue placeholder="Required" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label class="flex items-center gap-2 text-sm">
              <Checkbox invalid />
              <span>Accept flight risk (unconfirmed)</span>
            </label>
          </div>
          <div class="space-y-3">
            <div class="text-xs uppercase text-muted-foreground">size</div>
            <div v-for="s in FIELD_SIZES" :key="s" class="flex items-center gap-3">
              <span class="w-8 text-xs uppercase text-muted-foreground">{{ s }}</span>
              <Input :size="s" :placeholder="`Input ${s}`" />
            </div>
            <p class="text-xs text-muted-foreground pt-1">
              Compact (<code class="font-mono">sm</code>) suits dense GCS/telemetry panels.
              The whole axis also flexes by register — the same markup tightens under
              <code class="font-mono">data-register="operational"</code>:
            </p>
            <div data-register="operational" class="flex items-center gap-3">
              <span class="w-8 text-xs uppercase text-muted-foreground">op</span>
              <Input size="md" placeholder="Input md · operational" />
            </div>
          </div>
        </div>
      </section>

      <!-- Typography -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Typography</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          Inter Variable with <code class="font-mono">ss02</code> +
          <code class="font-mono">cv01</code> for I/l/1 + O/0 disambiguation. Geist Mono
          + tabular for identifiers, coordinates, telemetry.
        </p>
        <div class="space-y-3 rounded-md border border-border bg-card p-5">
          <div class="font-display">Mission Control</div>
          <p class="text-base text-muted-foreground">
            The quick brown fox jumps over the lazy dog — 0123456789
          </p>
          <p class="font-mono tabular text-sm text-muted-foreground">{{ MISSION_ID }}</p>
          <p class="font-mono tabular text-sm">
            <span class="text-muted-foreground">LAT </span><span>47.3769° N</span>
            <span class="text-muted-foreground ml-3">LON </span><span>8.5417° E</span>
            <span class="text-muted-foreground ml-3">ALT </span><span>408 m</span>
          </p>
        </div>
      </section>

      <!-- Dialog -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Dialog</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          First headless-backed primitive. <code class="font-mono">@auxiliary/vue</code>
          wraps Reka UI's Dialog with our styling. Focus trap, Escape to close,
          click-outside, ARIA dialog semantics, and portal teleport — all from Reka.
        </p>
        <Dialog>
          <DialogTrigger as-child>
            <Button variant="secondary">Confirm abort</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Abort mission?</DialogTitle>
            <DialogDescription>
              This will terminate the active flight plan and return the vehicle to home.
              The aircraft will not resume the mission automatically.
            </DialogDescription>
            <div class="flex justify-end gap-2 pt-2">
              <DialogClose as-child>
                <Button variant="ghost" size="sm">Cancel</Button>
              </DialogClose>
              <DialogClose as-child>
                <Button variant="danger" size="sm">Abort</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      <!-- Floating UI: Tooltip + Popover -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Floating UI</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          Tooltip for hints, Popover for richer floating content. Both anchored to
          their trigger, both backed by Reka UI for keyboard a11y and collision
          detection.
        </p>
        <div class="flex flex-wrap items-center gap-6">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="secondary" size="sm">Hover for tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              Mission integrity — all sensors green
            </TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger as-child>
              <Button variant="secondary" size="sm">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div class="space-y-2">
                <div class="font-medium text-foreground">Quick settings</div>
                <p class="text-muted-foreground">
                  Popovers hold richer content than tooltips — forms, menus, filters.
                  Press Escape or click outside to dismiss.
                </p>
                <p class="font-mono tabular text-xs text-muted-foreground">
                  Try Tab to focus the buttons inside.
                </p>
                <div class="flex gap-2 pt-1">
                  <Button variant="ghost" size="sm">Reset</Button>
                  <Button variant="primary" size="sm">Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <!-- Menus: DropdownMenu + Select -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Menus</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;DropdownMenu&gt;</code> for action menus,
          <code class="font-mono">&lt;Select&gt;</code> for value selection. Both
          keyboard-navigable (↑/↓, Home/End, type-ahead), both backed by Reka UI.
        </p>
        <div class="flex flex-wrap items-end gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="secondary" size="sm">Mission actions ▾</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Flight plan</DropdownMenuLabel>
              <DropdownMenuItem>New mission</DropdownMenuItem>
              <DropdownMenuItem>Import waypoints</DropdownMenuItem>
              <DropdownMenuItem>Export telemetry</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Vehicle</DropdownMenuLabel>
              <DropdownMenuItem>Calibrate sensors</DropdownMenuItem>
              <DropdownMenuItem disabled>Firmware update (in flight)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div class="flex flex-col gap-1.5">
            <Label for="vehicle-mode">Vehicle mode</Label>
            <Select v-model="vehicleMode">
              <SelectTrigger id="vehicle-mode" class="w-48">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="loiter">Loiter</SelectItem>
                <SelectItem value="rtl">Return to launch</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
            <p class="font-mono tabular text-xs text-muted-foreground">
              v-model: <span class="text-muted-foreground">{{ vehicleMode }}</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Type-ahead: Combobox -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Type-ahead</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;Combobox&gt;</code> — an input that filters a list as you
          type. For large sets (frequencies, vehicle IDs, waypoints) where scanning a
          <code class="font-mono">&lt;Select&gt;</code> is too slow. Shares the
          <code class="font-mono">size</code> / <code class="font-mono">invalid</code>
          vocabulary with the other controls.
        </p>
        <div class="flex flex-wrap items-end gap-6">
          <div class="flex flex-col gap-1.5">
            <Label for="freq">Radio frequency</Label>
            <Combobox v-model="radioFreq">
              <ComboboxInput
                id="freq"
                class="w-64"
                placeholder="Type to filter…"
                aria-label="Radio frequency"
              />
              <ComboboxContent>
                <ComboboxEmpty>No matching frequency.</ComboboxEmpty>
                <ComboboxItem v-for="f in FREQUENCIES" :key="f.value" :value="f.value">
                  {{ f.label }}
                </ComboboxItem>
              </ComboboxContent>
            </Combobox>
            <p class="font-mono tabular text-xs text-muted-foreground">
              v-model: <span class="text-muted-foreground">{{ radioFreq || '(none)' }}</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Number field -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Number field</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;NumberField&gt;</code> — stepper entry with
          min/max/step clamp and an inline <code class="font-mono">unit</code>. For
          altitude, speed, frequency, throttle — where free-text input is error-prone.
          Pairs with <code class="font-mono">&lt;TelemetryValue&gt;</code>.
        </p>
        <div class="flex flex-wrap items-end gap-6 rounded-md border border-border bg-card p-5">
          <div class="flex flex-col gap-1.5">
            <Label for="nf-alt">Target altitude</Label>
            <NumberField
              id="nf-alt"
              v-model="targetAlt"
              :min="0"
              :max="ceiling"
              :step="10"
              unit="m"
              :invalid="targetAlt > ceiling"
              class="w-44"
            />
            <p class="font-mono tabular text-xs text-muted-foreground">
              {{ targetAlt }} m · ceiling {{ ceiling }} m
            </p>
          </div>
          <div class="flex flex-col gap-1.5">
            <Label for="nf-thr">Throttle</Label>
            <NumberField
              id="nf-thr"
              v-model="throttle"
              :min="0"
              :max="100"
              :step="5"
              unit="%"
              class="w-44"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="text-xs uppercase text-muted-foreground">disabled</span>
            <NumberField :default-value="408" unit="m" disabled class="w-44" />
          </div>
        </div>
      </section>

      <!-- Tabs -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Tabs</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;Tabs&gt;</code> for panel switching. Keyboard:
          ←/→ navigates triggers, Home/End jumps to first/last. Active tab uses our
          <code class="font-mono">bg-primary</code>.
        </p>
        <Tabs default-value="telemetry" class="max-w-2xl">
          <TabsList>
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
            <TabsTrigger value="waypoints">Waypoints</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="telemetry">
            <div class="rounded-md border border-border bg-card p-5">
              <p class="text-sm text-muted-foreground">Live sensor readings.</p>
              <p class="mt-2 font-mono tabular text-sm">
                <span class="text-muted-foreground">BAT </span><span>74%</span>
                <span class="text-muted-foreground ml-3">SPD </span><span>12.4 m/s</span>
                <span class="text-muted-foreground ml-3">HDG </span><span>247°</span>
              </p>
            </div>
          </TabsContent>
          <TabsContent value="waypoints">
            <div class="rounded-md border border-border bg-card p-5">
              <p class="text-sm text-muted-foreground">5 waypoints queued.</p>
              <p class="mt-2 font-mono tabular text-sm text-muted-foreground">
                WP-01 → WP-02 → WP-03 → WP-04 → WP-05 (HOME)
              </p>
            </div>
          </TabsContent>
          <TabsContent value="logs">
            <div class="rounded-md border border-border bg-card p-5">
              <p class="text-sm text-muted-foreground">Last 3 events.</p>
              <p class="mt-2 font-mono tabular text-xs text-muted-foreground">
                12:04:18 INFO  link established<br />
                12:04:22 INFO  GPS lock acquired (12 sats)<br />
                12:04:30 INFO  mission armed
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <!-- Toast -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Toast</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          Transient notifications. Auto-dismisses after 4s, swipe right to dismiss
          early, paused on hover. ARIA live-region announces to screen readers.
          Single global <code class="font-mono">&lt;ToastViewport&gt;</code> renders
          fixed bottom-right.
        </p>
        <div class="flex flex-wrap gap-3">
          <Button variant="ghost" size="sm" @click="showToast('info')">Show info</Button>
          <Button variant="secondary" size="sm" @click="showToast('success')">Show success</Button>
          <Button variant="danger" size="sm" @click="showToast('alarm')">Show alarm</Button>
        </div>
      </section>

      <!-- Structure: Card + Separator + Accordion -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Structure</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;Card&gt;</code>, <code class="font-mono">&lt;Separator&gt;</code>,
          and <code class="font-mono">&lt;Accordion&gt;</code> — content scaffolding that
          composes with everything else.
        </p>
        <div class="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle MX-01</CardTitle>
              <CardDescription>Quadcopter · firmware v4.2.1</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap items-center gap-2 text-sm">
                <StatusBadge level="nominal" size="sm" dot>Connected</StatusBadge>
                <Separator orientation="vertical" class="h-4" />
                <span class="text-muted-foreground">Battery</span>
                <TelemetryValue :value="74" unit="%" :precision="0" size="sm" />
                <Separator orientation="vertical" class="h-4" />
                <span class="text-muted-foreground">Signal</span>
                <TelemetryValue :value="-87" unit="dBm" :precision="0" size="sm" level="caution" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm">Details</Button>
              <Button variant="primary" size="sm" class="ml-auto">Launch</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pre-flight checks</CardTitle>
              <CardDescription>Confirm before takeoff. Expand each for details.</CardDescription>
            </CardHeader>
            <CardContent class="px-1">
              <Accordion type="single" collapsible default-value="airspace">
                <AccordionItem value="airspace">
                  <AccordionTrigger>Airspace authorization</AccordionTrigger>
                  <AccordionContent>
                    Class G uncontrolled airspace below 120m AGL. No NOTAMs active for
                    this area. Cleared for VLOS operations.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="weather">
                  <AccordionTrigger>Weather window</AccordionTrigger>
                  <AccordionContent>
                    Wind: 6.2 m/s gusting to 9.8 m/s — within operational limits.
                    Visibility: &gt;10 km. No precipitation expected for 90 minutes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="vehicle">
                  <AccordionTrigger>Vehicle systems</AccordionTrigger>
                  <AccordionContent>
                    Battery: 74% (estimated 21 min flight). GPS lock: 12 satellites,
                    HDOP 0.7. IMU and barometer calibrated &lt;24h ago.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payload" disabled>
                  <AccordionTrigger>Payload (none attached)</AccordionTrigger>
                  <AccordionContent>
                    Not applicable for this mission.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      <!-- Data table -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Data table</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;Table&gt;</code> — the top operational surface: fleets,
          mission logs, telemetry streams, alert history. Sticky header on a bounded scroll
          container, row selection, and <code class="font-mono">scope="row"</code> headers so
          screen readers associate each row with its vehicle.
        </p>
        <div class="rounded-md border border-border bg-card">
          <Table class="max-h-72">
            <TableCaption class="px-4 pt-3">
              Active fleet — {{ selectedVehicles.size }} of {{ FLEET.length }} selected
            </TableCaption>
            <TableHeader sticky>
              <TableRow>
                <TableHead class="w-10"><span class="sr-only">Select</span></TableHead>
                <TableHead scope="col">Vehicle</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col">Battery</TableHead>
                <TableHead scope="col">Altitude</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="row in FLEET"
                :key="row.id"
                :data-state="selectedVehicles.has(row.id) ? 'selected' : undefined"
              >
                <TableCell>
                  <Checkbox
                    :model-value="selectedVehicles.has(row.id)"
                    :aria-label="`Select ${row.vehicle}`"
                    @update:model-value="toggleVehicle(row.id)"
                  />
                </TableCell>
                <TableHead scope="row" class="font-medium text-foreground">{{ row.vehicle }}</TableHead>
                <TableCell>
                  <StatusBadge :level="row.level" size="sm" dot>{{ row.status }}</StatusBadge>
                </TableCell>
                <TableCell>
                  <TelemetryValue :value="row.battery" unit="%" :precision="0" size="sm" />
                </TableCell>
                <TableCell>
                  <TelemetryValue :value="row.altitude" unit="m" :precision="0" size="sm" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <!-- Visuals: Avatar / Badge / Progress / Spinner / Skeleton -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Visuals</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono">&lt;Avatar&gt;</code>,
          <code class="font-mono">&lt;Badge&gt;</code>,
          <code class="font-mono">&lt;Progress&gt;</code>,
          <code class="font-mono">&lt;Spinner&gt;</code>,
          <code class="font-mono">&lt;Skeleton&gt;</code> — small visual surface
          pieces that complete the universal-basics set.
        </p>
        <div class="grid gap-5 rounded-md border border-border bg-card p-5 lg:grid-cols-2">
          <div class="space-y-4">
            <div>
              <div class="mb-2 text-xs uppercase text-muted-foreground">Avatars (initials fallback)</div>
              <div class="flex items-center gap-3">
                <Avatar size="sm"><AvatarFallback>YD</AvatarFallback></Avatar>
                <Avatar size="md"><AvatarFallback>AM</AvatarFallback></Avatar>
                <Avatar size="lg"><AvatarFallback>OP</AvatarFallback></Avatar>
              </div>
            </div>

            <div>
              <div class="mb-2 text-xs uppercase text-muted-foreground">Badges (generic — distinct from StatusBadge)</div>
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="default">default</Badge>
                <Badge variant="secondary">secondary</Badge>
                <Badge variant="outline">outline</Badge>
                <Badge variant="accent">accent</Badge>
                <Badge size="sm">v4.2.1</Badge>
                <Badge size="sm" variant="outline">beta</Badge>
              </div>
            </div>

            <div>
              <div class="mb-2 text-xs uppercase text-muted-foreground">Spinner</div>
              <div class="flex items-center gap-4 text-muted-foreground">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
                <span class="text-sm text-muted-foreground">inherits color via currentColor</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <div class="mb-2 text-xs uppercase text-muted-foreground">Progress (battery 74% — warning if &lt;30%)</div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <span class="font-mono tabular text-xs text-muted-foreground w-12">74%</span>
                  <Progress :value="74" level="nominal" />
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-mono tabular text-xs text-muted-foreground w-12">42%</span>
                  <Progress :value="42" level="caution" />
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-mono tabular text-xs text-muted-foreground w-12">18%</span>
                  <Progress :value="18" level="warning" />
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-mono tabular text-xs text-muted-foreground w-12">5%</span>
                  <Progress :value="5" level="alarm" />
                </div>
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between">
                <span class="text-xs uppercase text-muted-foreground">Skeleton (loading prop)</span>
                <label class="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch v-model="skeletonLoading" />
                  loading
                </label>
              </div>
              <div class="space-y-2">
                <Skeleton :loading="skeletonLoading" class="h-3 w-32">
                  <div class="text-sm">Vehicle MX-01</div>
                </Skeleton>
                <Skeleton :loading="skeletonLoading" class="h-3 w-48">
                  <div class="text-sm text-muted-foreground">Quadcopter · firmware v4.2.1</div>
                </Skeleton>
                <Skeleton :loading="skeletonLoading" class="h-3 w-24">
                  <div class="font-mono tabular text-sm">74%</div>
                </Skeleton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Color palette construction -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Color palette</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          One OKLCH primitive palette is the raw material. Semantic tokens —
          <code class="font-mono">background</code>, <code class="font-mono">primary</code>, the
          alarm ladder — reference specific steps, and each theme reassigns which step. Below: the
          ramps, then how the active <strong class="text-foreground">{{ activeThemeName }}</strong>
          theme selects from them.
        </p>

        <!-- Primitive ramps -->
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="w-16 shrink-0"></span>
            <div class="flex flex-1 gap-0.5">
              <span
                v-for="s in PALETTE_STEPS"
                :key="s"
                class="flex-1 text-center text-[10px] tabular-nums text-muted-foreground"
              >{{ s }}</span>
            </div>
          </div>
          <div v-for="ramp in primitiveRamps" :key="ramp.family" class="flex items-center gap-2">
            <span class="w-16 shrink-0 font-mono text-xs text-muted-foreground">{{ ramp.family }}</span>
            <div class="flex flex-1 gap-0.5">
              <div
                v-for="sw in ramp.steps"
                :key="sw.step"
                class="h-7 flex-1 rounded-sm border border-border/40"
                :style="{ backgroundColor: sw.value }"
                :title="`${ramp.family}.${sw.step} — ${sw.value}`"
              />
            </div>
          </div>
        </div>

        <!-- Semantic selection for the active theme -->
        <div class="mt-6 rounded-md border border-border bg-card p-5">
          <div class="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
            {{ activeThemeName }} theme — semantic token → primitive step
          </div>
          <div class="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
            <div v-for="m in semanticMap" :key="m.role" class="flex items-center gap-2">
              <div
                class="h-6 w-6 shrink-0 rounded border border-border"
                :style="{ backgroundColor: m.value }"
                :title="m.value"
              />
              <div class="min-w-0">
                <div class="font-mono text-xs text-foreground">{{ m.role }}</div>
                <div class="truncate font-mono text-[10px] text-muted-foreground">{{ m.source }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Surface specimens -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Surfaces</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          Background hierarchy: canvas → surface → elevated. Borders, accent, focus.
        </p>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-md bg-background border border-border p-5">
            <div class="text-xs uppercase text-muted-foreground">bg-background</div>
            <div class="mt-2 text-sm">Page background</div>
          </div>
          <div class="rounded-md bg-card border border-border p-5">
            <div class="text-xs uppercase text-muted-foreground">bg-card</div>
            <div class="mt-2 text-sm">Card / panel</div>
          </div>
          <div class="rounded-md bg-popover border border-border p-5 shadow-md">
            <div class="text-xs uppercase text-muted-foreground">bg-popover</div>
            <div class="mt-2 text-sm">Popover / dropdown</div>
          </div>
        </div>
      </section>

      <!-- Icons -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Icons</h2>
        <p class="mb-5 text-sm text-muted-foreground">
          <code class="font-mono text-xs">&lt;Icon name="…" weight="…" size="…" /&gt;</code>
          — typed name union from <code class="font-mono text-xs">@auxiliary/icons</code>.
          Inherits <code class="font-mono text-xs">currentColor</code>; pair with the alarm-tier text utilities.
        </p>

        <!-- Size scale -->
        <div class="mb-6 flex items-end gap-6">
          <div v-for="size in (['xs', 'sm', 'md', 'lg', 'xl'] as const)" :key="size" class="flex flex-col items-center gap-2">
            <Icon name="drone" :size="size" />
            <span class="text-[10px] uppercase tracking-wide text-muted-foreground">{{ size }}</span>
          </div>
        </div>

        <!-- Status pairing -->
        <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div class="flex items-center gap-2 rounded-md border border-border bg-card p-3">
            <span class="text-alarm"><Icon name="drone" size="md" /></span>
            <span class="text-xs">alarm</span>
          </div>
          <div class="flex items-center gap-2 rounded-md border border-border bg-card p-3">
            <span class="text-warning"><Icon name="drone" size="md" /></span>
            <span class="text-xs">warning</span>
          </div>
          <div class="flex items-center gap-2 rounded-md border border-border bg-card p-3">
            <span class="text-caution"><Icon name="drone" size="md" /></span>
            <span class="text-xs">caution</span>
          </div>
          <div class="flex items-center gap-2 rounded-md border border-border bg-card p-3">
            <span class="text-advisory"><Icon name="drone" size="md" /></span>
            <span class="text-xs">advisory</span>
          </div>
          <div class="flex items-center gap-2 rounded-md border border-border bg-card p-3">
            <span class="text-nominal"><Icon name="drone" size="md" /></span>
            <span class="text-xs">nominal</span>
          </div>
        </div>

        <!-- Registry coverage -->
        <div class="rounded-md border border-border bg-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-xs uppercase tracking-wide text-muted-foreground">Registry</span>
            <span class="font-mono text-xs text-muted-foreground">{{ ICON_NAMES.length }} icons</span>
          </div>
          <div class="grid grid-cols-4 gap-3 sm:grid-cols-8">
            <div
              v-for="name in ICON_NAMES"
              :key="name"
              class="flex flex-col items-center gap-1.5 rounded border border-border p-2 text-muted-foreground"
            >
              <Icon :name="name" size="md" />
              <span class="font-mono text-[10px] truncate w-full text-center">{{ name }}</span>
            </div>
          </div>
          <p class="mt-4 text-xs text-muted-foreground">
            Interim placeholder glyphs pending the Nucleo swap. Drop SVGs in
            <code class="font-mono">packages/icons/inputs/</code> and run
            <code class="font-mono">pnpm --filter @auxiliary/icons sync</code>.
          </p>
        </div>
      </section>
    </div>

    <footer class="border-t border-border px-8 py-6 text-xs text-muted-foreground">
      Auxiliary · zinc-on-zinc, 4 themes, 5-level status · pre-1.0
    </footer>
  </main>
  <Toast v-model:open="toastOpen">
    <div>
      <ToastTitle>{{ toastVariant === 'alarm' ? 'Link lost' : toastVariant === 'success' ? 'Mission saved' : 'Telemetry updated' }}</ToastTitle>
      <ToastDescription>
        {{ toastVariant === 'alarm'
          ? 'No telemetry packets received for &gt;3s. Check radio link.'
          : toastVariant === 'success'
          ? 'Waypoints stored to local mission cache.'
          : '3 new sensor readings within the last 10s.' }}
      </ToastDescription>
    </div>
    <div class="flex flex-col gap-1">
      <ToastAction alt-text="View details" as-child>
        <Button variant="ghost" size="sm">View</Button>
      </ToastAction>
      <ToastClose>Close</ToastClose>
    </div>
  </Toast>
  <ToastViewport />
  </ToastProvider>
  </TooltipProvider>
</template>
