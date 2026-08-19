<!--
  Hallmark · macrostructure: Editorial (portfolio deck) · tone: measured/declarative
  anchor hue: auterion blue (rationed — none on this page; the masthead mark is
  the view's only signal)
  pre-emit critique: P5 H5 E5 S5 R5 V4
-->
<script setup lang="ts">
import { inject } from 'vue';
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
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <WebHero
      eyebrow="Developers"
      title="Build on the open robotics platform."
      subtitle="AuterionOS is open by design. Ship apps to the vehicle, automate the fleet from the cloud, and simulate it all before launch."
      facts="3 LANGUAGES · REST + GRPC · SITL + HITL"
      primary="Read the docs"
      secondary="Get an API key"
      @primary="navigate('company')"
      @secondary="navigate('company')"
    />

    <!-- ╭─ Fleet API ────────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Fleet API</span>
          <span class="dk-bracket">7 LINES · 1 FLEET</span>
        </div>

        <div class="wb-split wb-stack">
          <div>
            <h2 class="dk-h1">A few lines from idea to autonomy.</h2>
            <p class="dk-body-lg wb-measure-text wb-stack">
              The same APIs that power Auterion Suite are yours. Query any vehicle, react to live
              telemetry, and command missions — with SDKs in the languages you already use.
            </p>
            <div class="wb-actions wb-stack">
              <button type="button" class="dk-cta-solid">
                <Icon name="arrow-up-right-from-square" size="xs" /> API reference
              </button>
              <button type="button" class="dk-cta">
                <Icon name="copy" size="xs" /> View on GitHub
              </button>
            </div>
          </div>

          <!-- Code card. Syntax is carried by weight and ink, never by hue:
               a second colour in here would be a third signal. -->
          <div class="dk-card wb-figure">
            <div class="wb-figure-bar">
              <span class="dk-label">fleet_watch.py</span>
              <span class="dk-label wb-push">Python</span>
            </div>
            <pre class="wb-code"><code><template v-for="(l, i) in code" :key="i"><span v-if="l.t === 'comment'" class="wb-code-comment">{{ l.v }}</span><span v-else-if="l.t === 'kw'"><span class="wb-code-kw">{{ l.v }}</span>{{ l.v2 }}</span><span v-else>{{ l.v }}</span>
</template></code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Toolkit ──────────────────────────────────────────────────╮ -->
    <section class="wb-band wb-band-alt">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Toolkit</span>
          <span class="dk-bracket">4 TOOLS</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Everything you need to build.</h2>
        </div>

        <div class="wb-grid" data-cols="4">
          <div v-for="f in features" :key="f.name" class="dk-card dk-lift wb-tile">
            <div class="wb-tile-head">
              <span class="wb-tile-mark"><Icon :name="f.icon" size="xs" /></span>
            </div>
            <h3 class="dk-h2">{{ f.name }}</h3>
            <p class="dk-body">{{ f.blurb }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Documentation ────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Documentation</span>
          <span class="dk-bracket">3 ENTRY POINTS</span>
        </div>

        <div class="wb-grid wb-stack" data-cols="3">
          <a v-for="d in docs" :key="d.t" class="dk-card dk-lift wb-tile" tabindex="0">
            <div class="wb-tile-head">
              <h3 class="dk-h2">{{ d.t }}</h3>
              <Icon name="arrow-up-right-from-square" size="xs" class="wb-tile-go" />
            </div>
            <p class="dk-body">{{ d.s }}</p>
          </a>
        </div>
      </div>
    </section>

    <!-- ╭─ Proof close ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-plate wb-cover">
          <div class="wb-cover-copy">
            <p class="dk-h2 dk-ghost">Start building</p>
            <h2 class="dk-display">Ship your first flight app.</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            Grab an API key, read the quickstart, and have an app on a vehicle in minutes.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid">
              Get an API key <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('company')">Talk to us</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
