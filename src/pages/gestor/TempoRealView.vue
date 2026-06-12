<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Dashboard de gestão em tempo real (Figma seção "Gestão tempo real"). Estrutura
// de duas camadas: grupo (Tempo Real | Performance) + abas. Cada aba é um
// componente próprio; só "Início" está implementada — as demais entram a seguir.
const InicioTab = defineAsyncComponent(() => import('@/components/gestor/tempo-real/InicioTab.vue'))

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'inicio', label: 'Início', ready: true },
  { key: 'atendimentos', label: 'Atendimentos', ready: false },
  { key: 'filas', label: 'Gestão de filas e atendimento humano', ready: false },
  { key: 'abandonos', label: 'Abandonos e desistência', ready: false },
  { key: 'performance', label: 'Performance e Workforce', ready: false },
  { key: 'equipe', label: 'Equipe', ready: false },
] as const

const activeTab = computed({
  get: () => (tabs.some((t) => t.key === route.query.tab) ? (route.query.tab as string) : 'inicio'),
  set: (v) => router.replace({ query: { ...route.query, tab: v } }),
})

const current = computed(() => tabs.find((t) => t.key === activeTab.value) ?? tabs[0])
</script>

<template>
  <DashboardLayout>
    <!-- Cabeçalho -->
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-ms-text-primary">Visão Geral do Atendimento</h1>
      <p class="mt-1 text-sm text-ms-text-secondary">
        Acompanhe em tempo real os principais indicadores, desempenho das equipes, filas e níveis de
        atendimento.
      </p>
    </div>

    <!-- Grupo de nível 1 -->
    <div class="mb-4 flex gap-6 border-b border-ms-border-light">
      <button class="border-b-2 border-ms-primary pb-2 text-sm font-semibold text-ms-primary">
        Gestão Tempo Real
      </button>
      <button class="pb-2 text-sm font-medium text-ms-text-secondary hover:text-ms-text-regular">
        Gestão e Performance
      </button>
    </div>

    <!-- Abas (chips) -->
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

    <!-- Conteúdo da aba -->
    <InicioTab v-if="current.ready" />
    <div
      v-else
      class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-ms-border py-20 text-center"
    >
      <p class="font-medium text-ms-text-regular">{{ current.label }}</p>
      <p
        v-if="route.query.filtro"
        class="rounded-full bg-ms-primary/10 px-3 py-1 text-sm text-ms-primary"
      >
        Filtro pré-selecionado: <b>{{ route.query.filtro }}</b>
      </p>
      <p class="text-sm text-ms-text-secondary">Em construção — chega na próxima etapa do fluxo.</p>
    </div>
  </DashboardLayout>
</template>
