<script setup lang="ts">
// Aba "Indicadores" do dashboard do gestor: ponto de entrada para o Centro de
// Indicadores Operacionais. Cada card abre o indicador correspondente (?ind=).
import { useRouter } from 'vue-router'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import { indicadorKpis, type IndicadorKey } from '@/data/gestorIndicadores'

const router = useRouter()

function abrirIndicador(key: IndicadorKey) {
  router.push({ path: '/gestor/indicadores', query: { ind: key } })
}

// Dot de status (redesign minimalista): saudável → cinza neutro; cor só em
// atenção/crítico. O rótulo segue neutro (text-ms-text-secondary).
const statusDot: Record<'ok' | 'warning' | 'danger', string> = {
  ok: 'bg-ms-text-placeholder',
  warning: 'bg-ms-warning',
  danger: 'bg-ms-danger',
}
const statusLabel: Record<'ok' | 'warning' | 'danger', string> = {
  ok: 'Saudável',
  warning: 'Atenção',
  danger: 'Crítico',
}
</script>

<template>
  <div class="space-y-5">
    <SectionHeader
      title="Indicadores Operacionais"
      subtitle="Selecione um indicador para abrir a análise temporal, comparativa e por segmento."
      action="Abrir Centro de Indicadores"
      action-to="/gestor/indicadores"
    />

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <button
        v-for="k in indicadorKpis"
        :key="k.key"
        class="flex flex-col rounded-lg border border-ms-border-light bg-ms-surface px-4 py-3 text-left transition hover:border-ms-primary/40 hover:shadow-md"
        @click="abrirIndicador(k.key)"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">{{
            k.label
          }}</span>
          <span class="flex items-center gap-1 text-2xs text-ms-text-secondary">
            <span class="h-2 w-2 rounded-full" :class="statusDot[k.status]" />{{
              statusLabel[k.status]
            }}
          </span>
        </div>
        <div class="mt-1 text-2xl font-bold text-ms-text-primary">{{ k.value }}</div>
        <div class="mt-2 flex items-center gap-1 text-2xs font-medium text-ms-primary">
          Ver detalhamento
          <AppIcon name="chevron-right" class="h-3 w-3" />
        </div>
      </button>
    </div>
  </div>
</template>
