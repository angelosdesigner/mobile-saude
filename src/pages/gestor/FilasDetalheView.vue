<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import KpiStatCard from '@/components/gestor/KpiStatCard.vue'
import RecomendacoesIA from '@/components/gestor/RecomendacoesIA.vue'
import IndicadorSelector from '@/components/gestor/IndicadorSelector.vue'
import PeriodoSelector from '@/components/gestor/PeriodoSelector.vue'
import StickyPeriodo from '@/components/gestor/StickyPeriodo.vue'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import { useChartColors } from '@/plugins/echarts'
import { useActionFeedback } from '@/composables/useActionFeedback'
import { normalizeFila } from '@/data/gestorTaxonomia'
import {
  periodos,
  contexto,
  resumoExecutivo,
  filasTabela,
  filasAlerta,
  correlacao,
  comoInterpretar,
  indicadores,
  graficoPeriodos,
  horasGrafico,
  filasEvolucao,
  graficoMeta,
  anotacoes,
  abandonoMetrics,
  abandonosPorHora,
  abandonoPorAssunto,
  beneficiarios,
  totalAbandonos,
  diagnosticoFila,
  recomendacoesFila,
  proximaAcao,
  type Indicador,
  type CorrelStatus,
} from '@/data/gestorFilasDetalhe'

// Tela de detalhe "Gestão de Filas e Atendimento Humano" (drill-down da aba
// Gestão de filas) — estrutura padrão das telas de detalhe do gestor.
const C = useChartColors()
const { comingSoon } = useActionFeedback()
const router = useRouter()

const periodoAtivo = ref<string>('Hoje')
const indicadorAtivo = ref<Indicador>('TME')
const graficoPeriodo = ref<string>('Hoje')

// Filas ativas no gráfico (toggle). Default: as marcadas em `ativoPadrao`.
const filasAtivas = ref<string[]>(filasEvolucao.filter((f) => f.ativoPadrao).map((f) => f.key))
function toggleFila(key: string) {
  const i = filasAtivas.value.indexOf(key)
  if (i >= 0) filasAtivas.value.splice(i, 1)
  else filasAtivas.value.push(key)
}
function selecionarTodas() {
  filasAtivas.value = filasEvolucao.map((f) => f.key)
}

// Cor por fila (chart + chips).
const filaColor: Record<string, string> = {
  reembolso: 'warning',
  duvidas: 'primary',
  autorizacoes: 'success',
  financeiro: 'danger',
}
const corDe = computed<Record<string, string>>(() => ({
  reembolso: C.warning,
  duvidas: C.primary,
  autorizacoes: C.success,
  financeiro: C.danger,
}))
const chipDot: Record<string, string> = {
  warning: 'bg-ms-warning',
  primary: 'bg-ms-primary',
  success: 'bg-ms-success',
  danger: 'bg-ms-danger',
}

const ehMin = computed(() => indicadorAtivo.value === 'TME' || indicadorAtivo.value === 'TMA')
const unidade = computed(() => (ehMin.value ? 'min' : '%'))

// Deriva a série do indicador ativo a partir do TME base de cada fila.
function serieDe(tme: number[]): number[] {
  switch (indicadorAtivo.value) {
    case 'TMA':
      return tme.map((v) => Math.round(v * 0.8))
    case 'SLA':
      return tme.map((v) => Math.min(99, Math.max(40, Math.round(100 - v * 2.2))))
    case 'Ocupação':
      return tme.map((v) => Math.min(100, Math.max(0, Math.round(55 + v * 2.2))))
    default:
      return tme
  }
}

const eixoY = computed(() =>
  ehMin.value ? { min: 0, max: 20 } : indicadorAtivo.value === 'SLA' ? { min: 40, max: 100 } : { min: 0, max: 100 },
)

const graficoOption = computed(() => {
  const meta = graficoMeta[indicadorAtivo.value]
  const series = filasEvolucao
    .filter((f) => filasAtivas.value.includes(f.key))
    .map((f) => ({
      name: f.label,
      type: 'line' as const,
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      data: serieDe(f.tme),
      lineStyle: { color: corDe.value[f.key], width: 2.5 },
      itemStyle: { color: corDe.value[f.key] },
    }))
  return {
    tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}${unidade.value}` },
    legend: { show: false },
    grid: { left: 44, right: 16, top: 16, bottom: 28 },
    xAxis: {
      type: 'category',
      data: horasGrafico,
      axisLabel: { color: C.axis, fontSize: 10 },
      axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: {
      type: 'value',
      ...eixoY.value,
      axisLabel: { color: C.axis, fontSize: 10, formatter: `{value}${unidade.value}` },
      splitLine: { lineStyle: { color: C.split } },
    },
    series: [
      ...series,
      {
        name: `Meta ${meta}${unidade.value}`,
        type: 'line',
        symbol: 'none',
        data: horasGrafico.map(() => meta),
        lineStyle: { color: C.success, type: 'dashed', width: 1.5 },
        itemStyle: { color: C.success },
      },
    ],
  }
})

// Legenda/KPI por fila ativa: valor atual (último ponto) + desvio vs meta.
const legendaFilas = computed(() => {
  const meta = graficoMeta[indicadorAtivo.value]
  return filasEvolucao
    .filter((f) => filasAtivas.value.includes(f.key))
    .map((f) => {
      const serie = serieDe(f.tme)
      const valor = serie[serie.length - 1]
      let delta = ''
      if (ehMin.value) {
        const pct = Math.round(((valor - meta) / meta) * 100)
        delta = pct > 0 ? `↑ +${pct}% acima da meta` : '✓ dentro da meta'
      } else if (indicadorAtivo.value === 'SLA') {
        const pct = Math.round(((meta - valor) / meta) * 100)
        delta = valor < meta ? `↓ ${pct}% abaixo da meta` : '✓ na meta'
      } else {
        delta = valor >= meta ? '↑ acima do ideal' : '✓ saudável'
      }
      return { label: f.label, color: corDe.value[f.key], valor: `${valor}${unidade.value}`, delta, ruim: ehMin.value ? valor > meta : valor < meta }
    })
})

// ── Abandonos por hora (barras) ───────────────────────────────────────────────
const abandonoHoraOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 24, right: 8, top: 24, bottom: 24 },
  xAxis: {
    type: 'category',
    data: abandonosPorHora.horas,
    axisLabel: { color: C.axis, fontSize: 10 },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: { type: 'value', axisLabel: { color: C.axis, fontSize: 10 }, splitLine: { lineStyle: { color: C.split } } },
  series: [
    {
      type: 'bar',
      barWidth: '52%',
      data: abandonosPorHora.valores.map((v, i) => ({
        value: v,
        itemStyle: { color: i === abandonosPorHora.picoIdx ? C.danger : C.primary, opacity: i === abandonosPorHora.picoIdx ? 0.9 : 0.4, borderRadius: [3, 3, 0, 0] },
      })),
      markLine: {
        symbol: 'none',
        silent: true,
        data: [{ yAxis: abandonosPorHora.media, label: { formatter: `média: ${abandonosPorHora.media}`, color: C.axis, fontSize: 10, position: 'insideEndTop' }, lineStyle: { color: C.axis, type: 'dashed' } }],
      },
    },
  ],
}))

// ── Por assunto (pizza) ───────────────────────────────────────────────────────
const assuntoCor: Record<string, string> = {
  Reembolso: 'warning',
  'Dúvidas Adm.': 'primary',
  Autorizações: 'success',
  Financeiro: 'danger',
}
const abandonoAssuntoOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  series: [
    {
      type: 'pie',
      radius: ['45%', '78%'],
      label: { show: false },
      data: abandonoPorAssunto.map((a) => ({
        value: a.value,
        name: a.nome,
        itemStyle: { color: corDe.value[{ Reembolso: 'reembolso', 'Dúvidas Adm.': 'duvidas', Autorizações: 'autorizacoes', Financeiro: 'financeiro' }[a.nome] ?? 'reembolso'] },
      })),
    },
  ],
}))

// ── Tabela de filas ───────────────────────────────────────────────────────────
const filaTone: Record<'danger' | 'warning' | 'success', string> = {
  danger: 'bg-ms-danger',
  warning: 'bg-ms-warning',
  success: 'bg-ms-success',
}
const filaColumns: DataListColumn[] = [
  { key: 'fila', label: 'Fila', minWidth: 170, sortable: true },
  { key: 'disponiveis', label: 'Atendentes', align: 'right', width: 110, sortable: true },
  { key: 'emEspera', label: 'Em espera', align: 'right', width: 110, sortable: true },
  { key: 'emAtendimento', label: 'Em atend.', align: 'right', width: 110, sortable: true },
  { key: 'finalizados', label: 'Concluídos', align: 'right', width: 110, sortable: true },
  { key: 'tme', label: 'TME', align: 'right', width: 90 },
  { key: 'tma', label: 'TMA', align: 'right', width: 90 },
  { key: 'nps', label: 'NPS', align: 'right', width: 80 },
  { key: 'abandonos', label: 'Abandonos', align: 'right', width: 110, sortable: true },
  { key: 'reabertura', label: 'Reabertura', align: 'right', width: 110, sortable: true },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupacao as number },
  { key: 'acao', label: 'Ação', width: 110 },
]
const ocupTone = (v: number) => (v >= 90 ? 'text-ms-danger' : v >= 70 ? 'text-ms-warning' : 'text-ms-success')

function abrirFila(fila: string) {
  router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', fila: normalizeFila(fila) } })
}

// ── Correlação operacional ────────────────────────────────────────────────────
const tmeSeg = (s: string) => {
  if (s === '—') return Number.POSITIVE_INFINITY
  const [m, sec] = s.split(':').map(Number)
  return (m || 0) * 60 + (sec || 0)
}
const correlStatusOrder: Record<CorrelStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const correlColumns: DataListColumn[] = [
  { key: 'fila', label: 'Fila', minWidth: 150, sortable: true },
  { key: 'volume', label: 'Volume', align: 'right', width: 100, sortable: true },
  { key: 'sla', label: 'SLA', align: 'right', width: 90, sortBy: (r) => r.sla as number },
  { key: 'tme', label: 'TME', align: 'right', width: 90, sortBy: (r) => tmeSeg(r.tme as string) },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupacao as number },
  { key: 'espera', label: 'T. espera', align: 'right', width: 110, sortBy: (r) => tmeSeg(r.espera as string) },
  { key: 'gargalo', label: 'Gargalo', minWidth: 240 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => correlStatusOrder[r.status as CorrelStatus] },
]
const correlStatusTone: Record<CorrelStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
const slaTone = (v: number) => (v >= 90 ? 'text-ms-success' : v >= 70 ? 'text-ms-warning' : 'text-ms-danger')

// ── Registro de beneficiários ─────────────────────────────────────────────────
const beneficiarioColumns: DataListColumn[] = [
  { key: 'beneficiario', label: 'Beneficiário', minWidth: 140, sortable: true },
  { key: 'fila', label: 'Fila', width: 140, sortable: true },
  { key: 'assunto', label: 'Assunto', minWidth: 160 },
  { key: 'espera', label: 'Espera', align: 'right', width: 100, sortBy: (r) => parseInt(String(r.espera)) },
  { key: 'horario', label: 'Horário', align: 'right', width: 100, sortable: true },
  { key: 'tentativas', label: 'Tentativas', width: 110 },
  { key: 'acao', label: 'Ação', width: 110 },
]

const abandonoMetricTone: Record<'danger' | 'warning' | 'neutral', string> = {
  danger: 'text-ms-danger',
  warning: 'text-ms-warning',
  neutral: 'text-ms-text-primary',
}
</script>

<template>
  <DashboardLayout>
    <!-- Seletor de período fixo no topo (sticky · à direita) -->
    <StickyPeriodo>
      <PeriodoSelector v-model="periodoAtivo" :options="periodos" />
    </StickyPeriodo>

    <!-- Breadcrumb -->
    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real', query: { tab: 'filas' } }"
        >Gestão de filas e atendimento humano</el-breadcrumb-item
      >
      <el-breadcrumb-item>Detalhes</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Cabeçalho/contexto -->
    <el-card shadow="never" body-class="!p-5" class="mb-5 overflow-hidden !border-ms-border-light">
      <div class="-mx-5 -mt-5 mb-4 h-1 bg-ms-primary" />
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-xs">
            <span class="flex items-center gap-1.5 font-bold uppercase tracking-wide text-ms-primary">
              <span class="h-2 w-2 rounded-full bg-ms-primary" />{{ contexto.badge }}
            </span>
            <span class="text-ms-text-secondary">· {{ contexto.prioridade }}</span>
          </div>
          <h1 class="mt-2 text-2xl font-bold text-ms-text-primary">{{ contexto.titulo }}</h1>
          <p class="mt-1 text-sm text-ms-text-secondary">{{ contexto.subtitulo }}</p>
        </div>
        <span class="shrink-0 text-2xs text-ms-text-secondary">{{ contexto.atualizado }}</span>
      </div>
    </el-card>

    <!-- 1) Resumo executivo -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Resumo executivo
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">Estado atual das filas e do atendimento humano</p>
    <div class="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <KpiStatCard
        v-for="k in resumoExecutivo"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
      />
    </div>

    <!-- 2) Tabela de filas -->
    <ChartCard
      title="Gestão de filas e atendimento humano"
      subtitle="Volume em tempo real das filas e do atendimento humano"
      class="mb-3"
    >
      <DataList
        :columns="filaColumns"
        :rows="filasTabela"
        row-key="fila"
        :selectable="false"
        :expandable="false"
        :actions="false"
        top-scrollbar
        count-label="filas"
      >
        <template #cell-fila="{ row }">
          <span class="flex items-center gap-1.5 font-medium text-ms-text-primary">
            <span class="h-2 w-2 rounded-full" :class="filaTone[row.tone]" />{{ row.fila }}
          </span>
        </template>
        <template #cell-ocupacao="{ row }">
          <span class="font-medium" :class="ocupTone(row.ocupacao)">{{ row.ocupacao }}%</span>
        </template>
        <template #cell-acao="{ row }">
          <el-button text type="primary" size="small" @click="abrirFila(row.fila)"
            >Detalhes →</el-button
          >
        </template>
      </DataList>
    </ChartCard>
    <div
      class="mb-5 flex items-center gap-2 rounded-lg border border-ms-danger/30 bg-ms-danger/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-danger">⊘</span>{{ filasAlerta }}
    </div>

    <!-- 3) Gráfico principal -->
    <ChartCard
      title="Gráfico principal · fila × período × indicador"
      subtitle="Evolução dos indicadores por fila ao longo do tempo"
      class="mb-5"
    >
      <!-- Controles -->
      <div class="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <IndicadorSelector v-model="indicadorAtivo" label="Indicador:" :options="indicadores" />
        <PeriodoSelector v-model="graficoPeriodo" label="Período:" :options="graficoPeriodos" />
      </div>
      <!-- Chips de fila (toggle) -->
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <span class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary"
          >Filas:</span
        >
        <button
          v-for="f in filasEvolucao"
          :key="f.key"
          type="button"
          class="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition"
          :class="
            filasAtivas.includes(f.key)
              ? 'border-ms-border bg-ms-fill-light font-medium text-ms-text-primary'
              : 'border-ms-border-light text-ms-text-secondary hover:bg-ms-fill-light'
          "
          @click="toggleFila(f.key)"
        >
          <span
            class="h-2 w-2 rounded-full"
            :class="filasAtivas.includes(f.key) ? chipDot[filaColor[f.key]] : 'bg-ms-text-placeholder'"
          />{{ f.label }}
        </button>
        <button class="text-xs font-medium text-ms-primary hover:underline" @click="selecionarTodas">
          + Selecionar todas
        </button>
      </div>
      <div class="h-64 w-full">
        <VChart class="h-full w-full" :option="graficoOption" autoresize />
      </div>
      <!-- Legenda KPI + anotações -->
      <div class="mt-3 grid gap-3 lg:grid-cols-2">
        <div class="flex flex-col justify-center gap-2">
          <div v-for="l in legendaFilas" :key="l.label" class="flex items-center gap-2 text-sm">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: l.color }" />
            <span class="text-ms-text-regular">{{ l.label }}</span>
            <span class="font-semibold text-ms-text-primary">{{ l.valor }} ({{ indicadorAtivo }})</span>
            <span class="text-2xs" :class="l.ruim ? 'text-ms-danger' : 'text-ms-success'">{{ l.delta }}</span>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="a in anotacoes"
            :key="a.titulo"
            class="rounded-lg border border-ms-border-light p-2.5 text-center"
          >
            <div class="text-2xs uppercase tracking-wide text-ms-text-secondary">{{ a.titulo }}</div>
            <div class="mt-0.5 text-base font-bold text-ms-text-primary">{{ a.valor }}</div>
            <div class="text-2xs text-ms-text-secondary">{{ a.sub }}</div>
          </div>
        </div>
      </div>
    </ChartCard>

    <!-- 4) Correlação operacional -->
    <ChartCard
      title="Correlação operacional"
      subtitle="Volume × SLA × TME × Ocupação × Espera · Por fila · Identificação de gargalos"
      class="mb-3"
    >
      <DataList
        :columns="correlColumns"
        :rows="correlacao"
        row-key="fila"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="filas"
      >
        <template #cell-sla="{ row }">
          <span class="font-medium" :class="slaTone(row.sla)">{{ row.sla }}%</span>
        </template>
        <template #cell-ocupacao="{ row }">
          <span class="font-medium" :class="ocupTone(row.ocupacao)">{{ row.ocupacao }}%</span>
        </template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="correlStatusTone[row.status].text">
            <span class="h-2 w-2 rounded-full" :class="correlStatusTone[row.status].dot" />{{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>
    <div
      class="mb-5 flex items-start gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5"
    >
      <span class="text-ms-primary">ℹ</span>
      <div class="text-xs text-ms-text-regular">
        <span class="font-semibold text-ms-text-primary">Como interpretar</span>
        <p class="mt-0.5 leading-relaxed">{{ comoInterpretar }}</p>
      </div>
    </div>

    <!-- Fila de abandono + Registro de beneficiários — ocultos (5 seções) -->
    <template v-if="false">
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Fila de abandono
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Beneficiários que desistiram antes do atendimento · subdivisão por assunto
    </p>
    <div class="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card
        v-for="m in abandonoMetrics"
        :key="m.label"
        shadow="never"
        body-class="!p-4"
        class="!border-ms-border-light"
      >
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          {{ m.label }}
        </div>
        <div class="mt-1 text-2xl font-bold" :class="abandonoMetricTone[m.tone]">{{ m.value }}</div>
        <div class="mt-0.5 text-2xs text-ms-text-secondary">{{ m.sub }}</div>
      </el-card>
    </div>
    <div class="mb-5 grid gap-4 lg:grid-cols-3">
      <ChartCard title="Abandonos por hora" :subtitle="abandonosPorHora.picoLabel" class="lg:col-span-2">
        <div class="h-52 w-full">
          <VChart class="h-full w-full" :option="abandonoHoraOption" autoresize />
        </div>
      </ChartCard>
      <ChartCard title="Por assunto" subtitle="Motivos de desistência">
        <div class="h-40 w-full">
          <VChart class="h-full w-full" :option="abandonoAssuntoOption" autoresize />
        </div>
        <div class="mt-auto space-y-1 text-xs">
          <div v-for="a in abandonoPorAssunto" :key="a.nome" class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-ms-text-regular">
              <span class="h-2 w-2 rounded-full" :class="chipDot[assuntoCor[a.nome]]" />{{ a.nome }}
            </span>
            <span class="font-medium text-ms-text-primary">{{ a.value }}%</span>
          </div>
        </div>
      </ChartCard>
    </div>

    <!-- 5) Registro de beneficiários -->
    <ChartCard
      title="Registro de beneficiários"
      subtitle="Período atual · ordenado por tempo de espera"
      class="mb-3"
    >
      <DataList
        :columns="beneficiarioColumns"
        :rows="beneficiarios"
        row-key="beneficiario"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="beneficiários"
      >
        <template #cell-acao>
          <el-button text type="primary" size="small" @click="comingSoon('Ver caso')"
            >Ver caso →</el-button
          >
        </template>
      </DataList>
      <div class="mt-2 text-right">
        <button class="text-xs font-medium text-ms-primary hover:underline" @click="comingSoon('Ver todos os abandonos')">
          Ver todos os {{ totalAbandonos }} abandonos →
        </button>
      </div>
    </ChartCard>
    </template>

    <!-- 5) Insights da IA -->
    <RecomendacoesIA
      subtitle="Ações ordenadas por impacto · mitigação imediata da Fila Dúvidas Adm."
      diagnostico-titulo="Diagnóstico da Fila"
      :confianca="diagnosticoFila.confianca"
      :texto="diagnosticoFila.texto"
      :recomendacoes="recomendacoesFila"
    />

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/tempo-real', query: { tab: 'filas' } }"
        class="text-ms-primary no-underline hover:underline"
        >← Voltar ao Dashboard</router-link
      >
      <span class="text-ms-text-secondary">
        Próxima ação prioritária:
        <span class="font-medium text-ms-warning">{{ proximaAcao }} →</span>
      </span>
    </div>
  </DashboardLayout>
</template>
