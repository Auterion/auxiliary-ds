<script setup lang="ts">
/**
 * GTC token model — a live view of the four tiers and how a value travels.
 *
 * The theme/register/input attributes are set on a SUBTREE wrapper, not on
 * <html>. That is deliberate: CSS custom properties substitute var() at the
 * element the declaration applies to, and descendants inherit the already
 * substituted value — so a `:root`-only component tier would keep its expressive
 * geometry here and nothing would move. Everything below changing when you flip
 * a register IS the proof that the register block re-emits the component tokens
 * that depend on it.
 */
import { computed, onMounted, ref, watch } from 'vue';
import dtcg from '@auxiliary/tokens/dist/tokens.json';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  StatusBadge,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@auxiliary/vue';

type Theme = 'light' | 'dark' | 'sunlight' | 'darknight';
type Register = 'expressive' | 'operational';
type Pointer = 'fine' | 'coarse';

const theme = ref<Theme>('dark');
const register = ref<Register>('expressive');
const pointer = ref<Pointer>('fine');

const THEMES: Theme[] = ['light', 'dark', 'sunlight', 'darknight'];
const REGISTERS: Register[] = ['expressive', 'operational'];
const POINTERS: Pointer[] = ['fine', 'coarse'];

/* ---------------------------------------------------------------- token tree */

type Node = { $type?: string; $value?: unknown } & Record<string, unknown>;
const tree = dtcg as unknown as Record<string, Node>;

const at = (path: string): Node | undefined => {
  let node: unknown = tree;
  for (const key of path.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = (node as Record<string, unknown>)[key];
  }
  return node as Node | undefined;
};

const aliasOf = (node: Node | undefined): string | null => {
  const v = node?.$value;
  return typeof v === 'string' && v.startsWith('{') && v.endsWith('}') ? v.slice(1, -1) : null;
};

/** Follow a token's alias chain to the raw global rung. */
function chainOf(path: string): string[] {
  const out = [path];
  let cursor = path;
  for (let hops = 0; hops < 8; hops++) {
    const next = aliasOf(at(cursor));
    if (!next) break;
    out.push(next);
    cursor = next;
  }
  return out;
}

/** `component.button.padding-x.md` → `--component-button-padding-x-md` */
function cssVar(path: string): string {
  const seg = path.split('.');
  const stripped =
    seg[0] === 'global' || seg[0] === 'component'
      ? seg[0] === 'component'
        ? seg
        : seg.slice(1)
      : seg.slice(2);
  return '--' + stripped.join('-').replace(/_/g, '.');
}

/* ------------------------------------------------------- what we put on show */

const COMPONENTS = [
  'button',
  'badge',
  'input',
  'checkbox',
  'switch',
  'tabs',
  'card',
  'status-badge',
] as const;
const focus = ref<(typeof COMPONENTS)[number]>('button');

/** Every leaf under `component.<name>`, flattened to dotted paths. */
const leavesOf = (name: string): string[] => {
  const root = at(`component.${name}`);
  const out: string[] = [];
  const walk = (node: unknown, prefix: string) => {
    if (node === null || typeof node !== 'object') return;
    if ('$value' in (node as Node)) {
      out.push(prefix);
      return;
    }
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (k.startsWith('$')) continue;
      walk(v, `${prefix}.${k}`);
    }
  };
  walk(root, `component.${name}`);
  return out.sort();
};

const rows = computed(() =>
  leavesOf(focus.value).map((path) => ({
    path,
    short: path.replace(`component.${focus.value}.`, ''),
    chain: chainOf(path),
    varName: cssVar(path),
  })),
);

/* ------------------------------------------------ live resolution from the DOM */

const scope = ref<HTMLElement | null>(null);
const resolved = ref<Record<string, string>>({});

function readResolved() {
  const el = scope.value;
  if (!el) return;
  const cs = getComputedStyle(el);
  const next: Record<string, string> = {};
  for (const r of rows.value) next[r.varName] = cs.getPropertyValue(r.varName).trim() || '—';
  next['--control-height-md'] = cs.getPropertyValue('--control-height-md').trim();
  next['--radius-md'] = cs.getPropertyValue('--radius-md').trim();
  next['--target-floor'] = cs.getPropertyValue('--target-floor').trim();
  resolved.value = next;
}

onMounted(readResolved);
watch([theme, register, pointer, focus], () => requestAnimationFrame(readResolved));

const TIERS = [
  { key: 'global', blurb: 'Raw values. Aliases nothing. The source of truth.', tone: 'text-foreground' },
  { key: 'theme', blurb: 'Colour only. Re-resolves on [data-theme]. 4 modes.', tone: 'text-foreground' },
  { key: 'register', blurb: 'Everything non-colour. Density and motion. 2 modes.', tone: 'text-foreground' },
  { key: 'component', blurb: 'Per-component structure. Emits var() so it follows the register.', tone: 'text-foreground' },
];

const counts = computed(() => {
  const count = (node: unknown): number => {
    if (node === null || typeof node !== 'object') return 0;
    if ('$value' in (node as Node)) return 1;
    return Object.entries(node as Record<string, unknown>)
      .filter(([k]) => !k.startsWith('$'))
      .reduce((n, [, v]) => n + count(v), 0);
  };
  return {
    global: count(tree.global),
    theme: count(tree.theme),
    register: count(tree.register),
    component: count(tree.component),
  };
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground" data-theme="dark">
    <div class="mx-auto max-w-6xl px-8 py-14">
      <header class="mb-12">
        <p class="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Foundations</p>
        <h1 class="text-4xl font-medium tracking-tight">The GTC token model</h1>
        <p class="mt-3 max-w-2xl text-base text-muted-foreground">
          Four tiers. A value travels only as far as it needs to: raw in
          <code class="text-foreground">global</code>, recoloured by
          <code class="text-foreground">theme</code>, re-densified by
          <code class="text-foreground">register</code>, and shaped per component in
          <code class="text-foreground">component</code>.
        </p>
      </header>

      <!-- tiers -->
      <section class="mb-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="t in TIERS" :key="t.key">
          <CardHeader>
            <CardTitle class="font-mono text-sm">{{ t.key }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ t.blurb }}</p>
            <p class="mt-3 text-2xl tabular-nums">
              {{ counts[t.key as keyof typeof counts] }}
              <span class="text-sm text-muted-foreground">tokens</span>
            </p>
          </CardContent>
        </Card>
      </section>

      <!-- axis controls -->
      <section class="mb-8 flex flex-wrap items-end gap-8">
        <div>
          <Label class="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
            data-theme · colour
          </Label>
          <div class="flex gap-1">
            <Button
              v-for="t in THEMES"
              :key="t"
              size="sm"
              :variant="theme === t ? 'primary' : 'secondary'"
              @click="theme = t"
            >
              {{ t }}
            </Button>
          </div>
        </div>
        <div>
          <Label class="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
            data-register · density
          </Label>
          <div class="flex gap-1">
            <Button
              v-for="r in REGISTERS"
              :key="r"
              size="sm"
              :variant="register === r ? 'primary' : 'secondary'"
              @click="register = r"
            >
              {{ r }}
            </Button>
          </div>
        </div>
        <div>
          <Label class="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
            data-input · touch floor
          </Label>
          <div class="flex gap-1">
            <Button
              v-for="p in POINTERS"
              :key="p"
              size="sm"
              :variant="pointer === p ? 'primary' : 'secondary'"
              @click="pointer = p"
            >
              {{ p }}
            </Button>
          </div>
        </div>
      </section>

      <!-- the scoped subtree -->
      <div
        ref="scope"
        :data-theme="theme"
        :data-register="register"
        :data-input="pointer"
        class="rounded-lg border border-border bg-background p-8 text-foreground"
      >
        <p class="mb-6 text-xs uppercase tracking-wide text-muted-foreground">
          Scoped subtree — attributes are set here, not on the document
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button variant="secondary">Secondary</Button>
          <Badge>Badge</Badge>
          <StatusBadge level="nominal">Nominal</StatusBadge>
          <StatusBadge level="caution">Caution</StatusBadge>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-6">
          <div class="w-56"><Input placeholder="Callsign" /></div>
          <div class="flex items-center gap-2"><Checkbox id="c1" /><Label for="c1">Armed</Label></div>
          <div class="flex items-center gap-2"><Switch id="s1" /><Label for="s1">Telemetry</Label></div>
          <Tabs default-value="a">
            <TabsList>
              <TabsTrigger value="a">Map</TabsTrigger>
              <TabsTrigger value="b">Video</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <dl class="mt-8 grid grid-cols-2 gap-x-8 gap-y-2 border-t border-border pt-6 text-sm sm:grid-cols-3">
          <div v-for="k in ['--control-height-md', '--radius-md', '--target-floor']" :key="k" class="contents">
            <dt class="font-mono text-xs text-muted-foreground">{{ k }}</dt>
            <dd class="tabular-nums">{{ resolved[k] || '—' }}</dd>
          </div>
        </dl>
      </div>

      <!-- resolution chains -->
      <section class="mt-14">
        <h2 class="text-xl font-medium tracking-tight">Resolution chains</h2>
        <p class="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every component token is an alias into <code class="text-foreground">global</code>, emitted
          as a <code class="text-foreground">var()</code> reference rather than a baked literal — which
          is why the values below move when you change the register above.
        </p>

        <div class="mt-5 flex flex-wrap gap-1">
          <Button
            v-for="c in COMPONENTS"
            :key="c"
            size="sm"
            :variant="focus === c ? 'primary' : 'secondary'"
            @click="focus = c"
          >
            {{ c }}
          </Button>
        </div>

        <div class="mt-6 overflow-x-auto">
          <table class="w-full min-w-[46rem] border-collapse text-sm">
            <thead>
              <tr class="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th class="py-2 pr-4 font-medium">Token</th>
                <th class="py-2 pr-4 font-medium">Resolves through</th>
                <th class="py-2 pr-4 font-medium">CSS variable</th>
                <th class="py-2 font-medium text-right">Value here</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rows" :key="r.path" class="border-b border-border/50">
                <td class="py-2 pr-4 font-mono text-xs">{{ r.short }}</td>
                <td class="py-2 pr-4 font-mono text-xs text-muted-foreground">
                  <span v-for="(hop, i) in r.chain.slice(1)" :key="hop">
                    <span v-if="i > 0" aria-hidden="true"> → </span>{{ hop }}
                  </span>
                </td>
                <td class="py-2 pr-4 font-mono text-xs text-muted-foreground">{{ r.varName }}</td>
                <td class="py-2 text-right tabular-nums">{{ resolved[r.varName] || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
