<script setup lang="ts">
/**
 * GTC token model — a live view of the four tiers and how a value travels.
 *
 * Written in the Deck 07b grammar (`_deck07b.css`), built the Console way via
 * the surface layer `_reference.css`. A token reference IS a table of measured
 * facts, which is what the grammar's ledger devices are for: pointer-labels on
 * fields, a header ledger topping the layout, values hard right in tabular
 * figures, brackets around counts, and spread captions naming each block.
 *
 * One mode attribute, `[data-theme]`, on the same element as `.dk` — so the
 * `--dk-*` palette and the DS semantic tokens re-resolve together and cannot
 * drift. The register and pointer axes stay on the SUBTREE wrapper, not on
 * <html>. That is deliberate: CSS custom properties substitute var() at the
 * element the declaration applies to, and descendants inherit the already
 * substituted value — so a `:root`-only component tier would keep its expressive
 * geometry here and nothing would move. Everything in the specimen changing when
 * you flip a register IS the proof that the register block re-emits the
 * component tokens that depend on it.
 */
import { computed, onMounted, ref, watch } from 'vue';
import dtcg from '@auxiliary/tokens/dist/tokens.json';
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Label,
  StatusBadge,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@auxiliary/vue';
import './_reference.css';

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

/** The three axis-resolved geometry vars the specimen reports on. Named once,
 *  so the reader and the DOM read can never fall out of sync. */
const AXIS_VARS = ['--control-height-md', '--radius-md', '--target-floor'] as const;

const scope = ref<HTMLElement | null>(null);
const resolved = ref<Record<string, string>>({});

function readResolved() {
  const el = scope.value;
  if (!el) return;
  const cs = getComputedStyle(el);
  const next: Record<string, string> = {};
  for (const r of rows.value) next[r.varName] = cs.getPropertyValue(r.varName).trim() || '—';
  for (const v of AXIS_VARS) next[v] = cs.getPropertyValue(v).trim();
  resolved.value = next;
}

onMounted(readResolved);
watch([theme, register, pointer, focus], () => requestAnimationFrame(readResolved));

const TIERS = [
  { key: 'global', blurb: 'Raw values. Aliases nothing. The source of truth.' },
  { key: 'theme', blurb: 'Colour only. Re-resolves on [data-theme]. 4 modes.' },
  { key: 'register', blurb: 'Everything non-colour. Density and motion. 2 modes.' },
  { key: 'component', blurb: 'Per-component structure. Emits var() so it follows the register.' },
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

/* --------------------------------------------------------- measured facts
 * Every bracket on this page is COUNTED from the token tree rather than typed,
 * so it cannot go stale against the tables beneath it. A bracket wraps measured
 * facts only — never an opinion, never a label. */

const totalTokens = computed(() =>
  Object.values(counts.value).reduce((n, v) => n + v, 0),
);

const coverBracket = computed(
  () => `${TIERS.length} tiers · ${totalTokens.value} tokens `
    + `· ${THEMES.length} themes · ${REGISTERS.length} registers`,
);

const axisBracket = computed(
  () => `${THEMES.length} themes · ${REGISTERS.length} registers · ${POINTERS.length} pointer classes`,
);

/** The focused component's position in the sequence of eight — the folio. It is
 *  aria-hidden on the numeral card, so it is also printed in text beside it. */
const folio = computed(() =>
  String(COMPONENTS.indexOf(focus.value) + 1).padStart(2, '0'),
);

const chainBracket = computed(() => {
  const deepest = rows.value.reduce((n, r) => Math.max(n, r.chain.length - 1), 0);
  return `${rows.value.length} tokens · ${deepest} ${deepest === 1 ? 'hop' : 'hops'} to global`;
});
</script>

<template>
  <!-- ONE mode attribute for the whole surface: `.dk` keys its palette off
       [data-theme] exactly as the DS semantic tokens do, so the grammar and
       Button/Badge/Switch can never re-resolve out of step. -->
  <div :data-theme="theme" class="dk rf-page">
    <div class="rf-measure">
      <!-- ════ COVER ════ -->
      <header class="rf-cover">
        <p class="dk-label">Foundations · @auxiliary/tokens</p>
        <h1 class="dk-display">The GTC token model</h1>
        <!-- ghost line: covers and section titles only -->
        <p class="dk-h2 dk-ghost">Global · Theme · Register · Component</p>
        <p class="dk-body-lg rf-lede">
          Four tiers. A value travels only as far as it needs to: raw in
          <code class="rf-code">global</code>, recoloured by
          <code class="rf-code">theme</code>, re-densified by
          <code class="rf-code">register</code>, and shaped per component in
          <code class="rf-code">component</code>.
        </p>
        <p class="rf-cover-facts">
          <span class="dk-bracket">{{ coverBracket }}</span>
        </p>
      </header>

      <!-- ════ HEADER LEDGER — tops the case layout, one per view ════
           The four tiers as fields, counts hard measured. -->
      <div class="dk-ledger rf-ledger-4">
        <div v-for="t in TIERS" :key="t.key" class="dk-ledger-cell">
          <span class="dk-pointer">{{ t.key }}</span>
          <span class="dk-value dk-num">{{ counts[t.key as keyof typeof counts] }} tokens</span>
          <span class="dk-small">{{ t.blurb }}</span>
        </div>
      </div>

      <div class="rf-stack rf-body">
        <!-- ════ AXES ════ -->
        <section class="rf-section">
          <div class="dk-section">
            <span class="dk-label">Axes</span>
            <span class="dk-bracket">{{ axisBracket }}</span>
          </div>
          <div class="rf-fields">
            <div class="rf-field">
              <span class="dk-pointer">data-theme · colour</span>
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
            <div class="rf-field">
              <span class="dk-pointer">data-register · density</span>
              <div class="dk-segment rf-segment-wrap">
                <button
                  v-for="r in REGISTERS"
                  :key="r"
                  type="button"
                  class="dk-segment-btn"
                  :data-active="register === r"
                  :aria-pressed="register === r"
                  @click="register = r"
                >{{ r }}</button>
              </div>
            </div>
            <div class="rf-field">
              <span class="dk-pointer">data-input · touch floor</span>
              <div class="dk-segment rf-segment-wrap">
                <button
                  v-for="p in POINTERS"
                  :key="p"
                  type="button"
                  class="dk-segment-btn"
                  :data-active="pointer === p"
                  :aria-pressed="pointer === p"
                  @click="pointer = p"
                >{{ p }}</button>
              </div>
            </div>
          </div>
        </section>

        <!-- ════ SPECIMEN — the scoped subtree ════
             The DS components inside render exactly as they ship; the frame is
             a hairline and touches nothing within it. -->
        <section class="rf-section">
          <div class="dk-section">
            <span class="dk-label">Scoped subtree</span>
            <span class="dk-micro">[data-theme] · [data-register] · [data-input]</span>
          </div>

          <div
            ref="scope"
            :data-theme="theme"
            :data-register="register"
            :data-input="pointer"
            class="dk-card rf-specimen rf-stack-sm"
          >
            <div class="rf-row">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button variant="secondary">Secondary</Button>
              <Badge>Badge</Badge>
              <StatusBadge level="nominal">Nominal</StatusBadge>
              <StatusBadge level="caution">Caution</StatusBadge>
            </div>

            <div class="rf-row">
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

            <hr class="dk-rule rf-specimen-split">

            <!-- pointer-labelled fields: measured geometry, read live from the
                 DOM at this element -->
            <dl class="rf-fields">
              <div v-for="k in AXIS_VARS" :key="k" class="rf-field">
                <dt class="dk-pointer">{{ k }}</dt>
                <dd class="dk-value dk-num">{{ resolved[k] || '—' }}</dd>
              </div>
            </dl>
          </div>

          <p class="dk-caption">
            Specimen · scoped subtree — the axis attributes are set on this element, not on the document
          </p>
        </section>

        <!-- ════ CHAPTER HEAD + RESOLUTION CHAINS ════
             Exactly one numeral card on this spread. -->
        <section class="rf-section">
          <header class="rf-chapter">
            <div class="dk-numeral rf-folio">
              <span class="dk-numeral-folio" aria-hidden="true">{{ folio }}</span>
            </div>
            <div class="rf-tight">
              <p class="dk-label">Resolution chains · {{ folio }} of {{ COMPONENTS.length }}</p>
              <h2 class="dk-h1">component.{{ focus }}</h2>
              <p class="dk-body rf-lede">
                Every component token is an alias into <code class="rf-code">global</code>, emitted
                as a <code class="rf-code">var()</code> reference rather than a baked literal —
                which is why the values below move when you change the register above.
              </p>
            </div>
            <span class="dk-bracket">{{ chainBracket }}</span>
          </header>

          <div class="dk-segment rf-segment-wrap">
            <button
              v-for="c in COMPONENTS"
              :key="c"
              type="button"
              class="dk-segment-btn"
              :data-active="focus === c"
              :aria-pressed="focus === c"
              @click="focus = c"
            >{{ c }}</button>
          </div>

          <div class="rf-scroll-x">
            <table class="dk-table rf-table-min">
              <colgroup>
                <col class="rf-col-token">
                <col class="rf-col-chain">
                <col class="rf-col-var">
                <col class="rf-col-value">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">Resolves through</th>
                  <th scope="col">CSS variable</th>
                  <th scope="col" data-align="end">Value here</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in rows" :key="r.path">
                  <td class="rf-mono" data-lead="true">{{ r.short }}</td>
                  <td class="rf-mono rf-chain">
                    <span v-for="(hop, i) in r.chain.slice(1)" :key="hop">
                      <span v-if="i > 0" aria-hidden="true"> → </span>{{ hop }}
                    </span>
                  </td>
                  <td class="rf-mono">{{ r.varName }}</td>
                  <td class="dk-num" data-align="end" data-lead="true">
                    {{ resolved[r.varName] || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="dk-caption">
            Reference · component tier — ledger table, resolved values hard right in tabular figures
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
