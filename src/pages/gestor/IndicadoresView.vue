<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Tela de indicadores do gestor. Recebe o indicador pré-selecionado via ?ind=.
// Layout/conteúdo detalhado entram quando a tela do Figma for convertida; por ora
// lista os indicadores destacando o selecionado, com a navegação já cabeada.
const route = useRoute()

const indicadores = [
  { key: 'fix-call-resolution', label: 'Fix Call Resolution', value: '78%' },
  { key: 'resolucao-chamados', label: 'Resolução de Chamados', value: '92%' },
  { key: 'nps', label: 'NPS / Satisfação', value: '4.6' },
  { key: 'tma', label: 'TMA — Tempo Médio de Atendimento', value: '14min' },
  { key: 'tmef', label: 'TMEF — Tempo Médio na Fila', value: '4,2min' },
  { key: 'tme', label: 'TME — Tempo Médio de Espera', value: '12min' },
]

const selected = computed(() => (route.query.ind as string) || '')
</script>

<template>
  <DashboardLayout>
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-ms-text-primary">Indicadores</h1>
      <p class="mt-1 text-sm text-ms-text-secondary">
        Acompanhamento detalhado dos indicadores da operação.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <el-card
        v-for="i in indicadores"
        :key="i.key"
        shadow="never"
        body-class="!p-4"
        :class="
          i.key === selected
            ? '!border-ms-primary ring-1 ring-ms-primary'
            : '!border-ms-border-light'
        "
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-ms-text-primary">{{ i.label }}</span>
          <span
            v-if="i.key === selected"
            class="rounded-full bg-ms-primary/10 px-2 py-0.5 text-[11px] font-medium text-ms-primary"
            >Selecionado</span
          >
        </div>
        <div class="mt-2 text-2xl font-bold text-ms-text-primary">{{ i.value }}</div>
      </el-card>
    </div>

    <p class="mt-4 rounded-lg bg-ms-fill-light p-3 text-xs text-ms-text-secondary">
      Detalhamento de cada indicador (séries históricas, metas, drill-down) entra na próxima etapa,
      a partir da tela do Figma.
    </p>
  </DashboardLayout>
</template>
