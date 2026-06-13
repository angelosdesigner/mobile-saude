<script setup lang="ts">
// Design System (styleguide vivo) — referência única de tokens e componentes.
// Consome os tokens reais (--color-ms-* via classes utilitárias + chartColors),
// então serve de QA visual: o que aparece aqui é o que o app usa.
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { chartColors } from '@/plugins/echarts'
import ChannelTag from '@/components/ui/ChannelTag.vue'
import FilterChips from '@/components/ui/FilterChips.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import MetricCard from '@/components/gestor/MetricCard.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import BarList from '@/components/gestor/BarList.vue'
import KanbanCard from '@/components/ui/KanbanCard.vue'
import NotificacaoItem from '@/components/notificacoes/NotificacaoItem.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import type { FilterChip } from '@/components/ui/filterChips'
import type { Notificacao } from '@/types/notificacoes'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

// ── Tokens (classes literais p/ o Tailwind detectar) ────────────────────────
const textTokens = [
  { name: 'ms-text-primary', cls: 'text-ms-text-primary' },
  { name: 'ms-text-regular', cls: 'text-ms-text-regular' },
  { name: 'ms-text-secondary', cls: 'text-ms-text-secondary' },
  { name: 'ms-text-placeholder', cls: 'text-ms-text-placeholder' },
]
const fillTokens = [
  { name: 'ms-primary', cls: 'bg-ms-primary' },
  { name: 'ms-primary-light', cls: 'bg-ms-primary-light' },
  { name: 'ms-success', cls: 'bg-ms-success' },
  { name: 'ms-warning', cls: 'bg-ms-warning' },
  { name: 'ms-danger', cls: 'bg-ms-danger' },
  { name: 'ms-teal', cls: 'bg-ms-teal' },
]
const surfaceTokens = [
  { name: 'ms-surface', cls: 'bg-ms-surface' },
  { name: 'ms-bg', cls: 'bg-ms-bg' },
  { name: 'ms-fill-light', cls: 'bg-ms-fill-light' },
  { name: 'ms-border', cls: 'bg-ms-border' },
  { name: 'ms-border-light', cls: 'bg-ms-border-light' },
  { name: 'ms-border-lighter', cls: 'bg-ms-border-lighter' },
]
const chartSwatches = Object.entries(chartColors).map(([name, hex]) => ({ name, hex }))

const typeScale = [
  { cls: 'text-xs', label: 'text-xs · 12px' },
  { cls: 'text-sm', label: 'text-sm · 14px' },
  { cls: 'text-base', label: 'text-base · 16px' },
  { cls: 'text-lg', label: 'text-lg · 18px' },
  { cls: 'text-xl', label: 'text-xl · 20px' },
  { cls: 'text-2xl', label: 'text-2xl · 24px' },
  { cls: 'text-3xl', label: 'text-3xl · 30px' },
]
const spacingScale = [
  { cls: 'w-1', label: '1 · 4px' },
  { cls: 'w-2', label: '2 · 8px' },
  { cls: 'w-3', label: '3 · 12px' },
  { cls: 'w-4', label: '4 · 16px' },
  { cls: 'w-5', label: '5 · 20px' },
  { cls: 'w-6', label: '6 · 24px' },
  { cls: 'w-8', label: '8 · 32px' },
]
const radiusScale = [
  { cls: 'rounded', label: 'rounded · 4px' },
  { cls: 'rounded-md', label: 'rounded-md · 6px' },
  { cls: 'rounded-lg', label: 'rounded-lg · 8px' },
  { cls: 'rounded-xl', label: 'rounded-xl · 12px' },
  { cls: 'rounded-full', label: 'rounded-full' },
]
const shadowScale = [
  { cls: 'shadow-sm', label: 'shadow-sm' },
  { cls: 'shadow', label: 'shadow' },
  { cls: 'shadow-md', label: 'shadow-md' },
  { cls: 'shadow-lg', label: 'shadow-lg' },
]

const iconNames = [
  'chevron-left',
  'chevron-right',
  'chevron-down',
  'search',
  'close',
  'plus',
  'sun',
  'moon',
  'eye',
  'edit',
] as const

// ── Exemplos vivos de componentes ───────────────────────────────────────────
const channels = ['WhatsApp', 'Telefone', 'App', 'Chat', 'Portal']

const chipSelection = ref<string[]>(['alta'])
const sampleChips: FilterChip[] = [
  { key: 'total', label: 'Total', value: 24, tone: 'neutral', filterable: false },
  { key: 'alta', label: 'Alta prioridade', value: 6, tone: 'danger' },
  { key: 'atencao', label: 'Atenção', value: 3, tone: 'warning' },
  { key: 'ok', label: 'No prazo', value: 15, tone: 'success' },
]

const sampleBars = [
  { label: 'Reembolso', value: 92, caption: '92% (20min)' },
  { label: 'Autorização', value: 74, caption: '74% (10min)' },
  { label: 'Financeiro', value: 45, caption: '45% (5min)' },
]

const sampleNotif: Notificacao = {
  id: 1,
  type: 'warning',
  category: 'sla',
  audience: 'todos',
  title: 'Atenção ao SLA de autorizações',
  desc: 'Volume acima da média hoje. Priorize casos com menor tempo restante.',
  time: '10min atrás',
  bucket: 'hoje',
  unread: true,
  setor: 'Autorização',
}

const listColumns: DataListColumn[] = [
  { key: 'protocolo', label: 'Protocolo', width: 160 },
  { key: 'beneficiario', label: 'Beneficiário', minWidth: 200 },
  { key: 'status', label: 'Status', width: 140 },
]
const listRows = [
  { id: 1, protocolo: 'OC-2026-001001', beneficiario: 'Maria Silva', status: 'Em análise' },
  { id: 2, protocolo: 'OC-2026-001002', beneficiario: 'João Pereira', status: 'Aguardando' },
  { id: 3, protocolo: 'OC-2026-001003', beneficiario: 'Ana Costa', status: 'Concluído' },
]
</script>

<template>
  <div class="min-h-dvh bg-ms-bg">
    <div class="mx-auto max-w-5xl px-6 py-8">
      <!-- Cabeçalho -->
      <header class="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-ms-text-primary">Design System</h1>
          <p class="mt-1 text-sm text-ms-text-secondary">
            Tokens e componentes da Mobile Saúde — fonte única de referência visual.
          </p>
        </div>
        <el-button @click="themeStore.toggle()">
          <AppIcon :name="isDark ? 'sun' : 'moon'" class="mr-1.5 h-4 w-4" />
          {{ isDark ? 'Modo claro' : 'Modo escuro' }}
        </el-button>
      </header>

      <!-- ════════ CORES ════════ -->
      <section class="mb-10">
        <h2 class="mb-4 border-b border-ms-border-light pb-2 text-lg font-bold text-ms-text-primary">
          Cores
        </h2>

        <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Texto</h3>
        <div class="mb-5 flex flex-wrap gap-4">
          <div v-for="t in textTokens" :key="t.name" class="rounded-lg border border-ms-border-light bg-ms-surface px-4 py-3">
            <span class="text-lg font-semibold" :class="t.cls">Aa</span>
            <div class="mt-1 text-[11px] text-ms-text-secondary">{{ t.name }}</div>
          </div>
        </div>

        <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Marca e semânticas</h3>
        <div class="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div v-for="c in fillTokens" :key="c.name" class="overflow-hidden rounded-lg border border-ms-border-light">
            <div class="h-12" :class="c.cls" />
            <div class="bg-ms-surface px-2 py-1.5 text-[11px] text-ms-text-secondary">{{ c.name }}</div>
          </div>
        </div>

        <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Superfícies e bordas</h3>
        <div class="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div v-for="c in surfaceTokens" :key="c.name" class="overflow-hidden rounded-lg border border-ms-border-light">
            <div class="h-12 border-b border-ms-border-light" :class="c.cls" />
            <div class="bg-ms-surface px-2 py-1.5 text-[11px] text-ms-text-secondary">{{ c.name }}</div>
          </div>
        </div>

        <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">
          Paleta dos gráficos
          <span class="font-normal text-ms-text-placeholder">(chartColors — ECharts)</span>
        </h3>
        <div class="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          <div v-for="c in chartSwatches" :key="c.name" class="overflow-hidden rounded-lg border border-ms-border-light">
            <div class="h-12" :style="{ backgroundColor: c.hex }" />
            <div class="bg-ms-surface px-2 py-1.5 text-[11px] text-ms-text-secondary">{{ c.name }}</div>
          </div>
        </div>
      </section>

      <!-- ════════ TIPOGRAFIA ════════ -->
      <section class="mb-10">
        <h2 class="mb-4 border-b border-ms-border-light pb-2 text-lg font-bold text-ms-text-primary">
          Tipografia <span class="text-sm font-normal text-ms-text-placeholder">· Inter</span>
        </h2>
        <div class="space-y-2 rounded-lg border border-ms-border-light bg-ms-surface p-5">
          <div v-for="t in typeScale" :key="t.cls" class="flex items-baseline gap-4">
            <span class="w-32 shrink-0 text-[11px] text-ms-text-placeholder">{{ t.label }}</span>
            <span :class="t.cls" class="font-semibold text-ms-text-primary">Mobile Saúde</span>
          </div>
        </div>
      </section>

      <!-- ════════ ESPAÇAMENTO / RAIO / SOMBRA ════════ -->
      <section class="mb-10">
        <h2 class="mb-4 border-b border-ms-border-light pb-2 text-lg font-bold text-ms-text-primary">
          Espaçamento, raio e sombra
        </h2>
        <div class="grid gap-5 lg:grid-cols-3">
          <!-- Espaçamento -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">Escala de espaçamento</h3>
            <div class="space-y-2">
              <div v-for="s in spacingScale" :key="s.cls" class="flex items-center gap-3">
                <div class="h-3 rounded-sm bg-ms-primary" :class="s.cls" />
                <span class="text-[11px] text-ms-text-secondary">{{ s.label }}</span>
              </div>
            </div>
          </div>
          <!-- Raio -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">Raio de borda</h3>
            <div class="flex flex-wrap gap-3">
              <div v-for="r in radiusScale" :key="r.cls" class="text-center">
                <div class="h-12 w-12 border-2 border-ms-primary bg-ms-primary-light" :class="r.cls" />
                <span class="mt-1 block text-[10px] text-ms-text-secondary">{{ r.label }}</span>
              </div>
            </div>
          </div>
          <!-- Sombra -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">Sombra</h3>
            <div class="flex flex-wrap gap-4">
              <div v-for="s in shadowScale" :key="s.cls" class="text-center">
                <div class="h-12 w-12 rounded-lg bg-ms-surface" :class="s.cls" />
                <span class="mt-2 block text-[10px] text-ms-text-secondary">{{ s.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ════════ COMPONENTES ════════ -->
      <section class="mb-10">
        <h2 class="mb-4 border-b border-ms-border-light pb-2 text-lg font-bold text-ms-text-primary">
          Componentes
        </h2>

        <div class="grid gap-5 lg:grid-cols-2">
          <!-- Botões -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">Botões (Element Plus)</h3>
            <div class="flex flex-wrap gap-2">
              <el-button type="primary">Primário</el-button>
              <el-button type="success">Sucesso</el-button>
              <el-button type="warning">Atenção</el-button>
              <el-button type="danger">Perigo</el-button>
              <el-button>Padrão</el-button>
              <el-button text type="primary">Texto</el-button>
            </div>
          </div>

          <!-- Tags -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">Tags</h3>
            <div class="flex flex-wrap items-center gap-2">
              <el-tag type="primary">Primário</el-tag>
              <el-tag type="success">Sucesso</el-tag>
              <el-tag type="warning">Atenção</el-tag>
              <el-tag type="danger" effect="plain">Risco</el-tag>
              <el-tag type="info" effect="light">Info</el-tag>
            </div>
          </div>

          <!-- ChannelTag -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">ChannelTag</h3>
            <div class="flex flex-wrap gap-4">
              <ChannelTag v-for="c in channels" :key="c" :channel="c" />
            </div>
          </div>

          <!-- FilterChips -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">
              FilterChips
              <span class="font-normal text-ms-text-placeholder">· {{ chipSelection.join(', ') || 'nenhum' }}</span>
            </h3>
            <FilterChips v-model="chipSelection" :chips="sampleChips" />
          </div>

          <!-- SectionHeader -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5 lg:col-span-2">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">SectionHeader</h3>
            <SectionHeader title="Gestão de Filas" subtitle="Controle dos tempos de espera e ocupação." />
          </div>

          <!-- MetricCard -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">MetricCard</h3>
            <div class="grid grid-cols-2 gap-3">
              <MetricCard label="Atendimentos" :value="31" delta="+4 hoje" delta-tone="up" />
              <MetricCard label="TME" value="14min" delta="↑ 1.2min" delta-tone="down" />
            </div>
          </div>

          <!-- ChartCard + BarList -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">ChartCard + BarList</h3>
            <ChartCard title="Ocupação por Fila" subtitle="% de uso da capacidade">
              <BarList :items="sampleBars" />
            </ChartCard>
          </div>

          <!-- KanbanCard -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">KanbanCard</h3>
            <KanbanCard highlight>
              <div class="text-sm font-semibold text-ms-text-primary">Maria Silva</div>
              <div class="mt-1 text-xs text-ms-text-regular">Fluxo: Reembolso</div>
              <template #footer>
                <ChannelTag channel="WhatsApp" />
              </template>
            </KanbanCard>
          </div>

          <!-- NotificacaoItem -->
          <div class="overflow-hidden rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">NotificacaoItem</h3>
            <div class="overflow-hidden rounded-lg border border-ms-border-light">
              <NotificacaoItem :notif="sampleNotif" />
            </div>
          </div>

          <!-- AppIcon -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">AppIcon</h3>
            <div class="flex flex-wrap gap-4">
              <div v-for="n in iconNames" :key="n" class="flex flex-col items-center gap-1 text-ms-text-regular">
                <AppIcon :name="n" class="h-5 w-5" />
                <span class="text-[10px] text-ms-text-placeholder">{{ n }}</span>
              </div>
            </div>
          </div>

          <!-- EmptyState -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">EmptyState</h3>
            <EmptyState title="Nenhuma ocorrência" description="Não há itens para os filtros aplicados." />
          </div>

          <!-- DataList -->
          <div class="rounded-lg border border-ms-border-light bg-ms-surface p-5 lg:col-span-2">
            <h3 class="mb-3 text-sm font-semibold text-ms-text-regular">DataList</h3>
            <DataList
              :columns="listColumns"
              :rows="listRows"
              :paginated="false"
              count-label="registros"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
