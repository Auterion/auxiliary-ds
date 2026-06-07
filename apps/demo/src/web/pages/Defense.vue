/* Hallmark · macrostructure: Swiss-Minimal · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { inject } from 'vue';
import WebHero from '../WebHero.vue';
import { Button } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';

const navigate = inject<(p: string) => void>('navigate', () => {});

const trustItems = [
  { label: '30+ allied nations' },
  { label: 'AES-256 encryption' },
  { label: 'NDAA compliant' },
  { label: '0 cloud required' },
];

const capabilities = [
  {
    icon: 'bars' as const,
    title: 'Contested Environments',
    description: 'Full autonomy under GPS denial, jamming, and lost-link conditions. On-board intelligence keeps missions on task when connectivity drops.',
  },
  {
    icon: 'gear' as const,
    title: 'On-device AI',
    description: 'Detection, tracking, and re-identification execute entirely at the edge — no cloud dependency, no round-trip latency, no single point of failure.',
  },
  {
    icon: 'lock' as const,
    title: 'Secure Datalink',
    description: 'AES-256 end-to-end C2 and video. Spectrum-agile mesh with anti-tamper key management and zero-trust node authentication.',
  },
  {
    icon: 'circle-info' as const,
    title: 'Open Architecture',
    description: 'Standards-based interfaces (STANAG 4586, MAVLink) enable fast integration with existing force assets and allied systems.',
  },
] as const;

const nodes = [
  { id: 'hq',    x: 80,  y: 100, label: 'HQ',     primary: true },
  { id: 'gs1',   x: 260, y: 60,  label: 'GCS-1' },
  { id: 'gs2',   x: 260, y: 160, label: 'GCS-2' },
  { id: 'uav1',  x: 420, y: 40,  label: 'UAV-1' },
  { id: 'uav2',  x: 420, y: 110, label: 'UAV-2' },
  { id: 'ugv1',  x: 420, y: 180, label: 'UGV-1' },
];

const edges: [string, string][] = [
  ['hq', 'gs1'],
  ['hq', 'gs2'],
  ['gs1', 'uav1'],
  ['gs1', 'uav2'],
  ['gs2', 'ugv1'],
];

function nodePos(id: string) {
  return nodes.find(n => n.id === id)!;
}
</script>

<template>
  <div class="overflow-x-clip">

    <!-- 1. HERO -->
    <WebHero
      eyebrow="Defense"
      title="Autonomy for allied forces."
      subtitle="NDAA-compliant. On-device AI. Zero cloud dependency."
      primary="Request briefing"
      secondary="View documentation"
      @primary="navigate('company')"
      @secondary="navigate('developers')"
    />

    <!-- 2. TRUST INDICATORS -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-5xl px-6 py-14">
        <ul class="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
          <li
            v-for="item in trustItems"
            :key="item.label"
            class="flex items-center gap-3 text-[14px] font-medium"
            style="color: var(--foreground)"
          >
            <Icon name="circle-check" size="sm" style="color: var(--brand); flex-shrink: 0" />
            {{ item.label }}
          </li>
        </ul>
      </div>
    </section>

    <!-- 3. CAPABILITIES -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-5xl px-6 py-20">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Capabilities</p>
        <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
          Built for the <span style="color: var(--brand)">mission.</span>
        </h2>
        <p class="mt-4 max-w-xl text-[15px] leading-relaxed" style="color: var(--muted-foreground)">
          Four core capabilities that make Auterion the platform of choice for autonomous defense operations.
        </p>

        <div class="mt-10 grid gap-5 sm:grid-cols-2">
          <div
            v-for="cap in capabilities"
            :key="cap.title"
            class="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div
              class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
              style="background: color-mix(in oklch, var(--brand) 8%, transparent)"
            >
              <Icon :name="cap.icon" size="sm" style="color: var(--brand)" />
            </div>
            <div class="mb-px border-b-2" style="border-color: var(--brand); width: 2rem; margin-bottom: 0.75rem" />
            <h3 class="text-[16px] font-medium" style="color: var(--foreground)">{{ cap.title }}</h3>
            <p class="mt-2 text-[14px] leading-relaxed" style="color: var(--muted-foreground)">{{ cap.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. DEPLOYMENT DIAGRAM -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-5xl px-6 py-20">
        <div class="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Architecture</p>
            <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
              Connected from HQ<br>to the <span style="color: var(--brand)">last node.</span>
            </h2>
            <p class="mt-4 text-[15px] leading-relaxed" style="color: var(--muted-foreground)">
              A unified command architecture linking headquarters, ground control stations, and autonomous vehicles — all encrypted, all sovereign.
            </p>
          </div>

          <!-- Network diagram SVG -->
          <div class="rounded-xl border border-border bg-card p-6">
            <svg viewBox="0 0 500 230" class="w-full" role="img" aria-label="Deployment network: HQ to vehicles via ground control stations">

              <!-- Connecting edges -->
              <g v-for="[a, b] in edges" :key="`${a}-${b}`">
                <line
                  :x1="nodePos(a).x" :y1="nodePos(a).y"
                  :x2="nodePos(b).x" :y2="nodePos(b).y"
                  stroke-width="1.5"
                  style="stroke: var(--brand)"
                  opacity="0.35"
                  stroke-dasharray="4 3"
                />
              </g>

              <!-- Nodes -->
              <g v-for="n in nodes" :key="n.id">
                <!-- Outer ring for primary node -->
                <circle
                  v-if="n.primary"
                  :cx="n.x" :cy="n.y" r="22"
                  fill="none"
                  style="stroke: var(--brand)"
                  stroke-width="1"
                  opacity="0.2"
                />
                <!-- Node circle -->
                <circle
                  :cx="n.x" :cy="n.y"
                  :r="n.primary ? 16 : 11"
                  :style="n.primary
                    ? 'fill: var(--brand)'
                    : 'fill: var(--card); stroke: var(--brand); stroke-width: 1.5'"
                  :opacity="n.primary ? '1' : '0.85'"
                />
                <!-- Label -->
                <text
                  :x="n.x"
                  :y="n.primary ? n.y + 38 : n.y + 26"
                  text-anchor="middle"
                  font-family="ui-monospace, monospace"
                  font-size="9"
                  :style="n.primary ? 'fill: var(--brand)' : 'fill: var(--muted-foreground)'"
                  font-weight="600"
                  letter-spacing="0.05em"
                >{{ n.label }}</text>
                <!-- Icon text for primary -->
                <text
                  v-if="n.primary"
                  :x="n.x" :y="n.y + 4"
                  text-anchor="middle"
                  font-family="ui-monospace, monospace"
                  font-size="9"
                  fill="white"
                  font-weight="700"
                >HQ</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. STATS DARK SECTION -->
    <section style="background: #0d1117">
      <div class="mx-auto max-w-5xl px-6 py-20">
        <div class="grid grid-cols-3 gap-10 text-center">
          <div>
            <p class="text-5xl font-medium tabular-nums tracking-tight" style="color: var(--brand)">30+</p>
            <p class="mt-2 font-mono text-[11px] uppercase tracking-[0.12em]" style="color: #6b7280">Allied nations</p>
          </div>
          <div>
            <p class="text-5xl font-medium tabular-nums tracking-tight" style="color: #e5e7eb">AES-256</p>
            <p class="mt-2 font-mono text-[11px] uppercase tracking-[0.12em]" style="color: #6b7280">Encryption standard</p>
          </div>
          <div>
            <p class="text-5xl font-medium tabular-nums tracking-tight" style="color: #e5e7eb">0</p>
            <p class="mt-2 font-mono text-[11px] uppercase tracking-[0.12em]" style="color: #6b7280">Cloud required</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. CTA -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-5xl px-6 py-24 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Get started</p>
        <h2 class="mt-4 text-4xl font-medium" style="color: var(--foreground)">
          Ready to deploy?
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[15px] leading-relaxed" style="color: var(--muted-foreground)">
          Defense programs are invite-only. Contact our team to discuss requirements and your operational environment.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" @click="navigate('company')">Request briefing</Button>
          <Button size="lg" variant="ghost" @click="navigate('developers')">View documentation</Button>
        </div>
      </div>
    </section>

  </div>
</template>
