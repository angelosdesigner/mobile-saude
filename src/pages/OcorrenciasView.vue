<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import OcorrenciasBoard from '@/components/ocorrencias/OcorrenciasBoard.vue'
import OcorrenciasList from '@/components/ocorrencias/OcorrenciasList.vue'
import ConfigurarColunas from '@/components/ocorrencias/ConfigurarColunas.vue'
import { useOcorrencias } from '@/composables/useOcorrencias'
import {
  prioridadeOptions,
  slaOptions,
  tipoOcorrenciaOptions,
  tipoAtendimentoOptions,
  atendenteOptions,
} from '@/data/ocorrencias'

const route = useRoute()
const router = useRouter()

const { filters, activeFilterCount, clearFilters } = useOcorrencias()

// Interação principal: alterna Quadro/Lista (modo fica na URL ?view=).
const viewMode = computed<'quadro' | 'lista'>({
  get: () => (route.query.view === 'lista' ? 'lista' : 'quadro'),
  set: (v) => router.replace({ query: { ...route.query, view: v } }),
})

type FilterKey = 'prioridade' | 'sla' | 'tipoOcorrencia' | 'tipoAtendimento' | 'atendente'
const filterDefs: { key: FilterKey; label: string; options: string[]; width: string }[] = [
  { key: 'prioridade', label: 'Prioridade', options: prioridadeOptions, width: '!w-36' },
  { key: 'sla', label: 'SLA', options: slaOptions, width: '!w-32' },
  { key: 'tipoOcorrencia', label: 'Tipo de ocorrência', options: tipoOcorrenciaOptions, width: '!w-48' },
  { key: 'tipoAtendimento', label: 'Tipo de atendimento', options: tipoAtendimentoOptions, width: '!w-48' },
  { key: 'atendente', label: 'Atendente', options: atendenteOptions, width: '!w-44' },
]

const showColumns = ref(false)

const stats = [
  { label: 'Total', value: 10, color: '#909399' },
  { label: 'SLA regulatório', value: 3, color: '#F56C6C' },
  { label: 'SLA interno', value: 3, color: '#F56C6C' },
  { label: 'Atenção', value: 3, color: '#E6A23C' },
  { label: 'Meus pendentes', value: 1, color: '#409EFF' },
  { label: 'Pendentes do setor', value: 7, color: '#909399' },
  { label: 'Não atribuídos', value: 7, color: '#909399' },
  { label: 'Alta prioridade', value: 4, color: '#F56C6C' },
]
</script>

<template>
  <DashboardLayout>
    <!-- Cabeçalho: título + busca | modo de visualização -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold text-[#303133]">Ocorrências</h1>
        <el-input placeholder="Buscar protocolo" class="!w-72" clearable>
          <template #prefix>
            <svg class="h-4 w-4 text-[#C0C4CC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </template>
        </el-input>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-sm text-[#606266]">Modo de visualização:</span>
        <el-radio-group v-model="viewMode">
          <el-radio-button value="quadro">
            <span class="flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              Quadro
            </span>
          </el-radio-button>
          <el-radio-button value="lista">
            <span class="flex items-center gap-1.5">
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
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
        <el-button>Filtros avançados</el-button>
        <el-button>Filtros salvos</el-button>
        <el-button>Configurar filtros</el-button>
      </div>
    </div>

    <!-- Chips de estatísticas -->
    <div class="mb-5 flex flex-wrap items-center gap-2">
      <div
        v-for="s in stats"
        :key="s.label"
        class="flex items-center gap-2 rounded-full border border-[#EBEEF5] bg-white px-3 py-1"
      >
        <span class="inline-block h-2 w-2 rounded-full" :style="{ backgroundColor: s.color }" />
        <span class="text-xs text-[#606266]">{{ s.label }}:</span>
        <span class="text-xs font-semibold text-[#303133]">{{ s.value }}</span>
      </div>
    </div>

    <!-- Conteúdo: Quadro (kanban, drag-and-drop) ou Lista -->
    <OcorrenciasBoard v-if="viewMode === 'quadro'" />
    <OcorrenciasList v-else />

    <!-- Dialog de configuração de colunas -->
    <ConfigurarColunas v-model="showColumns" />
  </DashboardLayout>
</template>
