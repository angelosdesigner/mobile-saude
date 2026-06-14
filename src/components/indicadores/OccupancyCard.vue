<script setup lang="ts">
// OccupancyCard — ocupação por fila/atendente (% de uso da capacidade).
// Composto sobre BaseCard + BarList (tom da barra derivado do valor).
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
  }>(),
  { subtitle: '' },
)
</script>

<template>
  <BaseCard>
    <div class="mb-3">
      <h3 class="text-sm font-bold text-ms-text-primary">{{ title }}</h3>
      <p v-if="subtitle" class="text-2xs text-ms-text-secondary">{{ subtitle }}</p>
    </div>
    <BarList :items="items" />
  </BaseCard>
</template>
