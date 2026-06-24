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
import { useActionFeedback } from '@/composables/useActionFeedback'
import {
  periodos,
  contexto,
  indicadoresBot,
  evolucao,
  evolucaoMetricas,
  fluxosBot,
  correlacaoBot,
  comoInterpretarBot,
  botVsHumano,
  jornadaFluxos,
  diagnosticoBot,
  recomendacoesBot,
  proximoGargalo,
  type FluxoStatus,
  type CorrelStatus,
} from '@/data/gestorAutomacaoBot'

// Tela de detalhe "Central de Automação" (Atendimentos → Atendimento
// automatizado → detalhes) — Figma 7654:104067. Estrutura padrão das telas de
// detalhe do gestor.
const C = useChartColors()
const { comingSoon } = useActionFeedback()

const periodoAtivo = ref<string>('Hoje')
const metrica = ref<(typeof evolucaoMetricas)[number]>('Transbordo')

// ── Evolução ──────────────────────────────────────────────────────────────────
// Transbordo e Abandono são "quanto menor, melhor": eixo direito 0–50% e uma
// linha de LIMITE (alvo máximo) por indicador.
const evolucaoOption = computed(() => {
  const volume = evolucao.volume
  const linha = evolucao.series[metrica.value] ?? evolucao.series.Transbordo
  const limite = evolucao.limites[metrica.value] ?? 30
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 48, top: 20, bottom: 36 },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: ['Volume', `${metrica.value} atual`, `Limite ${limite}%`],
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
        min: 0,
        max: 100,
        axisLabel: { color: C.axis, fontSize: 10 },
        splitLine: { lineStyle: { color: C.split } },
      },
      {
        type: 'value',
        min: 0,
        max: 50,
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
        lineStyle: { color: C.warning, width: 2.5 },
        itemStyle: { color: C.warning },
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
      {
        name: `Limite ${limite}%`,
        type: 'line',
        yAxisIndex: 1,
        symbol: 'none',
        data: evolucao.horas.map(() => limite),
        lineStyle: { color: C.danger, type: 'dashed', width: 1.5 },
        itemStyle: { color: C.danger },
      },
    ],
  }
})

// ── Tabela de fluxos do BOT ───────────────────────────────────────────────────
const tmeSeg = (s: string) => {
  if (s === '—') return Number.POSITIVE_INFINITY
  const [m, sec] = s.split(':').map(Number)
  return (m || 0) * 60 + (sec || 0)
}
const statusOrder: Record<FluxoStatus, number> = { OK: 0, 'ATENÇÃO': 1, 'BAIXA RET.': 2, ALERTA: 3 }
const fluxoColumns: DataListColumn[] = [
  { key: 'fluxo', label: 'Fluxo', minWidth: 180, sortable: true },
  { key: 'atend', label: 'N de atend.', align: 'right', width: 110, sortable: true },
  { key: 'retencao', label: 'Retenção', align: 'right', width: 100, sortBy: (r) => r.retencao as number },
  { key: 'transferencia', label: 'Transferência', align: 'right', width: 120, sortBy: (r) => r.transferencia as number },
  { key: 'abandono', label: 'Abandono', align: 'right', width: 100, sortBy: (r) => r.abandono as number },
  { key: 'tma', label: 'TMA', align: 'right', width: 90, sortBy: (r) => tmeSeg(r.tma as string) },
  { key: 'nps', label: 'NPS', align: 'right', width: 80, sortBy: (r) => r.nps as number },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as FluxoStatus] },
  { key: 'acao', label: 'Ação', width: 120 },
]

const statusTone: Record<FluxoStatus, { text: string; dot: string }> = {
  ALERTA: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  'ATENÇÃO': { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  'BAIXA RET.': { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
const retencaoTone = (v: number) => (v < 50 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const abandonoTone = (v: number) => (v >= 10 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')

// ── Correlação operacional (tabela diagnóstica por fluxo) ────────────────────
const correlStatusOrder: Record<CorrelStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const correlColumns: DataListColumn[] = [
  { key: 'fluxo', label: 'Fluxo', minWidth: 180, sortable: true },
  { key: 'volume', label: 'Volume', align: 'right', width: 100, sortable: true },
  { key: 'retencao', label: 'Retenção', align: 'right', width: 100, sortBy: (r) => r.retencao as number },
  { key: 'abandono', label: 'Abandono', align: 'right', width: 100, sortBy: (r) => r.abandono as number },
  { key: 'transbordo', label: 'Transbordo', align: 'right', width: 110, sortBy: (r) => r.transbordo as number },
  { key: 'gargalo', label: 'Gargalo', minWidth: 240 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => correlStatusOrder[r.status as CorrelStatus] },
]
const correlStatusTone: Record<CorrelStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}

// ── Jornada do BOT (funil por fluxo) ─────────────────────────────────────────
const jornadaAtiva = ref(jornadaFluxos[0].key)
const jornada = computed(() => jornadaFluxos.find((j) => j.key === jornadaAtiva.value) ?? jornadaFluxos[0])
const jornadaEl = ref<HTMLElement | null>(null)

const etapaTone: Record<'primary' | 'warning' | 'danger' | 'success', { card: string; valor: string }> = {
  primary: { card: 'border-ms-primary/30 bg-ms-primary/5', valor: 'text-ms-primary' },
  warning: { card: 'border-ms-warning/30 bg-ms-warning/5', valor: 'text-ms-warning' },
  danger: { card: 'border-ms-danger/30 bg-ms-danger/5', valor: 'text-ms-danger' },
  success: { card: 'border-ms-success/30 bg-ms-success/5', valor: 'text-ms-success' },
}

// "Ver jornada" → abre o funil do fluxo correspondente (quando existir) e rola
// até a seção; senão, feedback.
const fluxoParaJornada: Record<string, string> = {
  'Envio de Documentos': 'envio-docs',
  'Autorização Prévia': 'autorizacao',
  '2ª via de Boleto': '2via',
  'Consulta de Carência': 'carencia',
}
function verJornada(fluxo: string) {
  const key = fluxoParaJornada[fluxo]
  if (key) {
    jornadaAtiva.value = key
    jornadaEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    comingSoon(`Jornada · ${fluxo}`)
  }
}

const vsTone: Record<'success' | 'warning' | 'neutral', string> = {
  success: 'text-ms-success',
  warning: 'text-ms-warning',
  neutral: 'text-ms-text-secondary',
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
      <el-breadcrumb-item>Atendimento Automatizado</el-breadcrumb-item>
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
            <span class="text-ms-text-secondary">· {{ contexto.resumoAlerta }}</span>
          </div>
          <h1 class="mt-2 flex items-center gap-2 text-2xl font-bold text-ms-text-primary">
            <span class="text-ms-text-secondary">⚙</span>{{ contexto.titulo }}
          </h1>
          <p class="mt-1 text-sm text-ms-text-secondary">{{ contexto.subtitulo }}</p>
        </div>
      </div>
    </el-card>

    <!-- 1) Indicadores do BOT -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Indicadores do BOT · {{ periodoAtivo }}
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Transbordo, abandono e satisfação · vs período anterior
    </p>
    <div class="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard
        v-for="k in indicadoresBot"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
      />
    </div>

    <!-- 2) Todos os fluxos do BOT -->
    <ChartCard
      title="Todos os fluxos BOT · ordenados por abandono"
      subtitle="Clique em “Ver jornada” para abrir a jornada detalhada do fluxo"
      class="mb-5"
    >
      <DataList
        :columns="fluxoColumns"
        :rows="fluxosBot"
        row-key="fluxo"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="fluxos"
      >
        <template #cell-retencao="{ row }">
          <span class="font-medium" :class="retencaoTone(row.retencao)">{{ row.retencao }}%</span>
        </template>
        <template #cell-transferencia="{ row }">{{ row.transferencia }}%</template>
        <template #cell-abandono="{ row }">
          <span class="font-medium" :class="abandonoTone(row.abandono)">{{ row.abandono }}%</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusTone[row.status].text">
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status].dot" />{{ row.status }}
          </span>
        </template>
        <template #cell-acao="{ row }">
          <el-button text type="primary" size="small" @click="verJornada(row.fluxo)"
            >Ver jornada →</el-button
          >
        </template>
      </DataList>
    </ChartCard>

    <!-- 3) Evolução -->
    <ChartCard
      title="Evolução dos indicadores do BOT"
      subtitle="Comparativo período anterior · Meta"
      class="mb-5"
    >
      <div class="mb-2">
        <IndicadorSelector v-model="metrica" label="Indicador:" :options="evolucaoMetricas" />
      </div>
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
      </div>
    </ChartCard>

    <!-- 4) Correlação operacional -->
    <ChartCard
      title="Correlação operacional"
      subtitle="Volume × Retenção × Abandono × Transbordo · Por fluxo · Identificação de gargalos"
      class="mb-3"
    >
      <DataList
        :columns="correlColumns"
        :rows="correlacaoBot"
        row-key="fluxo"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="fluxos"
      >
        <template #cell-retencao="{ row }">
          <span class="font-medium" :class="retencaoTone(row.retencao)">{{ row.retencao }}%</span>
        </template>
        <template #cell-abandono="{ row }">
          <span class="font-medium" :class="abandonoTone(row.abandono)">{{ row.abandono }}%</span>
        </template>
        <template #cell-transbordo="{ row }">{{ row.transbordo }}%</template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="correlStatusTone[row.status].text">
            <span class="h-2 w-2 rounded-full" :class="correlStatusTone[row.status].dot" />{{ row.status }}
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
        <p class="mt-0.5 leading-relaxed">{{ comoInterpretarBot }}</p>
      </div>
    </div>

    <!-- BOT vs Humano + Jornada do BOT — ocultos por enquanto (5 seções) -->
    <template v-if="false">
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      BOT vs Atendimento Humano
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Comparativo de eficiência entre automação e atendentes · Hoje
    </p>
    <div class="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card
        v-for="c in botVsHumano"
        :key="c.metrica"
        shadow="never"
        body-class="!p-4"
        class="!border-ms-border-light"
      >
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          {{ c.metrica }}
        </div>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-xl font-bold text-ms-primary">{{ c.bot }}</span>
          <span class="text-2xs text-ms-text-secondary">BOT</span>
        </div>
        <div class="mt-0.5 flex items-baseline gap-2">
          <span class="text-sm font-semibold text-ms-text-regular">{{ c.humano }}</span>
          <span class="text-2xs text-ms-text-secondary">Humano</span>
        </div>
        <div class="mt-1 text-2xs font-medium" :class="vsTone[c.tone]">{{ c.delta }}</div>
      </el-card>
    </div>

    <!-- 5) Jornada do BOT -->
    <div ref="jornadaEl" class="mb-5">
    <ChartCard
      title="Jornada do BOT · fluxos"
      subtitle="Volume, tempo e abandono em cada etapa · escolha o fluxo para detalhar"
    >
      <!-- Abas de fluxo -->
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="j in jornadaFluxos"
          :key="j.key"
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs transition"
          :class="
            jornadaAtiva === j.key
              ? '!border-ms-primary bg-ms-primary/5 font-semibold ring-1 ring-ms-primary'
              : 'border-ms-border-light hover:border-ms-primary/40 hover:bg-ms-fill-light'
          "
          @click="jornadaAtiva = j.key"
        >
          {{ j.label }}
        </button>
      </div>

      <!-- Funil de etapas -->
      <div class="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        <template v-for="(e, i) in jornada.etapas" :key="e.nome">
          <div class="flex-1 rounded-lg border p-3" :class="etapaTone[e.tone].card">
            <div class="flex items-baseline justify-between">
              <span class="text-sm font-semibold text-ms-text-primary">{{ e.nome }}</span>
              <span class="text-2xl font-bold" :class="etapaTone[e.tone].valor">{{ e.valor }}</span>
            </div>
            <div class="text-2xs text-ms-text-secondary">{{ e.pctTotal }}</div>
            <div class="mt-2 flex gap-3 text-2xs">
              <span class="text-ms-success">CONV. {{ e.conv }}%</span>
              <span class="text-ms-danger">ABAND. {{ e.aband }}%</span>
              <span class="text-ms-text-secondary">{{ e.tempo }}</span>
            </div>
          </div>
          <div
            v-if="i < jornada.etapas.length - 1"
            class="flex items-center justify-center text-ms-text-placeholder"
          >
            →
          </div>
        </template>
      </div>

      <!-- Maior gargalo -->
      <div
        class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ms-warning/30 bg-ms-warning/5 px-3 py-2.5"
      >
        <div class="flex items-start gap-2 text-sm text-ms-text-regular">
          <span class="text-ms-warning">⚠</span>
          <span>
            <b class="text-ms-text-primary">{{ jornada.gargalo.titulo }}</b>
            <span class="block text-xs text-ms-text-secondary">{{ jornada.gargalo.corpo }}</span>
          </span>
        </div>
        <el-button size="small" type="primary" @click="comingSoon('Investigar gargalo')"
          >Investigar →</el-button
        >
      </div>
    </ChartCard>
    </div>
    </template>

    <!-- 5) Insights da IA -->
    <RecomendacoesIA
      subtitle="Otimizações para reduzir abandono e aumentar retenção"
      diagnostico-titulo="Diagnóstico do BOT"
      :confianca="diagnosticoBot.confianca"
      :texto="diagnosticoBot.texto"
      :recomendacoes="recomendacoesBot"
    />

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/tempo-real', query: { tab: 'atendimentos' } }"
        class="text-ms-primary no-underline hover:underline"
        >← Voltar ao Dashboard</router-link
      >
      <span class="text-ms-text-secondary">
        Próximo gargalo:
        <span class="font-medium text-ms-warning">{{ proximoGargalo }} →</span>
      </span>
    </div>
  </DashboardLayout>
</template>
