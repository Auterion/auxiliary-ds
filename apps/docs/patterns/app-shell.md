<script setup>
import { ref } from 'vue';

const collapsed = ref(false);
const active = ref('dashboard');

const nav = [
  { id: 'dashboard',   label: 'Dashboard',       icon: 'house' },
  { id: 'fleet',       label: 'Fleet',           icon: 'drone' },
  { id: 'alerts',      label: 'Alerts',          icon: 'bell', badge: 3 },
  { id: 'security',    label: 'Device security', icon: 'lock', attention: true },
  { id: 'diagnostics', label: 'Diagnostics',     icon: 'magnifying-glass' },
];
const footer = [
  { id: 'docs',     label: 'Documentation', icon: 'arrow-up-right-from-square' },
  { id: 'settings', label: 'Settings',      icon: 'gear' },
];

const labelOf = (id) => [...nav, ...footer].find((n) => n.id === id)?.label ?? '';

function itemStyle(id) {
  const on = active.value === id;
  return {
    display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%',
    padding: '0.5rem 0.6rem', borderRadius: '0.375rem', fontSize: '0.875rem',
    border: 'none', cursor: 'pointer', textAlign: 'left', lineHeight: '1.25rem',
    justifyContent: collapsed.value ? 'center' : 'flex-start',
    background: on ? 'var(--accent)' : 'transparent',
    color: on ? 'var(--accent-foreground)' : 'var(--foreground)',
    fontWeight: on ? 500 : 400,
  };
}
</script>

# App shell

The frame every Level-2/3 surface sits in — a top bar, a collapsible left navigation, and a content region that scrolls **independently** of the chrome. This is the structure behind AuterionSuite and the AuterionOS device admin: the shell stays put; only the content moves.

**Composes:** `Icon` · `DropdownMenu` (org switcher) · `Avatar` · `Badge` · layout

<div class="vp-raw" style="margin:1.25rem 0; border:1px solid var(--border); border-radius:0.5rem; overflow:hidden; height:30rem; display:grid; grid-template-rows:auto 1fr; background:var(--background); color:var(--foreground);" :style="{ gridTemplateColumns: (collapsed ? '3.25rem' : '13.5rem') + ' 1fr' }">
  <!-- Top bar -->
  <header style="grid-column:1 / -1; display:flex; align-items:center; gap:0.75rem; padding:0 0.875rem; height:3.25rem; border-bottom:1px solid var(--border); background:var(--card);">
    <button @click="collapsed = !collapsed" :aria-label="collapsed ? 'Expand navigation' : 'Collapse navigation'" :aria-expanded="!collapsed" style="display:inline-flex; align-items:center; justify-content:center; width:2rem; height:2rem; border:none; background:transparent; border-radius:0.375rem; cursor:pointer; color:var(--muted-foreground);">
      <Icon name="bars" />
    </button>
    <span style="font-weight:600;">Auterion<span style="color:var(--muted-foreground); font-weight:400;">OS</span></span>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button style="display:inline-flex; align-items:center; gap:0.375rem; padding:0.25rem 0.5rem; border:1px solid var(--border); border-radius:0.375rem; background:transparent; color:var(--foreground); font-size:0.8125rem; cursor:pointer;">Auterion <Icon name="chevron-down" /></button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuItem>Auterion</DropdownMenuItem>
        <DropdownMenuItem>Skyfall OEM</DropdownMenuItem>
        <DropdownMenuItem>Censys Technologies</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <div style="flex:1;"></div>
    <button aria-label="Notifications" style="display:inline-flex; align-items:center; justify-content:center; width:2rem; height:2rem; border:none; background:transparent; border-radius:0.375rem; cursor:pointer; color:var(--muted-foreground);">
      <Icon name="bell" />
    </button>
    <Avatar><AvatarFallback>YL</AvatarFallback></Avatar>
  </header>

  <!-- Sidebar -->
  <nav aria-label="Primary" style="grid-row:2; grid-column:1; display:flex; flex-direction:column; gap:0.125rem; padding:0.625rem; border-right:1px solid var(--border); background:var(--card); overflow-y:auto;">
    <button v-for="item in nav" :key="item.id" @click="active = item.id" :aria-current="active === item.id ? 'page' : undefined" :title="collapsed ? item.label : undefined" :style="itemStyle(item.id)">
      <Icon :name="item.icon" />
      <span v-show="!collapsed" style="flex:1; white-space:nowrap; overflow:hidden;">{{ item.label }}</span>
      <Badge v-if="item.badge && !collapsed" size="sm">{{ item.badge }}</Badge>
      <span v-if="item.attention && !collapsed" aria-label="Attention required" style="width:0.5rem; height:0.5rem; border-radius:9999px; background:var(--color-amber-500, orange);"></span>
    </button>
    <div style="margin-top:auto; display:flex; flex-direction:column; gap:0.125rem; padding-top:0.625rem;">
      <button v-for="item in footer" :key="item.id" @click="active = item.id" :aria-current="active === item.id ? 'page' : undefined" :title="collapsed ? item.label : undefined" :style="itemStyle(item.id)">
        <Icon :name="item.icon" />
        <span v-show="!collapsed" style="flex:1; white-space:nowrap; overflow:hidden;">{{ item.label }}</span>
      </button>
    </div>
  </nav>

  <!-- Content -->
  <main style="grid-row:2; grid-column:2; overflow-y:auto; padding:1.5rem; background:var(--background);">
    <h3 style="margin:0 0 0.25rem; font-size:1.125rem; font-weight:600;">{{ labelOf(active) }}</h3>
    <p style="margin:0 0 1.25rem; color:var(--muted-foreground); font-size:0.875rem;">Content region — scrolls independently of the shell. Toggle the bars icon to collapse the sidebar to icons. Try resizing: on a narrow viewport this becomes a slide-in drawer.</p>
    <div style="display:grid; gap:0.75rem;">
      <Card v-for="n in 4" :key="n">
        <CardHeader>
          <CardTitle>Panel {{ n }}</CardTitle>
          <CardDescription>Stacked content to demonstrate the independent scroll.</CardDescription>
        </CardHeader>
        <CardContent>
          <span style="font-size:0.875rem; color:var(--muted-foreground);">The top bar and sidebar stay fixed while this column scrolls.</span>
        </CardContent>
      </Card>
    </div>
  </main>
</div>

## Structure

```
┌ TOP BAR — menu · brand · org switcher ········· notifications · user ┐
├──────────────┬──────────────────────────────────────────────────────┤
│   SIDEBAR    │   CONTENT (scrolls independently)                     │
│  ▸ Dashboard │                                                        │
│  ▸ Fleet     │   …                                                    │
│  ▸ Alerts  3 │                                                        │
│  · · · · · · │                                                        │
│  ▸ Settings  │  ← footer items pinned to the bottom (margin-top:auto) │
└──────────────┴──────────────────────────────────────────────────────┘
```

The shell is a CSS grid: `grid-template-columns: <sidebar> 1fr` and `grid-template-rows: auto 1fr`. The top bar spans both columns; the sidebar and content fill the second row, each with its own `overflow-y: auto`.

```vue
<script setup>
import { ref } from 'vue';
const collapsed = ref(false);
const sidebarW = computed(() => (collapsed.value ? '3.25rem' : '13.5rem'));
</script>

<template>
  <div
    class="grid h-screen"
    :style="{ gridTemplateColumns: sidebarW + ' 1fr', gridTemplateRows: 'auto 1fr' }"
  >
    <header class="col-span-full flex items-center gap-3 border-b border-border bg-card px-3.5">
      <button :aria-expanded="!collapsed" aria-label="Toggle navigation" @click="collapsed = !collapsed">
        <Icon name="bars" />
      </button>
      <!-- brand · org switcher (DropdownMenu) · spacer · notifications · Avatar -->
    </header>

    <nav aria-label="Primary" class="flex flex-col gap-0.5 overflow-y-auto border-r border-border bg-card p-2.5">
      <!-- each item: <button :aria-current="active === id ? 'page' : undefined"> <Icon/> label -->
      <div class="mt-auto"><!-- footer items pinned bottom --></div>
    </nav>

    <main class="overflow-y-auto bg-background p-6"><!-- routed content --></main>
  </div>
</template>
```

## Notes

- **No full-page scroll** (Level-2/3 rule). The shell is `h-screen`; the sidebar and content scroll *inside* it, so the top bar and navigation never leave the viewport. Everything is one click — or one keystroke — away.
- **Collapsible.** Toggling the bars button narrows the sidebar to icons (labels `v-show`-hidden, each item gains a `title` for hover identification). On a narrow viewport the same sidebar becomes a slide-in drawer (`-translate-x-full` → `translate-x-0`) over the content — see the input/touch note below for why the toggle target stays ≥44px on touch.
- **Footer items pin to the bottom** via `margin-top: auto` on a trailing group — Documentation, Settings — separated from the primary nav so utility links don't crowd the main destinations.
- **Active + attention.** The current destination carries `aria-current="page"` and the accent background. A count uses a `Badge`; an "attention required" condition uses a non-color cue (a dot *and* its `aria-label`), never color alone — consistent with the [status ladder](/components/status-badge).
- **Keyboard & SR.** The nav is a `<nav aria-label="Primary">` of real `<button>`/`<a>` controls, so Tab order and screen-reader landmarks work for free. The collapse toggle exposes `aria-expanded`.
- **Org switcher** is a [`DropdownMenu`](/components/dropdown-menu); user/notifications compose [`Avatar`](/components/avatar) and `Icon`. The shell itself is layout — see the decision below.

## Decision: pattern now, component later

Per §6.4, the app shell ships **docs-first** — a copy-able layout pattern, not an `<AppShell>` / `<Sidebar>` component. The frame is mostly CSS grid plus existing primitives; there's no repetition yet to justify a versioned component surface (Principle 3). If several product surfaces converge on the same shell with the same props, that's the signal to extract a thin wrapper — and this page is its spec.
