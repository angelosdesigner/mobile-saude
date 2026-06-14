<script setup lang="ts">
// TrendCard — KPI com mini-gráfico de tendência (sparkline). Composto sobre
// BaseCard + ECharts (linha). Bom para "valor atual + evolução recente".
import { computed } from 'vue'
import VChart from 'vue-echarts'
import BaseCard from '@/components/base/BaseCard.vue'
import { chartColors } from '@/plugins/echarts'

export type DeltaTone = 'up' | 'down' | 'neutral'
export type TrendTone = 'primary' | 'success' | 'warning' | 'danger' | 'teal'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    series: number[]
    delta?: string
    deltaTone?: DeltaTone
    tone?: TrendTone
  }>(),
  { delta: '', deltaTone: 'neutral', tone: 'primary' },
)

const deltaClass: Record<DeltaTone, string> = {
  up: 'text-ms-success',
  down: 'text-ms-danger',
  neutral: 'text-ms-text-secondary',
}
const dCls = computed(() => deltaClass[props.deltaTone])

const color = computed(() => chartColors[props.tone])
const option = computed(() => ({
  grid: { left: 2, right: 2, top: 6, bottom: 2 },
  xAxis: { type: 'category', show: false, data: props.series.map((_, i) => i) },
  yAxis: { type: 'value', show: false, scale: true },
  tooltip: { trigger: 'axis', confine: true },
  series: [
    {
      type: 'line',
      data: props.series,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: color.value, width: 2 },
      areaStyle: { color: color.value, opacity: 0.12 },
    },
  ],
}))
</script>

<template>
  <BaseCard>
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          {{ label }}
        </div>
        <div class="mt-1 text-2xl font-bold text-ms-text-primary">{{ value }}</div>
        <div v-if="delta" class="mt-0.5 text-xs" :class="dCls">{{ delta }}</div>
      </div>
      <div class="h-12 w-28 shrink-0">
        <VChart class="h-full w-full" :option="option" autoresize />
      </div>
    </div>
  </BaseCard>
</template>
