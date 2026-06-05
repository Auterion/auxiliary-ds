<script setup lang="ts">
import { Button, Badge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const features = [
  { icon: 'gear', name: 'Auterion SDK', blurb: 'Write apps that run on-vehicle in C++, Python or Rust against a stable API.' },
  { icon: 'bars', name: 'REST & gRPC API', blurb: 'Programmatic access to fleets, missions, telemetry and media from the cloud.' },
  { icon: 'drone', name: 'Simulation', blurb: 'Hardware-in-the-loop and SITL to test missions before they ever fly.' },
  { icon: 'house', name: 'App marketplace', blurb: 'Publish and distribute payload apps to every AuterionOS device.' },
] as const;
const code = [
  { t: 'comment', v: '# Stream telemetry from every vehicle in the fleet' },
  { t: 'plain', v: 'from auterion import Suite' },
  { t: 'blank', v: '' },
  { t: 'plain', v: 'suite = Suite(token=AUTERION_API_KEY)' },
  { t: 'kw', v: 'async for', v2: ' frame in suite.fleet.telemetry():' },
  { t: 'indent', v: '    if frame.battery < 0.2:' },
  { t: 'indent2', v: '        await frame.vehicle.return_to_launch()' },
];
</script>

<template>
  <div>
    <WebHero
      eyebrow="Developers"
      title="Build on the open robotics platform"
      subtitle="AuterionOS is open by design. Ship apps to the vehicle, automate the fleet from the cloud, and simulate it all before launch."
      primary="Read the docs"
      secondary="Get an API key"
    />

    <!-- code section -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge variant="secondary" size="sm">Fleet API</Badge>
          <h2 class="mt-3 text-3xl font-semibold tracking-tight">A few lines from idea to autonomy</h2>
          <p class="mt-4 text-[16px] leading-relaxed text-muted-foreground">
            The same APIs that power Auterion Suite are yours. Query any vehicle, react to live
            telemetry, and command missions — with SDKs in the languages you already use.
          </p>
          <div class="mt-6 flex gap-3">
            <Button variant="secondary" size="md" class="gap-2"><Icon name="arrow-up-right-from-square" size="xs" /> API reference</Button>
            <Button variant="ghost" size="md" class="gap-2"><Icon name="copy" size="xs" /> View on GitHub</Button>
          </div>
        </div>
        <div class="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span class="flex gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-border" /><span class="h-2.5 w-2.5 rounded-full bg-border" /><span class="h-2.5 w-2.5 rounded-full bg-border" /></span>
            <span class="ml-2 font-mono text-[12px] text-muted-foreground">fleet_watch.py</span>
            <Badge variant="outline" size="sm" class="ml-auto">Python</Badge>
          </div>
          <pre class="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-6"><code><template v-for="(l, i) in code" :key="i"><span v-if="l.t === 'comment'" class="text-muted-foreground">{{ l.v }}</span><span v-else-if="l.t === 'kw'"><span style="color: var(--advisory)">{{ l.v }}</span><span>{{ l.v2 }}</span></span><span v-else :class="l.t.startsWith('indent') ? '' : ''">{{ l.v }}</span>
</template></code></pre>
        </div>
      </div>
    </section>

    <!-- feature grid -->
    <section class="border-y border-border/60 bg-card/40">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <h2 class="text-3xl font-semibold tracking-tight lg:text-4xl">Everything you need to build</h2>
        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="f in features" :key="f.name" class="rounded-2xl border border-border bg-card p-5">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary"><Icon :name="f.icon" size="sm" /></div>
            <h3 class="mt-4 text-[15px] font-semibold">{{ f.name }}</h3>
            <p class="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{{ f.blurb }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- docs links -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-4 sm:grid-cols-3">
        <a
v-for="d in [
          { t: 'Quickstart', s: 'From zero to first flight app in 10 minutes.' },
          { t: 'Guides', s: 'Missions, payloads, telemetry and OTA updates.' },
          { t: 'Reference', s: 'Full SDK, REST and gRPC documentation.' },
        ]" :key="d.t" class="group flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-secondary/40">
          <div>
            <p class="text-[15px] font-semibold">{{ d.t }}</p>
            <p class="mt-1 text-[13px] text-muted-foreground">{{ d.s }}</p>
          </div>
          <Icon name="arrow-up-right-from-square" size="sm" class="text-muted-foreground transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  </div>
</template>
