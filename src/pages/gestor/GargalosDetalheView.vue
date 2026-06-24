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
  setoresAgora,
  evolucaoBase,
  evolucaoMetricas,
  correlacao,
  comoInterpretar,
  setorSaudavel,
  type SetorContexto,
  type SetorStatus,
  type EvolucaoMetrica,
} from '@/data/gestorGargalosDetalhe'

// Detalhe "Gargalos e Setores" (drill-down). Estrutura padrão de detalhe (5
// blocos). Chips selecionam o SETOR; tabelas mantêm todos (comparativo).
const C = useChartColors()
const route = useRoute()
const router = useRouter()

const chaveValida = (v: unknown): v is SetorContexto => typeof v === 'string' && v in contextos
const ctxKey = ref<SetorContexto>(chaveValida(route.query.setor) ? route.query.setor : 'geral')
watch(
  () => route.query.setor,
  (v) => {
    if (chaveValida(v)) ctxKey.value = v
  },
)
function selecionar(key: SetorContexto) {
  ctxKey.value = key
  router.replace({ query: { ...route.query, setor: key } })
}

const ctx = computed(() => contextos[ctxKey.value])
const isGeral = computed(() => ctxKey.value === 'geral')
const destacado = (setor: string) => ctx.value.setoresDestaque.includes(setor)

const periodoAtivo = ref<string>('Hoje')
const metrica = ref<EvolucaoMetrica>('Ocupação')

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
  () => `${isGeral.value ? 'Indicadores da operação' : 'Indicadores do setor'} · ${periodoAtivo.value}`,
)
const evolucaoTitulo = computed(() =>
  isGeral.value ? 'Evolução da operação · últimas 12h' : `Evolução · ${ctx.value.label} · últimas 12h`,
)
const evolucaoSubtitulo = computed(() => `Fila/volume vs ${metrica.value} · janela ${periodoAtivo.value}`)
const iaSubtitulo = computed(() =>
  isGeral.value ? 'Ações para destravar a operação' : `Ações para destravar ${ctx.value.label}`,
)

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

const metricaPct = computed(() => metrica.value === 'Ocupação')
const metricaMin = computed(() => metrica.value === 'TME')

const linhaSerie = computed<number[]>(() => {
  const vol = ctx.value.volume
  const max = Math.max(...vol) || 1
  if (metrica.value === 'Ocupação') return ctx.value.ocupacao
  if (metrica.value === 'Fila') return vol
  // TME (min): proporcional ao volume relativo.
  return vol.map((v) => Number((6 + (v / max) * 10).toFixed(1)))
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
      bottom: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: ['Fila', `${metrica.value} atual`, ...(metricaPct.value ? ['Meta 85%'] : [])],
    },
    xAxis: {
      type: 'category', data: eixoLabels.value,
      axisLabel: { color: C.axis, fontSize: 10 }, axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: [
      { type: 'value', min: 0, max: Math.ceil(volMax), axisLabel: { color: C.axis, fontSize: 10 }, splitLine: { lineStyle: { color: C.split } } },
      {
        type: 'value', position: 'right',
        min: metricaPct.value ? 40 : 0,
        max: metricaPct.value ? 100 : Math.ceil((Math.max(...linha) || 1) * 1.3),
        axisLabel: { color: C.axis, fontSize: 10, formatter: metricaPct.value ? '{value}%' : metricaMin.value ? '{value}min' : '{value}' },
        splitLine: { show: false },
      },
    ],
    series: [
      { name: 'Fila', type: 'bar', data: volume, barWidth: '46%', itemStyle: { color: C.primary, opacity: 0.18, borderRadius: [3, 3, 0, 0] } },
      {
        name: `${metrica.value} atual`, type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 5, data: linha,
        lineStyle: { color: C.warning, width: 2.5 }, itemStyle: { color: C.warning },
        markLine: isHoje.value
          ? {
              symbol: 'none', silent: true, label: { fontSize: 10 },
              data: [
                { xAxis: evolucaoBase.horas[evolucaoBase.picoIdx], lineStyle: { color: C.warning, type: 'solid', width: 1 }, label: { formatter: evolucaoBase.picoLabel, color: C.warning, position: 'insideEndTop' } },
                { xAxis: evolucaoBase.horas[evolucaoBase.agoraIdx], lineStyle: { color: C.danger, type: 'solid', width: 1.5 }, label: { formatter: 'AGORA', color: C.danger, position: 'insideEndTop' } },
              ],
            }
          : undefined,
      },
      { name: 'Meta 85%', type: 'line', yAxisIndex: 1, symbol: 'none', data: metricaPct.value ? eixoLabels.value.map(() => evolucaoBase.meta) : [], lineStyle: { color: C.success, type: 'dashed', width: 1.5 }, itemStyle: { color: C.success } },
    ],
  }
})

// ── 2) Tabela "Setores · agora" ──────────────────────────────────────────────
const statusOrder: Record<SetorStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const setoresColumns: DataListColumn[] = [
  { key: 'setor', label: 'Setor', minWidth: 170, sortable: true },
  { key: 'fila', label: 'Fila', align: 'right', width: 80, sortable: true },
  { key: 'emAtendimento', label: 'Em atend.', align: 'right', width: 110, sortable: true },
  { key: 'tme', label: 'TME', align: 'right', width: 90 },
  { key: 'tma', label: 'TMA', align: 'right', width: 90 },
  { key: 'estourados', label: 'Estouro SLA', align: 'right', width: 120, sortable: true },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupacao as number },
  { key: 'repasses', label: 'Repasses', align: 'right', width: 100 },
  { key: 'status', label: 'Status', width: 110, sortBy: (r) => statusOrder[r.status as SetorStatus] },
]

// ── 4) Tabela "Correlação operacional" ───────────────────────────────────────
const tmeSeg = (s: string) => {
  const [m, sec] = s.split(':').map(Number)
  return (m || 0) * 60 + (sec || 0)
}
const correlColumns: DataListColumn[] = [
  { key: 'setor', label: 'Setor', minWidth: 160, sortable: true },
  { key: 'volume', label: 'Volume', align: 'right', width: 100, sortable: true },
  { key: 'sla', label: 'SLA', align: 'right', width: 90, sortBy: (r) => r.sla as number },
  { key: 'tme', label: 'TME', align: 'right', width: 90, sortBy: (r) => tmeSeg(r.tme as string) },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupacao as number },
  { key: 'espera', label: 'T. espera', align: 'right', width: 110, sortBy: (r) => tmeSeg(r.espera as string) },
  { key: 'gargalo', label: 'Gargalo', minWidth: 280 },
  { key: 'status', label: 'Status', width: 110, sortBy: (r) => statusOrder[r.status as SetorStatus] },
]

const statusTone: Record<SetorStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
// Minimalista: cor só no valor realmente ruim; o restante em tinta neutra.
const slaTone = (v: number) => (v < 80 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const ocupTone = (v: number) => (v > 90 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const estourTone = (v: number) => (v > 0 ? 'text-ms-danger font-semibold' : 'text-ms-text-secondary')
</script>

<template>
  <DashboardLayout>
    <StickyPeriodo>
      <PeriodoSelector v-model="periodoAtivo" :options="periodos" />
    </StickyPeriodo>

    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/gestor/gestao-performance', query: { tab: 'gargalos' } }"
        >Gestão e Performance</el-breadcrumb-item
      >
      <el-breadcrumb-item>Gargalos e Setores · {{ ctx.label }}</el-breadcrumb-item>
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
          <span class="text-ms-text-secondary">⊞</span>Gargalos e Setores
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
          <span class="font-semibold" :class="chipPill[c.tone]">{{ c.ocupacao }}%</span>
        </button>
      </div>
    </el-card>

    <!-- 1) Indicadores -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">{{ kpiTitulo }}</div>
    <p class="mb-3 text-xs text-ms-text-secondary">Fila, capacidade, SLA e repasses · vs período anterior</p>
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

    <!-- 2) Setores · agora -->
    <ChartCard
      title="Setores · agora"
      subtitle="Fila, atendimento, SLA e ocupação por setor · todos os setores para comparação"
      class="mb-5"
    >
      <DataList :columns="setoresColumns" :rows="setoresAgora" row-key="setor" :selectable="false" :expandable="false" :actions="false" count-label="setores">
        <template #cell-setor="{ row }">
          <span class="flex items-center gap-1.5" :class="destacado(row.setor) ? 'font-semibold text-ms-text-primary' : ''">
            <span v-if="destacado(row.setor)" class="h-1.5 w-1.5 rounded-full bg-ms-primary" />{{ row.setor }}
          </span>
        </template>
        <template #cell-estourados="{ row }">
          <span :class="estourTone(row.estourados as number)">{{ row.estourados === 0 ? '—' : row.estourados }}</span>
        </template>
        <template #cell-ocupacao="{ row }">
          <span class="font-medium" :class="ocupTone(row.ocupacao as number)">{{ row.ocupacao }}%</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status as SetorStatus].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as SetorStatus].dot" />{{ row.status }}
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

    <!-- 4) Correlação operacional -->
    <ChartCard
      title="Correlação operacional"
      subtitle="Volume × SLA × TME × Ocupação × Espera · Por setor · Identificação de gargalos"
      class="mb-3"
    >
      <DataList :columns="correlColumns" :rows="correlacao" row-key="setor" :selectable="false" :expandable="false" :actions="false" count-label="setores">
        <template #cell-setor="{ row }">
          <span class="flex items-center gap-1.5" :class="destacado(row.setor) ? 'font-semibold text-ms-text-primary' : ''">
            <span v-if="destacado(row.setor)" class="h-1.5 w-1.5 rounded-full bg-ms-primary" />{{ row.setor }}
          </span>
        </template>
        <template #cell-sla="{ row }">
          <span class="font-medium" :class="slaTone(row.sla as number)">{{ row.sla }}%</span>
        </template>
        <template #cell-ocupacao="{ row }">
          <span class="font-medium" :class="ocupTone(row.ocupacao as number)">{{ row.ocupacao }}%</span>
        </template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status as SetorStatus].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as SetorStatus].dot" />{{ row.status }}
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
      :diagnostico-titulo="isGeral ? 'Diagnóstico da operação' : `Diagnóstico · ${ctx.label}`"
      :confianca="ctx.diagnostico.confianca"
      :texto="ctx.diagnostico.texto"
      :recomendacoes="ctx.recomendacoes"
    />

    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link :to="{ path: '/gestor/gestao-performance', query: { tab: 'gargalos' } }" class="text-ms-primary no-underline hover:underline"
        >← Voltar a Gargalos e Setores</router-link
      >
      <button v-if="ctxKey !== setorSaudavel.contexto" class="text-ms-text-secondary hover:underline" @click="selecionar(setorSaudavel.contexto)">
        Setor saudável: <span class="font-medium text-ms-success">{{ setorSaudavel.nome }} · SLA {{ setorSaudavel.sla }}% →</span>
      </button>
    </div>
  </DashboardLayout>
</template>
