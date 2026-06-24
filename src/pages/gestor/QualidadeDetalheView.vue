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
  qualidadeAgora,
  evolucaoBase,
  evolucaoMetricas,
  correlacao,
  comoInterpretar,
  canalReferencia,
  type QualidadeContexto,
  type QualidadeStatus,
  type EvolucaoMetrica,
} from '@/data/gestorQualidadeDetalhe'

// Detalhe "Qualidade e Experiência" (drill-down). Estrutura padrão de detalhe
// (5 blocos). Chips selecionam o INDICADOR; a evolução é da experiência geral.
const C = useChartColors()
const route = useRoute()
const router = useRouter()

const chaveValida = (v: unknown): v is QualidadeContexto => typeof v === 'string' && v in contextos
const ctxKey = ref<QualidadeContexto>(chaveValida(route.query.ind) ? route.query.ind : 'geral')
watch(
  () => route.query.ind,
  (v) => {
    if (chaveValida(v)) ctxKey.value = v
  },
)
function selecionar(key: QualidadeContexto) {
  ctxKey.value = key
  router.replace({ query: { ...route.query, ind: key } })
}

const ctx = computed(() => contextos[ctxKey.value])
const isGeral = computed(() => ctxKey.value === 'geral')

const periodoAtivo = ref<string>('30d')
const metrica = ref<EvolucaoMetrica>('NPS')

const toneText: Record<'success' | 'warning' | 'danger' | 'neutral' | 'primary', string> = {
  success: 'text-ms-success', warning: 'text-ms-warning', danger: 'text-ms-danger', neutral: 'text-ms-text-secondary', primary: 'text-ms-primary',
}
const toneDot: Record<'success' | 'warning' | 'danger' | 'neutral' | 'primary', string> = {
  success: 'bg-ms-success', warning: 'bg-ms-warning', danger: 'bg-ms-danger', neutral: 'bg-ms-text-placeholder', primary: 'bg-ms-primary',
}
const toneBar: Record<'success' | 'warning' | 'danger' | 'primary', string> = {
  success: 'bg-ms-success', warning: 'bg-ms-warning', danger: 'bg-ms-danger', primary: 'bg-ms-primary',
}
const chipPill: Record<'success' | 'warning' | 'danger' | 'neutral', string> = {
  success: 'text-ms-text-secondary', warning: 'text-ms-text-secondary', danger: 'text-ms-text-secondary', neutral: 'text-ms-text-secondary',
}

const kpiTitulo = computed(
  () => `${isGeral.value ? 'Indicadores de experiência' : `Indicador · ${ctx.value.label}`} · ${periodoAtivo.value}`,
)
const evolucaoSubtitulo = computed(() => `Volume de respostas vs ${metrica.value} · últimos 90 dias`)
const iaSubtitulo = computed(() =>
  isGeral.value ? 'Ações para recuperar a qualidade percebida' : `Ações para melhorar ${ctx.value.label}`,
)

// Série e escala do eixo direito conforme a métrica selecionada.
const metricaSerie = computed<number[]>(() =>
  metrica.value === 'NPS' ? evolucaoBase.nps : metrica.value === 'CSAT' ? evolucaoBase.csat : evolucaoBase.ces,
)
const ehNps = computed(() => metrica.value === 'NPS')
const metaMetrica = computed(() => evolucaoBase.metas[metrica.value])

const evolucaoOption = computed(() => {
  const linha = metricaSerie.value
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 48, top: 20, bottom: 36 },
    legend: {
      bottom: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: ['Respostas', `${metrica.value} atual`, 'Meta'],
    },
    xAxis: {
      type: 'category', data: evolucaoBase.semanas,
      axisLabel: { color: C.axis, fontSize: 10 }, axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: [
      { type: 'value', min: 0, axisLabel: { color: C.axis, fontSize: 10 }, splitLine: { lineStyle: { color: C.split } } },
      {
        type: 'value', position: 'right',
        min: ehNps.value ? 40 : 0,
        max: ehNps.value ? 100 : 5,
        axisLabel: { color: C.axis, fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      { name: 'Respostas', type: 'bar', data: evolucaoBase.respostas, barWidth: '46%', itemStyle: { color: C.primary, opacity: 0.16, borderRadius: [3, 3, 0, 0] } },
      {
        name: `${metrica.value} atual`, type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 5, data: linha,
        lineStyle: { color: C.purple, width: 2.5 }, itemStyle: { color: C.purple },
        markLine: {
          symbol: 'none', silent: true, label: { fontSize: 10 },
          data: [
            { xAxis: evolucaoBase.semanas[evolucaoBase.picoIdx], lineStyle: { color: C.warning, type: 'solid', width: 1 }, label: { formatter: evolucaoBase.picoLabel, color: C.warning, position: 'insideEndTop' } },
            { xAxis: evolucaoBase.semanas[evolucaoBase.agoraIdx], lineStyle: { color: C.danger, type: 'solid', width: 1.5 }, label: { formatter: 'AGORA', color: C.danger, position: 'insideEndTop' } },
          ],
        },
      },
      { name: 'Meta', type: 'line', yAxisIndex: 1, symbol: 'none', data: evolucaoBase.semanas.map(() => metaMetrica.value), lineStyle: { color: C.success, type: 'dashed', width: 1.5 }, itemStyle: { color: C.success } },
    ],
  }
})

// ── Formatação e tons ────────────────────────────────────────────────────────
const fmt1 = (n: number) => n.toFixed(1).replace('.', ',')
// Minimalista: cor só no valor realmente ruim; o restante em tinta neutra.
const npsTone = (v: number) => (v < 60 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const cesTone = (v: number) => (v > 3 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const reabTone = (v: number) => (v > 10 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const fcrTone = (v: number) => (v < 75 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')

// ── 2) Tabela "Qualidade por canal · agora" ──────────────────────────────────
const statusOrder: Record<QualidadeStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const qualidadeColumns: DataListColumn[] = [
  { key: 'canal', label: 'Canal', minWidth: 150, sortable: true },
  { key: 'nps', label: 'NPS', align: 'right', width: 90, sortBy: (r) => r.nps as number },
  { key: 'csat', label: 'CSAT', align: 'right', width: 90, sortBy: (r) => r.csat as number },
  { key: 'ces', label: 'CES', align: 'right', width: 90, sortBy: (r) => r.ces as number },
  { key: 'reabertura', label: 'Reabertura', align: 'right', width: 120, sortBy: (r) => r.reabertura as number },
  { key: 'fcr', label: 'FCR', align: 'right', width: 90, sortBy: (r) => r.fcr as number },
  { key: 'status', label: 'Status', width: 110, sortBy: (r) => statusOrder[r.status as QualidadeStatus] },
]

// ── 4) Tabela "Correlação de experiência" ────────────────────────────────────
const correlColumns: DataListColumn[] = [
  { key: 'canal', label: 'Canal', minWidth: 150, sortable: true },
  { key: 'csat', label: 'CSAT', align: 'right', width: 90, sortBy: (r) => r.csat as number },
  { key: 'fcr', label: 'FCR', align: 'right', width: 90, sortBy: (r) => r.fcr as number },
  { key: 'reabertura', label: 'Reabertura', align: 'right', width: 120, sortBy: (r) => r.reabertura as number },
  { key: 'nps', label: 'NPS', align: 'right', width: 90, sortBy: (r) => r.nps as number },
  { key: 'gargalo', label: 'Gargalo', minWidth: 280 },
  { key: 'status', label: 'Status', width: 110, sortBy: (r) => statusOrder[r.status as QualidadeStatus] },
]

const statusTone: Record<QualidadeStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
</script>

<template>
  <DashboardLayout>
    <StickyPeriodo>
      <PeriodoSelector v-model="periodoAtivo" :options="periodos" />
    </StickyPeriodo>

    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/gestor/gestao-performance', query: { tab: 'qualidade' } }"
        >Gestão e Performance</el-breadcrumb-item
      >
      <el-breadcrumb-item>Qualidade e Experiência · {{ ctx.label }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" body-class="!p-5" class="mb-5 overflow-hidden !border-ms-border-light">
      <div class="-mx-5 -mt-5 mb-4 h-1" :class="toneBar[ctx.badgeTone]" />
      <div class="min-w-0">
        <div class="flex items-center gap-2 text-xs">
          <span class="flex items-center gap-1.5 font-bold uppercase tracking-wide" :class="toneText[ctx.badgeTone]">
            <span class="h-2 w-2 rounded-full" :class="toneDot[ctx.badgeTone]" />{{ ctx.badge }}
          </span>
          <span class="text-ms-text-secondary">· {{ ctx.resumo }}</span>
        </div>
        <h1 class="mt-2 flex items-center gap-2 text-2xl font-bold text-ms-text-primary">
          <span class="text-ms-text-secondary">⊞</span>Qualidade e Experiência
        </h1>
        <p class="mt-1 text-sm text-ms-text-secondary">{{ ctx.subtitulo }}</p>
      </div>

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
          <span v-if="c.valor" class="font-semibold" :class="chipPill[c.tone]">{{ c.valor }}</span>
        </button>
      </div>
    </el-card>

    <!-- 1) Indicadores -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">{{ kpiTitulo }}</div>
    <p class="mb-3 text-xs text-ms-text-secondary">Percepção do beneficiário · vs período anterior</p>
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

    <!-- 2) Qualidade por canal · agora -->
    <ChartCard
      title="Qualidade por canal · agora"
      subtitle="NPS, CSAT, CES, reabertura e FCR por canal · todos os canais para comparação"
      class="mb-5"
    >
      <DataList :columns="qualidadeColumns" :rows="qualidadeAgora" row-key="canal" :selectable="false" :expandable="false" :actions="false" count-label="canais">
        <template #cell-nps="{ row }">
          <span class="font-medium" :class="npsTone(row.nps as number)">{{ row.nps }}</span>
        </template>
        <template #cell-csat="{ row }">
          <span class="font-medium text-ms-text-regular">{{ fmt1(row.csat as number) }}</span>
        </template>
        <template #cell-ces="{ row }">
          <span class="font-medium" :class="cesTone(row.ces as number)">{{ fmt1(row.ces as number) }}</span>
        </template>
        <template #cell-reabertura="{ row }">
          <span class="font-medium" :class="reabTone(row.reabertura as number)">{{ row.reabertura }}%</span>
        </template>
        <template #cell-fcr="{ row }">
          <span class="font-medium" :class="fcrTone(row.fcr as number)">{{ row.fcr }}%</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status as QualidadeStatus].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as QualidadeStatus].dot" />{{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <!-- 3) Evolução -->
    <ChartCard title="Evolução da experiência · 90 dias" :subtitle="evolucaoSubtitulo" class="mb-5">
      <div class="mb-2">
        <IndicadorSelector v-model="metrica" label="Métrica:" :options="evolucaoMetricas" />
      </div>
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
      </div>
    </ChartCard>

    <!-- 4) Correlação de experiência -->
    <ChartCard
      title="Correlação de experiência"
      subtitle="CSAT × FCR × Reabertura × NPS · Por canal · Identificação de gargalos"
      class="mb-3"
    >
      <DataList :columns="correlColumns" :rows="correlacao" row-key="canal" :selectable="false" :expandable="false" :actions="false" count-label="canais">
        <template #cell-csat="{ row }">
          <span class="font-medium text-ms-text-regular">{{ fmt1(row.csat as number) }}</span>
        </template>
        <template #cell-fcr="{ row }">
          <span class="font-medium" :class="fcrTone(row.fcr as number)">{{ row.fcr }}%</span>
        </template>
        <template #cell-reabertura="{ row }">
          <span class="font-medium" :class="reabTone(row.reabertura as number)">{{ row.reabertura }}%</span>
        </template>
        <template #cell-nps="{ row }">
          <span class="font-medium" :class="npsTone(row.nps as number)">{{ row.nps }}</span>
        </template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status as QualidadeStatus].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as QualidadeStatus].dot" />{{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <div class="mb-5 flex items-start gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5">
      <span class="text-ms-primary">ℹ</span>
      <div class="text-xs text-ms-text-regular">
        <span class="font-semibold text-ms-text-primary">Como interpretar</span>
        <p class="mt-0.5 leading-relaxed">{{ comoInterpretar }}</p>
      </div>
    </div>

    <!-- 5) Insights da IA -->
    <RecomendacoesIA
      :subtitle="iaSubtitulo"
      :diagnostico-titulo="isGeral ? 'Diagnóstico da experiência' : `Diagnóstico · ${ctx.label}`"
      :confianca="ctx.diagnostico.confianca"
      :texto="ctx.diagnostico.texto"
      :recomendacoes="ctx.recomendacoes"
    />

    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link :to="{ path: '/gestor/gestao-performance', query: { tab: 'qualidade' } }" class="text-ms-primary no-underline hover:underline"
        >← Voltar a Qualidade e Experiência</router-link
      >
      <span class="text-ms-text-secondary">Referência: <span class="font-medium text-ms-success">{{ canalReferencia.nome }} · NPS {{ canalReferencia.nps }}</span></span>
    </div>
  </DashboardLayout>
</template>
