<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import OperacionalBoard from '@/components/gestor/OperacionalBoard.vue'
import { useGestorOcorrenciasStore } from '@/stores/gestorOcorrencias'
import type { StageTone, GestorStat } from '@/types/gestorOcorrencias'

const route = useRoute()
const router = useRouter()

const store = useGestorOcorrenciasStore()
const { statusPills, stats, loading, search } = storeToRefs(store)

onMounted(() => store.load())

const viewMode = computed({
  get: () => (route.query.view === 'lista' ? 'lista' : 'quadro'),
  set: (v) => router.replace({ query: { ...route.query, view: v } }),
})

// Filtros visuais (fiéis ao layout; lógica entra quando houver dados reais).
const filterDefs = [
  { label: 'Prioridade', options: ['Alta', 'Média', 'Baixa'] },
  { label: 'Fila', options: ['Reembolso', 'Autorização', 'Financeiro'] },
  { label: 'Tipo de ocorrência', options: ['Reembolso', 'Autorização', 'Dúvida'] },
  { label: 'Canal', options: ['WhatsApp', 'App', 'Portal', 'Telefone'] },
  { label: 'Atendente', options: ['Ana Silva', 'Lucas Mendes', 'Ana Souza'] },
]

const pillDot: Record<StageTone | 'info', string> = {
  primary: 'bg-ms-primary',
  info: 'bg-ms-text-secondary',
  warning: 'bg-ms-warning',
  teal: 'bg-ms-teal',
  success: 'bg-ms-success',
}

const statDot: Record<GestorStat['tone'], string> = {
  default: 'bg-ms-text-placeholder',
  danger: 'bg-ms-danger',
  warning: 'bg-ms-warning',
  success: 'bg-ms-success',
  primary: 'bg-ms-primary',
}
</script>

<template>
  <DashboardLayout>
    <!-- Cabeçalho: título + busca + modo de visualização -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-ms-text-primary">Ocorrências</h1>
        <el-input v-model="search" placeholder="Buscar ocorrência" class="!w-72" clearable>
          <template #prefix>
            <AppIcon name="search" class="h-4 w-4 text-ms-text-placeholder" />
          </template>
        </el-input>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-ms-text-secondary">Modo de visualização:</span>
        <el-radio-group v-model="viewMode">
          <el-radio-button value="quadro">Quadro</el-radio-button>
          <el-radio-button value="lista">Lista</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- Barra de status agregada -->
    <div class="mb-4 flex flex-wrap gap-3">
      <div
        v-for="p in statusPills"
        :key="p.label"
        class="flex items-center gap-2 rounded-lg border border-ms-border-light bg-white px-3 py-2"
      >
        <span class="h-2.5 w-2.5 rounded-full" :class="pillDot[p.tone]" />
        <span class="text-[11px] font-semibold uppercase tracking-wide text-ms-text-secondary">{{
          p.label
        }}</span>
        <span class="text-base font-bold text-ms-text-primary">{{ p.value }}</span>
      </div>
    </div>

    <!-- Linha de métricas -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <span
        v-for="s in stats"
        :key="s.label"
        class="flex items-center gap-1.5 rounded-full border border-ms-border-light bg-white px-3 py-1 text-xs text-ms-text-regular"
      >
        <span class="h-1.5 w-1.5 rounded-full" :class="statDot[s.tone]" />
        {{ s.label }}: <b class="text-ms-text-primary">{{ s.value }}</b>
      </span>
    </div>

    <!-- Filtros -->
    <div class="mb-4 flex flex-wrap items-center gap-2">
      <el-select
        v-for="f in filterDefs"
        :key="f.label"
        :placeholder="f.label"
        class="!w-40"
        clearable
      >
        <el-option v-for="o in f.options" :key="o" :label="o" :value="o" />
      </el-select>
      <div class="ml-auto flex items-center gap-2">
        <el-button>Status Atendimento</el-button>
        <el-button>Configurar colunas</el-button>
      </div>
    </div>

    <!-- Conteúdo -->
    <div v-loading="loading">
      <OperacionalBoard v-if="viewMode === 'quadro'" />
      <div
        v-else
        class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-ms-border py-16 text-center"
      >
        <p class="font-medium text-ms-text-regular">Modo Lista</p>
        <p class="text-sm text-ms-text-secondary">Em construção — o modo Quadro está disponível.</p>
      </div>
    </div>
  </DashboardLayout>
</template>
