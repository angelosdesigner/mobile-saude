<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import KpiStatCard from '@/components/gestor/KpiStatCard.vue'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import { useChartColors } from '@/plugins/echarts'
import { useActionFeedback } from '@/composables/useActionFeedback'
import {
  periodos,
  contexto,
  canalPills,
  indicadoresCanal,
  operacaoAgora,
  evolucao,
  evolucaoMetricas,
  correlacao,
  comoInterpretar,
  alertas,
  diagnosticoCanal,
  recomendacoesCanal,
  canalSaudavel,
  type CorrelStatus,
} from '@/data/gestorOperacaoCanal'

// Tela de detalhe "Operação por Canal" (drill-down da aba Atendimentos) —
// Figma 7651:98838. Estrutura padrão das telas de detalhe do gestor.
const C = useChartColors()
const { comingSoon } = useActionFeedback()

const periodoAtivo = ref<string>('Hoje')
const metrica = ref<string>('SLA')

const pillTone: Record<'success' | 'warning' | 'danger', string> = {
  success: 'text-ms-success',
  warning: 'text-ms-warning',
  danger: 'text-ms-danger',
}

// ── Evolução: período reescala a janela (Hoje = 12h; demais agregam). ─────────
const periodoLabels: Record<string, string[]> = {
  Hoje: evolucao.horas,
  '7d': ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  '30d': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  Trimestre: ['Mês 1', 'Mês 2', 'Mês 3'],
}
const eixoLabels = computed(() => periodoLabels[periodoAtivo.value] ?? evolucao.horas)
const isHoje = computed(() => periodoAtivo.value === 'Hoje')

// Reamostra `arr` para `n` pontos por interpolação linear (determinístico).
function resample(arr: number[], n: number): number[] {
  if (n === arr.length || arr.length < 2) return arr.slice(0, n)
  return Array.from({ length: n }, (_, i) => {
    const t = (i / (n - 1)) * (arr.length - 1)
    const lo = Math.floor(t)
    const hi = Math.ceil(t)
    return Number((arr[lo] + (arr[hi] - arr[lo]) * (t - lo)).toFixed(1))
  })
}

const evolucaoSubtitulo = computed(() =>
  isHoje.value
    ? 'Volume vs SLA · onde a fila telefônica entrou em colapso'
    : `Volume vs ${metrica.value} · janela ${periodoAtivo.value}`,
)

const evolucaoOption = computed(() => {
  const n = eixoLabels.value.length
  const volume = resample(evolucao.volume, n)
  const linha = resample(evolucao.series[metrica.value] ?? evolucao.series.SLA, n)
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 48, top: 20, bottom: 36 },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: ['Volume', `${metrica.value} atual`, 'Meta 90%'],
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
        max: 100,
        axisLabel: { color: C.axis, fontSize: 10 },
        splitLine: { lineStyle: { color: C.split } },
      },
      {
        type: 'value',
        min: 50,
        max: 100,
        position: 'right',
        axisLabel: { color: C.axis, fontSize: 10, formatter: '{value}%' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Volume',
        type: 'bar',
        data: volume,
        barWidth: '46%',
        itemStyle: { color: C.primary, opacity: 0.18, borderRadius: [3, 3, 0, 0] },
      },
      {
        name: `${metrica.value} atual`,
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: linha,
        // Cor por segmento: degrada para vermelho quando cai abaixo da meta.
        lineStyle: { color: C.warning, width: 2.5 },
        itemStyle: { color: C.warning },
        markLine: isHoje.value
          ? {
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
            }
          : undefined,
      },
      {
        name: 'Meta 90%',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'none',
        data: eixoLabels.value.map(() => evolucao.meta),
        lineStyle: { color: C.success, type: 'dashed', width: 1.5 },
        itemStyle: { color: C.success },
      },
    ],
  }
})

// ── Tabela "Operação por canal · agora" ──────────────────────────────────────
const operacaoColumns: DataListColumn[] = [
  { key: 'canal', label: 'Canal', minWidth: 140, sortable: true },
  { key: 'atendentes', label: 'Atendentes', align: 'right', width: 120, sortable: true },
  { key: 'emEspera', label: 'Em espera', align: 'right', width: 120, sortable: true },
  { key: 'emAtendimento', label: 'Em atendimento', align: 'right', width: 140, sortable: true },
  { key: 'finalizados', label: 'Finalizados', align: 'right', width: 120, sortable: true },
  { key: 'tme', label: 'TME', align: 'right', width: 100, sortBy: (r) => parseFloat(String(r.tme)) },
  { key: 'sla', label: 'SLA', align: 'right', width: 100, sortBy: (r) => r.sla as number },
]

// ── Tabela "Correlação operacional" ──────────────────────────────────────────
const correlStatusOrder: Record<CorrelStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const correlColumns: DataListColumn[] = [
  { key: 'canal', label: 'Canal', minWidth: 130, sortable: true },
  { key: 'volume', label: 'Volume', align: 'right', width: 110, sortable: true },
  { key: 'sla', label: 'SLA', align: 'right', width: 90, sortBy: (r) => r.sla as number },
  { key: 'tme', label: 'TME', align: 'right', width: 90, sortBy: (r) => tmeSeg(r.tme as string) },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupacao as number },
  { key: 'espera', label: 'T. espera', align: 'right', width: 110, sortBy: (r) => tmeSeg(r.espera as string) },
  { key: 'gargalo', label: 'Gargalo', minWidth: 240 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => correlStatusOrder[r.status as CorrelStatus] },
]
const tmeSeg = (s: string) => {
  const [m, sec] = s.split(':').map(Number)
  return (m || 0) * 60 + (sec || 0)
}

const statusTone: Record<CorrelStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
// SLA/Ocupação: limiar simples para cor (SLA<80 ruim; ocup>85 ruim).
const slaTone = (v: number) => (v >= 90 ? 'text-ms-success' : v >= 80 ? 'text-ms-warning' : 'text-ms-danger')
const ocupTone = (v: number) => (v > 90 ? 'text-ms-danger' : v >= 85 ? 'text-ms-warning' : 'text-ms-success')

const alertaTone: Record<'CRÍTICO' | 'ATENÇÃO', { bar: string; badge: string }> = {
  CRÍTICO: { bar: 'border-l-ms-danger', badge: 'text-ms-danger' },
  ATENÇÃO: { bar: 'border-l-ms-warning', badge: 'text-ms-warning' },
}
</script>

<template>
  <DashboardLayout>
    <!-- Breadcrumb -->
    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real', query: { tab: 'atendimentos' } }"
        >Operação de Atendimento</el-breadcrumb-item
      >
      <el-breadcrumb-item>Operação por Canal · {{ contexto.canalAtivo }}</el-breadcrumb-item>
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
            <span class="text-ms-text-secondary">· {{ contexto.resumoSla }}</span>
          </div>
          <h1 class="mt-2 flex items-center gap-2 text-2xl font-bold text-ms-text-primary">
            <span class="text-ms-text-secondary">⊞</span>{{ contexto.titulo }}
          </h1>
          <p class="mt-1 text-sm text-ms-text-secondary">{{ contexto.subtitulo }}</p>
        </div>
        <el-radio-group v-model="periodoAtivo" size="small">
          <el-radio-button v-for="p in periodos" :key="p" :value="p">{{ p }}</el-radio-button>
        </el-radio-group>
      </div>
      <!-- Pills de canal -->
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="c in canalPills"
          :key="c.nome"
          class="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs"
          :class="
            c.ativo ? 'border-ms-primary bg-ms-primary/5 font-semibold' : 'border-ms-border-light'
          "
        >
          <span class="text-ms-text-regular">{{ c.nome }}</span>
          <span class="font-semibold" :class="pillTone[c.tone]">{{ c.sla }}%</span>
        </span>
      </div>
    </el-card>

    <!-- 1) Indicadores do canal -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Indicadores do canal · Hoje
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Volume, tempo de resposta e capacidade · vs canal anterior
    </p>
    <div class="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiStatCard
        v-for="k in indicadoresCanal"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
      />
    </div>

    <!-- 2) Operação por canal · agora -->
    <ChartCard
      title="Operação por canal · agora"
      subtitle="Volume, espera e desempenho por canal de atendimento"
      class="mb-5"
    >
      <DataList
        :columns="operacaoColumns"
        :rows="operacaoAgora"
        row-key="canal"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="canais"
      >
        <template #cell-canal="{ row }">
          <span :class="row.ativo ? 'font-semibold text-ms-text-primary' : ''">{{ row.canal }}</span>
        </template>
        <template #cell-emEspera="{ row }">
          <span :class="row.esperaTone === 'danger' ? 'font-semibold text-ms-danger' : ''">{{
            row.emEspera
          }}</span>
        </template>
        <template #cell-sla="{ row }">
          <span class="font-semibold" :class="pillTone[row.slaTone]">{{ row.sla }}%</span>
        </template>
      </DataList>
    </ChartCard>

    <!-- 3) Evolução do canal -->
    <ChartCard
      title="Evolução do canal · últimas 12h"
      :subtitle="evolucaoSubtitulo"
      class="mb-5"
    >
      <div class="mb-2">
        <el-select v-model="metrica" size="small" class="!w-36">
          <el-option v-for="m in evolucaoMetricas" :key="m" :label="m" :value="m" />
        </el-select>
      </div>
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
      </div>
    </ChartCard>

    <!-- 4) Correlação operacional -->
    <ChartCard
      title="Correlação operacional"
      subtitle="Volume × SLA × TME × Ocupação × Espera · Por canal · Identificação de gargalos"
      class="mb-3"
    >
      <DataList
        :columns="correlColumns"
        :rows="correlacao"
        row-key="canal"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="canais"
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
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status].dot" />{{ row.status }}
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

    <!-- 5) Alertas do canal · ativos -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Alertas do canal · ativos
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">Sinais detectados nas últimas 4 horas</p>
    <div class="mb-5 grid gap-4 lg:grid-cols-3">
      <el-card
        v-for="a in alertas"
        :key="a.titulo"
        shadow="never"
        body-class="!p-4"
        class="border-l-4 !border-ms-border-light"
        :class="alertaTone[a.severidade].bar"
      >
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide" :class="alertaTone[a.severidade].badge">
            <span class="h-1.5 w-1.5 rounded-full" :class="a.severidade === 'CRÍTICO' ? 'bg-ms-danger' : 'bg-ms-warning'" />{{ a.severidade }}
          </span>
          <span class="text-2xs text-ms-text-secondary">{{ a.tempo }}</span>
        </div>
        <div class="mt-2 text-sm font-semibold text-ms-text-primary">{{ a.titulo }}</div>
        <p class="mt-1 text-xs text-ms-text-secondary">{{ a.corpo }}</p>
      </el-card>
    </div>

    <!-- 6) Recomendações IA -->
    <ChartCard
      title="Recomendações IA"
      :subtitle="`Ações para recuperar performance do canal ${contexto.canalAtivo}`"
    >
      <div class="mb-3 rounded-lg border border-ms-primary/20 bg-ms-primary/5 p-3">
        <div class="mb-1 flex flex-wrap items-center gap-2">
          <span class="text-sm font-bold text-ms-text-primary">Diagnóstico do canal</span>
          <span class="rounded bg-ms-primary px-1.5 py-0.5 text-2xs font-bold uppercase text-white"
            >IA</span
          >
          <span class="ml-auto text-2xs text-ms-text-secondary">{{ diagnosticoCanal.confianca }}</span>
        </div>
        <p class="text-xs leading-relaxed text-ms-text-regular">{{ diagnosticoCanal.texto }}</p>
      </div>

      <div class="grid gap-3 lg:grid-cols-3">
        <div
          v-for="(r, i) in recomendacoesCanal"
          :key="r.titulo"
          class="flex flex-col rounded-lg border p-3"
          :class="r.destaque ? 'border-ms-primary/40 bg-ms-primary/5' : 'border-ms-border-light'"
        >
          <div class="flex items-center gap-2">
            <span
              class="flex h-5 w-5 items-center justify-center rounded-full bg-ms-primary/10 text-2xs font-bold text-ms-primary"
              >{{ i + 1 }}</span
            >
            <span class="text-sm font-semibold text-ms-text-primary">{{ r.titulo }}</span>
          </div>
          <p class="mt-2 flex-1 text-xs text-ms-text-secondary">{{ r.corpo }}</p>
          <div class="mt-2 rounded bg-ms-fill-light px-2 py-1 text-2xs font-medium text-ms-text-regular">
            IMPACTO: {{ r.impacto }}
          </div>
          <el-button
            :type="r.destaque ? 'primary' : 'default'"
            size="small"
            class="mt-2"
            @click="comingSoon(r.acao)"
          >
            {{ r.acao }}
          </el-button>
        </div>
      </div>
    </ChartCard>

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/tempo-real', query: { tab: 'atendimentos' } }"
        class="text-ms-primary no-underline hover:underline"
        >← Voltar ao Dashboard</router-link
      >
      <span class="text-ms-text-secondary">
        Canal saudável:
        <span class="font-medium text-ms-success"
          >{{ canalSaudavel.nome }} · SLA {{ canalSaudavel.sla }}% →</span
        >
      </span>
    </div>
  </DashboardLayout>
</template>
