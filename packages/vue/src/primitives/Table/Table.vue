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
  <div :class="rootClass">
    <table :class="styles.table()">
      <slot />
    </table>
  </div>
</template>
