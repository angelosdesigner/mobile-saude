<script setup lang="ts">
// ChartLegend — legenda padrão de gráfico do Design System: bolinha (círculo)
// na cor da série + nome. Fonte única (substitui quadrados e legendas internas
// do ECharts). Dois layouts:
//  - inline (padrão): chips centralizados no rodapé (ex.: BOT/Humano, faixas).
//  - list: lista vertical com o valor à direita — nome + "% (qtd)".
export interface ChartLegendItem {
  label: string
  /** Cor da bolinha (CSS: hex da série do gráfico ou var de token). */
  color: string
  /** Valor opcional à direita (layout list) — ex.: "71% (84)". */
  value?: string
}

withDefaults(defineProps<{ items: ChartLegendItem[]; layout?: 'inline' | 'list' }>(), {
  layout: 'inline',
})
</script>

<template>
  <div v-if="layout === 'list'" class="space-y-1 text-xs">
    <div v-for="i in items" :key="i.label" class="flex items-center justify-between gap-2">
      <span class="flex items-center gap-1.5 text-ms-text-regular">
        <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: i.color }" />{{
          i.label
        }}
      </span>
      <span v-if="i.value" class="font-medium text-ms-text-primary">{{ i.value }}</span>
    </div>
  </div>

  <div
    v-else
    class="flex flex-wrap items-center justify-center gap-3 text-2xs text-ms-text-secondary"
  >
    <span v-for="i in items" :key="i.label" class="flex items-center gap-1">
      <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: i.color }" />{{
        i.label
      }}
    </span>
  </div>
</template>
