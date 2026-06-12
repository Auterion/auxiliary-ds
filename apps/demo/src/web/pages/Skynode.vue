/* Hallmark · macrostructure: Swiss-Minimal · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { inject } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const specs: { label: string; value: string; unit?: string }[] = [
  { label: 'Compute', value: '275', unit: 'TOPS AI' },
  { label: 'Mass', value: '199', unit: 'grams' },
  { label: 'Power draw', value: '<15', unit: 'watts' },
  { label: 'Connectivity', value: '4G / 5G', unit: '+ mesh' },
];

const capabilities: { name: string; icon: IconName; desc: string }[] = [
  {
    name: 'Mission computer + autopilot',
    icon: 'gear',
    desc: 'A flight controller and a Linux mission computer on one module — no separate companion board, no integration tax.',
  },
  {
    name: 'On-board AI acceleration',
    icon: 'drone',
    desc: 'Run detection, tracking and obstacle avoidance at the edge. Inference stays on the vehicle when the link drops.',
  },
  {
    name: 'Secure by design',
    icon: 'lock',
    desc: 'Secure boot, encrypted storage and signed over-the-air updates. NDAA-compliant, built for contested environments.',
  },
  {
    name: 'Always connected',
    icon: 'bars',
    desc: 'Integrated 4G/5G and mesh radios keep telemetry and video flowing — with automatic failover between links.',
  },
];

const variants: { name: string; tag: string; blurb: string; specs: string[]; featured?: boolean }[] = [
  {
    name: 'Skynode S',
    tag: 'Compact',
    blurb: 'The smallest full-stack module. For sub-2 kg airframes and tight payload budgets.',
    specs: ['140 g', '100 TOPS', '4G + mesh', 'IP54'],
  },
  {
    name: 'Skynode',
    tag: 'Flagship',
    featured: true,
    blurb: 'The field-proven standard. Powers thousands of vehicles across defense and enterprise.',
    specs: ['199 g', '275 TOPS', '5G + mesh', 'IP67'],
  },
  {
    name: 'Skynode X',
    tag: 'Heavy compute',
    blurb: 'Maximum AI throughput for multi-sensor autonomy and on-board fusion.',
    specs: ['320 g', '500 TOPS', '5G + mesh', 'IP67'],
  },
];

const compliance = ['NDAA Section 848', 'Blue UAS framework', 'AES-256 storage', 'Secure boot', 'MAVLink-native'];
</script>

<template>
  <div class="overflow-x-clip" style="background: var(--background)">

    <!-- 1. HERO -->
    <WebHero
      eyebrow="Skynode"
      title="The brain that runs the stack."
      subtitle="Flight control, mission compute, AI acceleration and connectivity — in a single 199-gram module. The hardware foundation behind every Auterion vehicle."
      primary="Request a unit"
      secondary="Read the datasheet"
      @primary="navigate('company')"
      @secondary="navigate('developers')"
    />

    <!-- 2. SPEC STRIP -->
    <section class="border-b border-border" style="background: var(--card)">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4" style="background: var(--border)">
        <div
          v-for="s in specs"
          :key="s.label"
          class="px-6 py-8"
          style="background: var(--card)"
        >
          <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{{ s.label }}</p>
          <p class="mt-3 text-5xl font-medium tabular-nums tracking-tight" style="color: var(--foreground)">
            {{ s.value }}
          </p>
          <p v-if="s.unit" class="mt-1 font-mono text-[11px] uppercase tracking-[0.1em]" style="color: var(--brand)">
            {{ s.unit }}
          </p>
        </div>
      </div>
    </section>

    <!-- 3. CAPABILITIES -->
    <section class="mx-auto max-w-6xl px-6 py-24">
      <div class="mb-12 max-w-2xl">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">What's inside</p>
        <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
          One module. <span style="color: var(--brand)">The whole vehicle.</span>
        </h2>
        <p class="mt-4 text-[17px] leading-relaxed text-muted-foreground">
          Everything that used to take a rack of boards and weeks of integration now fits in the palm of your hand.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div
          v-for="c in capabilities"
          :key="c.name"
          class="group rounded-xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
        >
          <div
            class="mb-5 flex h-11 w-11 items-center justify-center rounded-lg"
            style="background: color-mix(in oklab, var(--brand) 12%, var(--card))"
          >
            <Icon :name="c.icon" size="sm" style="color: var(--brand)" />
          </div>
          <h3 class="text-[18px] font-medium" style="color: var(--foreground)">{{ c.name }}</h3>
          <p class="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{{ c.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 4. VARIANTS -->
    <section class="border-t border-border" style="background: var(--card)">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <div class="mb-12">
          <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">The family</p>
          <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
            Pick the module that fits your airframe.
          </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <div
            v-for="v in variants"
            :key="v.name"
            class="relative rounded-xl border p-7 transition-shadow hover:shadow-md"
            :style="v.featured
              ? 'background: var(--background); border-color: var(--brand); box-shadow: 0 0 0 1px var(--brand)'
              : 'background: var(--background); border-color: var(--border)'"
          >
            <span
              v-if="v.featured"
              class="absolute right-5 top-5 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em]"
              style="background: var(--brand); color: var(--brand-foreground)"
            >Most deployed</span>

            <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{{ v.tag }}</p>
            <h3 class="mt-2 text-2xl font-medium" style="color: var(--foreground)">{{ v.name }}</h3>
            <p class="mt-3 text-[14px] leading-relaxed text-muted-foreground">{{ v.blurb }}</p>

            <ul class="mt-6 space-y-2.5 border-t border-border pt-5">
              <li
                v-for="sp in v.specs"
                :key="sp"
                class="flex items-center gap-2.5 font-mono text-[12px] tabular-nums"
                style="color: var(--foreground)"
              >
                <Icon name="circle-check" size="xs" style="color: var(--brand); flex-shrink: 0" />
                {{ sp }}
              </li>
            </ul>

            <Button
              :variant="v.featured ? 'primary' : 'ghost'"
              size="sm"
              class="mt-7 w-full gap-2 text-[13px]"
              @click="navigate('company')"
            >
              Configure <Icon name="arrow-right" size="xs" />
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. COMPLIANCE STRIP -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-4 px-6 py-10">
        <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Trusted &amp; compliant</span>
        <span
          v-for="c in compliance"
          :key="c"
          class="flex items-center gap-2 font-mono text-[12px]"
          style="color: var(--foreground)"
        >
          <Icon name="lock" size="xs" style="color: var(--brand)" />
          {{ c }}
        </span>
      </div>
    </section>

    <!-- 6. CTA -->
    <section class="border-t border-border" style="background: var(--card)">
      <div class="mx-auto max-w-2xl px-6 py-24 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Get started</p>
        <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
          Build your vehicle on Skynode.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          Tell us about your airframe and mission. We'll help you spec the right module and get you flying.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="cta-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-medium"
            style="background: var(--brand); color: var(--brand-foreground)"
            @click="navigate('company')"
          >
            Request a unit
            <Icon name="arrow-right" size="xs" />
          </button>
          <Button variant="ghost" size="md" class="gap-2 text-[14px]" @click="navigate('developers')">
            Read the docs
          </Button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.cta-btn:hover {
  background: color-mix(in oklab, var(--brand) 88%, black) !important;
}

.cta-btn:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
</style>
