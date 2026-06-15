<script setup lang="ts">
// Bloco "Indicadores gerais" — 4 cards-resumo no topo das abas iniciais do
// gestor. Padrão único (header + grid de KpiRingCard) reutilizado em
// Atendimentos, Abandonos e Performance/Workforce.
import KpiRingCard from '@/components/indicadores/KpiRingCard.vue'
import type { IndicadorGeral } from '@/data/gestorIndicadoresGerais'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    items: IndicadorGeral[]
  }>(),
  { title: 'Indicadores gerais', subtitle: undefined },
)
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-sm font-bold uppercase tracking-wide text-ms-text-primary">{{ title }}</h2>
      <p v-if="subtitle" class="text-xs text-ms-text-secondary">{{ subtitle }}</p>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiRingCard
        v-for="k in items"
        :key="k.label"
        :value="k.value"
        :display="k.display"
        :label="k.label"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
        :meta="k.meta"
        :tone="k.tone"
      />
    </div>
  </section>
</template>
