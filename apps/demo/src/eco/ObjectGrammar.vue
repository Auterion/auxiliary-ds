<script setup lang="ts">
/* One name for every object.
 *
 * Today the same aircraft is a database row in Suite, a `Vehicle` object in
 * Trellys, a MAVLink system id in Mission Control and a serial number on the
 * device page. Four names, and no way to say "this one" over a radio.
 *
 * `auterion:<org>:<kind>:<id>` is one addressable name any surface can resolve.
 * What makes it more than a string is the last column below: the surfaces that
 * CANNOT open a given object grey out and say why, instead of disappearing. A
 * launcher that hides what it cannot do teaches nothing; one that shows it
 * greyed teaches the shape of the system to anyone who uses it twice.
 */
import { computed, ref } from 'vue';
import { Icon } from '@auxiliary/icons';
import { ENTITIES, ORG, SURFACES, type SurfaceId } from './surfaces';

const picked = ref(ENTITIES[0].kind);
const entity = computed(() => ENTITIES.find((e) => e.kind === picked.value) ?? ENTITIES[0]);
const uri = computed(() => `auterion:${ORG}:${entity.value.kind}:${entity.value.id}`);

/* A stable, always-rendered status region — a polite region created at the
 * moment of the announcement is inconsistently picked up. */
const said = ref('');

async function copy() {
  try {
    await navigator.clipboard.writeText(uri.value);
    said.value = `Copied ${uri.value}`;
  } catch {
    said.value = 'Unable to copy. Select the URI and copy it by hand.';
  }
}

function resolution(id: SurfaceId): { opens: boolean; line: string } {
  const e = entity.value;
  // The noun phrase arrives with its own article: see the `as` field's note.
  if (e.opens.includes(id)) {
    return { opens: true, line: `Opens as ${e.as[id] ?? ''}.` };
  }
  return { opens: false, line: e.why[id] ?? 'Not addressable here.' };
}
</script>

<template>
  <div class="ec-stack">
    <div class="dk-segment" role="group" aria-label="Object kind">
      <button
        v-for="e in ENTITIES"
        :key="e.kind"
        type="button"
        class="dk-segment-btn"
        :data-active="picked === e.kind ? 'true' : 'false'"
        :aria-pressed="picked === e.kind"
        @click="picked = e.kind"
      >
        {{ e.kind }}
      </button>
    </div>

    <div class="ec-uri">
      <code>
        <span class="dim">auterion:{{ ORG }}:</span><span class="k">{{ entity.kind }}:{{ entity.id }}</span>
      </code>
      <span class="dk-bracket">{{ entity.label }}</span>
      <span style="flex: 1"></span>
      <button type="button" class="dk-cta dk-cta-sm" @click="copy">
        <Icon name="copy" :size="13" aria-hidden="true" />
        Copy URI
      </button>
    </div>

    <p role="status" class="dk-micro" style="min-height: 1.5em">{{ said }}</p>

    <div class="ec-resolve">
      <p
        v-for="s in SURFACES"
        :key="s.id"
        class="ec-resolve-row"
        :data-opens="resolution(s.id).opens ? 'true' : 'false'"
      >
        <span class="ec-resolve-mark" aria-hidden="true">
          {{ resolution(s.id).opens ? '✓' : '—' }}
        </span>
        <span>
          <span class="dk-value" style="display: block">{{ s.chrome }}</span>
          <span class="dk-small">{{ resolution(s.id).line }}</span>
        </span>
      </p>
    </div>
  </div>
</template>
