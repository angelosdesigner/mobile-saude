<script setup lang="ts">
// Bloco "Indicadores gerais" — 4 cards-resumo no topo das abas iniciais do
// gestor. Padrão único (header + grid de KpiRingCard) reutilizado em
// Atendimentos, Abandonos e Performance/Workforce. Cada card pode levar a um
// destino (drill-down): indicador, lista de Ocorrências ou rota direta.
import { useRouter } from 'vue-router'
import KpiRingCard from '@/components/indicadores/KpiRingCard.vue'
import type { IndicadorGeral, IndicadorTarget } from '@/data/gestorIndicadoresGerais'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    items: IndicadorGeral[]
  }>(),
  { title: 'Indicadores gerais', subtitle: undefined },
)

const router = useRouter()

function go(t?: IndicadorTarget) {
  if (!t) return
  if (t.kind === 'indicador') router.push({ path: '/gestor/indicadores', query: { ind: t.ind } })
  else if (t.kind === 'ocorrencias')
    router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', ...(t.query ?? {}) } })
  else router.push(t.to)
}
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
        :clickable="!!k.target"
        @click="go(k.target)"
      />
    </div>
  </section>
</template>
