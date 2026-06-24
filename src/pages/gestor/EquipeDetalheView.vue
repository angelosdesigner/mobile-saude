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
  atendentes,
  evolucao,
  evolucaoMetricas,
  correlacao,
  comoInterpretar,
  diagnostico,
  recomendacoes,
  proximaAcao,
  type EvolucaoMetrica,
  type EquipeStatus,
} from '@/data/gestorEquipeDetalhe'

// Tela de detalhe "Desempenho da Equipe" — estrutura padrão (5 seções).
const C = useChartColors()

const periodoAtivo = ref<string>('7d')
const metrica = ref<EvolucaoMetrica>('Eficiência')

// ── 3) Evolução: indicador da equipe na semana ───────────────────────────────
const isCsat = computed(() => metrica.value === 'CSAT')
const unidade = computed(() => (isCsat.value ? '' : '%'))

const evolucaoOption = computed(() => {
  const serie = evolucao.series[metrica.value]
  const meta = evolucao.metas[metrica.value]
  const eixo = isCsat.value ? { min: 3.5, max: 5 } : { min: 0, max: 100 }
  return {
    tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}${unidade.value}` },
    grid: { left: 40, right: 16, top: 20, bottom: 36 },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: [metrica.value, `Meta ${meta}${unidade.value}`],
    },
    xAxis: {
      type: 'category',
      data: evolucao.dias,
      axisLabel: { color: C.axis, fontSize: 10 },
      axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: {
      type: 'value',
      ...eixo,
      axisLabel: { color: C.axis, fontSize: 10, formatter: `{value}${unidade.value}` },
      splitLine: { lineStyle: { color: C.split } },
    },
    series: [
      {
        name: metrica.value,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: serie,
        lineStyle: { color: C.primary, width: 2.5 },
        itemStyle: { color: C.primary },
        areaStyle: { color: C.primary, opacity: 0.08 },
        markLine: {
          symbol: 'none',
          silent: true,
          label: { fontSize: 10 },
          data: [
            {
              xAxis: evolucao.dias[evolucao.agoraIdx],
              lineStyle: { color: C.danger, type: 'solid', width: 1.5 },
              label: { formatter: 'HOJE', color: C.danger, position: 'insideEndTop' },
            },
          ],
        },
      },
      {
        name: `Meta ${meta}${unidade.value}`,
        type: 'line',
        symbol: 'none',
        data: evolucao.dias.map(() => meta),
        lineStyle: { color: C.success, type: 'dashed', width: 1.5 },
        itemStyle: { color: C.success },
      },
    ],
  }
})

// ── 2) Tabela / 4) Correlação ────────────────────────────────────────────────
const statusOrder: Record<EquipeStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const atendenteColumns: DataListColumn[] = [
  { key: 'atendente', label: 'Atendente', minWidth: 180, sortable: true },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 120, sortBy: (r) => r.ocupacao as number },
  { key: 'csat', label: 'CSAT', align: 'right', width: 100, sortBy: (r) => r.csat as number },
  { key: 'reaberturas', label: 'Reaberturas', align: 'right', width: 120, sortable: true },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as EquipeStatus] },
]
const correlColumns: DataListColumn[] = [
  { key: 'atendente', label: 'Atendente', minWidth: 160, sortable: true },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupacao as number },
  { key: 'csat', label: 'CSAT', align: 'right', width: 90, sortBy: (r) => r.csat as number },
  { key: 'reaberturas', label: 'Reab.', align: 'right', width: 90, sortable: true },
  { key: 'gargalo', label: 'Gargalo', minWidth: 280 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as EquipeStatus] },
]

const statusTone: Record<EquipeStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
const ocupTone = (v: number) => (v >= 90 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const csatTone = (v: number) => (v < 4 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
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
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real', query: { tab: 'equipe' } }"
        >Desempenho da Equipe</el-breadcrumb-item
      >
      <el-breadcrumb-item>Detalhes</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Cabeçalho/contexto -->
    <el-card shadow="never" body-class="!p-5" class="mb-5 overflow-hidden !border-ms-border-light">
      <div class="-mx-5 -mt-5 mb-4 h-1 bg-ms-warning" />
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-xs">
            <span class="flex items-center gap-1.5 font-bold uppercase tracking-wide text-ms-warning">
              <span class="h-2 w-2 rounded-full bg-ms-warning" />{{ contexto.badge }}
            </span>
            <span class="text-ms-text-secondary">· {{ contexto.resumo }}</span>
          </div>
          <h1 class="mt-2 flex items-center gap-2 text-2xl font-bold text-ms-text-primary">
            <span class="text-ms-text-secondary">☺</span>{{ contexto.titulo }}
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
      Produtividade, ocupação e qualidade · vs período anterior
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

    <!-- 2) Tabela — por atendente -->
    <ChartCard
      title="Desempenho por atendente"
      subtitle="Ocupação, qualidade e reabertura · ordenado por criticidade"
      class="mb-5"
    >
      <DataList
        :columns="atendenteColumns"
        :rows="atendentes"
        row-key="atendente"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="atendentes"
      >
        <template #cell-ocupacao="{ row }">
          <span class="font-medium" :class="ocupTone(row.ocupacao)">{{ row.ocupacao }}%</span>
        </template>
        <template #cell-csat="{ row }">
          <span class="font-medium" :class="csatTone(row.csat)">{{ row.csat }}</span>
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
      title="Evolução da equipe"
      subtitle="Indicador ao longo da semana · vs meta"
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
      subtitle="Ocupação × CSAT × Reabertura · Por atendente · Identificação de sobrecarga"
      class="mb-3"
    >
      <DataList
        :columns="correlColumns"
        :rows="correlacao"
        row-key="atendente"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="atendentes"
      >
        <template #cell-ocupacao="{ row }">
          <span class="font-medium" :class="ocupTone(row.ocupacao)">{{ row.ocupacao }}%</span>
        </template>
        <template #cell-csat="{ row }">
          <span class="font-medium" :class="csatTone(row.csat)">{{ row.csat }}</span>
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
      subtitle="Ações para equilibrar carga e proteger a qualidade"
      diagnostico-titulo="Diagnóstico da equipe"
      :confianca="diagnostico.confianca"
      :texto="diagnostico.texto"
      :recomendacoes="recomendacoes"
    />

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/tempo-real', query: { tab: 'equipe' } }"
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
