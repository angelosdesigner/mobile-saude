<script setup lang="ts">
// OccupancyCard — ocupação por fila/atendente (% de uso da capacidade).
// Composto sobre BaseCard + BarList (tom da barra derivado do valor).
// `legend` mostra os limiares de cor (bolinhas); slot `footer` p/ dicas
// (ex.: "↓ Pior  Melhor ↑" no ranking de atendentes).
import BaseCard from '@/components/base/BaseCard.vue'
import BarList from '@/components/gestor/BarList.vue'

export interface OccupancyItem {
  label: string
  value: number
  caption?: string
  avatar?: string
}

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    items: OccupancyItem[]
    /** Mostra a legenda de limiares (<70% / 70–89% / ≥90% crítico) com bolinhas. */
    legend?: boolean
  }>(),
  { subtitle: '', legend: false },
)

defineSlots<{ footer?(): unknown }>()
</script>

<template>
  <BaseCard>
    <div class="mb-3">
      <h3 class="text-sm font-bold text-ms-text-primary">{{ title }}</h3>
      <p v-if="subtitle" class="text-2xs text-ms-text-secondary">{{ subtitle }}</p>
    </div>
    <BarList :items="items" />

    <!-- Legenda de limiares (bolinha + rótulo) — padrão do produto. -->
    <div
      v-if="legend"
      class="mt-3 flex flex-wrap items-center justify-center gap-3 text-2xs text-ms-text-secondary"
    >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-success" />&lt;70%</span
      >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-warning" />70–89%</span
      >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-danger" />≥90% crítico</span
      >
    </div>

    <div v-if="$slots.footer" class="mt-3 border-t border-ms-border-lighter pt-2">
      <slot name="footer" />
    </div>
  </BaseCard>
</template>
