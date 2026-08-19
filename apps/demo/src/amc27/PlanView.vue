<script setup lang="ts">
/**
 * AMC27 · mission plan.
 *
 * The third view exists to prove the frame generalises: the command bar and
 * the instrument strip are unchanged, and the same rails, sections, labels and
 * tabular measures build a page that is entirely editorial — a list of
 * decisions about a flight rather than a live picture.
 *
 * A plan is a table. The incumbent has no plan surface in these screenshots at
 * all; the mission is a set of orange lines on a thumbnail.
 */
import { plan } from './telemetry';

const KIND_LEVEL: Record<string, string> = {
  TAKEOFF: 'advisory',
  LAND: 'advisory',
  SURVEY: 'nominal',
  LOITER: 'caution',
  WAYPOINT: 'nominal',
};

const current = 7;
const totalDist = 4.82;

/**
 * Vertical profile. A plan is a set of altitudes as much as a set of places,
 * and a table of numbers does not show you that leg 4–6 is flat and the
 * descent is all in the last leg. The map shows the ground track; this shows
 * the other axis. Geometry only — 640 × 96 user units, drawn to fit.
 */
/* PW is set near the rendered width on purpose: the chart is drawn with
 * `preserveAspectRatio="none"` so the leg spacing fills the column, and a
 * viewBox far from the render width would stretch the waypoint dots into
 * ellipses. Close enough that a circle stays a circle. */
const PW = 1040;
const PH = 96;
const legs = plan.map((p, i) => ({ ...p, d: i * (PW / (plan.length - 1)) }));
const maxAlt = 130;
const py = (alt: number) => PH - 10 - (alt / maxAlt) * (PH - 22);
const profileLine = legs.map((p) => `${p.d},${py(p.alt)}`).join(' ');
const profileArea = `${profileLine} ${PW},${PH} 0,${PH}`;

const changes = [
  'WP 4–6 raised 108 → 118 m AGL for terrain clearance',
  'WP 7 loiter extended 1 min → 2 min',
  'Survey overlap 70 % → 80 %',
  'WP 9 moved to pad A after pad B closure',
];
</script>

<template>
  <div class="grid min-h-0" style="grid-template-columns: minmax(0, 1fr) 320px">
    <!-- ── The plan ─────────────────────────────────────────────────────── -->
    <section class="flex min-h-0 flex-col">
      <div class="flex items-center justify-between px-3 py-2.5" style="border-bottom: 1px solid var(--a27-line)">
        <div>
          <p class="a27-name">Coastline Survey · revision 4</p>
          <p class="a27-label mt-1">UPLOADED 14:09:02 · CRC 0x8F2A · VERIFIED ON AIRCRAFT</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="a27-btn a27-btn-wide"><span class="a27-label" style="color: var(--a27-ink)">Verify</span></button>
          <button type="button" class="a27-btn a27-btn-wide"><span class="a27-label" style="color: var(--a27-ink)">Re-upload</span></button>
        </div>
      </div>

      <!-- ── Vertical profile ─────────────────────────────────────────── -->
      <div class="px-3 py-3" style="border-bottom: 1px solid var(--a27-line)">
        <div class="a27-sec-head">
          <span class="a27-label">Vertical profile</span>
          <span class="a27-micro">MAX 120 m AGL · CEILING 130 m</span>
        </div>
        <svg
          :viewBox="`0 0 ${PW} ${PH}`"
          width="100%"
          :height="PH"
          preserveAspectRatio="none"
          role="img"
          aria-label="Altitude profile across the nine plan waypoints"
        >
          <!-- ceiling and ground, the two lines a profile is read against -->
          <g stroke="var(--a27-line)" stroke-width="1">
            <line x1="0" :y1="py(maxAlt)" :x2="PW" :y2="py(maxAlt)" stroke-dasharray="4 4" />
            <line x1="0" :y1="PH - 10" :x2="PW" :y2="PH - 10" />
          </g>
          <polygon :points="profileArea" fill="var(--a27-ink)" fill-opacity="0.07" />
          <polyline :points="profileLine" fill="none" stroke="var(--a27-ink)" stroke-width="1.5" />
          <g v-for="p in legs" :key="p.n">
            <line
              :x1="p.d" :y1="py(p.alt)" :x2="p.d" :y2="PH - 10"
              stroke="var(--a27-line)" stroke-width="1"
            />
            <circle
              :cx="p.d" :cy="py(p.alt)" r="3"
              :fill="p.n === current ? 'var(--brand)' : 'var(--background)'"
              stroke="var(--a27-ink)" stroke-width="1.25"
            />
          </g>
        </svg>
      </div>

      <div class="a27-scroll flex-1">
        <table class="a27-table">
          <thead>
            <tr>
              <th style="width: 44px">#</th>
              <th style="width: 108px">Kind</th>
              <th style="width: 84px">Alt AGL</th>
              <th style="width: 84px">Speed</th>
              <th style="width: 92px">Leg</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in plan" :key="p.n" :data-current="p.n === current">
              <td class="a27-edge" :class="`a27-edge-${KIND_LEVEL[p.kind]}`" style="padding-left: 10px">{{ p.n }}</td>
              <td><span class="a27-label" :class="`a27-ink-${KIND_LEVEL[p.kind]}`">{{ p.kind }}</span></td>
              <td>{{ p.alt }} <span class="a27-unit">m</span></td>
              <td>{{ p.speed }} <span class="a27-unit">m/s</span></td>
              <td>{{ (p.n * 0.53).toFixed(2) }} <span class="a27-unit">km</span></td>
              <td style="font-family: var(--font-sans); font-size: 12px">
                {{ p.action }}
                <span v-if="p.n === current" class="a27-label ml-2" style="color: var(--brand)">◂ CURRENT</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- What changed since the last upload. A plan is versioned and flown by
           someone who did not necessarily write it; "revision 4" means nothing
           without the diff, and the incumbent has no place to put one. -->
      <div class="px-3 py-3" style="border-top: 1px solid var(--a27-line)">
        <div class="a27-sec-head">
          <span class="a27-label">Changes since revision 3</span>
          <span class="a27-micro">EDITED BY M. KELLER · 14:07</span>
        </div>
        <div class="grid gap-x-8 gap-y-1.5" style="grid-template-columns: repeat(2, minmax(0, 1fr))">
          <p
            v-for="c in changes"
            :key="c"
            class="a27-micro flex gap-2"
            style="color: var(--a27-ink)"
          >
            <span style="color: var(--a27-ink-3)">·</span>{{ c }}
          </p>
        </div>
      </div>
    </section>

    <!-- ── Summary ──────────────────────────────────────────────────────── -->
    <aside class="a27-rail a27-rail-right">
      <div class="a27-sec">
        <p class="a27-label mb-2">Plan totals</p>
        <div class="a27-fields" style="--a27-cols: 2">
          <div class="a27-field">
            <span class="a27-label">Distance</span>
            <span class="a27-field-row"><span class="a27-meas">{{ totalDist }}</span><span class="a27-unit">km</span></span>
          </div>
          <div class="a27-field">
            <span class="a27-label">Duration</span>
            <span class="a27-field-row"><span class="a27-meas">08:11</span></span>
          </div>
          <div class="a27-field">
            <span class="a27-label">Waypoints</span>
            <span class="a27-field-row"><span class="a27-meas">{{ plan.length }}</span></span>
          </div>
          <div class="a27-field">
            <span class="a27-label">Max alt</span>
            <span class="a27-field-row"><span class="a27-meas">120</span><span class="a27-unit">m</span></span>
          </div>
        </div>
      </div>

      <div class="a27-sec a27-sec-flex">
        <p class="a27-label mb-2">Pre-flight gates</p>
        <div class="flex flex-col">
          <div
            v-for="g in [
              { level: 'nominal', name: 'Airframe & props', note: 'Checked 13:52' },
              { level: 'nominal', name: 'Battery pack B7', note: '97 % · 14 cycles' },
              { level: 'nominal', name: 'GNSS RTK base', note: 'Fixed · 10 SV' },
              { level: 'caution', name: 'Datalink margin', note: '9 dB — below 12 dB target' },
              { level: 'nominal', name: 'Airspace clearance', note: 'NOTAM A2291 acknowledged' },
              { level: 'advisory', name: 'Wind aloft', note: '4.1 m/s @ 214° · within limits' },
            ]"
            :key="g.name"
            class="a27-alert a27-edge"
            :class="`a27-edge-${g.level}`"
            style="grid-template-columns: minmax(0, 1fr) auto"
          >
            <span class="a27-name">{{ g.name }}</span>
            <span class="a27-label" :class="`a27-ink-${g.level}`">{{ g.level.toUpperCase() }}</span>
            <span class="a27-label" style="color: var(--a27-ink-3)">{{ g.note }}</span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
