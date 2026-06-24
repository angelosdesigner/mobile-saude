<script setup lang="ts">
import { computed, ref } from 'vue'
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
  contexto,
  indicadores,
  turnosTabela,
  evolucao,
  evolucaoMetricas,
  capacidade,
  correlacao,
  comoInterpretar,
  diagnostico,
  recomendacoes,
  proximaAcao,
  type EvolucaoMetrica,
  type PerfStatus,
} from '@/data/gestorPerformanceDetalhe'

// Tela de detalhe "Performance e Workforce" — estrutura padrão (5 seções).
const C = useChartColors()

const periodoAtivo = ref<string>('Hoje')
const metrica = ref<EvolucaoMetrica>('Demanda')

// ── 3) Evolução: demanda (barras) × métrica (linha) ──────────────────────────
const barColor = (v: number) => {
  if (v > capacidade * 1.15) return C.danger
  if (v >= capacidade * 0.85) return C.warning
  return C.success
}

const evolucaoOption = computed(() => {
  const isDemanda = metrica.value === 'Demanda'
  const isOcup = metrica.value === 'Ocupação'
  const linha = isDemanda
    ? evolucao.horas.map(() => capacidade)
    : isOcup
      ? evolucao.ocupacao
      : evolucao.tme
  const linhaNome = isDemanda ? 'Capacidade' : isOcup ? 'Ocupação' : 'TME'
  const linhaCor = isDemanda ? C.ink : isOcup ? C.primary : C.warning
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 36, right: 48, top: 20, bottom: 36 },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: ['Demanda', linhaNome],
    },
    xAxis: {
      type: 'category',
      data: evolucao.horas,
      axisLabel: { color: C.axis, fontSize: 10 },
      axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: [
      {
        type: 'value',
        name: 'chamados/h',
        nameTextStyle: { color: C.axis, fontSize: 10 },
        axisLabel: { color: C.axis, fontSize: 10 },
        splitLine: { lineStyle: { color: C.split } },
      },
      {
        type: 'value',
        position: 'right',
        ...(isDemanda ? { show: false } : isOcup ? { min: 0, max: 100 } : { min: 0, max: 20 }),
        axisLabel: { color: C.axis, fontSize: 10, formatter: isOcup ? '{value}%' : '{value}' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Demanda',
        type: 'bar',
        data: evolucao.demanda.map((v) => ({ value: v, itemStyle: { color: barColor(v), borderRadius: [3, 3, 0, 0] } })),
        barWidth: '52%',
        markLine: {
          symbol: 'none',
          silent: true,
          label: { fontSize: 10 },
          data: [
            {
              xAxis: evolucao.horas[evolucao.picoIdx],
              lineStyle: { color: C.danger, type: 'solid', width: 1.5 },
              label: { formatter: evolucao.picoLabel, color: C.danger, position: 'insideEndTop' },
            },
          ],
        },
      },
      {
        name: linhaNome,
        type: 'line',
        yAxisIndex: isDemanda ? 0 : 1,
        step: isDemanda ? 'middle' : undefined,
        smooth: !isDemanda,
        symbol: isDemanda ? 'none' : 'circle',
        symbolSize: 5,
        data: linha,
        lineStyle: { color: linhaCor, width: 2.5, type: isDemanda ? 'solid' : 'solid' },
        itemStyle: { color: linhaCor },
        z: 5,
      },
    ],
  }
})

// ── 2) Tabela — turnos ───────────────────────────────────────────────────────
const statusOrder: Record<PerfStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const turnoColumns: DataListColumn[] = [
  { key: 'turno', label: 'Turno', minWidth: 110, sortable: true },
  { key: 'horario', label: 'Horário', width: 110 },
  { key: 'atendentes', label: 'Atendentes', align: 'right', width: 110, sortable: true },
  { key: 'cargaMedia', label: 'Carga média', align: 'right', width: 120 },
  { key: 'pico', label: 'Pico', minWidth: 200 },
  { key: 'sugestao', label: 'Sugestão', minWidth: 240 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as PerfStatus] },
]

// ── 4) Correlação ────────────────────────────────────────────────────────────
const correlColumns: DataListColumn[] = [
  { key: 'turno', label: 'Turno', minWidth: 110, sortable: true },
  { key: 'picoDemanda', label: 'Pico demanda', align: 'right', width: 130, sortBy: (r) => r.picoDemanda as number },
  { key: 'capacidade', label: 'Capacidade', align: 'right', width: 110, sortable: true },
  { key: 'tme', label: 'TME (min)', align: 'right', width: 110, sortBy: (r) => r.tme as number },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupacao as number },
  { key: 'gargalo', label: 'Gargalo', minWidth: 260 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as PerfStatus] },
]

const statusTone: Record<PerfStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
const tmeTone = (v: number) => (v >= 12 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const ocupTone = (v: number) => (v >= 90 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
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
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real', query: { tab: 'performance' } }"
        >Performance e Workforce</el-breadcrumb-item
      >
      <el-breadcrumb-item>Detalhes</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Cabeçalho/contexto -->
    <el-card shadow="never" body-class="!p-5" class="mb-5 overflow-hidden !border-ms-border-light">
      <div class="-mx-5 -mt-5 mb-4 h-1 bg-ms-danger" />
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-xs">
            <span class="flex items-center gap-1.5 font-bold uppercase tracking-wide text-ms-danger">
              <span class="h-2 w-2 rounded-full bg-ms-danger" />{{ contexto.badge }}
            </span>
            <span class="text-ms-text-secondary">· {{ contexto.resumo }}</span>
          </div>
          <h1 class="mt-2 flex items-center gap-2 text-2xl font-bold text-ms-text-primary">
            <span class="text-ms-text-secondary">▦</span>{{ contexto.titulo }}
          </h1>
          <p class="mt-1 text-sm text-ms-text-secondary">{{ contexto.subtitulo }}</p>
        </div>
      </div>
    </el-card>

    <!-- 1) Indicadores gerais -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Indicadores gerais · Hoje
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Demanda, capacidade e dimensionamento · vs período anterior
    </p>
    <div class="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiStatCard
        v-for="k in indicadores"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
      />
    </div>

    <!-- 2) Tabela — turnos -->
    <ChartCard
      title="Turnos de trabalho"
      subtitle="Capacidade × carga média por turno · ordenado por criticidade"
      class="mb-5"
    >
      <DataList
        :columns="turnoColumns"
        :rows="turnosTabela"
        row-key="turno"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="turnos"
      >
        <template #cell-sugestao="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.sugestao }}</span>
        </template>
        <template #cell-pico="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.pico }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status].dot" />{{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <!-- 3) Evolução -->
    <ChartCard
      title="Demanda vs Capacidade por hora"
      subtitle="Barras = volume de chamados · pico sinalizado"
      class="mb-5"
    >
      <div class="mb-2">
        <IndicadorSelector v-model="metrica" label="Indicador:" :options="evolucaoMetricas" />
      </div>
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
      </div>
    </ChartCard>

    <!-- 4) Correlação -->
    <ChartCard
      title="Correlação operacional"
      subtitle="Pico × Capacidade × TME × Ocupação · Por turno · Identificação de gargalos"
      class="mb-3"
    >
      <DataList
        :columns="correlColumns"
        :rows="correlacao"
        row-key="turno"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="turnos"
      >
        <template #cell-tme="{ row }">
          <span class="font-medium" :class="tmeTone(row.tme)">{{ row.tme }}min</span>
        </template>
        <template #cell-ocupacao="{ row }">
          <span class="font-medium" :class="ocupTone(row.ocupacao)">{{ row.ocupacao }}%</span>
        </template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status].dot" />{{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>
    <div
      class="mb-5 flex items-start gap-2 rounded-lg border border-ms-border-light bg-ms-surface px-3 py-2.5"
    >
      <span class="text-ms-text-secondary">ℹ</span>
      <div class="text-xs text-ms-text-regular">
        <span class="font-semibold text-ms-text-primary">Como interpretar</span>
        <p class="mt-0.5 leading-relaxed">{{ comoInterpretar }}</p>
      </div>
    </div>

    <!-- 5) Insights da IA -->
    <RecomendacoesIA
      subtitle="Ações de dimensionamento · ordenadas por impacto"
      diagnostico-titulo="Diagnóstico de capacidade"
      :confianca="diagnostico.confianca"
      :texto="diagnostico.texto"
      :recomendacoes="recomendacoes"
    />

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/tempo-real', query: { tab: 'performance' } }"
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
