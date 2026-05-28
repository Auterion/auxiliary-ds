<script setup lang="ts">
import { ref, watchEffect } from 'vue';
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

const STATUSES = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
const STATUS_LABELS: Record<(typeof STATUSES)[number], string> = {
  alarm: 'Link lost',
  warning: 'Battery low',
  caution: 'Wind > 10 m/s',
  advisory: 'New waypoint',
  nominal: 'All systems go',
};

const BUTTON_INTENTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
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
          <code class="font-mono">@auxiliary/vue</code>. Intent × size.
        </p>
        <div class="space-y-4">
          <div
            v-for="size in BUTTON_SIZES"
            :key="size"
            class="flex flex-wrap items-center gap-3"
          >
            <span class="w-12 text-xs uppercase text-muted-foreground">{{ size }}</span>
            <Button
              v-for="intent in BUTTON_INTENTS"
              :key="intent"
              :intent="intent"
              :size="size"
            >
              {{ intent }}
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
            <Button type="button" intent="ghost" size="sm">Cancel</Button>
            <Button type="submit" intent="primary" size="sm">Launch</Button>
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
            <Button intent="secondary">Confirm abort</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Abort mission?</DialogTitle>
            <DialogDescription>
              This will terminate the active flight plan and return the vehicle to home.
              The aircraft will not resume the mission automatically.
            </DialogDescription>
            <div class="flex justify-end gap-2 pt-2">
              <DialogClose as-child>
                <Button intent="ghost" size="sm">Cancel</Button>
              </DialogClose>
              <DialogClose as-child>
                <Button intent="danger" size="sm">Abort</Button>
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
              <Button intent="secondary" size="sm">Hover for tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>
              Mission integrity — all sensors green
            </TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger as-child>
              <Button intent="secondary" size="sm">Open popover</Button>
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
                  <Button intent="ghost" size="sm">Reset</Button>
                  <Button intent="primary" size="sm">Apply</Button>
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
              <Button intent="secondary" size="sm">Mission actions ▾</Button>
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
          <Button intent="ghost" size="sm" @click="showToast('info')">Show info</Button>
          <Button intent="secondary" size="sm" @click="showToast('success')">Show success</Button>
          <Button intent="danger" size="sm" @click="showToast('alarm')">Show alarm</Button>
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
              <Button intent="ghost" size="sm">Details</Button>
              <Button intent="primary" size="sm" class="ml-auto">Launch</Button>
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
              <div class="mb-2 text-xs uppercase text-muted-foreground">Skeleton (loading placeholders)</div>
              <div class="space-y-2">
                <Skeleton class="h-3 w-32" />
                <Skeleton class="h-3 w-48" />
                <Skeleton class="h-3 w-24" />
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
            Run <code class="font-mono">pnpm --filter @auxiliary/icons sync</code> with
            <code class="font-mono">FONTAWESOME_PACKAGE_TOKEN</code> set to populate FA Pro Sharp glyphs.
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
        <Button intent="ghost" size="sm">View</Button>
      </ToastAction>
      <ToastClose>Close</ToastClose>
    </div>
  </Toast>
  <ToastViewport />
  </ToastProvider>
  </TooltipProvider>
</template>
