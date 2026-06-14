<script setup lang="ts">
// KpiCard — indicador numérico do Design System (rótulo + valor + variação).
// Composto sobre BaseCard. Para tendência com mini-gráfico use TrendCard.
import { computed } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'

export type DeltaTone = 'up' | 'down' | 'neutral'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    delta?: string
    deltaTone?: DeltaTone
    hint?: string
    interactive?: boolean
  }>(),
  { delta: '', deltaTone: 'neutral', hint: '', interactive: false },
)

defineEmits<{ click: [] }>()

const deltaClass: Record<DeltaTone, string> = {
  up: 'text-ms-success',
  down: 'text-ms-danger',
  neutral: 'text-ms-text-secondary',
}
const dCls = computed(() => deltaClass[props.deltaTone])
</script>

<template>
  <BaseCard :interactive="interactive" @click="$emit('click')">
    <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
      {{ label }}
    </div>
    <div class="mt-1 text-2xl font-bold text-ms-text-primary">{{ value }}</div>
    <div v-if="delta" class="mt-0.5 text-xs" :class="dCls">{{ delta }}</div>
    <div v-if="hint" class="mt-0.5 text-2xs text-ms-text-secondary">{{ hint }}</div>
  </BaseCard>
</template>
