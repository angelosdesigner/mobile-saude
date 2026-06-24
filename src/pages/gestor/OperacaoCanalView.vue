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
  operacaoAgora,
  evolucaoBase,
  evolucaoMetricas,
  correlacao,
  comoInterpretar,
  canalSaudavel,
  type CanalContexto,
  type CorrelStatus,
} from '@/data/gestorOperacaoCanal'
import { escalarVolume } from '@/data/gestorPeriodo'
import { normalizeCanal } from '@/data/gestorTaxonomia'

// Tela de detalhe "Operação por Canal" (drill-down da aba Atendimentos) —
// Figma 7651:98838. Os chips no topo selecionam o TIPO de canal (Geral por
// padrão; Chat/WhatsApp agrupados) e reconfiguram tudo abaixo, exceto as
// tabelas comparativas (mantêm todos os canais, com o tipo ativo destacado).
const C = useChartColors()
const route = useRoute()
const router = useRouter()

const chaveValida = (v: unknown): v is CanalContexto =>
  typeof v === 'string' && v in contextos

const ctxKey = ref<CanalContexto>(chaveValida(route.query.canal) ? route.query.canal : 'geral')
watch(
  () => route.query.canal,
  (v) => {
    if (chaveValida(v)) ctxKey.value = v
  },
)
function selecionar(key: CanalContexto) {
  ctxKey.value = key
  router.replace({ query: { ...route.query, canal: key } })
}

// Drill-down (3º nível): clique no nome do canal nas tabelas → lista de
// Ocorrências filtrada por aquele canal (Protocolo → jornada).
function abrirCanalLista(canal: string) {
  router.push({
    path: '/gestor/ocorrencias',
    query: { view: 'lista', canal: normalizeCanal(canal) },
  })
}

const ctx = computed(() => contextos[ctxKey.value])
const isGeral = computed(() => ctxKey.value === 'geral')

// KPIs reagem ao período: o Volume (acumulado) é escalado; taxas/tempos
// (Ocupação/TME/TMA) são médias e permanecem estáveis.
const kpisPeriodo = computed(() =>
  ctx.value.kpis.map((k) =>
    k.label === 'Volume' ? { ...k, value: escalarVolume(k.value, periodoAtivo.value) } : k,
  ),
)
const destacado = (canal: string) => ctx.value.canaisDestaque.includes(canal)

const periodoAtivo = ref<string>('Hoje')
const metrica = ref<(typeof evolucaoMetricas)[number]>('Ocupação')

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

// Títulos de seção e textos dependem de ser visão geral ou de um canal.
// "Indicadores da operação" é o título-base de todas as telas de detalhe.
// O sufixo de período reflete o que o usuário escolher no seletor (não fixo em "Hoje").
const kpiTitulo = computed(() =>
  `${isGeral.value ? 'Indicadores da operação' : 'Indicadores do canal'} · ${periodoAtivo.value}`,
)
const evolucaoTitulo = computed(() =>
  isGeral.value ? 'Evolução da operação · últimas 12h' : 'Evolução do canal · últimas 12h',
)
const evolucaoSubtitulo = computed(() =>
  isGeral.value
    ? `Volume total vs ${metrica.value} consolidado · janela ${periodoAtivo.value}`
    : `Volume vs ${metrica.value} · janela ${periodoAtivo.value}`,
)
const iaSubtitulo = computed(() =>
  isGeral.value
    ? 'Ações para recuperar a performance da operação'
    : `Ações para recuperar performance do canal ${ctx.value.label}`,
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

// Tipo de eixo do indicador selecionado: % (Ocupação), minutos (TME/TMA) ou
// contagem (Volume → compartilha o eixo das barras de volume).
const metricaPct = computed(() => metrica.value === 'Ocupação')
const metricaMin = computed(() => metrica.value === 'TME' || metrica.value === 'TMA')

// Séries da linha derivadas das séries do contexto (determinístico, mock):
const linhaSerie = computed<number[]>(() => {
  const vol = ctx.value.volume
  const sla = ctx.value.sla
  const max = Math.max(...vol) || 1
  if (metrica.value === 'Volume') return vol
  if (metrica.value === 'Ocupação') return vol.map((v) => Math.round(55 + (v / max) * 40))
  if (metrica.value === 'TMA') return vol.map((v) => Number((4 + (v / max) * 6).toFixed(1)))
  // TME (min): inversamente proporcional ao SLA.
  return sla.map((v) => Number(Math.max(1.2, (100 - v) / 10).toFixed(1)))
})

const evolucaoOption = computed(() => {
  const n = eixoLabels.value.length
  const volume = resample(ctx.value.volume, n)
  const linha = resample(linhaSerie.value, n)
  const volMax = Math.max(...volume) * 1.1
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 48, top: 20, bottom: 36 },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: ['Volume', `${metrica.value} atual`, ...(metricaPct.value ? ['Meta 90%'] : [])],
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
        max: metricaPct.value ? 100 : Math.ceil((Math.max(...linha) || 1) * 1.25),
        axisLabel: {
          color: C.axis,
          fontSize: 10,
          formatter: metricaPct.value ? '{value}%' : metricaMin.value ? '{value}min' : '{value}',
        },
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
        yAxisIndex: metricaPct.value || metricaMin.value ? 1 : 0,
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
        // Linha de meta só faz sentido para a Ocupação (%); oculta nos demais.
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

// ── Tabela "Operação por canal · agora" ──────────────────────────────────────
// Ordem macro→micro: indicadores (Volume/Ocupação/TME/TMA) → No bot → contadores
// operacionais. Sem coluna SLA (pedido G6).
const operacaoColumns: DataListColumn[] = [
  { key: 'canal', label: 'Canal', minWidth: 140, sortable: true },
  { key: 'volume', label: 'Volume', align: 'right', width: 110, sortable: true },
  { key: 'ocupacao', label: 'Ocupação', align: 'right', width: 110, sortBy: (r) => r.ocupacao as number },
  { key: 'tme', label: 'TME', align: 'right', width: 100, sortBy: (r) => parseFloat(String(r.tme)) },
  { key: 'tma', label: 'TMA', align: 'right', width: 100, sortBy: (r) => parseFloat(String(r.tma)) },
  { key: 'noBot', label: 'No bot', align: 'right', width: 100, sortable: true },
  { key: 'emEspera', label: 'Em espera', align: 'right', width: 110, sortable: true },
  { key: 'emAtendimento', label: 'Em atendimento', align: 'right', width: 140, sortable: true },
  { key: 'atendentes', label: 'Atendentes', align: 'right', width: 110, sortable: true },
  { key: 'finalizados', label: 'Concluídos', align: 'right', width: 110, sortable: true },
]

// ── Tabela "Correlação operacional" ──────────────────────────────────────────
const tmeSeg = (s: string) => {
  const [m, sec] = s.split(':').map(Number)
  return (m || 0) * 60 + (sec || 0)
}
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

const statusTone: Record<CorrelStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
const slaTone = (v: number) => (v < 80 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const ocupTone = (v: number) => (v > 90 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')

const alertaTone: Record<'CRÍTICO' | 'ATENÇÃO', { bar: string; badge: string; dot: string }> = {
  CRÍTICO: { bar: 'border-l-ms-danger', badge: 'text-ms-danger', dot: 'bg-ms-danger' },
  ATENÇÃO: { bar: 'border-l-ms-warning', badge: 'text-ms-warning', dot: 'bg-ms-warning' },
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
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real', query: { tab: 'atendimentos' } }"
        >Operação de Atendimento</el-breadcrumb-item
      >
      <el-breadcrumb-item>Operação por Canal · {{ ctx.label }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Cabeçalho/contexto -->
    <el-card shadow="never" body-class="!p-5" class="mb-5 overflow-hidden !border-ms-border-light">
      <div class="-mx-5 -mt-5 mb-4 h-1" :class="toneBar[ctx.badgeTone]" />
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-xs">
            <span
              class="flex items-center gap-1.5 font-bold uppercase tracking-wide"
              :class="toneText[ctx.badgeTone]"
            >
              <span class="h-2 w-2 rounded-full" :class="toneDot[ctx.badgeTone]" />{{ ctx.badge }}
            </span>
            <span class="text-ms-text-secondary">· {{ ctx.resumoSla }}</span>
          </div>
          <h1 class="mt-2 flex items-center gap-2 text-2xl font-bold text-ms-text-primary">
            <span class="text-ms-text-secondary">⊞</span>Operação por Canal
          </h1>
          <p class="mt-1 text-sm text-ms-text-secondary">{{ ctx.subtitulo }}</p>
        </div>
      </div>

      <!-- Chips de tipo de canal (clicáveis · filtro global) -->
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
          <span v-if="c.key !== 'geral'" class="font-semibold text-ms-text-secondary">{{ c.sla }}%</span>
        </button>
      </div>
    </el-card>

    <!-- 1) Indicadores -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      {{ kpiTitulo }}
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Volume, tempo de resposta e capacidade · vs período anterior
    </p>
    <div class="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiStatCard
        v-for="k in kpisPeriodo"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
      />
    </div>

    <!-- 2) Operação por canal · agora (comparativo) -->
    <ChartCard
      title="Operação por canal · agora"
      subtitle="Volume, espera e desempenho por canal · todos os canais para comparação"
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
          <span class="flex items-center gap-1.5">
            <span v-if="destacado(row.canal)" class="h-1.5 w-1.5 rounded-full bg-ms-primary" /><button
              class="hover:underline"
              :class="destacado(row.canal) ? 'font-semibold text-ms-text-primary' : 'text-ms-primary'"
              @click="abrirCanalLista(row.canal)"
            >
              {{ row.canal }}
            </button>
          </span>
        </template>
        <template #cell-ocupacao="{ row }">
          <span class="font-medium" :class="ocupTone(row.ocupacao)">{{ row.ocupacao }}%</span>
        </template>
        <template #cell-emEspera="{ row }">
          <span :class="row.esperaTone === 'danger' ? 'font-semibold text-ms-danger' : ''">{{
            row.emEspera
          }}</span>
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

    <!-- 4) Correlação operacional (comparativo) -->
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
        <template #cell-canal="{ row }">
          <span class="flex items-center gap-1.5">
            <span v-if="destacado(row.canal)" class="h-1.5 w-1.5 rounded-full bg-ms-primary" /><button
              class="hover:underline"
              :class="destacado(row.canal) ? 'font-semibold text-ms-text-primary' : 'text-ms-primary'"
              @click="abrirCanalLista(row.canal)"
            >
              {{ row.canal }}
            </button>
          </span>
        </template>
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

    <!-- Alertas — oculto por enquanto (estrutura padrão = 5 seções) -->
    <template v-if="false">
      <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
        Alertas {{ isGeral ? 'da operação' : 'do canal' }} · ativos
      </div>
      <p class="mb-3 text-xs text-ms-text-secondary">Sinais detectados nas últimas 4 horas</p>
      <div class="mb-5 grid gap-4 lg:grid-cols-3">
        <el-card
          v-for="a in ctx.alertas"
          :key="a.titulo"
          shadow="never"
          body-class="!p-4"
          class="border-l-4 !border-ms-border-light"
          :class="alertaTone[a.severidade].bar"
        >
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wide" :class="alertaTone[a.severidade].badge">
              <span class="h-1.5 w-1.5 rounded-full" :class="alertaTone[a.severidade].dot" />{{ a.severidade }}
            </span>
            <span class="text-2xs text-ms-text-secondary">{{ a.tempo }}</span>
          </div>
          <div class="mt-2 text-sm font-semibold text-ms-text-primary">{{ a.titulo }}</div>
          <p class="mt-1 text-xs text-ms-text-secondary">{{ a.corpo }}</p>
        </el-card>
      </div>
    </template>

    <!-- 5) Insights da IA -->
    <RecomendacoesIA
      :subtitle="iaSubtitulo"
      :diagnostico-titulo="isGeral ? 'Diagnóstico da operação' : 'Diagnóstico do canal'"
      :confianca="ctx.diagnostico.confianca"
      :texto="ctx.diagnostico.texto"
      :recomendacoes="ctx.recomendacoes"
    />

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/tempo-real', query: { tab: 'atendimentos' } }"
        class="text-ms-primary no-underline hover:underline"
        >← Voltar ao Dashboard</router-link
      >
      <button
        v-if="ctxKey !== canalSaudavel.contexto"
        class="text-ms-text-secondary hover:underline"
        @click="selecionar(canalSaudavel.contexto)"
      >
        Canal saudável:
        <span class="font-medium text-ms-success"
          >{{ canalSaudavel.nome }} · SLA {{ canalSaudavel.sla }}% →</span
        >
      </button>
    </div>
  </DashboardLayout>
</template>
