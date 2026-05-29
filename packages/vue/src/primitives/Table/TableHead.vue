<script setup lang="ts">
// Column header cell. Defaults to scope="col" so screen readers associate the
// column with its data cells; override `scope` for row headers.
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { table } from '@auxiliary/css/recipes';

const props = defineProps<{
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  class?: HTMLAttributes['class'];
}>();

const styles = table();
const rootClass = computed(() => cn(styles.head(), props.class));
</script>

<template>
  <th :scope="scope ?? 'col'" :class="rootClass">
    <slot />
  </th>
</template>
