<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import {
  indicadorKpis,
  detalhePorIndicador,
  dias,
  segmentacao,
  segmentacaoLegenda,
  segmentosCriticos,
  diagnostico,
  recomendacoes,
  type IndicadorKey,
  type FilaCor,
} from '@/data/gestorIndicadores'
import { chartColors as C } from '@/plugins/echarts'
import { useActionFeedback } from '@/composables/useActionFeedback'

const { comingSoon } = useActionFeedback()

// Centro de Indicadores Operacionais (Figma 7651:87503). O indicador ativo vem
// de ?ind= — aceita as chaves canônicas (fcr/resolucao/tme/tmef/nps/abandono) e os
// apelidos vindos dos cards do Início.
const route = useRoute()
const router = useRouter()

const indAlias: Record<string, IndicadorKey> = {
  fcr: 'fcr',
  resolucao: 'resolucao',
  tme: 'tme',
  tmef: 'tmef',
  nps: 'nps',
  abandono: 'abandono',
  'fix-call-resolution': 'fcr',
  'resolucao-chamados': 'resolucao',
  tma: 'tma',
}

const active = computed<IndicadorKey>(() => indAlias[route.query.ind as string] ?? 'tme')
const detalhe = computed(() => detalhePorIndicador[active.value])
const evolucaoSubtitulo = computed(
  () => `Janela: ${periodoAtivo.value} · comparativo vs período anterior e meta`,
)

function selecionar(key: IndicadorKey) {
  router.replace({ query: { ...route.query, ind: key } })
}

// Período ativo (reativo). Cada janela tem seus rótulos de eixo; as séries são
// reamostradas (interpolação determinística) a partir da base de 7 pontos —
// mock, mas o controle de fato muda a visualização (não é decorativo).
const periodos = ['Hoje', '7d', '30d', 'Trimestre']
const periodoAtivo = ref('7d')
const periodoLabels: Record<string, string[]> = {
  Hoje: ['08h', '10h', '12h', '14h', '16h', '18h', '20h'],
  '7d': dias,
  '30d': ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
  Trimestre: ['Mês 1', 'Mês 2', 'Mês 3'],
}
const eixoLabels = computed(() => periodoLabels[periodoAtivo.value] ?? dias)

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

const statusDot: Record<'ok' | 'warning' | 'danger', string> = {
  ok: 'bg-ms-success',
  warning: 'bg-ms-warning',
  danger: 'bg-ms-danger',
}

// COR da bolha = fila (legenda do Figma).
const filaColor: Record<FilaCor, string> = {
  duvidas: C.primary,
  reembolso: C.warning,
  autoriz: C.success,
}
const filaDot: Record<FilaCor, string> = {
  duvidas: 'bg-ms-primary',
  reembolso: 'bg-ms-warning',
  autoriz: 'bg-ms-success',
}
const statusLinha: Record<'Crítico' | 'Atenção' | 'OK', string> = {
  Crítico: 'text-ms-danger',
  Atenção: 'text-ms-warning',
  OK: 'text-ms-success',
}

const evolucaoOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: {
    bottom: 0,
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    textStyle: { color: C.axis, fontSize: 11 },
    data: ['Período atual', 'Período anterior', 'Meta'],
  },
  grid: { left: 36, right: 12, top: 16, bottom: 36 },
  xAxis: {
    type: 'category',
    data: eixoLabels.value,
    axisLabel: { color: C.axis, fontSize: 10 },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: C.axis },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      name: 'Período atual',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      data: resample(detalhe.value.serieAtual, eixoLabels.value.length),
      lineStyle: { color: C.primary, width: 2 },
      itemStyle: { color: C.primary },
    },
    {
      name: 'Período anterior',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: resample(detalhe.value.serieAnterior, eixoLabels.value.length),
      lineStyle: { color: C.axis, type: 'dashed' },
      itemStyle: { color: C.axis },
    },
    {
      name: 'Meta',
      type: 'line',
      symbol: 'none',
      data: eixoLabels.value.map(() => detalhe.value.meta),
      lineStyle: { color: C.success, type: 'dashed' },
      itemStyle: { color: C.success },
    },
  ],
}))

const segmentacaoOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p: { data: [number, number, number, string, string] }) =>
      `${p.data[3]}<br/>Volume: ${p.data[0]} · TME ${p.data[1]}min<br/>${p.data[4]}`,
  },
  grid: { left: 40, right: 16, top: 16, bottom: 40 },
  xAxis: {
    type: 'value',
    name: 'Volume de Atendimentos',
    nameLocation: 'middle',
    nameGap: 26,
    nameTextStyle: { color: C.axis, fontSize: 10 },
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      type: 'scatter',
      symbolSize: (d: number[]) => d[2],
      data: segmentacao.map((s) => ({
        value: [s.volume, s.tme, s.size, s.nome, s.caption],
        itemStyle: { color: filaColor[s.fila], opacity: 0.75 },
      })),
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: { color: C.success, type: 'dashed' },
        data: [{ yAxis: detalhe.value.meta, label: { formatter: 'Meta', color: C.success } }],
      },
    },
  ],
}))

function tendTone(t: string): string {
  if (t.startsWith('Piorando')) return 'text-ms-danger'
  if (t.startsWith('Melhorando')) return 'text-ms-success'
  return 'text-ms-text-secondary'
}

// Colunas da tabela de segmentos críticos (DataList compartilhado).
// Larguras padronizadas: numéricas ~110 à direita; texto com min-width.
const segmentoColumns: DataListColumn[] = [
  { key: 'segmento', label: 'Segmento', minWidth: 220, sortable: true },
  { key: 'volume', label: 'Volume', align: 'right', width: 110, sortable: true },
  { key: 'atendidos', label: 'Atendidos', align: 'right', width: 110 },
  { key: 'abandonados', label: 'Abandonados', align: 'right', width: 120 },
  { key: 'disponiveis', label: 'Disponíveis', align: 'right', width: 120 },
  { key: 'tme', label: 'TME', align: 'right', width: 100 },
  { key: 'metaTme', label: 'Meta do TME', align: 'right', width: 120 },
  { key: 'tma', label: 'TMA', align: 'right', width: 100 },
  { key: 'csat', label: 'CSAT', align: 'center', width: 90 },
  { key: 'tendencia', label: 'Tendência', width: 130 },
  { key: 'status', label: 'Status', width: 110 },
  { key: 'acao', label: 'Ação', width: 110 },
]
</script>

<template>
  <DashboardLayout>
    <!-- Breadcrumb (interativo) -->
    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/gestor/indicadores' }"
        >Indicadores Gerais</el-breadcrumb-item
      >
      <el-breadcrumb-item>Centro de Indicadores Operacionais</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Cabeçalho -->
    <div class="mb-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-ms-text-primary">Centro de Indicadores Operacionais</h1>
        <p class="mt-1 text-sm text-ms-text-secondary">
          Análise temporal, comparativa e por segmento dos KPIs estratégicos da operação.
        </p>
      </div>
      <el-radio-group v-model="periodoAtivo" size="small">
        <el-radio-button v-for="p in periodos" :key="p" :value="p">{{ p }}</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Seletor de indicadores -->
    <div class="mb-2 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Indicadores estratégicos
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Clique em um indicador para ver detalhamento completo
    </p>
    <div class="mb-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      <button
        v-for="k in indicadorKpis"
        :key="k.key"
        class="rounded-lg border bg-ms-surface px-4 py-3 text-left transition hover:shadow-md"
        :class="
          active === k.key ? '!border-ms-primary ring-1 ring-ms-primary' : 'border-ms-border-light'
        "
        @click="selecionar(k.key)"
      >
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full" :class="statusDot[k.status]" />
          <span class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">{{
            k.label
          }}</span>
        </div>
        <div class="mt-1 text-xl font-bold text-ms-text-primary">{{ k.value }}</div>
      </button>
    </div>

    <!-- Evolução temporal + comparações -->
    <div class="mb-5 grid gap-4 lg:grid-cols-3">
      <ChartCard :title="detalhe.titulo" :subtitle="evolucaoSubtitulo" class="lg:col-span-2">
        <div class="mb-1 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-ms-text-primary">{{ detalhe.valor }}</span>
          <span
            class="text-sm font-medium"
            :class="detalhe.deltaTone === 'down' ? 'text-ms-danger' : 'text-ms-success'"
            >{{ detalhe.delta }}</span
          >
          <span class="text-xs text-ms-text-secondary">{{ detalhe.deltaSub }}</span>
        </div>
        <div class="h-64 w-full">
          <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
        </div>
      </ChartCard>

      <div class="space-y-4">
        <ChartCard title="Comparações">
          <div class="space-y-2">
            <div
              v-for="c in detalhe.comparacoes"
              :key="c.label"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-ms-text-regular">{{ c.label }}</span>
              <span
                class="font-semibold"
                :class="c.tone === 'down' ? 'text-ms-danger' : 'text-ms-success'"
                >{{ c.value }}</span
              >
            </div>
          </div>
        </ChartCard>
        <ChartCard title="Piores segmentos">
          <div class="space-y-2">
            <div
              v-for="s in detalhe.pioresSegmentos"
              :key="s.label"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-ms-text-regular">{{ s.label }}</span>
              <span class="font-semibold text-ms-danger">{{ s.value }}</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>

    <!-- Segmentação -->
    <ChartCard
      title="Segmentação"
      subtitle="Volume × TME por canal, fila, equipe e supervisor — identifique gargalos em 1 view"
      class="mb-5"
    >
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="segmentacaoOption" autoresize />
      </div>
      <!-- Legenda -->
      <div
        class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-2xs text-ms-text-secondary"
      >
        <div class="flex items-center gap-2">
          <span class="font-medium">COR = Fila:</span>
          <span v-for="l in segmentacaoLegenda.cor" :key="l.fila" class="flex items-center gap-1">
            <span class="h-2 w-2 rounded-full" :class="filaDot[l.fila]" />{{ l.label }}
          </span>
        </div>
        <span>TAMANHO = Equipe (volume): menor → maior</span>
        <span>RÓTULO = Equipe</span>
      </div>
    </ChartCard>

    <!-- Segmentos críticos -->
    <ChartCard
      title="Segmentos críticos · Canal × Fila × Turno"
      subtitle="5 piores combinações ordenadas por desvio vs meta · ferramenta de drill-down"
      class="mb-5"
    >
      <DataList
        :columns="segmentoColumns"
        :rows="segmentosCriticos"
        row-key="segmento"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="segmentos"
      >
        <template #cell-abandonados="{ row }">
          <span class="text-ms-danger">{{ row.abandonados }}</span>
        </template>
        <template #cell-tendencia="{ row }">
          <span class="text-xs font-medium" :class="tendTone(row.tendencia)">{{
            row.tendencia
          }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="text-xs font-semibold" :class="statusLinha[row.status]">{{
            row.status
          }}</span>
        </template>
        <template #cell-acao="{ row }">
          <el-button
            v-if="row.acao !== '—'"
            text
            type="primary"
            size="small"
            @click="comingSoon(row.acao)"
            >{{ row.acao }}</el-button
          >
          <span v-else class="text-ms-text-placeholder">—</span>
        </template>
      </DataList>
    </ChartCard>

    <!-- Recomendações IA -->
    <ChartCard title="Recomendações IA" subtitle="Ações priorizadas para recuperar SLA consolidado">
      <div class="mb-3 rounded-lg border border-ms-primary/20 bg-ms-primary/5 p-3">
        <div class="mb-1 flex items-center gap-2">
          <span
            class="rounded bg-ms-primary px-1.5 py-0.5 text-2xs font-bold uppercase text-white"
            >IA</span
          >
          <span class="text-sm font-bold text-ms-text-primary">Diagnóstico Consolidado</span>
          <span class="text-2xs text-ms-text-secondary"
            >confiança 84% · 612 padrões similares</span
          >
        </div>
        <p class="text-xs leading-relaxed text-ms-text-regular">{{ diagnostico }}</p>
      </div>

      <div class="grid gap-3 lg:grid-cols-3">
        <div
          v-for="r in recomendacoes"
          :key="r.titulo"
          class="flex flex-col rounded-lg border p-3"
          :class="r.destaque ? 'border-ms-primary/40 bg-ms-primary/5' : 'border-ms-border-light'"
        >
          <div class="text-sm font-semibold text-ms-text-primary">{{ r.titulo }}</div>
          <p class="mt-1 flex-1 text-xs text-ms-text-secondary">{{ r.descricao }}</p>
          <div class="mt-2 text-2xs font-medium text-ms-text-regular">
            Impacto: {{ r.impacto }}
          </div>
          <el-button
            :type="r.destaque ? 'primary' : 'default'"
            size="small"
            class="mt-2 self-start"
            @click="comingSoon(r.acao)"
          >
            {{ r.acao }}
          </el-button>
        </div>
      </div>
    </ChartCard>

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link to="/gestor/tempo-real" class="text-ms-primary no-underline hover:underline"
        >← Voltar ao Dashboard</router-link
      >
      <span class="text-ms-text-secondary">
        Explorar outro indicador:
        <button class="font-medium text-ms-danger hover:underline" @click="selecionar('abandono')">
          Abandono está em 6,4% (crítico) →
        </button>
      </span>
    </div>
  </DashboardLayout>
</template>
