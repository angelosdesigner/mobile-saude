<script setup lang="ts">
// ChartLegend — legenda padrão de gráfico do Design System: marcador na cor da
// série + nome. Fonte única (substitui quadrados e legendas internas do ECharts).
// Marcador: 'dot' (bolinha, padrão) ou 'line' (série de linha, ex.: "Capacidade").
// Layouts: 'inline' (chips centralizados) e 'list' (vertical, valor à direita).
export interface ChartLegendItem {
  label: string
  /** Cor do marcador (CSS: hex da série ou var de token). */
  color: string
  /** Valor opcional à direita (layout list) — ex.: "71% (84)". */
  value?: string
  /** Tipo de marcador: bolinha (padrão) ou linha. */
  marker?: 'dot' | 'line'
}

withDefaults(defineProps<{ items: ChartLegendItem[]; layout?: 'inline' | 'list' }>(), {
  layout: 'inline',
})
</script>

<template>
  <div v-if="layout === 'list'" class="space-y-1 text-xs">
    <div v-for="i in items" :key="i.label" class="flex items-center justify-between gap-2">
      <span class="flex items-center gap-1.5 text-ms-text-regular">
        <span
          class="shrink-0"
          :class="i.marker === 'line' ? 'h-0.5 w-3' : 'h-2 w-2 rounded-full'"
          :style="{ backgroundColor: i.color }"
        />{{ i.label }}
      </span>
      <span v-if="i.value" class="font-medium text-ms-text-primary">{{ i.value }}</span>
    </div>
  </div>

  <div
    v-else
    class="flex flex-wrap items-center justify-center gap-3 text-2xs text-ms-text-secondary"
  >
    <span v-for="i in items" :key="i.label" class="flex items-center gap-1">
      <span
        class="shrink-0"
        :class="i.marker === 'line' ? 'h-0.5 w-3' : 'h-2 w-2 rounded-full'"
        :style="{ backgroundColor: i.color }"
      />{{ i.label }}
    </span>
  </div>
</template>
