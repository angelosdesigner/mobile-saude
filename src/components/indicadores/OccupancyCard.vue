<script setup lang="ts">
// OccupancyCard — ocupação por fila/atendente (% de uso da capacidade).
// Composto sobre BaseCard + BarList. A legenda de limiares e o rodapé
// "Pior/Melhor" vêm do próprio BarList (fonte única), via props.
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
    /** Legenda de limiares (<70% / 70–89% / ≥90% crítico) com bolinhas. */
    legend?: boolean
    /** Rodapé "↓ Pior  Melhor ↑" (ranking de atendentes). */
    rankHint?: boolean
  }>(),
  { subtitle: '', legend: false, rankHint: false },
)
</script>

<template>
  <BaseCard>
    <div class="mb-3">
      <h3 class="text-sm font-bold text-ms-text-primary">{{ title }}</h3>
      <p v-if="subtitle" class="text-2xs text-ms-text-secondary">{{ subtitle }}</p>
    </div>
    <BarList :items="items" :threshold-legend="legend" :rank-hint="rankHint" />
  </BaseCard>
</template>
