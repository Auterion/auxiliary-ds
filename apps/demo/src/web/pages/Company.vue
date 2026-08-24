/* Hallmark · macrostructure: Swiss-Minimal · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { inject } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const stats = [
  { value: '2017', label: 'Founded' },
  { value: '450+', label: 'Team members' },
  { value: '6', label: 'Global offices' },
  { value: '$430M', label: 'Raised' },
];

const values = [
  { name: 'Mission first', blurb: 'We build for the operator in the field, not the demo on the stage.' },
  { name: 'Open by default', blurb: 'Open standards and APIs beat walled gardens — for everyone.' },
  { name: 'Earn trust', blurb: 'Safety, security and reliability are features, never afterthoughts.' },
];

const team = [
  { initials: 'LM', name: 'Lorenz M.', role: 'CEO' },
  { initials: 'KS', name: 'Kevin S.', role: 'CTO' },
  { initials: 'AD', name: 'Aïcha D.', role: 'VP Product' },
  { initials: 'RT', name: 'Ravi T.', role: 'VP Engineering' },
  { initials: 'EN', name: 'Elin N.', role: 'VP Defense' },
  { initials: 'MO', name: 'Marco O.', role: 'VP Operations' },
];

const news = [
  { tag: 'Press', title: 'Auterion partners with allied forces on counter-UAS autonomy', date: 'May 2026' },
  { tag: 'Product', title: 'AuterionOS 4.2 brings on-device tracking to every Skynode', date: 'Apr 2026' },
  { tag: 'Company', title: 'Auterion opens new R&D center in Munich', date: 'Mar 2026' },
];
</script>

<template>
  <div class="overflow-x-clip" style="background: var(--background)">

    <!-- 1. HERO -->
    <WebHero
      eyebrow="Company"
      title="Software for the robotic age."
      subtitle="We're building the open operating system that lets any organization deploy autonomous robots — safely, at scale, anywhere."
      primary="Join us"
      secondary="Our story"
      @primary="navigate('developers')"
      @secondary="navigate('home')"
    />

    <!-- 2. STATS (dark) -->
    <section style="background: #0d1117">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="grid grid-cols-2 gap-10 text-center lg:grid-cols-4">
          <div v-for="s in stats" :key="s.label">
            <p class="text-5xl font-medium tabular-nums tracking-tight" style="color: var(--brand)">{{ s.value }}</p>
            <p class="mt-2 font-mono text-[11px] uppercase tracking-[0.12em]" style="color: #6b7280">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. VALUES -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="mb-10 max-w-xl">
          <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">What we believe</p>
          <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
            Principles that <span style="color: var(--brand)">guide the work.</span>
          </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <div v-for="v in values" :key="v.name" class="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
            <div class="mb-4 border-b-2" style="border-color: var(--brand); width: 2rem" />
            <h3 class="text-[17px] font-medium" style="color: var(--foreground)">{{ v.name }}</h3>
            <p class="mt-2 text-[14px] leading-relaxed text-muted-foreground">{{ v.blurb }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. LEADERSHIP -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Leadership</p>
        <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
          The team behind the stack.
        </h2>

        <div class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          <div v-for="t in team" :key="t.name" class="flex flex-col items-center rounded-xl border border-border bg-card p-5 text-center">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-full font-mono text-[13px] font-medium"
              style="border: 1.5px solid var(--brand); color: var(--brand); background: color-mix(in oklab, var(--brand) 6%, white)"
            >{{ t.initials }}</span>
            <p class="mt-3 text-[14px] font-medium" style="color: var(--foreground)">{{ t.name }}</p>
            <p class="text-[12px] text-muted-foreground">{{ t.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. NEWSROOM -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="mb-10 flex items-end justify-between">
          <div>
            <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Newsroom</p>
            <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
              Latest from Auterion.
            </h2>
          </div>
          <button class="hidden text-[14px] text-muted-foreground hover:text-foreground sm:block">All news</button>
        </div>

        <div class="grid gap-5 md:grid-cols-3">
          <a v-for="n in news" :key="n.title" class="group flex flex-col rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
            <span class="self-start rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{{ n.tag }}</span>
            <h3 class="mt-4 flex-1 text-[16px] font-medium leading-snug" style="color: var(--foreground)">{{ n.title }}</h3>
            <p class="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{{ n.date }}</p>
          </a>
        </div>
      </div>
    </section>

    <!-- 6. CAREERS CTA -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-2xl px-6 py-24 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Careers</p>
        <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
          Come build the future of autonomy.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          We're hiring across engineering, product, defense and operations — worldwide.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="cta-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold"
            style="background: var(--brand); color: var(--brand-foreground)"
          >
            See open roles
            <Icon name="arrow-right" size="xs" />
          </button>
          <Button variant="ghost" size="md" class="gap-2 text-[14px]" @click="navigate('home')">
            Back to home
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
