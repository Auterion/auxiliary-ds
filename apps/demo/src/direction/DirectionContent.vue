<script setup lang="ts">
/**
 * The shared content set for the direction review (AD-D-013).
 *
 * ONE content component, rendered twice — once as the incumbent, once as the
 * "Anno 1965" challenger. That is the whole point: if the two candidates were
 * allowed to author different markup, the comparison would be between two
 * designers' compositions rather than between two visual languages, and the
 * winner would be whoever tried harder on the day.
 *
 * So the rule for this file is strict: **nothing here may express a candidate.**
 * No radius, no shadow, no easing, no colour, no type size that is not read from
 * a token. Every difference the reviewer sees must have arrived through the
 * override layer (`_anno1965.css`), because that is exactly the property being
 * tested — can the system hold the language, or does the language need bespoke
 * CSS to exist?
 *
 * Five pieces, chosen to span both registers: a deck cover and a section divider
 * (expressive/editorial), a data table and a product screen (operational), and a
 * mobile view (the constraint that breaks layouts).
 */
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TelemetryValue,
} from '@auxiliary/vue';

const FLEET = [
  { id: 'AX-01', state: 'In flight', level: 'nominal', battery: 82, alt: 122.4 },
  { id: 'AX-02', state: 'Degraded link', level: 'caution', battery: 41, alt: 88.0 },
  { id: 'AX-03', state: 'Battery critical', level: 'alarm', battery: 18, alt: 12.7 },
  { id: 'AX-04', state: 'Standby', level: 'advisory', battery: 97, alt: 0 },
] as const;
</script>

<template>
  <div class="dir-content">
    <!-- 1 — Deck cover -->
    <section class="dir-piece" data-piece="deck-cover">
      <p class="dir-piece-tag">01 · Deck cover</p>
      <div class="dir-cover">
        <p class="dir-cover-eyebrow">Auterion · Autonomous systems</p>
        <h1 class="dir-cover-title">Build swarms, not drones.</h1>
        <p class="dir-cover-sub">
          An open operating system for autonomous fleets — defense, public safety, industrial
          inspection.
        </p>
        <div class="dir-cover-foot">
          <span>AD-2026-001</span>
          <span>August 2026</span>
        </div>
      </div>
    </section>

    <!-- 2 — Section divider -->
    <section class="dir-piece" data-piece="section-divider">
      <p class="dir-piece-tag">02 · Section divider</p>
      <div class="dir-divider">
        <span class="dir-divider-num">03</span>
        <div class="dir-divider-body">
          <h2 class="dir-divider-title">Operational surfaces</h2>
          <p class="dir-divider-sub">
            Where the language meets time pressure, glare, and a degraded link.
          </p>
        </div>
      </div>
    </section>

    <!-- 3 — Data table -->
    <section class="dir-piece" data-piece="data-table">
      <p class="dir-piece-tag">03 · Data table</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Battery</TableHead>
            <TableHead>Altitude</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="v in FLEET" :key="v.id">
            <TableCell class="tabular">{{ v.id }}</TableCell>
            <TableCell>
              <StatusBadge :level="v.level" size="sm">{{ v.state }}</StatusBadge>
            </TableCell>
            <TableCell class="tabular">{{ v.battery }}%</TableCell>
            <TableCell class="tabular">{{ v.alt.toFixed(1) }} m</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>

    <!-- 4 — Product screen -->
    <section class="dir-piece" data-piece="product-screen">
      <p class="dir-piece-tag">04 · Product screen</p>
      <div class="dir-screen">
        <Card class="dir-screen-main">
          <CardHeader>
            <CardTitle>AX-03 · Inspection sortie</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="dir-readouts">
              <TelemetryValue label="Altitude" :value="12.7" unit="m" :precision="1" />
              <TelemetryValue label="Ground speed" :value="2.4" unit="m/s" :precision="1" />
              <TelemetryValue label="Heading" :value="287" unit="°" />
              <TelemetryValue label="Battery" :value="18" unit="%" />
            </div>
            <div class="dir-actions">
              <Button variant="primary" size="sm">Return to launch</Button>
              <Button variant="secondary" size="sm">Hold</Button>
            </div>
          </CardContent>
        </Card>
        <Card class="dir-screen-side">
          <CardHeader>
            <CardTitle>Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="dir-roster">
              <li v-for="v in FLEET" :key="v.id">
                <span class="tabular">{{ v.id }}</span>
                <StatusBadge :level="v.level" size="sm" dot>{{ v.battery }}%</StatusBadge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- 5 — Mobile view -->
    <section class="dir-piece" data-piece="mobile-view">
      <p class="dir-piece-tag">05 · Mobile view</p>
      <div class="dir-mobile">
        <p class="dir-mobile-eyebrow">Field · AX-03</p>
        <h3 class="dir-mobile-title">Battery critical</h3>
        <StatusBadge level="alarm">Land immediately</StatusBadge>
        <div class="dir-readouts dir-readouts-stack">
          <TelemetryValue label="Altitude" :value="12.7" unit="m" :precision="1" />
          <TelemetryValue label="Battery" :value="18" unit="%" />
        </div>
        <Button variant="primary" size="sm" class="dir-mobile-cta">Return to launch</Button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/*
 * Structure only. Every value below is a token reference — the moment one of
 * these becomes a literal, the specimen stops testing the system and starts
 * testing my CSS.
 */
.dir-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-12);
}

.dir-piece {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.dir-piece-tag {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  padding-bottom: var(--spacing-2);
  border-bottom: var(--border-width-1) solid var(--border);
}

/* 1 — cover */
.dir-cover {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: var(--spacing-10);
  background: var(--card);
  color: var(--card-foreground);
  border: var(--border-width-1) solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
}

.dir-cover-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.dir-cover-title {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  line-height: var(--leading-tight);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.02em;
  margin: 0;
}

.dir-cover-sub {
  font-size: var(--text-body-lg);
  color: var(--muted-foreground);
  max-width: 42ch;
}

.dir-cover-foot {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-3);
  border-top: var(--border-width-1) solid var(--border);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--muted-foreground);
}

/* 2 — divider */
.dir-divider {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-6);
  padding: var(--spacing-8) 0;
  border-top: var(--border-width-2) solid var(--foreground);
}

.dir-divider-num {
  font-family: var(--font-mono);
  font-size: var(--text-4xl);
  color: var(--muted-foreground);
}

.dir-divider-title {
  font-size: var(--text-heading);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.dir-divider-sub {
  color: var(--muted-foreground);
  margin-top: var(--spacing-1);
}

/* 4 — product screen */
.dir-screen {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-4);
}

.dir-readouts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-4);
}

.dir-readouts-stack {
  grid-template-columns: repeat(2, 1fr);
}

.dir-actions {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-6);
}

.dir-roster {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.dir-roster li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  font-size: var(--text-caption);
}

/* 5 — mobile */
.dir-mobile {
  width: 20rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  background: var(--card);
  color: var(--card-foreground);
  border: var(--border-width-1) solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.dir-mobile-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.dir-mobile-title {
  font-size: var(--text-title);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.dir-mobile-cta {
  margin-top: var(--spacing-2);
}
</style>
