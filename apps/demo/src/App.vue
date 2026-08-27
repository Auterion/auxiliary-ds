<script setup lang="ts">
import { setThemeAttribute } from '@auxiliary/css/utils';
/**
 * The component gallery — every `@auxiliary/vue` primitive, as it actually
 * renders.
 *
 * The page's CHROME is written in the Deck 07b grammar (`_deck07b.css`), built
 * the Console way via the shared reference layer (`tokens/_reference.css`):
 * section heads on hairlines, mono pointer-labels on specimen rows, brackets
 * around counted facts, one measure held down the whole page.
 *
 * The SPECIMENS are not. Nothing in this file sets a colour, size, radius or
 * state on a component on display, and no exhibit is wrapped in anything that
 * changes how it renders — the frames are hairlines with padding and nothing
 * else, and the grammar's own focus ring is deliberately withheld inside the
 * page so each control keeps its shipped `--ring` treatment. A gallery that
 * flatters its exhibits reports on itself instead of on the system.
 */
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
import './tokens/_reference.css';

const THEMES = ['system', 'light', 'dark', 'sunlight', 'darknight'] as const;
type Theme = (typeof THEMES)[number];

const theme = ref<Theme>('system');

watchEffect(() => {
  if (theme.value === 'system') setThemeAttribute('data-theme', null);
  else setThemeAttribute('data-theme', theme.value);
});

// The DS themes the switcher offers, minus the `system` pass-through.
const DS_THEMES = THEMES.filter((t) => t !== 'system');

// ONE mode attribute for the surface. `.dk` keys its palette off [data-theme]
// exactly as the DS semantic tokens do, so the grammar and Card/StatusBadge/
// Switch re-resolve together and cannot drift. `system` means "no attribute" on
// <html>, so it means no attribute here too — anything else would put the page
// on a theme the portalled Dialog and Toast are not on.
const themeAttr = computed(() => (theme.value === 'system' ? undefined : theme.value));

// --- Color palette construction (driven by @auxiliary/tokens) ---
const PALETTE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
// Brand scale first, then grayscale spine + status hues the operational palette draws from.
const RAMP_FAMILIES = [
  'auterion-blue',
  'cadet',
  'zinc', 'neutral', 'red', 'orange', 'amber', 'yellow',
  'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
] as const;
// Guard the tier lookup explicitly. Every read below has a `?? 'transparent'`
// per-value fallback for legitimately-absent keys, which means a missing *tier*
// would render a full page of blank swatches with no error at all — the worst
// failure mode in this file. Fail loudly instead.
if (!tokens.global?.color?.primitive) {
  throw new Error('demo: tokens.global.color.primitive is missing — the token tier layout changed?');
}
const primitive = tokens.global.color.primitive as unknown as Record<string, Record<string, string>>;
const primitiveRamps = RAMP_FAMILIES.map((family) => {
  const ramp = primitive[family] ?? {};
  return { family, steps: PALETTE_STEPS.map((step) => ({ step, value: ramp[step] ?? 'transparent' })) };
});

// Reverse-lookup: which primitive step a resolved semantic value came from.
const primitiveByValue = new Map<string, string>();
for (const [family, ramp] of Object.entries(tokens.global.color.primitive)) {
  if (typeof ramp === 'string') primitiveByValue.set(ramp, family);
  else for (const [step, value] of Object.entries(ramp)) primitiveByValue.set(value, `${family}.${step}`);
}
const SEMANTIC_ROLES = [
  // Surface
  'background', 'foreground',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  // Interactive
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  // Brand
  'brand', 'brand-foreground',
  // Utility
  'border', 'input', 'ring',
  'destructive', 'destructive-foreground',
  // Status ladder
  'alarm', 'alarm-foreground',
  'warning', 'warning-foreground',
  'caution', 'caution-foreground',
  'advisory', 'advisory-foreground',
  'nominal', 'nominal-foreground',
] as const;
const activeThemeName = computed<'light' | 'dark' | 'sunlight' | 'darknight'>(() => {
  if (theme.value !== 'system') return theme.value;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});
const semanticMap = computed(() => {
  const themeTokens = tokens.theme[activeThemeName.value];
  if (!themeTokens) {
    throw new Error(
      `demo: tokens.theme.${activeThemeName.value} is missing — the token tier layout changed?`,
    );
  }
  const t = themeTokens as Record<string, string>;
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

// Sample mission ID — packed with I/O/1/l/0 collisions (mono face + operational disambiguation)
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
const toastVariant = ref<'advisory' | 'nominal' | 'alarm'>('advisory');

function showToast(variant: 'advisory' | 'nominal' | 'alarm') {
  toastVariant.value = variant;
  toastOpen.value = false;
  // re-open on next tick so repeat clicks restart the timer
  setTimeout(() => (toastOpen.value = true), 50);
}

/* --------------------------------------------------------- measured facts
 * Every bracket on this page is COUNTED from the data that renders the block
 * beneath it, never typed — so a bracket cannot go stale against its specimen.
 * A bracket wraps measured facts only: never an opinion, never a label. */

const coverBracket = computed(
  () => `${DS_THEMES.length} themes · ${STATUSES.length} status levels · ${ICON_NAMES.length} icons`,
);
const statusBracket = `${STATUSES.length} levels`;
const buttonBracket = `${BUTTON_VARIANTS.length} variants · ${BUTTON_SIZES.length} sizes `
  + `· ${BUTTON_VARIANTS.length * BUTTON_SIZES.length} specimens`;
const sizeBracket = `${FIELD_SIZES.length} sizes · 1 invalid flag`;
const freqBracket = `${FREQUENCIES.length} frequencies`;
const fleetBracket = computed(
  () => `${FLEET.length} vehicles · ${selectedVehicles.value.size} selected`,
);
const paletteBracket = `${primitiveRamps.length} ramps · ${PALETTE_STEPS.length} steps`;
const semanticBracket = computed(() => `${semanticMap.value.length} roles`);
const iconBracket = `${ICON_NAMES.length} icons`;
</script>

<template>
  <TooltipProvider>
  <ToastProvider :duration="4000">
  <!-- ONE mode attribute for the whole surface — see `themeAttr` above. -->
  <main :data-theme="themeAttr" class="dk rf-page">
    <!-- ════ IDENTITY STRIP ════ -->
    <header class="rf-topbar">
      <div class="rf-row">
        <span class="dk-value">Auxiliary</span>
        <span class="dk-micro">/</span>
        <span class="dk-label">Component gallery</span>
      </div>

      <div class="rf-row">
        <span class="dk-label">Theme</span>
        <div class="dk-segment rf-segment-wrap">
          <button
            v-for="t in THEMES"
            :key="t"
            type="button"
            class="dk-segment-btn"
            :data-active="theme === t"
            :aria-pressed="theme === t"
            @click="theme = t"
          >{{ t }}</button>
        </div>
      </div>
    </header>

    <div class="rf-measure">
      <!-- ════ COVER ════ -->
      <header class="rf-cover">
        <p class="dk-label">@auxiliary/vue · specimens</p>
        <h1 class="dk-display">Component gallery</h1>
        <!-- ghost line: covers and section titles only -->
        <p class="dk-h2 dk-ghost">Unretouched, in a hairline frame</p>
        <p class="dk-body-lg rf-lede">
          The chrome on this page is the house grammar. The specimens are not —
          every component below renders exactly as it ships, framed by a hairline
          that sets nothing on it.
        </p>
        <p class="rf-cover-facts">
          <span class="dk-bracket">{{ coverBracket }}</span>
        </p>
      </header>

      <!-- ════ HEADER LEDGER — tops the case layout, one per view ════ -->
      <div class="dk-ledger rf-ledger-5">
        <div class="dk-ledger-cell">
          <span class="dk-pointer">Package</span>
          <span class="dk-value">@auxiliary/vue</span>
        </div>
        <div class="dk-ledger-cell">
          <span class="dk-pointer">Built on</span>
          <span class="dk-value">Reka UI · Tailwind v4</span>
        </div>
        <div class="dk-ledger-cell">
          <span class="dk-pointer">Themes</span>
          <span class="dk-value dk-num">{{ DS_THEMES.length }} · colour only</span>
        </div>
        <div class="dk-ledger-cell">
          <span class="dk-pointer">Status ladder</span>
          <span class="dk-value dk-num">{{ STATUSES.length }} levels</span>
        </div>
        <div class="dk-ledger-cell" data-align="end">
          <span class="dk-pointer">Release</span>
          <span class="dk-value">pre-1.0</span>
        </div>
      </div>

      <div class="rf-stack rf-body">
        <!-- Status -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Status hierarchy</h2>
              <span class="dk-bracket">{{ statusBracket }}</span>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;StatusBadge&gt;</code> — five levels, populated
              per theme. Solid for active state; outline for muted contexts. The vocabulary
              nobody else in the Vue ecosystem ships.
            </p>
          </header>
          <div class="dk-card rf-specimen rf-stack-sm">
            <div class="rf-row">
              <span class="dk-pointer rf-slot">Solid</span>
              <StatusBadge v-for="s in STATUSES" :key="`s-${s}`" :level="s" dot>{{ STATUS_LABELS[s] }}</StatusBadge>
            </div>
            <div class="rf-row">
              <span class="dk-pointer rf-slot">Outline</span>
              <StatusBadge
                v-for="s in STATUSES"
                :key="`o-${s}`"
                :level="s"
                variant="outline"
              >{{ STATUS_LABELS[s] }}</StatusBadge>
            </div>
            <div class="rf-row rf-split">
              <span class="dk-pointer rf-slot">In situ</span>
              <span class="dk-small">Link status</span>
              <StatusBadge level="alarm" size="sm" dot>Lost</StatusBadge>
              <span class="dk-small">Battery</span>
              <StatusBadge level="warning" size="sm" dot>Low</StatusBadge>
              <span class="dk-small">GPS</span>
              <StatusBadge level="nominal" size="sm" dot>12 sats</StatusBadge>
            </div>
          </div>
        </section>

        <!-- Telemetry -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Telemetry</h2>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;TelemetryValue&gt;</code> — mono tabular readouts
              with optional unit, label, precision, and trend arrow. Colors by status when
              a value crosses a threshold.
            </p>
          </header>
          <div class="dk-card rf-specimen rf-cols rf-cols-sm">
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Alert banners</h2>
              <span class="dk-bracket">{{ statusBracket }}</span>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;AlertBanner&gt;</code> — persistent, severity-coded
              banners. Use for in-flight conditions that need visible acknowledgement, not
              dismiss-after-N-seconds toasts.
            </p>
          </header>
          <div class="rf-stack-xs">
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Buttons</h2>
              <span class="dk-bracket">{{ buttonBracket }}</span>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Button&gt;</code> from
              <code class="rf-code">@auxiliary/vue</code>. Variant × size.
            </p>
          </header>
          <div class="dk-card rf-specimen rf-stack-sm">
            <div
              v-for="size in BUTTON_SIZES"
              :key="size"
              class="rf-row"
            >
              <span class="dk-pointer rf-slot">{{ size }}</span>
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Form composition</h2>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Label&gt;</code> +
              <code class="rf-code">&lt;Input&gt;</code> +
              <code class="rf-code">&lt;Button&gt;</code>. Click the label and focus jumps
              to the input.
            </p>
          </header>
          <form
            class="dk-card rf-specimen rf-stack-sm rf-narrow"
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
            <div class="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm">Cancel</Button>
              <Button type="submit" variant="primary" size="sm">Launch</Button>
            </div>
            <p v-if="callsign || altitude" class="rf-echo">
              v-model echo — callsign: <span class="rf-echo-value">{{ callsign || '(empty)' }}</span>,
              altitude: <span class="rf-echo-value">{{ altitude || '(empty)' }}</span>
            </p>
          </form>
        </section>

        <!-- Form inputs (checkbox / switch / radio / slider / textarea) -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Form inputs</h2>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Checkbox&gt;</code>,
              <code class="rf-code">&lt;Switch&gt;</code>,
              <code class="rf-code">&lt;RadioGroup&gt;</code>,
              <code class="rf-code">&lt;Slider&gt;</code>,
              <code class="rf-code">&lt;Textarea&gt;</code>. The selection + range
              surface for forms beyond text inputs.
            </p>
          </header>
          <div class="dk-card rf-specimen rf-stack-sm rf-medium">
            <div class="rf-row">
              <Checkbox id="armed" v-model="armed" />
              <Label for="armed">Arm vehicle on launch</Label>
              <span class="rf-echo rf-row-end">{{ armed ? 'true' : 'false' }}</span>
            </div>

            <div class="rf-row">
              <Switch id="geofence" v-model="geofenceEnabled" />
              <Label for="geofence">Geofence active</Label>
              <span class="rf-echo rf-row-end">{{ geofenceEnabled ? 'enabled' : 'disabled' }}</span>
            </div>

            <div class="rf-tight">
              <Label>Flight mode</Label>
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
              <p class="rf-echo">
                v-model: <span class="rf-echo-value">{{ flightMode }}</span>
              </p>
            </div>

            <div class="rf-tight">
              <Label for="max-alt">
                Max altitude
                <span class="rf-echo">{{ maxAltitude[0] }} m</span>
              </Label>
              <Slider id="max-alt" v-model="maxAltitude" :min="10" :max="400" :step="10" />
            </div>

            <div class="rf-tight">
              <Label for="failsafe">Failsafe note (operator)</Label>
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Validation &amp; size</h2>
              <span class="dk-bracket">{{ sizeBracket }}</span>
            </div>
            <p class="dk-body rf-lede">
              The shared <code class="rf-code">invalid</code> flag (aria-invalid + destructive
              border/ring) and <code class="rf-code">size</code> axis (<code class="rf-code">sm
              / md / lg</code>) added across the form set in Phase 6.1 — one vocabulary for every
              control.
            </p>
          </header>
          <div class="dk-card rf-specimen rf-cols rf-cols-lg">
            <div class="rf-stack-sm">
              <div class="dk-label">invalid</div>
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
            <div class="rf-stack-sm">
              <div class="dk-label">size</div>
              <div v-for="s in FIELD_SIZES" :key="s" class="rf-row">
                <span class="dk-pointer rf-slot">{{ s }}</span>
                <Input :size="s" :placeholder="`Input ${s}`" />
              </div>
              <p class="dk-small">
                Compact (<code class="rf-code">sm</code>) suits dense GCS/telemetry panels.
                The whole axis also flexes by register — the same markup tightens under
                <code class="rf-code">data-register="operational"</code>:
              </p>
              <div data-register="operational" class="rf-row">
                <span class="dk-pointer rf-slot">op</span>
                <Input size="md" placeholder="Input md · operational" />
              </div>
            </div>
          </div>
        </section>

        <!-- Typography -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Typography</h2>
            </div>
            <p class="dk-body rf-lede">
              Inter Variable — square / straight punctuation globally;
              <code class="rf-code">I/l/1</code> disambiguation and slashed zero switch on in the
              <code class="rf-code">operational</code> register. Geist Mono
              + tabular for identifiers, coordinates, telemetry.
            </p>
          </header>
          <div class="dk-card rf-specimen rf-stack-sm">
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Dialog</h2>
            </div>
            <p class="dk-body rf-lede">
              First headless-backed primitive. <code class="rf-code">@auxiliary/vue</code>
              wraps Reka UI's Dialog with our styling. Focus trap, Escape to close,
              click-outside, ARIA dialog semantics, and portal teleport — all from Reka.
            </p>
          </header>
          <div class="rf-row">
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
          </div>
        </section>

        <!-- Floating UI: Tooltip + Popover -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Floating UI</h2>
            </div>
            <p class="dk-body rf-lede">
              Tooltip for hints, Popover for richer floating content. Both anchored to
              their trigger, both backed by Reka UI for keyboard a11y and collision
              detection.
            </p>
          </header>
          <div class="rf-row">
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Menus</h2>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;DropdownMenu&gt;</code> for action menus,
              <code class="rf-code">&lt;Select&gt;</code> for value selection. Both
              keyboard-navigable (↑/↓, Home/End, type-ahead), both backed by Reka UI.
            </p>
          </header>
          <div class="rf-row rf-row-top">
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
              <p class="rf-echo">
                v-model: <span class="rf-echo-value">{{ vehicleMode }}</span>
              </p>
            </div>
          </div>
        </section>

        <!-- Type-ahead: Combobox -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Type-ahead</h2>
              <span class="dk-bracket">{{ freqBracket }}</span>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Combobox&gt;</code> — an input that filters a list as you
              type. For large sets (frequencies, vehicle IDs, waypoints) where scanning a
              <code class="rf-code">&lt;Select&gt;</code> is too slow. Shares the
              <code class="rf-code">size</code> / <code class="rf-code">invalid</code>
              vocabulary with the other controls.
            </p>
          </header>
          <div class="rf-row rf-row-top">
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
              <p class="rf-echo">
                v-model: <span class="rf-echo-value">{{ radioFreq || '(none)' }}</span>
              </p>
            </div>
          </div>
        </section>

        <!-- Number field -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Number field</h2>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;NumberField&gt;</code> — stepper entry with
              min/max/step clamp and an inline <code class="rf-code">unit</code>. For
              altitude, speed, frequency, throttle — where free-text input is error-prone.
              Pairs with <code class="rf-code">&lt;TelemetryValue&gt;</code>.
            </p>
          </header>
          <div class="dk-card rf-specimen rf-row rf-row-top">
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
              <p class="rf-echo">
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
              <span class="dk-label">disabled</span>
              <NumberField :default-value="408" unit="m" disabled class="w-44" />
            </div>
          </div>
        </section>

        <!-- Tabs -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Tabs</h2>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Tabs&gt;</code> for panel switching. Keyboard:
              ←/→ navigates triggers, Home/End jumps to first/last. Active tab uses our
              <code class="rf-code">bg-primary</code>.
            </p>
          </header>
          <Tabs default-value="telemetry">
            <TabsList>
              <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
              <TabsTrigger value="waypoints">Waypoints</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="telemetry">
              <div class="dk-card rf-specimen">
                <p class="dk-body">Live sensor readings.</p>
                <p class="mt-2 font-mono tabular text-sm">
                  <span class="text-muted-foreground">BAT </span><span>74%</span>
                  <span class="text-muted-foreground ml-3">SPD </span><span>12.4 m/s</span>
                  <span class="text-muted-foreground ml-3">HDG </span><span>247°</span>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="waypoints">
              <div class="dk-card rf-specimen">
                <p class="dk-body">5 waypoints queued.</p>
                <p class="mt-2 font-mono tabular text-sm text-muted-foreground">
                  WP-01 → WP-02 → WP-03 → WP-04 → WP-05 (HOME)
                </p>
              </div>
            </TabsContent>
            <TabsContent value="logs">
              <div class="dk-card rf-specimen">
                <p class="dk-body">Last 3 events.</p>
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Toast</h2>
            </div>
            <p class="dk-body rf-lede">
              Transient notifications. Auto-dismisses after 4s, swipe right to dismiss
              early, paused on hover. ARIA live-region announces to screen readers.
              Single global <code class="rf-code">&lt;ToastViewport&gt;</code> renders
              fixed bottom-right.
            </p>
          </header>
          <div class="rf-row">
            <Button variant="ghost" size="sm" @click="showToast('advisory')">Show advisory</Button>
            <Button variant="secondary" size="sm" @click="showToast('nominal')">Show nominal</Button>
            <Button variant="danger" size="sm" @click="showToast('alarm')">Show alarm</Button>
          </div>
        </section>

        <!-- Structure: Card + Separator + Accordion -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Structure</h2>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Card&gt;</code>, <code class="rf-code">&lt;Separator&gt;</code>,
              and <code class="rf-code">&lt;Accordion&gt;</code> — content scaffolding that
              composes with everything else.
            </p>
          </header>
          <div class="rf-cols rf-cols-lg">
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Data table</h2>
              <span class="dk-bracket">{{ fleetBracket }}</span>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Table&gt;</code> — the top operational surface: fleets,
              mission logs, telemetry streams, alert history. Sticky header on a bounded scroll
              container, row selection, and <code class="rf-code">scope="row"</code> headers so
              screen readers associate each row with its vehicle.
            </p>
          </header>
          <div class="dk-card">
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Visuals</h2>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Avatar&gt;</code>,
              <code class="rf-code">&lt;Badge&gt;</code>,
              <code class="rf-code">&lt;Progress&gt;</code>,
              <code class="rf-code">&lt;Spinner&gt;</code>,
              <code class="rf-code">&lt;Skeleton&gt;</code> — small visual surface
              pieces that complete the universal-basics set.
            </p>
          </header>
          <div class="dk-card rf-specimen rf-cols rf-cols-lg">
            <div class="rf-stack">
              <div class="rf-stack-sm">
                <div class="dk-label">Avatars (initials fallback)</div>
                <div class="rf-row">
                  <Avatar size="sm"><AvatarFallback>YD</AvatarFallback></Avatar>
                  <Avatar size="md"><AvatarFallback>AM</AvatarFallback></Avatar>
                  <Avatar size="lg"><AvatarFallback>OP</AvatarFallback></Avatar>
                </div>
              </div>

              <div class="rf-stack-sm">
                <div class="dk-label">Badges (generic — distinct from StatusBadge)</div>
                <div class="rf-row">
                  <Badge variant="neutral">neutral</Badge>
                  <Badge variant="secondary">secondary</Badge>
                  <Badge variant="outline">outline</Badge>
                  <Badge variant="primary">primary</Badge>
                  <Badge size="sm">v4.2.1</Badge>
                  <Badge size="sm" variant="outline">beta</Badge>
                </div>
              </div>

              <div class="rf-stack-sm">
                <div class="dk-label">Spinner</div>
                <div class="rf-row text-muted-foreground">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <span class="dk-small">inherits color via currentColor</span>
                </div>
              </div>
            </div>

            <div class="rf-stack">
              <div class="rf-stack-sm">
                <div class="dk-label">Progress (battery 74% — warning if &lt;30%)</div>
                <div class="rf-stack-xs">
                  <div class="rf-meter">
                    <span class="dk-micro dk-num">74%</span>
                    <Progress :value="74" level="nominal" />
                  </div>
                  <div class="rf-meter">
                    <span class="dk-micro dk-num">42%</span>
                    <Progress :value="42" level="caution" />
                  </div>
                  <div class="rf-meter">
                    <span class="dk-micro dk-num">18%</span>
                    <Progress :value="18" level="warning" />
                  </div>
                  <div class="rf-meter">
                    <span class="dk-micro dk-num">5%</span>
                    <Progress :value="5" level="alarm" />
                  </div>
                </div>
              </div>

              <div class="rf-stack-sm">
                <div class="rf-head">
                  <span class="dk-label">Skeleton (loading prop)</span>
                  <label class="flex items-center gap-2 text-xs text-muted-foreground">
                    <Switch v-model="skeletonLoading" />
                    loading
                  </label>
                </div>
                <div class="rf-stack-xs">
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
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Color palette</h2>
              <span class="dk-bracket">{{ paletteBracket }}</span>
            </div>
            <p class="dk-body rf-lede">
              One OKLCH primitive palette is the raw material. Semantic tokens —
              <code class="rf-code">background</code>, <code class="rf-code">primary</code>, the
              alarm ladder — reference specific steps, and each theme reassigns which step. Below: the
              ramps, then how the active <strong class="rf-ink">{{ activeThemeName }}</strong>
              theme selects from them.
            </p>
          </header>

          <!-- Primitive ramps -->
          <div class="rf-stack-xs">
            <div class="rf-ramp">
              <span></span>
              <div class="rf-ramp-steps">
                <span
                  v-for="s in PALETTE_STEPS"
                  :key="s"
                  class="dk-micro dk-num rf-ramp-step"
                >{{ s }}</span>
              </div>
            </div>
            <div v-for="ramp in primitiveRamps" :key="ramp.family" class="rf-ramp">
              <span class="dk-label">{{ ramp.family }}</span>
              <div class="rf-ramp-steps">
                <div
                  v-for="sw in ramp.steps"
                  :key="sw.step"
                  class="rf-swatch"
                  :style="{ backgroundColor: sw.value }"
                  :title="`${ramp.family}.${sw.step} — ${sw.value}`"
                />
              </div>
            </div>

          </div>

          <!-- Semantic selection for the active theme -->
          <div class="dk-card rf-specimen rf-stack-sm">
            <div class="rf-head">
              <span class="dk-label">{{ activeThemeName }} theme — semantic token → primitive step</span>
              <span class="dk-bracket">{{ semanticBracket }}</span>
            </div>
            <div class="rf-cols rf-cols-sm">
              <div v-for="m in semanticMap" :key="m.role" class="flex items-center gap-2">
                <div
                  class="rf-chip"
                  :style="{ backgroundColor: m.value }"
                  :title="m.value"
                />
                <div class="min-w-0">
                  <div class="rf-mono rf-ink">{{ m.role }}</div>
                  <div class="dk-micro rf-truncate">{{ m.source }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Surface specimens -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Surfaces</h2>
            </div>
            <p class="dk-body rf-lede">
              Background hierarchy: canvas → surface → elevated. Borders, accent, focus.
              These three are the design system's own fills, shown unframed — the grammar's
              hairline card would hide the very thing being compared.
            </p>
          </header>
          <div class="rf-cols">
            <div class="rounded-md bg-background border border-border p-5">
              <div class="dk-label">bg-background</div>
              <div class="mt-2 text-sm">Page background</div>
            </div>
            <div class="rounded-md bg-card border border-border p-5">
              <div class="dk-label">bg-card</div>
              <div class="mt-2 text-sm">Card / panel</div>
            </div>
            <div class="rounded-md bg-popover border border-border p-5 shadow-md">
              <div class="dk-label">bg-popover</div>
              <div class="mt-2 text-sm">Popover / dropdown</div>
            </div>
          </div>
        </section>

        <!-- Icons -->
        <section class="rf-section">
          <header>
            <div class="dk-section">
              <h2 class="dk-h2">Icons</h2>
              <span class="dk-bracket">{{ iconBracket }}</span>
            </div>
            <p class="dk-body rf-lede">
              <code class="rf-code">&lt;Icon name="…" weight="…" size="…" /&gt;</code>
              — typed name union from <code class="rf-code">@auxiliary/icons</code>.
              Inherits <code class="rf-code">currentColor</code>; pair with the alarm-tier text utilities.
            </p>
          </header>

          <!-- Size scale -->
          <div class="rf-scale">
            <div v-for="size in (['xs', 'sm', 'md', 'lg', 'xl'] as const)" :key="size" class="rf-scale-item">
              <Icon name="drone" :size="size" />
              <span class="dk-label">{{ size }}</span>
            </div>
          </div>

          <!-- Status pairing -->
          <div class="rf-cols rf-cols-sm">
            <div class="rf-tile-row">
              <span class="text-alarm"><Icon name="drone" size="md" /></span>
              <span class="dk-label">alarm</span>
            </div>
            <div class="rf-tile-row">
              <span class="text-warning"><Icon name="drone" size="md" /></span>
              <span class="dk-label">warning</span>
            </div>
            <div class="rf-tile-row">
              <span class="text-caution"><Icon name="drone" size="md" /></span>
              <span class="dk-label">caution</span>
            </div>
            <div class="rf-tile-row">
              <span class="text-advisory"><Icon name="drone" size="md" /></span>
              <span class="dk-label">advisory</span>
            </div>
            <div class="rf-tile-row">
              <span class="text-nominal"><Icon name="drone" size="md" /></span>
              <span class="dk-label">nominal</span>
            </div>
          </div>

          <!-- Registry coverage -->
          <div class="dk-card rf-specimen rf-stack-sm">
            <div class="rf-head">
              <span class="dk-label">Registry</span>
              <span class="dk-bracket">{{ iconBracket }}</span>
            </div>
            <div class="rf-cols rf-cols-xs">
              <div
                v-for="name in ICON_NAMES"
                :key="name"
                class="rf-tile"
              >
                <Icon :name="name" size="md" />
                <span class="dk-micro rf-tile-name">{{ name }}</span>
              </div>
            </div>
            <p class="dk-small">
              Interim placeholder glyphs pending the Nucleo swap. Drop SVGs in
              <code class="rf-code">packages/icons/inputs/</code> and run
              <code class="rf-code">pnpm --filter @auxiliary/icons sync</code>.
            </p>
          </div>
        </section>
      </div>

      <p class="dk-caption rf-colophon">
        Reference · component gallery — header ledger + section rules + specimen frames
      </p>
    </div>

    <footer class="rf-footer">
      <span class="dk-small">
        Auxiliary · zinc-on-zinc, 4 themes, 5-level status · pre-1.0
      </span>
    </footer>
  </main>
  <Toast v-model:open="toastOpen">
    <div>
      <ToastTitle>{{ toastVariant === 'alarm' ? 'Link lost' : toastVariant === 'nominal' ? 'Mission saved' : 'Telemetry updated' }}</ToastTitle>
      <ToastDescription>
        {{ toastVariant === 'alarm'
          ? 'No telemetry packets received for &gt;3s. Check radio link.'
          : toastVariant === 'nominal'
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
