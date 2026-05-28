<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { RadioGroupIndicator, RadioGroupItem } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { radioGroup } from '@auxiliary/css/recipes';

const props = defineProps<{
  value: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  class?: HTMLAttributes['class'];
}>();

const styles = radioGroup();
const itemClass = computed(() => cn(styles.item(), props.class));
</script>

<template>
  <RadioGroupItem
    :id="id"
    :value="value"
    :disabled="disabled"
    :required="required"
    :class="itemClass"
  >
    <RadioGroupIndicator :class="styles.indicator()">
      <span :class="styles.dot()" />
    </RadioGroupIndicator>
  </RadioGroupItem>
</template>
