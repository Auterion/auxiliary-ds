<script setup lang="ts">
import { setThemeAttribute } from '@auxiliary/css/utils';
/**
 * Visual-regression harness — the thing Playwright screenshots.
 *
 * WHY THIS EXISTS RATHER THAN SCREENSHOTTING THE COMPONENT DOC PAGES
 * ------------------------------------------------------------------
 * A doc page mixes prose with live components. Screenshotting one means every
 * paragraph edit reflows the capture and produces a diff that says "changed"
 * without anything having changed — a gate that cries wolf gets muted, and a
 * muted gate is worse than none. This page carries no prose: each specimen is
 * an isolated, fixed-width block that Playwright captures by locator, so a
 * diff is always about the component.
 *
 * DETERMINISM — every source of frame-to-frame variance is pinned:
 *   - the alert model gets a frozen clock (`now`), so `raisedAt` ordering and
 *     any escalation timing are identical on every run;
 *   - the block below kills transitions/animations, so a capture can never
 *     land mid-tween;
 *   - no random values, no `Date`, no live telemetry.
 * Font loading is the remaining race and is handled on the Playwright side
 * (`document.fonts.ready`) because it is a page-level concern, not a component one.
 *
 * Theme and register come from the query string (`?theme=darknight&register=operational`)
 * rather than from clicks: the matrix is driven by the spec file, and a URL is
 * the cheapest way to make each cell independently addressable and re-openable
 * by hand when a diff needs explaining.
 */
import { computed, effectScope, onMounted, onUnmounted, ref, shallowRef } from 'vue';
import {
  AlertAnnunciator,
  AlertBanner,
  GuardedAction,
  Register,
  StatusBadge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TelemetryValue,
  useAlertModel,
  type AlertModel,
} from '@auxiliary/vue';

const THEMES = ['light', 'dark', 'sunlight', 'darknight'] as const;
const REGISTERS = ['expressive', 'operational'] as const;
type Theme = (typeof THEMES)[number];
type RegisterValue = (typeof REGISTERS)[number];

/** The reserved severity ladder, in severity order — every specimen walks it. */
const LEVELS = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;

const theme = ref<Theme>('light');
const register = ref<RegisterValue>('expressive');
const ready = ref(false);

/**
 * Frozen clock. A real `Date.now()` would put a different `raisedAt` on every
 * run; ordering is stable regardless, but escalation windows are not.
 */
const FIXED_NOW = 1_767_225_600_000; // 2026-01-01T00:00:00Z
const scope = effectScope();
const alerts = shallowRef<AlertModel | null>(null);

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const t = params.get('theme');
  const r = params.get('register');
  if (t && (THEMES as readonly string[]).includes(t)) theme.value = t as Theme;
  if (r && (REGISTERS as readonly string[]).includes(r)) register.value = r as RegisterValue;

  setThemeAttribute('data-theme', theme.value);
  // VitePress's own chrome keys off `.dark`; keep it consistent so the page
  // background behind the specimens matches the token background.
  document.documentElement.classList.toggle(
    'dark',
    theme.value === 'dark' || theme.value === 'darknight',
  );

  const model = scope.run(() => useAlertModel({ now: () => FIXED_NOW }))!;
  model.raise({
    id: 'battery',
    level: 'alarm',
    title: 'Battery critical',
    message: 'Land immediately.',
  });
  model.raise({
    id: 'link',
    level: 'warning',
    title: 'Link degraded',
    message: 'Telemetry intermittent.',
  });
  model.raise({ id: 'geofence', level: 'caution', title: 'Approaching geofence' });
  model.raise({ id: 'update', level: 'advisory', title: 'Firmware update available' });
  alerts.value = model;

  ready.value = true;
});

onUnmounted(() => scope.stop());

/** Rendered into the DOM so a failing screenshot names its own cell. */
const cell = computed(() => `${theme.value}/${register.value}`);
</script>

<template>
  <div v-if="ready" class="aux-specimens vp-raw" :data-cell="cell">
    <Register :register="register">
      <section data-specimen="status-badge">
        <div class="row">
          <StatusBadge v-for="level in LEVELS" :key="level" :level="level">
            {{ level }}
          </StatusBadge>
        </div>
        <div class="row">
          <StatusBadge v-for="level in LEVELS" :key="level" :level="level" variant="outline">
            {{ level }}
          </StatusBadge>
        </div>
        <div class="row">
          <StatusBadge v-for="level in LEVELS" :key="level" :level="level" size="sm" dot>
            {{ level }}
          </StatusBadge>
        </div>
      </section>

      <section data-specimen="alert-banner">
        <AlertBanner
          v-for="level in LEVELS"
          :key="level"
          :level="level"
          :title="`${level} condition`"
          description="Non-color cue is carried by the glyph and the title, never by hue alone."
        />
        <AlertBanner
          level="warning"
          title="Dismissible, with an action"
          description="Both affordances present, so the densest banner state is covered."
          dismissible
          action-label="Acknowledge"
        />
      </section>

      <section data-specimen="alert-annunciator">
        <AlertAnnunciator v-if="alerts" :model="alerts" />
      </section>

      <section data-specimen="guarded-action">
        <div class="row">
          <GuardedAction mode="hold" variant="danger">Arm</GuardedAction>
          <GuardedAction mode="double" variant="danger">Abort</GuardedAction>
          <GuardedAction mode="confirm" variant="primary">Return to launch</GuardedAction>
        </div>
        <div class="row">
          <GuardedAction mode="hold" variant="danger" size="sm">Arm</GuardedAction>
          <GuardedAction mode="hold" variant="secondary" disabled>Arm</GuardedAction>
        </div>
      </section>

      <section data-specimen="telemetry-value">
        <div class="row">
          <TelemetryValue label="Altitude" :value="122.4" unit="m" :precision="1" />
          <TelemetryValue label="Ground speed" :value="14.208" unit="m/s" :precision="2" />
          <TelemetryValue label="Heading" :value="287" unit="°" />
          <TelemetryValue label="Battery" :value="18" unit="%" />
        </div>
        <!-- `level` is the row this gate exists for. It used to change ink color
             and nothing else, and no specimen rendered it — so the one gate that
             could have shown a color-only status cue never drew one. -->
        <div class="row">
          <TelemetryValue
            v-for="level in LEVELS"
            :key="level"
            :label="level"
            :value="18"
            unit="%"
            :level="level"
          />
        </div>
      </section>

      <section data-specimen="table">
        <Table>
          <TableCaption>Fleet status</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Altitude</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>AX-01</TableCell>
              <TableCell><StatusBadge level="nominal" size="sm">In flight</StatusBadge></TableCell>
              <TableCell class="tabular">82%</TableCell>
              <TableCell class="tabular">122.4 m</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>AX-02</TableCell>
              <TableCell><StatusBadge level="caution" size="sm">Degraded</StatusBadge></TableCell>
              <TableCell class="tabular">41%</TableCell>
              <TableCell class="tabular">88.0 m</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>AX-03</TableCell>
              <TableCell>
                <StatusBadge level="alarm" size="sm">Battery critical</StatusBadge>
              </TableCell>
              <TableCell class="tabular">18%</TableCell>
              <TableCell class="tabular">12.7 m</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </Register>
  </div>
</template>

<style scoped>
.aux-specimens {
  background: var(--background);
  color: var(--foreground);
  padding: 2rem;
}

/* Every specimen is a fixed-width island so a capture is independent of the
   viewport and of its neighbours' height. */
.aux-specimens :deep(section[data-specimen]) {
  width: 40rem;
  margin: 0 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.aux-specimens :deep(.row) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

/* A screenshot must never land mid-tween. Belt and braces alongside
   Playwright's own `animations: 'disabled'`, which does not cover every
   CSS property in every engine. */
.aux-specimens :deep(*),
.aux-specimens :deep(*::before),
.aux-specimens :deep(*::after) {
  transition-duration: 0s !important;
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  animation-iteration-count: 1 !important;
  caret-color: transparent !important;
}
</style>
