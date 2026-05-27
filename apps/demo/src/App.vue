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
} from '@auxiliary/vue';

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
</script>

<template>
  <TooltipProvider>
  <main class="min-h-dvh bg-canvas text-primary">
    <header
      class="sticky top-0 z-10 flex items-center justify-between border-b border-default bg-canvas/80 px-8 py-4 backdrop-blur"
    >
      <div>
        <h1 class="font-display text-2xl">Auxiliary</h1>
        <p class="text-sm text-muted">System showcase · pre-1.0</p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-muted uppercase tracking-wide">Theme</span>
        <div class="flex gap-1 rounded-md border border-default bg-surface p-1">
          <button
            v-for="t in THEMES"
            :key="t"
            type="button"
            @click="theme = t"
            class="rounded px-3 py-1 text-sm capitalize transition-colors"
            :class="
              theme === t
                ? 'bg-accent text-accent-fg'
                : 'text-secondary hover:bg-hover'
            "
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
        <p class="mb-5 text-sm text-muted">
          Five levels, populated per theme. Same vocabulary across product, marketing,
          internal tools. Foundation for operational surfaces (Level 3–4).
        </p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div
            v-for="s in STATUSES"
            :key="s"
            :class="[
              'rounded-md border p-4',
              s === 'alarm' ? 'bg-alarm text-alarm border-alarm' : '',
              s === 'warning' ? 'bg-warning text-warning border-warning' : '',
              s === 'caution' ? 'bg-caution text-caution border-caution' : '',
              s === 'advisory' ? 'bg-advisory text-advisory border-advisory' : '',
              s === 'nominal' ? 'bg-nominal text-nominal border-nominal' : '',
            ]"
          >
            <div class="text-xs uppercase tracking-wide opacity-80">{{ s }}</div>
            <div class="mt-1 font-medium">{{ STATUS_LABELS[s] }}</div>
          </div>
        </div>
      </section>

      <!-- Buttons -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Buttons</h2>
        <p class="mb-5 text-sm text-muted">
          <code class="font-mono">&lt;Button&gt;</code> from
          <code class="font-mono">@auxiliary/vue</code>. Intent × size.
        </p>
        <div class="space-y-4">
          <div
            v-for="size in BUTTON_SIZES"
            :key="size"
            class="flex flex-wrap items-center gap-3"
          >
            <span class="w-12 text-xs uppercase text-muted">{{ size }}</span>
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
        <p class="mb-5 text-sm text-muted">
          <code class="font-mono">&lt;Label&gt;</code> +
          <code class="font-mono">&lt;Input&gt;</code> +
          <code class="font-mono">&lt;Button&gt;</code>. Click the label and focus jumps
          to the input.
        </p>
        <form
          class="flex max-w-md flex-col gap-3 rounded-md border border-default bg-surface p-5"
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
          <p v-if="callsign || altitude" class="font-mono tabular text-xs text-muted">
            v-model echo — callsign: <span class="text-secondary">{{ callsign || '(empty)' }}</span>,
            altitude: <span class="text-secondary">{{ altitude || '(empty)' }}</span>
          </p>
        </form>
      </section>

      <!-- Typography -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Typography</h2>
        <p class="mb-5 text-sm text-muted">
          Inter Variable with <code class="font-mono">ss02</code> +
          <code class="font-mono">cv01</code> for I/l/1 + O/0 disambiguation. Geist Mono
          + tabular for identifiers, coordinates, telemetry.
        </p>
        <div class="space-y-3 rounded-md border border-default bg-surface p-5">
          <div class="font-display">Mission Control</div>
          <p class="text-base text-secondary">
            The quick brown fox jumps over the lazy dog — 0123456789
          </p>
          <p class="font-mono tabular text-sm text-muted">{{ MISSION_ID }}</p>
          <p class="font-mono tabular text-sm">
            <span class="text-muted">LAT </span><span>47.3769° N</span>
            <span class="text-muted ml-3">LON </span><span>8.5417° E</span>
            <span class="text-muted ml-3">ALT </span><span>408 m</span>
          </p>
        </div>
      </section>

      <!-- Dialog -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Dialog</h2>
        <p class="mb-5 text-sm text-muted">
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
        <p class="mb-5 text-sm text-muted">
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
                <div class="font-medium text-primary">Quick settings</div>
                <p class="text-muted">
                  Popovers hold richer content than tooltips — forms, menus, filters.
                  Press Escape or click outside to dismiss.
                </p>
                <p class="font-mono tabular text-xs text-muted">
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
        <p class="mb-5 text-sm text-muted">
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
            <p class="font-mono tabular text-xs text-muted">
              v-model: <span class="text-secondary">{{ vehicleMode }}</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Surface specimens -->
      <section>
        <h2 class="mb-1 text-lg font-medium">Surfaces</h2>
        <p class="mb-5 text-sm text-muted">
          Background hierarchy: canvas → surface → elevated. Borders, accent, focus.
        </p>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-md bg-canvas border border-default p-5">
            <div class="text-xs uppercase text-muted">bg-canvas</div>
            <div class="mt-2 text-sm">Page background</div>
          </div>
          <div class="rounded-md bg-surface border border-default p-5">
            <div class="text-xs uppercase text-muted">bg-surface</div>
            <div class="mt-2 text-sm">Card / panel</div>
          </div>
          <div class="rounded-md bg-elevated border border-strong p-5 shadow-md">
            <div class="text-xs uppercase text-muted">bg-elevated</div>
            <div class="mt-2 text-sm">Popover / dropdown</div>
          </div>
        </div>
      </section>
    </div>

    <footer class="border-t border-default px-8 py-6 text-xs text-muted">
      Auxiliary · zinc-on-zinc, 4 themes, 5-level status · pre-1.0
    </footer>
  </main>
  </TooltipProvider>
</template>
