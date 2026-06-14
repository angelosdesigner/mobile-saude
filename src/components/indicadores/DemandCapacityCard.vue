<script setup lang="ts">
// DemandCapacityCard — demanda (barras) × capacidade (linha) por hora.
// A cor da barra indica pressão (verde ok · âmbar pressão · vermelho saturado).
import { computed } from 'vue'
import VChart from 'vue-echarts'
import BaseCard from '@/components/base/BaseCard.vue'
import { chartColors as C } from '@/plugins/echarts'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    horas: string[]
    demanda: number[]
    capacidade: number
  }>(),
  { subtitle: '' },
)

const barColor = (v: number) => {
  if (v > props.capacidade * 1.15) return C.danger
  if (v >= props.capacidade * 0.85) return C.warning
  return C.success
}

const option = computed(() => ({
  tooltip: { trigger: 'axis', confine: true },
  grid: { left: 30, right: 10, top: 12, bottom: 24 },
  xAxis: {
    type: 'category',
    data: props.horas,
    axisLabel: { color: C.axis, fontSize: 10, interval: 0 },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: C.axis },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      name: 'Demanda',
      type: 'bar',
      data: props.demanda.map((v) => ({
        value: v,
        itemStyle: { color: barColor(v), borderRadius: [3, 3, 0, 0] },
      })),
    },
    {
      name: 'Capacidade',
      type: 'line',
      step: 'middle',
      symbol: 'none',
      data: props.horas.map(() => props.capacidade),
      lineStyle: { color: C.ink, width: 2 },
      z: 5,
    },
  ],
}))
</script>

<template>
  <BaseCard>
    <div class="mb-2">
      <h3 class="text-sm font-bold text-ms-text-primary">{{ title }}</h3>
      <p v-if="subtitle" class="text-2xs text-ms-text-secondary">{{ subtitle }}</p>
    </div>
    <div class="h-52 w-full"><VChart class="h-full w-full" :option="option" autoresize /></div>
    <div class="mt-1 flex flex-wrap gap-3 text-2xs text-ms-text-secondary">
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-sm bg-ms-success" />Equilibrada</span>
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-sm bg-ms-warning" />Pressão</span>
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-sm bg-ms-danger" />Saturado</span>
      <span class="flex items-center gap-1"><span class="h-0.5 w-3" :style="{ backgroundColor: C.ink }" />Capacidade</span>
    </div>
  </BaseCard>
</template>
