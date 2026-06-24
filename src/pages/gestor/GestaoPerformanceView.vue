<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Área "Gestão e Performance" (a frio) — visão EXECUTIVA, não operacional.
// Estrutura de duas camadas (igual ao Tempo Real): grupo de nível 1
// (Tempo Real | Gestão e Performance) + subabas. Cada subaba é um componente
// próprio (lazy).
const VisaoGeralTab = defineAsyncComponent(
  () => import('@/components/gestor/gestao-performance/VisaoGeralTab.vue'),
)
const GestaoRiscosTab = defineAsyncComponent(
  () => import('@/components/gestor/gestao-performance/GestaoRiscosTab.vue'),
)
const GargalosSetoresTab = defineAsyncComponent(
  () => import('@/components/gestor/gestao-performance/GargalosSetoresTab.vue'),
)
const PendenciasLimboTab = defineAsyncComponent(
  () => import('@/components/gestor/gestao-performance/PendenciasLimboTab.vue'),
)
const QualidadeExperienciaTab = defineAsyncComponent(
  () => import('@/components/gestor/gestao-performance/QualidadeExperienciaTab.vue'),
)

const tabComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'visao-geral': VisaoGeralTab,
  riscos: GestaoRiscosTab,
  gargalos: GargalosSetoresTab,
  limbo: PendenciasLimboTab,
  qualidade: QualidadeExperienciaTab,
}

const tabs = [
  { key: 'visao-geral', label: 'Visão Geral' },
  { key: 'riscos', label: 'Gestão de Riscos' },
  { key: 'gargalos', label: 'Gargalos e Setores' },
  { key: 'limbo', label: 'Pendências e Limbo' },
  { key: 'qualidade', label: 'Qualidade e Experiência' },
] as const

const route = useRoute()
const router = useRouter()

const activeTab = computed({
  get: () =>
    tabs.some((t) => t.key === route.query.tab) ? (route.query.tab as string) : 'visao-geral',
  set: (v) => router.replace({ query: { ...route.query, tab: v } }),
})
const current = computed(() => tabs.find((t) => t.key === activeTab.value) ?? tabs[0])

function goTab(key: string) {
  if (tabs.some((t) => t.key === key)) activeTab.value = key
}
</script>

<template>
  <DashboardLayout>
    <!-- Cabeçalho -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-ms-text-primary">Gestão do Atendimento</h1>
      <p class="mt-1 text-sm text-ms-text-secondary">
        Acompanhe e gerencie a operação de atendimento da operadora — do monitoramento em tempo real
        à análise de performance.
      </p>
    </div>

    <!-- Grupo de nível 1 -->
    <div class="mb-4 flex gap-6 border-b border-ms-border-light">
      <button
        class="pb-2 text-sm font-medium text-ms-text-secondary hover:text-ms-text-regular"
        @click="router.push('/gestor/tempo-real')"
      >
        Gestão Tempo Real
      </button>
      <button class="border-b-2 border-ms-primary pb-2 text-sm font-semibold text-ms-primary">
        Gestão e Performance
      </button>
    </div>

    <!-- Subabas (chips) -->
    <div class="mb-5 flex flex-wrap gap-2">
      <button
        v-for="t in tabs"
        :key="t.key"
        class="rounded-full border px-4 py-1.5 text-sm font-medium transition"
        :class="
          activeTab === t.key
            ? 'border-ms-primary bg-ms-primary-light text-ms-primary'
            : 'border-ms-border-light text-ms-text-regular hover:border-ms-primary/40 hover:text-ms-primary'
        "
        @click="activeTab = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Conteúdo da subaba -->
    <component :is="tabComponents[current.key]" @go-tab="goTab" />
  </DashboardLayout>
</template>
