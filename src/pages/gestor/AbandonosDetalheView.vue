<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import KpiStatCard from '@/components/gestor/KpiStatCard.vue'
import RecomendacoesIA from '@/components/gestor/RecomendacoesIA.vue'
import IndicadorSelector from '@/components/gestor/IndicadorSelector.vue'
import PeriodoSelector from '@/components/gestor/PeriodoSelector.vue'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import { useChartColors } from '@/plugins/echarts'
import {
  periodos,
  contexto,
  indicadores,
  fluxos,
  evolucao,
  evolucaoMetricas,
  correlacao,
  comoInterpretar,
  diagnostico,
  recomendacoes,
  proximaAcao,
  type EvolucaoMetrica,
  type AbandonoStatus,
} from '@/data/gestorAbandonosDetalhe'

// Tela de detalhe "Abandonos e Desistência" — estrutura padrão (5 seções).
const C = useChartColors()

const periodoAtivo = ref<string>('Hoje')
const metrica = ref<EvolucaoMetrica>('Total')

// ── 3) Evolução: abandonos por hora (contagem) ───────────────────────────────
const evolucaoOption = computed(() => {
  const serie = evolucao.series[metrica.value]
  const cor = metrica.value === 'Humano' ? C.success : C.primary
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 32, right: 16, top: 20, bottom: 36 },
    xAxis: {
      type: 'category',
      data: evolucao.horas,
      axisLabel: { color: C.axis, fontSize: 10 },
      axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: C.axis, fontSize: 10 },
      splitLine: { lineStyle: { color: C.split } },
    },
    series: [
      {
        name: `Abandonos (${metrica.value})`,
        type: 'bar',
        data: serie.map((v, i) => ({
          value: v,
          itemStyle: {
            color: cor,
            opacity: i === evolucao.picoIdx ? 0.9 : 0.45,
            borderRadius: [3, 3, 0, 0],
          },
        })),
        barWidth: '52%',
        markLine: {
          symbol: 'none',
          silent: true,
          label: { fontSize: 10 },
          data: [
            {
              xAxis: evolucao.horas[evolucao.picoIdx],
              lineStyle: { color: C.warning, type: 'solid', width: 1 },
              label: { formatter: evolucao.picoLabel, color: C.warning, position: 'insideEndTop' },
            },
            {
              xAxis: evolucao.horas[evolucao.agoraIdx],
              lineStyle: { color: C.danger, type: 'solid', width: 1.5 },
              label: { formatter: 'AGORA', color: C.danger, position: 'insideEndTop' },
            },
          ],
        },
      },
    ],
  }
})

// ── 2) Tabela — abandono por fluxo ───────────────────────────────────────────
const statusOrder: Record<AbandonoStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const fluxoColumns: DataListColumn[] = [
  { key: 'fluxo', label: 'Fluxo', minWidth: 180, sortable: true },
  { key: 'volume', label: 'Volume', align: 'right', width: 100, sortable: true },
  { key: 'abandonos', label: 'Abandonos', align: 'right', width: 110, sortable: true },
  { key: 'bot', label: 'Aband. BOT', align: 'right', width: 110, sortBy: (r) => r.bot as number },
  { key: 'humana', label: 'Aband. humana', align: 'right', width: 130, sortBy: (r) => r.humana as number },
  { key: 'origem', label: 'Origem', width: 110 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as AbandonoStatus] },
]

// ── 4) Correlação ────────────────────────────────────────────────────────────
const correlColumns: DataListColumn[] = [
  { key: 'fluxo', label: 'Fluxo', minWidth: 180, sortable: true },
  { key: 'volume', label: 'Volume', align: 'right', width: 100, sortable: true },
  { key: 'bot', label: 'Aband. BOT', align: 'right', width: 110, sortBy: (r) => r.bot as number },
  { key: 'humana', label: 'Aband. humana', align: 'right', width: 130, sortBy: (r) => r.humana as number },
  { key: 'gargalo', label: 'Gargalo', minWidth: 260 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as AbandonoStatus] },
]

const statusTone: Record<AbandonoStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
const origemTone: Record<'BOT' | 'Humano' | 'Misto', string> = {
  BOT: 'text-ms-primary',
  Humano: 'text-ms-success',
  Misto: 'text-ms-text-secondary',
}
const botTone = (v: number) => (v >= 10 ? 'text-ms-danger' : v >= 5 ? 'text-ms-warning' : 'text-ms-text-regular')
const humanaTone = (v: number) => (v >= 10 ? 'text-ms-danger' : v >= 5 ? 'text-ms-warning' : 'text-ms-text-regular')
</script>

<template>
  <DashboardLayout>
    <!-- Breadcrumb -->
    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real', query: { tab: 'abandonos' } }"
        >Abandonos e Desistência</el-breadcrumb-item
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
            <span class="text-ms-text-secondary">⊘</span>{{ contexto.titulo }}
          </h1>
          <p class="mt-1 text-sm text-ms-text-secondary">{{ contexto.subtitulo }}</p>
        </div>
        <PeriodoSelector v-model="periodoAtivo" :options="periodos" />
      </div>
    </el-card>

    <!-- 1) Indicadores gerais -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Indicadores gerais · Hoje
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Volume de desistências, origem e taxa · vs período anterior
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

    <!-- 2) Tabela — abandono por fluxo -->
    <ChartCard
      title="Abandono por fluxo"
      subtitle="Onde o beneficiário desiste · ordenado por nº de abandonos"
      class="mb-5"
    >
      <DataList
        :columns="fluxoColumns"
        :rows="fluxos"
        row-key="fluxo"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="fluxos"
      >
        <template #cell-bot="{ row }">
          <span class="font-medium" :class="botTone(row.bot)">{{ row.bot }}%</span>
        </template>
        <template #cell-humana="{ row }">
          <span class="font-medium" :class="humanaTone(row.humana)">{{ row.humana }}%</span>
        </template>
        <template #cell-origem="{ row }">
          <span class="text-xs font-semibold" :class="origemTone[row.origem]">{{ row.origem }}</span>
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
      title="Evolução dos abandonos"
      subtitle="Desistências por hora · pico e momento atual sinalizados"
      class="mb-5"
    >
      <div class="mb-2">
        <IndicadorSelector v-model="metrica" label="Origem:" :options="evolucaoMetricas" />
      </div>
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
      </div>
    </ChartCard>

    <!-- 4) Correlação -->
    <ChartCard
      title="Correlação operacional"
      subtitle="Volume × Abandono BOT × Abandono humano · Por fluxo · Identificação de gargalos"
      class="mb-3"
    >
      <DataList
        :columns="correlColumns"
        :rows="correlacao"
        row-key="fluxo"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="fluxos"
      >
        <template #cell-bot="{ row }">
          <span class="font-medium" :class="botTone(row.bot)">{{ row.bot }}%</span>
        </template>
        <template #cell-humana="{ row }">
          <span class="font-medium" :class="humanaTone(row.humana)">{{ row.humana }}%</span>
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
      subtitle="Ações para reduzir desistências · ordenadas por impacto"
      diagnostico-titulo="Diagnóstico de abandono"
      :confianca="diagnostico.confianca"
      :texto="diagnostico.texto"
      :recomendacoes="recomendacoes"
    />

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/tempo-real', query: { tab: 'abandonos' } }"
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
