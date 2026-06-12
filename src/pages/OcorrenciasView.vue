<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import OcorrenciasBoard from '@/components/ocorrencias/OcorrenciasBoard.vue'
import OcorrenciasList from '@/components/ocorrencias/OcorrenciasList.vue'
import ConfigurarColunas from '@/components/ocorrencias/ConfigurarColunas.vue'
import FiltrosAvancados from '@/components/ocorrencias/FiltrosAvancados.vue'
import { useOcorrenciasStore, type StatTone } from '@/stores/ocorrencias'
import {
  prioridadeOptions,
  slaOptions,
  tipoOcorrenciaOptions,
  tipoAtendimentoOptions,
  atendenteOptions,
} from '@/types/ocorrencias'

const route = useRoute()
const router = useRouter()

const store = useOcorrenciasStore()
const { activeFilterCount, stats } = storeToRefs(store)
const { filters, savedFilters } = store
const { clearFilters, applyPreset } = store

onMounted(() => store.load())

// Interação principal: alterna Quadro/Lista (modo fica na URL ?view=).
const viewMode = computed<'quadro' | 'lista'>({
  get: () => (route.query.view === 'lista' ? 'lista' : 'quadro'),
  set: (v) => router.replace({ query: { ...route.query, view: v } }),
})

type FilterKey = 'prioridade' | 'sla' | 'tipoOcorrencia' | 'tipoAtendimento' | 'atendente'
const filterDefs: { key: FilterKey; label: string; options: readonly string[]; width: string }[] = [
  { key: 'prioridade', label: 'Prioridade', options: prioridadeOptions, width: '!w-36' },
  { key: 'sla', label: 'SLA', options: slaOptions, width: '!w-32' },
  {
    key: 'tipoOcorrencia',
    label: 'Tipo de ocorrência',
    options: tipoOcorrenciaOptions,
    width: '!w-48',
  },
  {
    key: 'tipoAtendimento',
    label: 'Tipo de atendimento',
    options: tipoAtendimentoOptions,
    width: '!w-48',
  },
  { key: 'atendente', label: 'Atendente', options: atendenteOptions, width: '!w-44' },
]

const showColumns = ref(false)
const showAvancados = ref(false)

// `stats` vem do store (derivado do conjunto filtrado) com tom semântico;
// aqui mapeamos o tom para o token de cor do dot.
const statDot: Record<StatTone, string> = {
  secondary: 'bg-ms-text-secondary',
  danger: 'bg-ms-danger',
  warning: 'bg-ms-warning',
  primary: 'bg-ms-primary',
  success: 'bg-ms-success',
}
</script>

<template>
  <DashboardLayout>
    <!-- Cabeçalho: título + busca | modo de visualização -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-ms-text-primary">Ocorrências</h1>
        <el-input placeholder="Buscar protocolo" class="!w-72" clearable>
          <template #prefix>
            <AppIcon name="search" class="h-4 w-4 text-ms-text-placeholder" />
          </template>
        </el-input>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm text-ms-text-regular">Modo de visualização:</span>
        <el-radio-group v-model="viewMode">
          <el-radio-button value="quadro">
            <span class="flex items-center gap-1.5">
              <svg
                class="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Quadro
            </span>
          </el-radio-button>
          <el-radio-button value="lista">
            <span class="flex items-center gap-1.5">
              <svg
                class="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
              Lista
            </span>
          </el-radio-button>
        </el-radio-group>
        <el-button @click="showColumns = true">Configurar colunas</el-button>
      </div>
    </div>

    <!-- Barra de filtros (multi-select com opções do Figma) -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-2">
        <el-select
          v-for="f in filterDefs"
          :key="f.key"
          v-model="filters[f.key]"
          multiple
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="1"
          :placeholder="f.label"
          :class="f.width"
          clearable
        >
          <el-option v-for="opt in f.options" :key="opt" :label="opt" :value="opt" />
        </el-select>
        <el-button v-if="activeFilterCount" text type="primary" @click="clearFilters">
          Limpar ({{ activeFilterCount }})
        </el-button>
      </div>
      <div class="flex items-center gap-2">
        <el-button @click="showAvancados = true">Filtros avançados</el-button>
        <el-dropdown trigger="click" @command="applyPreset">
          <el-button>
            Filtros salvos
            <AppIcon name="chevron-down" class="ml-1 h-3 w-3" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="p in savedFilters" :key="p.name" :command="p">{{
                p.name
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button>Configurar filtros</el-button>
      </div>
    </div>

    <!-- Chips de estatísticas -->
    <div class="mb-5 flex flex-wrap items-center gap-2">
      <div
        v-for="s in stats"
        :key="s.label"
        class="flex items-center gap-2 rounded-full border border-ms-border-light bg-ms-surface px-3 py-1"
      >
        <span class="inline-block h-2 w-2 rounded-full" :class="statDot[s.tone]" />
        <span class="text-xs text-ms-text-regular">{{ s.label }}:</span>
        <span class="text-xs font-semibold text-ms-text-primary">{{ s.value }}</span>
      </div>
    </div>

    <!-- Conteúdo: Quadro (kanban, drag-and-drop) ou Lista -->
    <OcorrenciasBoard v-if="viewMode === 'quadro'" />
    <OcorrenciasList v-else />

    <!-- Dialog de configuração de colunas + drawer de filtros avançados -->
    <ConfigurarColunas v-model="showColumns" />
    <FiltrosAvancados v-model="showAvancados" />
  </DashboardLayout>
</template>
