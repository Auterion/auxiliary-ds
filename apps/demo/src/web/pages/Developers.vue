/* Hallmark · macrostructure: Swiss-Minimal · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { inject } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const features: { name: string; icon: IconName; blurb: string }[] = [
  { name: 'Auterion SDK', icon: 'gear', blurb: 'Write apps that run on-vehicle in C++, Python or Rust against a stable API.' },
  { name: 'REST & gRPC API', icon: 'bars', blurb: 'Programmatic access to fleets, missions, telemetry and media from the cloud.' },
  { name: 'Simulation', icon: 'drone', blurb: 'Hardware-in-the-loop and SITL to test missions before they ever fly.' },
  { name: 'App marketplace', icon: 'house', blurb: 'Publish and distribute payload apps to every AuterionOS device.' },
];

const code: { t: string; v: string; v2?: string }[] = [
  { t: 'comment', v: '# Stream telemetry from every vehicle in the fleet' },
  { t: 'plain', v: 'from auterion import Suite' },
  { t: 'blank', v: '' },
  { t: 'plain', v: 'suite = Suite(token=AUTERION_API_KEY)' },
  { t: 'kw', v: 'async for', v2: ' frame in suite.fleet.telemetry():' },
  { t: 'indent', v: '    if frame.battery < 0.2:' },
  { t: 'indent2', v: '        await frame.vehicle.return_to_launch()' },
];

const docs = [
  { t: 'Quickstart', s: 'From zero to first flight app in 10 minutes.' },
  { t: 'Guides', s: 'Missions, payloads, telemetry and OTA updates.' },
  { t: 'Reference', s: 'Full SDK, REST and gRPC documentation.' },
];
</script>

<template>
  <div class="overflow-x-clip" style="background: var(--background)">

    <!-- 1. HERO -->
    <WebHero
      eyebrow="Developers"
      title="Build on the open robotics platform."
      subtitle="AuterionOS is open by design. Ship apps to the vehicle, automate the fleet from the cloud, and simulate it all before launch."
      primary="Read the docs"
      secondary="Get an API key"
      @primary="navigate('company')"
      @secondary="navigate('company')"
    />

    <!-- 2. CODE -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Fleet API</p>
            <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]" style="color: var(--foreground)">
              A few lines from <span style="color: var(--brand)">idea to autonomy.</span>
            </h2>
            <p class="mt-4 text-[16px] leading-relaxed text-muted-foreground">
              The same APIs that power Auterion Suite are yours. Query any vehicle, react to live
              telemetry, and command missions — with SDKs in the languages you already use.
            </p>
            <div class="mt-7 flex flex-wrap gap-3">
              <button
                class="cta-btn inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold"
                style="background: var(--brand); color: var(--brand-foreground)"
              >
                <Icon name="arrow-up-right-from-square" size="xs" /> API reference
              </button>
              <Button variant="ghost" size="md" class="gap-2 text-[13px]">
                <Icon name="copy" size="xs" /> View on GitHub
              </Button>
            </div>
          </div>

          <!-- code card -->
          <div class="overflow-hidden rounded-xl border border-border bg-card">
            <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span class="flex gap-1.5">
                <span class="h-2.5 w-2.5 rounded-full" style="background: var(--border)" />
                <span class="h-2.5 w-2.5 rounded-full" style="background: var(--border)" />
                <span class="h-2.5 w-2.5 rounded-full" style="background: var(--border)" />
              </span>
              <span class="ml-2 font-mono text-[12px] text-muted-foreground">fleet_watch.py</span>
              <span class="ml-auto rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Python</span>
            </div>
            <pre class="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-6"><code><template v-for="(l, i) in code" :key="i"><span v-if="l.t === 'comment'" class="text-muted-foreground">{{ l.v }}</span><span v-else-if="l.t === 'kw'"><span style="color: var(--brand)">{{ l.v }}</span><span style="color: var(--foreground)">{{ l.v2 }}</span></span><span v-else style="color: var(--foreground)">{{ l.v }}</span>
</template></code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. FEATURE GRID -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="mb-10 max-w-xl">
          <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Toolkit</p>
          <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]" style="color: var(--foreground)">
            Everything you need <span style="color: var(--brand)">to build.</span>
          </h2>
        </div>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="f in features" :key="f.name" class="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
            <div
              class="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
              style="background: color-mix(in oklab, var(--brand) 8%, white)"
            >
              <Icon :name="f.icon" size="sm" style="color: var(--brand)" />
            </div>
            <h3 class="text-[15px] font-semibold tracking-[-0.01em]" style="color: var(--foreground)">{{ f.name }}</h3>
            <p class="mt-2 text-[13px] leading-relaxed text-muted-foreground">{{ f.blurb }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. DOCS LINKS -->
    <section class="border-b border-border" style="background: var(--background)">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="grid gap-5 sm:grid-cols-3">
          <a
            v-for="d in docs"
            :key="d.t"
            class="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div>
              <p class="text-[15px] font-semibold tracking-[-0.01em]" style="color: var(--foreground)">{{ d.t }}</p>
              <p class="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{{ d.s }}</p>
            </div>
            <Icon
              name="arrow-up-right-from-square"
              size="sm"
              class="transition-transform group-hover:-translate-y-0.5"
              style="color: var(--brand)"
            />
          </a>
        </div>
      </div>
    </section>

    <!-- 5. CTA -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-2xl px-6 py-24 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Start building</p>
        <h2 class="mt-3 text-4xl font-semibold tracking-[-0.02em] leading-[1.15]" style="color: var(--foreground)">
          Ship your first flight app.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          Grab an API key, read the quickstart, and have an app on a vehicle in minutes.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="cta-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-semibold"
            style="background: var(--brand); color: var(--brand-foreground)"
          >
            Get an API key
            <Icon name="arrow-right" size="xs" />
          </button>
          <Button variant="ghost" size="md" class="gap-2 text-[14px]" @click="navigate('company')">
            Talk to us
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
