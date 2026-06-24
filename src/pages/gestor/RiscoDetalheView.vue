<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import {
  periodos,
  chips,
  contextos,
  riscoAgora,
  evolucaoBase,
  evolucaoMetricas,
  correlacao,
  comoInterpretar,
  riscoControlado,
  type RiscoContexto,
  type RiscoStatus,
  type EvolucaoMetrica,
} from '@/data/gestorRiscoDetalhe'

// Tela de detalhe "Risk Center" (drill-down da subaba Gestão de Riscos).
// Estrutura padrão das telas de detalhe do gestor (5 blocos). Os chips no topo
// selecionam o TIPO de risco e reconfiguram KPIs/evolução/IA; as tabelas
// mantêm todos os tipos (comparativo), com o tipo ativo destacado.
const C = useChartColors()
const route = useRoute()
const router = useRouter()

const chaveValida = (v: unknown): v is RiscoContexto => typeof v === 'string' && v in contextos
const ctxKey = ref<RiscoContexto>(chaveValida(route.query.risco) ? route.query.risco : 'geral')
watch(
  () => route.query.risco,
  (v) => {
    if (chaveValida(v)) ctxKey.value = v
  },
)
function selecionar(key: RiscoContexto) {
  ctxKey.value = key
  router.replace({ query: { ...route.query, risco: key } })
}

const ctx = computed(() => contextos[ctxKey.value])
const isGeral = computed(() => ctxKey.value === 'geral')
const destacado = (tipo: string) => ctx.value.tiposDestaque.includes(tipo)

const periodoAtivo = ref<string>('Hoje')
const metrica = ref<EvolucaoMetrica>('No prazo')

const toneText: Record<'success' | 'warning' | 'danger' | 'neutral' | 'primary', string> = {
  success: 'text-ms-success',
  warning: 'text-ms-warning',
  danger: 'text-ms-danger',
  neutral: 'text-ms-text-secondary',
  primary: 'text-ms-primary',
}
const toneDot: Record<'success' | 'warning' | 'danger' | 'neutral' | 'primary', string> = {
  success: 'bg-ms-success',
  warning: 'bg-ms-warning',
  danger: 'bg-ms-danger',
  neutral: 'bg-ms-text-placeholder',
  primary: 'bg-ms-primary',
}
const toneBar: Record<'success' | 'warning' | 'danger' | 'primary', string> = {
  success: 'bg-ms-success',
  warning: 'bg-ms-warning',
  danger: 'bg-ms-danger',
  primary: 'bg-ms-primary',
}
// Minimalista: métrica do chip em cinza neutro (o chip ativo já se destaca pelo anel).
const chipPill: Record<'success' | 'warning' | 'danger' | 'neutral', string> = {
  success: 'text-ms-text-secondary',
  warning: 'text-ms-text-secondary',
  danger: 'text-ms-text-secondary',
  neutral: 'text-ms-text-secondary',
}

// Títulos de seção dependem de visão geral vs tipo específico.
const kpiTitulo = computed(
  () => `${isGeral.value ? 'Indicadores de risco' : 'Indicadores do tipo'} · ${periodoAtivo.value}`,
)
const evolucaoTitulo = computed(() =>
  isGeral.value ? 'Evolução do risco · últimas 12h' : `Evolução · ${ctx.value.label} · últimas 12h`,
)
const evolucaoSubtitulo = computed(
  () => `Casos em risco vs ${metrica.value} · janela ${periodoAtivo.value}`,
)
const iaSubtitulo = computed(() =>
  isGeral.value
    ? 'Ações para reduzir a exposição regulatória da operação'
    : `Ações para conter o risco de ${ctx.value.label}`,
)

// ── Evolução: período reescala a janela (Hoje = 12h; demais agregam). ─────────
const periodoLabels: Record<string, string[]> = {
  Hoje: evolucaoBase.horas,
  '7d': ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  '30d': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  Trimestre: ['Mês 1', 'Mês 2', 'Mês 3'],
}
const eixoLabels = computed(() => periodoLabels[periodoAtivo.value] ?? evolucaoBase.horas)
const isHoje = computed(() => periodoAtivo.value === 'Hoje')

function resample(arr: number[], n: number): number[] {
  if (n === arr.length || arr.length < 2) return arr.slice(0, n)
  return Array.from({ length: n }, (_, i) => {
    const t = (i / (n - 1)) * (arr.length - 1)
    const lo = Math.floor(t)
    const hi = Math.ceil(t)
    return Number((arr[lo] + (arr[hi] - arr[lo]) * (t - lo)).toFixed(1))
  })
}

const metricaPct = computed(() => metrica.value === 'No prazo')
const metricaDias = computed(() => metrica.value === 'TMR')

// Série da linha derivada do contexto (determinístico, mock):
const linhaSerie = computed<number[]>(() => {
  const vol = ctx.value.volume
  const max = Math.max(...vol) || 1
  if (metrica.value === 'No prazo') return ctx.value.noPrazo
  if (metrica.value === 'Vencidos') return vol.map((v) => Math.round((v / max) * 4))
  // TMR (dias): proporcional ao volume relativo.
  return vol.map((v) => Number((0.8 + (v / max) * 1.4).toFixed(1)))
})

const evolucaoOption = computed(() => {
  const n = eixoLabels.value.length
  const volume = resample(ctx.value.volume, n)
  const linha = resample(linhaSerie.value, n)
  const volMax = Math.max(...volume) * 1.3
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 48, top: 20, bottom: 36 },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: ['Casos em risco', `${metrica.value} atual`, ...(metricaPct.value ? ['Meta 90%'] : [])],
    },
    xAxis: {
      type: 'category',
      data: eixoLabels.value,
      axisLabel: { color: C.axis, fontSize: 10 },
      axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: Math.ceil(volMax),
        axisLabel: { color: C.axis, fontSize: 10 },
        splitLine: { lineStyle: { color: C.split } },
      },
      {
        type: 'value',
        position: 'right',
        min: metricaPct.value ? 50 : 0,
        max: metricaPct.value ? 100 : Math.ceil((Math.max(...linha) || 1) * 1.4),
        axisLabel: {
          color: C.axis,
          fontSize: 10,
          formatter: metricaPct.value ? '{value}%' : metricaDias.value ? '{value}d' : '{value}',
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Casos em risco',
        type: 'bar',
        data: volume,
        barWidth: '46%',
        itemStyle: { color: C.danger, opacity: 0.18, borderRadius: [3, 3, 0, 0] },
      },
      {
        name: `${metrica.value} atual`,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: linha,
        lineStyle: { color: C.warning, width: 2.5 },
        itemStyle: { color: C.warning },
        markLine: isHoje.value
          ? {
              symbol: 'none',
              silent: true,
              label: { fontSize: 10 },
              data: [
                {
                  xAxis: evolucaoBase.horas[evolucaoBase.picoIdx],
                  lineStyle: { color: C.warning, type: 'solid', width: 1 },
                  label: { formatter: evolucaoBase.picoLabel, color: C.warning, position: 'insideEndTop' },
                },
                {
                  xAxis: evolucaoBase.horas[evolucaoBase.agoraIdx],
                  lineStyle: { color: C.danger, type: 'solid', width: 1.5 },
                  label: { formatter: 'AGORA', color: C.danger, position: 'insideEndTop' },
                },
              ],
            }
          : undefined,
      },
      {
        name: 'Meta 90%',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'none',
        data: metricaPct.value ? eixoLabels.value.map(() => evolucaoBase.meta) : [],
        lineStyle: { color: C.success, type: 'dashed', width: 1.5 },
        itemStyle: { color: C.success },
      },
    ],
  }
})

// ── 2) Tabela "Risco por tipo · agora" ───────────────────────────────────────
const statusOrder: Record<RiscoStatus, number> = { OK: 0, Moderado: 1, Alto: 2, Crítico: 3 }
const riscoColumns: DataListColumn[] = [
  { key: 'tipo', label: 'Tipo de risco', minWidth: 220, sortable: true },
  { key: 'casos', label: 'Casos', align: 'right', width: 90, sortable: true },
  { key: 'proxVencimento', label: 'Próx. vencimento', align: 'right', width: 150, sortBy: (r) => r.proxHoras as number },
  { key: 'tmr', label: 'TMR', align: 'right', width: 100 },
  { key: 'estourados', label: 'Estourados', align: 'right', width: 110, sortable: true },
  { key: 'noPrazo', label: 'No prazo', align: 'right', width: 110, sortBy: (r) => r.noPrazo as number },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as RiscoStatus] },
]

// ── 4) Tabela "Correlação de risco" ──────────────────────────────────────────
const correlColumns: DataListColumn[] = [
  { key: 'tipo', label: 'Tipo de risco', minWidth: 220, sortable: true },
  { key: 'casos', label: 'Casos', align: 'right', width: 90, sortable: true },
  { key: 'prazoCritico', label: 'Prazo crítico', align: 'right', width: 120 },
  { key: 'tmr', label: 'TMR', align: 'right', width: 100 },
  { key: 'tendencia', label: 'Tendência', width: 140 },
  { key: 'gargalo', label: 'Gargalo', minWidth: 280 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as RiscoStatus] },
]

const statusTone: Record<RiscoStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Moderado: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
// Minimalista: tendência sem cor (a seta já indica direção); cor só no valor crítico.
const tendTone: Record<'danger' | 'warning' | 'success' | 'neutral', string> = {
  danger: 'text-ms-text-regular',
  warning: 'text-ms-text-regular',
  success: 'text-ms-text-regular',
  neutral: 'text-ms-text-regular',
}
const prazoTone = (h: number) =>
  h <= 6 ? 'text-ms-danger font-semibold' : 'text-ms-text-regular'
const noPrazoTone = (v: number) => (v < 80 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const estourTone = (v: number) => (v > 0 ? 'text-ms-danger font-semibold' : 'text-ms-text-secondary')
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
      <el-breadcrumb-item :to="{ path: '/gestor/gestao-performance', query: { tab: 'riscos' } }"
        >Gestão e Performance</el-breadcrumb-item
      >
      <el-breadcrumb-item>Risk Center · {{ ctx.label }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Cabeçalho/contexto -->
    <el-card shadow="never" body-class="!p-5" class="mb-5 overflow-hidden !border-ms-border-light">
      <div class="-mx-5 -mt-5 mb-4 h-1" :class="toneBar[ctx.badgeTone]" />
      <div class="min-w-0">
        <div class="flex items-center gap-2 text-xs">
          <span
            class="flex items-center gap-1.5 font-bold uppercase tracking-wide"
            :class="toneText[ctx.badgeTone]"
          >
            <span class="h-2 w-2 rounded-full" :class="toneDot[ctx.badgeTone]" />{{ ctx.badge }}
          </span>
          <span class="text-ms-text-secondary">· {{ ctx.resumo }}</span>
        </div>
        <h1 class="mt-2 flex items-center gap-2 text-2xl font-bold text-ms-text-primary">
          <span class="text-ms-text-secondary">⊞</span>Risk Center
        </h1>
        <p class="mt-1 text-sm text-ms-text-secondary">{{ ctx.subtitulo }}</p>
      </div>

      <!-- Chips de tipo de risco (clicáveis · filtro global) -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button
          v-for="c in chips"
          :key="c.key"
          type="button"
          class="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition"
          :class="
            ctxKey === c.key
              ? '!border-ms-primary bg-ms-primary/5 font-semibold ring-1 ring-ms-primary'
              : 'border-ms-border-light hover:border-ms-primary/40 hover:bg-ms-fill-light'
          "
          @click="selecionar(c.key)"
        >
          <span class="text-ms-text-regular">{{ c.label }}</span>
          <span class="font-semibold" :class="chipPill[c.tone]">{{ c.casos }}</span>
        </button>
      </div>
    </el-card>

    <!-- 1) Indicadores -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      {{ kpiTitulo }}
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Volume em risco, proximidade do vencimento e exposição · vs período anterior
    </p>
    <div class="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiStatCard
        v-for="k in ctx.kpis"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
      />
    </div>

    <!-- 2) Risco por tipo · agora (comparativo) -->
    <ChartCard
      title="Risco por tipo · agora"
      subtitle="Casos, vencimento, TMR e estouros por tipo · todos os tipos para comparação"
      class="mb-5"
    >
      <DataList
        :columns="riscoColumns"
        :rows="riscoAgora"
        row-key="tipo"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="tipos de risco"
      >
        <template #cell-tipo="{ row }">
          <span
            class="flex items-center gap-1.5"
            :class="destacado(row.tipo) ? 'font-semibold text-ms-text-primary' : ''"
          >
            <span v-if="destacado(row.tipo)" class="h-1.5 w-1.5 rounded-full bg-ms-primary" />{{ row.tipo }}
          </span>
        </template>
        <template #cell-proxVencimento="{ row }">
          <span :class="prazoTone(row.proxHoras as number)">{{ row.proxVencimento }}</span>
        </template>
        <template #cell-estourados="{ row }">
          <span :class="estourTone(row.estourados as number)">{{ row.estourados === 0 ? '—' : row.estourados }}</span>
        </template>
        <template #cell-noPrazo="{ row }">
          <span class="font-medium" :class="noPrazoTone(row.noPrazo as number)">{{ row.noPrazo }}%</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status as RiscoStatus].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as RiscoStatus].dot" />{{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <!-- 3) Evolução -->
    <ChartCard :title="evolucaoTitulo" :subtitle="evolucaoSubtitulo" class="mb-5">
      <div class="mb-2">
        <IndicadorSelector v-model="metrica" label="Métrica:" :options="evolucaoMetricas" />
      </div>
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
      </div>
    </ChartCard>

    <!-- 4) Correlação de risco (comparativo) -->
    <ChartCard
      title="Correlação de risco"
      subtitle="Casos × Prazo × TMR × Tendência · Por tipo · Identificação de gargalos"
      class="mb-3"
    >
      <DataList
        :columns="correlColumns"
        :rows="correlacao"
        row-key="tipo"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="tipos de risco"
      >
        <template #cell-tipo="{ row }">
          <span
            class="flex items-center gap-1.5"
            :class="destacado(row.tipo) ? 'font-semibold text-ms-text-primary' : ''"
          >
            <span v-if="destacado(row.tipo)" class="h-1.5 w-1.5 rounded-full bg-ms-primary" />{{ row.tipo }}
          </span>
        </template>
        <template #cell-tendencia="{ row }">
          <span class="font-medium" :class="tendTone[row.tendenciaTone as 'danger' | 'warning' | 'success' | 'neutral']">{{ row.tendencia }}</span>
        </template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status as RiscoStatus].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as RiscoStatus].dot" />{{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <!-- Como interpretar -->
    <div
      class="mb-5 flex items-start gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5"
    >
      <span class="text-ms-primary">ℹ</span>
      <div class="text-xs text-ms-text-regular">
        <span class="font-semibold text-ms-text-primary">Como interpretar</span>
        <p class="mt-0.5 leading-relaxed">{{ comoInterpretar }}</p>
      </div>
    </div>

    <!-- 5) Insights da IA -->
    <RecomendacoesIA
      :subtitle="iaSubtitulo"
      :diagnostico-titulo="isGeral ? 'Diagnóstico do risco' : `Diagnóstico · ${ctx.label}`"
      :confianca="ctx.diagnostico.confianca"
      :texto="ctx.diagnostico.texto"
      :recomendacoes="ctx.recomendacoes"
    />

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/gestao-performance', query: { tab: 'riscos' } }"
        class="text-ms-primary no-underline hover:underline"
        >← Voltar a Gestão de Riscos</router-link
      >
      <button
        v-if="ctxKey !== riscoControlado.contexto"
        class="text-ms-text-secondary hover:underline"
        @click="selecionar(riscoControlado.contexto)"
      >
        Tipo controlado:
        <span class="font-medium text-ms-success">{{ riscoControlado.nome }} · {{ riscoControlado.tendencia }} →</span>
      </button>
    </div>
  </DashboardLayout>
</template>
