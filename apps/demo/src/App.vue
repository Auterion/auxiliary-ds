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

// Form state
const callsign = ref('');
const altitude = ref('');
const vehicleMode = ref('auto');

const NAV = [
  { id: 'status',      n: '01', label: 'Status hierarchy' },
  { id: 'buttons',     n: '02', label: 'Buttons' },
  { id: 'form',        n: '03', label: 'Form composition' },
  { id: 'typography',  n: '04', label: 'Typography' },
  { id: 'dialog',      n: '05', label: 'Dialog' },
  { id: 'floating',    n: '06', label: 'Floating UI' },
  { id: 'menus',       n: '07', label: 'Menus' },
  { id: 'surfaces',    n: '08', label: 'Surfaces' },
] as const;
</script>

<template>
  <TooltipProvider>
  <div class="min-h-dvh bg-canvas text-primary">
    <header
      class="sticky top-0 z-30 flex items-center justify-between border-b border-default bg-canvas/80 px-8 py-4 backdrop-blur"
    >
      <div class="flex items-baseline gap-4">
        <h1 class="font-display text-2xl">Auxiliary</h1>
        <p class="text-sm text-muted">
          System showcase · 16 primitives · 5-level status · 4 themes · pre-1.0
        </p>
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

    <div class="mx-auto flex max-w-7xl gap-12 px-8 py-12">
      <!-- Sidebar nav -->
      <aside class="sticky top-24 hidden h-fit w-44 shrink-0 self-start lg:block">
        <div class="mb-3 text-xs uppercase tracking-wide text-muted">Sections</div>
        <nav class="flex flex-col gap-1">
          <a
            v-for="s in NAV"
            :key="s.id"
            :href="`#${s.id}`"
            class="group flex items-baseline gap-3 rounded px-2 py-1.5 text-sm text-secondary hover:bg-hover hover:text-primary transition-colors"
          >
            <span class="font-mono tabular text-xs text-muted">{{ s.n }}</span>
            <span>{{ s.label }}</span>
          </a>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="min-w-0 flex-1 space-y-20">
        <!-- 01 Status -->
        <section id="status" class="scroll-mt-24">
          <div class="mb-2 flex items-center gap-3">
            <span class="font-mono tabular text-xs text-muted">01</span>
            <h2 class="text-xl font-medium">Status hierarchy</h2>
          </div>
          <p class="mb-6 text-sm text-muted">
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

        <!-- 02 Buttons -->
        <section id="buttons" class="scroll-mt-24">
          <div class="mb-2 flex items-center gap-3">
            <span class="font-mono tabular text-xs text-muted">02</span>
            <h2 class="text-xl font-medium">Buttons</h2>
          </div>
          <p class="mb-6 text-sm text-muted">
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

        <!-- 03 Form -->
        <section id="form" class="scroll-mt-24">
          <div class="mb-2 flex items-center gap-3">
            <span class="font-mono tabular text-xs text-muted">03</span>
            <h2 class="text-xl font-medium">Form composition</h2>
          </div>
          <p class="mb-6 text-sm text-muted">
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

        <!-- 04 Typography -->
        <section id="typography" class="scroll-mt-24">
          <div class="mb-2 flex items-center gap-3">
            <span class="font-mono tabular text-xs text-muted">04</span>
            <h2 class="text-xl font-medium">Typography</h2>
          </div>
          <p class="mb-6 text-sm text-muted">
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

        <!-- 05 Dialog -->
        <section id="dialog" class="scroll-mt-24">
          <div class="mb-2 flex items-center gap-3">
            <span class="font-mono tabular text-xs text-muted">05</span>
            <h2 class="text-xl font-medium">Dialog</h2>
          </div>
          <p class="mb-6 text-sm text-muted">
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

        <!-- 06 Floating UI -->
        <section id="floating" class="scroll-mt-24">
          <div class="mb-2 flex items-center gap-3">
            <span class="font-mono tabular text-xs text-muted">06</span>
            <h2 class="text-xl font-medium">Floating UI</h2>
          </div>
          <p class="mb-6 text-sm text-muted">
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

        <!-- 07 Menus -->
        <section id="menus" class="scroll-mt-24">
          <div class="mb-2 flex items-center gap-3">
            <span class="font-mono tabular text-xs text-muted">07</span>
            <h2 class="text-xl font-medium">Menus</h2>
          </div>
          <p class="mb-6 text-sm text-muted">
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

        <!-- 08 Surfaces -->
        <section id="surfaces" class="scroll-mt-24">
          <div class="mb-2 flex items-center gap-3">
            <span class="font-mono tabular text-xs text-muted">08</span>
            <h2 class="text-xl font-medium">Surfaces</h2>
          </div>
          <p class="mb-6 text-sm text-muted">
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
      </main>
    </div>

    <footer class="border-t border-default px-8 py-6 text-xs text-muted">
      Auxiliary · zinc-on-zinc, 4 themes, 5-level status · pre-1.0
    </footer>
  </div>
  </TooltipProvider>
</template>
