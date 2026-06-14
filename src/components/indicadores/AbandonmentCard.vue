<script setup lang="ts">
// AbandonmentCard — abandono por canal/fluxo (rosca + total ao centro + lista).
// Composto sobre BaseCard + ECharts (pie em anel).
import { computed } from 'vue'
import VChart from 'vue-echarts'
import BaseCard from '@/components/base/BaseCard.vue'

export interface AbandonmentItem {
  name: string
  value: number
  /** Cor da fatia (hex). */
  color: string
  /** Rótulo auxiliar (ex.: "8.2%"). */
  pct?: string
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    /** Valor central (ex.: total ou taxa). */
    centerValue: string | number
    centerLabel?: string
    items: AbandonmentItem[]
  }>(),
  { subtitle: '', centerLabel: '' },
)

const option = computed(() => ({
  tooltip: { trigger: 'item', confine: true, formatter: '{b}: {c}' },
  series: [
    {
      type: 'pie',
      radius: ['62%', '86%'],
      label: { show: false },
      data: props.items.map((i) => ({ value: i.value, name: i.name, itemStyle: { color: i.color } })),
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
    <div class="relative h-36 w-full">
      <VChart class="h-full w-full" :option="option" autoresize />
      <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-xl font-bold text-ms-text-primary">{{ centerValue }}</span>
        <span v-if="centerLabel" class="text-2xs text-ms-text-secondary">{{ centerLabel }}</span>
      </div>
    </div>
    <div class="mt-2 space-y-1 text-xs">
      <div v-for="i in items" :key="i.name" class="flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-ms-text-regular">
          <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: i.color }" />{{ i.name }}
        </span>
        <span class="font-medium text-ms-text-primary">
          <template v-if="i.pct">{{ i.pct }} · </template>{{ i.value }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>
