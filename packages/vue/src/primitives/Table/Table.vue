<script setup lang="ts">
// Composable data table. Renders a semantic <table> inside a horizontal scroll
// container so wide tables never break page layout. `class` styles the container
// (e.g. `max-h-96` to enable a sticky header). Compose with TableHeader/Body/Row/
// Head/Cell/Caption.
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { table } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = table();
const rootClass = computed(() => cn(styles.root(), props.class));
</script>

<template>
  <!-- tabindex="0" is what makes the scroll container reachable without a pointer.
       A read-only telemetry table has no focusable descendants, so without it the
       overflowed columns and rows are pointer-only in Firefox and Safari (Chromium
       ≥127 focuses such containers implicitly; the other two do not), and axe's
       scrollable-region-focusable flags it. The documented sticky-header pattern
       (`<Table class="max-h-72">`) is exactly the failing configuration.

       Deliberately NOT role="region": TableCaption is a slot child the root cannot
       reference, so the region would ship unnamed — trading one axe finding for
       another. Consumers name it by passing aria-label, which falls through. -->
  <div :class="rootClass" tabindex="0">
    <table :class="styles.table()">
      <slot />
    </table>
  </div>
</template>
