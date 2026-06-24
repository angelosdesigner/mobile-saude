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
  limboAgora,
  evolucaoBase,
  evolucaoMetricas,
  correlacao,
  comoInterpretar,
  type LimboContexto,
  type LimboStatus,
  type EvolucaoMetrica,
} from '@/data/gestorLimboDetalhe'

// Detalhe "Pendências e Limbo" (drill-down). Estrutura padrão de detalhe (5
// blocos). Chips selecionam a CATEGORIA; tabelas mantêm todos os setores.
const C = useChartColors()
const route = useRoute()
const router = useRouter()

const chaveValida = (v: unknown): v is LimboContexto => typeof v === 'string' && v in contextos
const ctxKey = ref<LimboContexto>(chaveValida(route.query.cat) ? route.query.cat : 'geral')
watch(
  () => route.query.cat,
  (v) => {
    if (chaveValida(v)) ctxKey.value = v
  },
)
function selecionar(key: LimboContexto) {
  ctxKey.value = key
  router.replace({ query: { ...route.query, cat: key } })
}

const ctx = computed(() => contextos[ctxKey.value])
const isGeral = computed(() => ctxKey.value === 'geral')

const periodoAtivo = ref<string>('Hoje')
const metrica = ref<EvolucaoMetrica>('Aging')

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
  () => `${isGeral.value ? 'Indicadores do limbo' : 'Indicadores da categoria'} · ${periodoAtivo.value}`,
)
const evolucaoTitulo = computed(() =>
  isGeral.value ? 'Evolução do limbo · últimas 12h' : `Evolução · ${ctx.value.label} · últimas 12h`,
)
const evolucaoSubtitulo = computed(() => `Entradas no limbo vs ${metrica.value} · janela ${periodoAtivo.value}`)
const iaSubtitulo = computed(() =>
  isGeral.value ? 'Ações para destravar as pendências' : `Ações para resolver ${ctx.value.label}`,
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

const metricaAging = computed(() => metrica.value === 'Aging')

const linhaSerie = computed<number[]>(() => {
  const vol = ctx.value.volume
  if (metrica.value === 'Aging') return ctx.value.aging
  if (metrica.value === 'Entradas') return vol
  // Saídas: ligeiramente abaixo das entradas (limbo crescendo).
  return vol.map((v) => Math.max(0, v - 1))
})

const evolucaoOption = computed(() => {
  const n = eixoLabels.value.length
  const volume = resample(ctx.value.volume, n)
  const linha = resample(linhaSerie.value, n)
  const volMax = Math.max(...volume) * 1.4
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 48, top: 20, bottom: 36 },
    legend: {
      bottom: 0, icon: 'roundRect', itemWidth: 12, itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: ['Entradas', `${metrica.value} atual`, ...(metricaAging.value ? ['Meta aging'] : [])],
    },
    xAxis: {
      type: 'category', data: eixoLabels.value,
      axisLabel: { color: C.axis, fontSize: 10 }, axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: [
      { type: 'value', min: 0, max: Math.ceil(volMax), axisLabel: { color: C.axis, fontSize: 10 }, splitLine: { lineStyle: { color: C.split } } },
      {
        type: 'value', position: 'right', min: 0,
        max: Math.ceil((Math.max(...linha) || 1) * 1.25),
        axisLabel: { color: C.axis, fontSize: 10, formatter: metricaAging.value ? '{value}h' : '{value}' },
        splitLine: { show: false },
      },
    ],
    series: [
      { name: 'Entradas', type: 'bar', data: volume, barWidth: '46%', itemStyle: { color: C.warning, opacity: 0.18, borderRadius: [3, 3, 0, 0] } },
      {
        name: `${metrica.value} atual`, type: 'line', yAxisIndex: 1, smooth: true, symbol: 'circle', symbolSize: 5, data: linha,
        lineStyle: { color: C.primary, width: 2.5 }, itemStyle: { color: C.primary },
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
      { name: 'Meta aging', type: 'line', yAxisIndex: 1, symbol: 'none', data: metricaAging.value ? eixoLabels.value.map(() => evolucaoBase.meta) : [], lineStyle: { color: C.success, type: 'dashed', width: 1.5 }, itemStyle: { color: C.success } },
    ],
  }
})

// ── 2) Tabela "Limbo por setor · agora" ──────────────────────────────────────
const statusOrder: Record<LimboStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const limboColumns: DataListColumn[] = [
  { key: 'setor', label: 'Setor', minWidth: 170, sortable: true },
  { key: 'pendencias', label: 'Pendências', align: 'right', width: 120, sortable: true },
  { key: 'aging', label: 'Aging médio', align: 'right', width: 130 },
  { key: 'beneficiario', label: 'C/ benef.', align: 'right', width: 100, sortable: true },
  { key: 'interna', label: 'Área interna', align: 'right', width: 120, sortable: true },
  { key: 'responsavel', label: 'Responsável crítico', minWidth: 200 },
  { key: 'status', label: 'Status', width: 110, sortBy: (r) => statusOrder[r.status as LimboStatus] },
]

// ── 4) Tabela "Correlação de pendências" ─────────────────────────────────────
const correlColumns: DataListColumn[] = [
  { key: 'setor', label: 'Setor', minWidth: 160, sortable: true },
  { key: 'pendencias', label: 'Pendências', align: 'right', width: 120, sortable: true },
  { key: 'aging', label: 'Aging médio', align: 'right', width: 130 },
  { key: 'pctInterno', label: '% interno', align: 'right', width: 110, sortBy: (r) => r.pctInterno as number },
  { key: 'responsavel', label: 'Responsável', width: 150 },
  { key: 'gargalo', label: 'Gargalo', minWidth: 280 },
  { key: 'status', label: 'Status', width: 110, sortBy: (r) => statusOrder[r.status as LimboStatus] },
]

const statusTone: Record<LimboStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
const pendTone = (n: number) => (n >= 20 ? 'text-ms-danger font-semibold' : 'text-ms-text-regular')
</script>

<template>
  <DashboardLayout>
    <StickyPeriodo>
      <PeriodoSelector v-model="periodoAtivo" :options="periodos" />
    </StickyPeriodo>

    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/gestor/gestao-performance', query: { tab: 'limbo' } }"
        >Gestão e Performance</el-breadcrumb-item
      >
      <el-breadcrumb-item>Pendências e Limbo · {{ ctx.label }}</el-breadcrumb-item>
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
          <span class="text-ms-text-secondary">⊞</span>Pendências e Limbo
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
          <span class="font-semibold" :class="chipPill[c.tone]">{{ c.total }}</span>
        </button>
      </div>
    </el-card>

    <!-- 1) Indicadores -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">{{ kpiTitulo }}</div>
    <p class="mb-3 text-xs text-ms-text-secondary">Volume parado, aging e origem da pendência · vs período anterior</p>
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

    <!-- 2) Limbo por setor · agora -->
    <ChartCard
      title="Limbo por setor · agora"
      subtitle="Pendências, aging e origem por setor · todos os setores para comparação"
      class="mb-5"
    >
      <DataList :columns="limboColumns" :rows="limboAgora" row-key="setor" :selectable="false" :expandable="false" :actions="false" count-label="setores">
        <template #cell-pendencias="{ row }">
          <span :class="pendTone(row.pendencias as number)">{{ row.pendencias }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status as LimboStatus].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as LimboStatus].dot" />{{ row.status }}
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

    <!-- 4) Correlação de pendências -->
    <ChartCard
      title="Correlação de pendências"
      subtitle="Pendências × Aging × % interno × Responsável · Por setor · Identificação de gargalos"
      class="mb-3"
    >
      <DataList :columns="correlColumns" :rows="correlacao" row-key="setor" :selectable="false" :expandable="false" :actions="false" count-label="setores">
        <template #cell-pctInterno="{ row }">
          <span class="text-ms-text-regular">{{ row.pctInterno }}%</span>
        </template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status as LimboStatus].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as LimboStatus].dot" />{{ row.status }}
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
      :diagnostico-titulo="isGeral ? 'Diagnóstico do limbo' : `Diagnóstico · ${ctx.label}`"
      :confianca="ctx.diagnostico.confianca"
      :texto="ctx.diagnostico.texto"
      :recomendacoes="ctx.recomendacoes"
    />

    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link :to="{ path: '/gestor/gestao-performance', query: { tab: 'limbo' } }" class="text-ms-primary no-underline hover:underline"
        >← Voltar a Pendências e Limbo</router-link
      >
    </div>
  </DashboardLayout>
</template>
