<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import OcorrenciasBoard from '@/components/ocorrencias/OcorrenciasBoard.vue'
import OcorrenciasList from '@/components/ocorrencias/OcorrenciasList.vue'
import ConfigurarColunas from '@/components/ocorrencias/ConfigurarColunas.vue'
import FiltrosAvancados from '@/components/ocorrencias/FiltrosAvancados.vue'
import FilterChips from '@/components/ui/FilterChips.vue'
import type { ChipTone, FilterChip } from '@/components/ui/filterChips'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { useOcorrenciasStore, type StatTone } from '@/stores/ocorrencias'
import {
  slaOptions,
  tipoOcorrenciaOptions,
  tipoAtendimentoOptions,
  atendenteOptions,
} from '@/types/ocorrencias'

const route = useRoute()
const router = useRouter()

const store = useOcorrenciasStore()
const { activeFilterCount, stats, quickFilters } = storeToRefs(store)
const { filters, savedFilters } = store
const { clearFilters, applyPreset } = store

const { comingSoon, done } = useActionFeedback()

// Aplica um preset salvo e confirma via toast.
function onPreset(p: (typeof savedFilters)[number]) {
  applyPreset(p)
  done(`Filtro "${p.name}" aplicado`)
}

// Tom semântico do store → tom dos chips (cor fica fora do estado).
const statToneToChip: Record<StatTone, ChipTone> = {
  secondary: 'neutral',
  danger: 'danger',
  warning: 'warning',
  primary: 'primary',
  success: 'success',
}
const chips = computed<FilterChip[]>(() =>
  stats.value.map((s) => ({
    key: s.key,
    label: s.label,
    value: s.value,
    tone: statToneToChip[s.tone],
    filterable: s.filterable,
  })),
)

onMounted(() => store.load())

// Interação principal: alterna Quadro/Lista (modo fica na URL ?view=).
const viewMode = computed<'quadro' | 'lista'>({
  get: () => (route.query.view === 'lista' ? 'lista' : 'quadro'),
  set: (v) => router.replace({ query: { ...route.query, view: v } }),
})

type FilterKey = 'sla' | 'tipoOcorrencia' | 'tipoAtendimento' | 'atendente'
const filterDefs: { key: FilterKey; label: string; options: readonly string[]; width: string }[] = [
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
        <!-- No modo lista, a configuração de colunas fica no ▥ da própria tabela. -->
        <el-button v-if="viewMode === 'quadro'" @click="showColumns = true"
          >Configurar colunas</el-button
        >
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
        <el-dropdown trigger="click" @command="onPreset">
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
        <el-button @click="comingSoon('Configurar filtros')">Configurar filtros</el-button>
      </div>
    </div>

    <!-- Chips de estatísticas (clicáveis, multi-seleção como filtros rápidos) -->
    <div class="mb-5">
      <FilterChips v-model="quickFilters" :chips="chips" />
    </div>

    <!-- Conteúdo: Quadro (kanban, drag-and-drop) ou Lista -->
    <OcorrenciasBoard v-if="viewMode === 'quadro'" />
    <OcorrenciasList v-else />

    <!-- Dialog de configuração de colunas + drawer de filtros avançados -->
    <ConfigurarColunas v-model="showColumns" />
    <FiltrosAvancados v-model="showAvancados" />
  </DashboardLayout>
</template>
