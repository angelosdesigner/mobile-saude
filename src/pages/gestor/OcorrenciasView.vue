<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import OperacionalBoard from '@/components/gestor/OperacionalBoard.vue'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import { useGestorOcorrenciasStore } from '@/stores/gestorOcorrencias'
import { stages, type StageTone, type GestorStat, type GestorCard } from '@/types/gestorOcorrencias'

const route = useRoute()
const router = useRouter()

const store = useGestorOcorrenciasStore()
const { statusPills, stats, loading, search, filtered } = storeToRefs(store)

onMounted(() => store.load())

// ── Modo Lista (mesma fonte do Kanban; colunas próprias da visão do gestor) ──
const listColumns: DataListColumn[] = [
  { key: 'beneficiary', label: 'Beneficiário', minWidth: 200, sortable: true },
  { key: 'stage', label: 'Estágio', width: 180 },
  { key: 'channel', label: 'Canal', width: 120 },
  { key: 'atendente', label: 'Atendente', minWidth: 150 },
  { key: 'situacao', label: 'Situação', minWidth: 170 },
]

const stageMeta = Object.fromEntries(stages.map((s) => [s.key, s])) as Record<
  GestorCard['stage'],
  (typeof stages)[number]
>

const stageTagClass: Record<StageTone, string> = {
  primary: 'bg-ms-primary/10 text-ms-primary',
  warning: 'bg-ms-warning/10 text-ms-warning',
  teal: 'bg-ms-teal/10 text-ms-teal',
  success: 'bg-ms-success/10 text-ms-success',
}

// "Situação" resumida por estágio (mesma informação dos cards do Kanban).
function situacao(c: GestorCard): string {
  if (c.stage === 'automatizado') return c.flag ?? c.fluxo ?? '—'
  if (c.stage === 'fila') return `Posição ${c.posicao}º · ${c.espera}`
  if (c.stage === 'humano') return `${c.sla} · ${c.tempoAtendimento}`
  return `Concluído ${c.concluidoHora} · ${c.total}`
}

function onVisualizar(c: GestorCard) {
  ElMessage.info(`Visualizar: ${c.beneficiary}`)
}
function onEditar(c: GestorCard) {
  ElMessage.info(`Editar: ${c.beneficiary}`)
}

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
        class="flex items-center gap-2 rounded-lg border border-ms-border-light bg-ms-surface px-3 py-2"
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
        class="flex items-center gap-1.5 rounded-full border border-ms-border-light bg-ms-surface px-3 py-1 text-xs text-ms-text-regular"
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
      <DataList
        v-else
        :columns="listColumns"
        :rows="filtered"
        empty-text="Nenhuma ocorrência para os filtros aplicados"
        @visualizar="onVisualizar"
        @editar="onEditar"
      >
        <!-- Estágio (tag) -->
        <template #cell-stage="{ row }">
          <span
            class="rounded-full px-2 py-0.5 text-[11px] font-medium"
            :class="stageTagClass[stageMeta[row.stage].tone]"
            >{{ stageMeta[row.stage].label }}</span
          >
        </template>
        <!-- Atendente -->
        <template #cell-atendente="{ row }">
          <span :class="row.atendente ? 'text-ms-text-regular' : 'text-ms-text-placeholder'">{{
            row.atendente ?? '—'
          }}</span>
        </template>
        <!-- Situação -->
        <template #cell-situacao="{ row }">
          <span class="text-ms-text-regular">{{ situacao(row) }}</span>
        </template>

        <!-- Accordion: detalhes completos por estágio -->
        <template #expand="{ row }">
          <dl class="grid grid-cols-2 gap-x-8 gap-y-1 text-xs md:grid-cols-4">
            <div>
              <dt class="text-ms-text-secondary">Canal</dt>
              <dd class="text-ms-text-primary">{{ row.channel }}</dd>
            </div>
            <template v-if="row.stage === 'automatizado'">
              <div>
                <dt class="text-ms-text-secondary">Fluxo</dt>
                <dd class="text-ms-text-primary">{{ row.fluxo ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">Sinalização</dt>
                <dd class="text-ms-text-primary">{{ row.flag ?? '—' }}</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">Risco jurídico</dt>
                <dd :class="row.risco ? 'text-ms-danger' : 'text-ms-text-primary'">
                  {{ row.risco ? 'Sim' : 'Não' }}
                </dd>
              </div>
            </template>
            <template v-else-if="row.stage === 'fila'">
              <div>
                <dt class="text-ms-text-secondary">Fila</dt>
                <dd class="text-ms-text-primary">{{ row.filaTipo }}</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">Posição</dt>
                <dd class="text-ms-text-primary">{{ row.posicao }}º</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">Espera</dt>
                <dd class="text-ms-text-primary">{{ row.espera }}</dd>
              </div>
            </template>
            <template v-else-if="row.stage === 'humano'">
              <div>
                <dt class="text-ms-text-secondary">Atendente</dt>
                <dd class="text-ms-text-primary">{{ row.atendente }}</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">Tempo</dt>
                <dd class="text-ms-text-primary">{{ row.tempoAtendimento }}</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">SLA</dt>
                <dd class="text-ms-text-primary">{{ row.sla }}</dd>
              </div>
            </template>
            <template v-else>
              <div>
                <dt class="text-ms-text-secondary">Concluído</dt>
                <dd class="text-ms-text-primary">{{ row.concluidoHora }}</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">Atendente</dt>
                <dd class="text-ms-text-primary">{{ row.atendente }}</dd>
              </div>
              <div>
                <dt class="text-ms-text-secondary">Tempo total</dt>
                <dd class="text-ms-text-primary">{{ row.total }}</dd>
              </div>
            </template>
          </dl>
        </template>
      </DataList>
    </div>
  </DashboardLayout>
</template>
