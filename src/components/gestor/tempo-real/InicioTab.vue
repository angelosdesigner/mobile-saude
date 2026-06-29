<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import MetricCard from '@/components/gestor/MetricCard.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import BarList from '@/components/gestor/BarList.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import KpiRingCard from '@/components/indicadores/KpiRingCard.vue'
import ChartLegend from '@/components/ui/ChartLegend.vue'
import {
  kpiGauges,
  chamadasNaFila,
  metricTiles,
  andamento,
  ocupacaoFila,
  ocupacaoAtendente,
  canalDistribuicao,
  canalResumo,
  abandonoFluxo,
  demandaCapacidade,
  type CardTarget,
} from '@/data/gestorTempoReal'
import { useChartColors } from '@/plugins/echarts'
import { canalCor, atendimentoCor, normalizeFila } from '@/data/gestorTaxonomia'
import type { GestorStage } from '@/types/gestorOcorrencias'

const router = useRouter()
const C = useChartColors()

// Drill-down unificado: todo card operacional leva à listagem de ocorrências
// (OcorrenciasView), com o estágio pré-filtrado quando aplicável. Antes alguns
// cards iam para a aba Atendimentos (que não tem lista) — destino inconsistente.
const STAGE_DE_FILTRO: Record<string, GestorStage | undefined> = {
  todos: undefined,
  automatizado: 'automatizado',
  fila: 'fila',
  humano: 'humano',
}
function abrirLista(filtro: string) {
  const stage = STAGE_DE_FILTRO[filtro]
  router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', ...(stage ? { stage } : {}) } })
}

// Alvo do card: indicador (Centro de Indicadores) ou listagem de atendimentos.
function goTarget(t: CardTarget) {
  if (t.type === 'indicador') router.push({ path: '/gestor/indicadores', query: { ind: t.ind } })
  else abrirLista(t.filtro)
}

// Clique numa fatia do donut de canal → listagem filtrada por aquele canal.
function abrirCanal(params: { name?: string }) {
  if (params?.name)
    router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', canal: params.name } })
}

// "Chamadas abandonadas" → aba Abandonos (visão por etapa da jornada), de
// onde se drilla por assunto/etapa até os protocolos. Padrão: indicador → etapa → registro.
function abrirAbandonos() {
  router.push({ path: '/gestor/tempo-real', query: { tab: 'abandonos' } })
}

// Drill-down das ocupações: fila (normalizada) e atendente.
function abrirFilaLista(label: string) {
  router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', fila: normalizeFila(label) } })
}
function abrirAtendente(nome: string) {
  router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', atendente: nome } })
}

// Cards de andamento neutralizados (redesign minimalista): sem fundo/borda
// colorida; o rótulo mantém um leve realce semântico apenas no texto.
const andamentoTone: Record<'primary' | 'warning' | 'teal' | 'success', string> = {
  primary: 'border-ms-border-light bg-ms-surface text-ms-primary',
  warning: 'border-ms-border-light bg-ms-surface text-ms-warning',
  teal: 'border-ms-border-light bg-ms-surface text-ms-teal',
  success: 'border-ms-border-light bg-ms-surface text-ms-success',
}

// "Ativos agora" consolidado: total + barra de proporção das etapas ativas
// (automatizado/fila/humano). Cor de preenchimento por etapa (dot + segmento).
const ativosTotal = computed(() => andamento.reduce((s, a) => s + a.value, 0))
const ativosSegBar: Record<'primary' | 'warning' | 'teal' | 'success', string> = {
  primary: 'bg-ms-primary',
  warning: 'bg-ms-warning',
  teal: 'bg-ms-teal',
  success: 'bg-ms-success',
}

// Número formatado em pt-BR (vírgula decimal) para o card "Chamadas abandonadas".
const ptNum = (n: number) => String(n).replace('.', ',')

// Legendas (bolinha + nome) reutilizando ChartLegend; cores = taxonomia única.
const canalLegend = computed(() =>
  canalDistribuicao.map((c) => ({
    label: c.name,
    color: canalCor(c.name, C),
    value: `${c.pct} (${c.value})`,
  })),
)
const abandonoLegend = computed(() => [
  { label: 'Automatizado', color: atendimentoCor(C).bot },
  { label: 'Humano', color: atendimentoCor(C).humano },
])
const demandaLegend = computed(() => [
  { label: 'Saudável', color: C.success },
  { label: 'Tensionado', color: C.warning },
  { label: 'Acima da capacidade', color: C.danger },
])

const canalOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [
    {
      type: 'pie',
      radius: ['62%', '88%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: canalDistribuicao.map((c) => ({
        value: c.value,
        name: c.name,
        itemStyle: { color: canalCor(c.name, C) },
      })),
    },
  ],
}))

const abandonoOption = computed(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}%` },
  // Legenda Automatizado/Em espera renderizada em HTML (ChartLegend) no rodapé —
  // evita a sobreposição com os rótulos do eixo X.
  grid: { left: 32, right: 8, top: 12, bottom: 34 },
  xAxis: {
    type: 'category',
    data: abandonoFluxo.fluxos,
    axisLabel: {
      color: C.axis,
      fontSize: 9,
      interval: 0,
      width: 64,
      overflow: 'break',
      lineHeight: 11,
    },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: C.axis, formatter: '{value}%' },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      name: 'Automatizado',
      type: 'bar',
      data: abandonoFluxo.automatizado,
      itemStyle: { color: atendimentoCor(C).bot, borderRadius: [3, 3, 0, 0] },
    },
    {
      name: 'Humano',
      type: 'bar',
      data: abandonoFluxo.emEspera,
      itemStyle: { color: atendimentoCor(C).humano, borderRadius: [3, 3, 0, 0] },
    },
  ],
}))

const demandaOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 30, right: 8, top: 20, bottom: 24 },
  xAxis: {
    type: 'category',
    data: demandaCapacidade.horas,
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
      type: 'bar',
      data: demandaCapacidade.demanda.map((v) => ({
        value: v,
        itemStyle: {
          color: v > demandaCapacidade.capacidade ? C.danger : v >= 18 ? C.warning : C.success,
          borderRadius: [3, 3, 0, 0],
        },
      })),
    },
    {
      type: 'line',
      data: demandaCapacidade.horas.map(() => demandaCapacidade.capacidade),
      symbol: 'none',
      lineStyle: { type: 'dashed', color: C.primary },
      // Rótulo "Capacidade XX/h" ancorado acima da linha, junto à extremidade
      // direita (fiel ao Figma dem-card 7740:1937).
      endLabel: {
        show: true,
        formatter: `Capacidade ${demandaCapacidade.capacidade}/h`,
        color: C.primary,
        fontSize: 10,
        align: 'right',
        verticalAlign: 'bottom',
        offset: [0, -6],
      },
    },
  ],
}))

</script>

<template>
  <div class="space-y-5">
    <!-- Resumo executivo -->
    <SectionHeader
      title="Resumo Executivo da Operação"
      subtitle="Visão consolidada dos indicadores mais importantes da central de atendimento."
      action-to="/gestor/indicadores"
    />

    <!-- KPIs — todos no mesmo padrão (anel + número + infos), via KpiRingCard. -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiRingCard
        v-for="k in kpiGauges"
        :key="k.label"
        :value="k.value"
        :display="k.display"
        :label="k.label"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
        :meta="k.meta"
        :tone="k.tone"
        clickable
        @click="goTarget(k.target)"
      />
      <!-- Chamadas abandonadas — taxa de abandono, mesmo padrão dos demais. -->
      <KpiRingCard
        :value="chamadasNaFila.abandono"
        :display="`${ptNum(chamadasNaFila.abandono)}%`"
        label="Chamadas abandonadas"
        :delta="`${chamadasNaFila.delta}${chamadasNaFila.critico ? ' (crítico)' : ''}`"
        delta-tone="danger"
        tone="danger"
        :legend="[
          { label: `Abandonadas ${ptNum(chamadasNaFila.abandono)}%`, tone: 'danger' },
          { label: `Atendidas ${ptNum(chamadasNaFila.atendidas)}%`, tone: 'success' },
        ]"
        clickable
        @click="abrirAbandonos"
      />
    </div>

    <!-- Métricas -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        v-for="m in metricTiles"
        :key="m.label"
        :label="m.label"
        :value="m.value"
        :delta="m.delta"
        :delta-tone="m.deltaTone"
        :trend="m.trend"
        class="cursor-pointer transition hover:shadow-md"
        @click="goTarget(m.target)"
      />
    </div>

    <!-- Andamento + ocupações -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="Ativos agora"
        subtitle="Tudo em atendimento agora · automatizado, fila e humano"
      >
        <!-- Total + barra de proporção das etapas ativas -->
        <div class="mb-3">
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-bold text-ms-text-primary">{{ ativosTotal }}</span>
            <span class="text-2xs uppercase tracking-wide text-ms-text-secondary">ativos agora</span>
          </div>
          <div class="mt-2 flex h-2 overflow-hidden rounded-full bg-ms-fill-light">
            <div
              v-for="a in andamento"
              :key="a.label"
              :class="ativosSegBar[a.tone]"
              :style="{ width: `${(a.value / ativosTotal) * 100}%` }"
              :title="`${a.label}: ${a.value}`"
            />
          </div>
        </div>
        <!-- Etapas ativas (clicáveis → lista filtrada) -->
        <div class="space-y-2">
          <div
            v-for="a in andamento"
            :key="a.label"
            role="button"
            :tabindex="0"
            :aria-label="`${a.label}: ${a.value} — abrir lista`"
            class="flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 transition hover:brightness-95"
            :class="andamentoTone[a.tone]"
            @click="abrirLista(a.filtro)"
            @keydown.enter.prevent="abrirLista(a.filtro)"
            @keydown.space.prevent="abrirLista(a.filtro)"
          >
            <span class="flex items-center gap-2 text-xs font-semibold uppercase">
              <span class="h-2 w-2 shrink-0 rounded-full" :class="ativosSegBar[a.tone]" />{{ a.label }}
            </span>
            <span class="text-xl font-bold text-ms-text-primary">{{ a.value }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Ocupação por fila" subtitle="% de uso da capacidade e TMEF · clique para detalhar">
        <BarList :items="ocupacaoFila" threshold-legend clickable @item-click="abrirFilaLista" />
      </ChartCard>

      <ChartCard title="Ocupação por atendente" subtitle="% de uso da capacidade · clique para detalhar">
        <BarList :items="ocupacaoAtendente" rank rank-hint clickable @item-click="abrirAtendente" />
      </ChartCard>
    </div>

    <!-- Gráficos -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="Distribuição de atendimentos por canal"
        subtitle="Total: 118 atendimentos ativos · clique numa fatia para detalhar"
      >
        <div class="relative h-44 w-full">
          <VChart
            class="h-full w-full cursor-pointer"
            :option="canalOption"
            autoresize
            @click="abrirCanal"
          />
          <div
            class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span class="text-2xl font-bold text-ms-text-primary">118</span>
            <span class="text-2xs text-ms-text-secondary">ativos</span>
          </div>
        </div>
        <ChartLegend layout="list" :items="canalLegend" class="mt-3" />
        <div class="mt-2 space-y-1 border-t border-ms-border-lighter pt-2 text-xs">
          <div class="flex justify-between">
            <span class="text-ms-text-regular">Reabertura</span>
            <span class="font-medium text-ms-danger">{{ canalResumo.reabertura }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ms-text-regular">SLA Conformidade</span>
            <span class="font-medium text-ms-text-primary">{{ canalResumo.slaConformidade }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Abandono por assunto — Automatizado × Humano"
        subtitle="% de abandono em cada tipo de assunto · clique para ver o detalhe"
        :to="{ path: '/gestor/tempo-real', query: { tab: 'abandonos' } }"
      >
        <div class="w-full flex-1" style="min-height: 200px">
          <VChart class="h-full w-full" :option="abandonoOption" autoresize />
        </div>
        <ChartLegend :items="abandonoLegend" class="mt-3" />
      </ChartCard>

      <ChartCard
        title="Demanda × Capacidade"
        subtitle="Distribuição ao longo do dia · pico 14h-16h"
        to="/gestor/performance-detalhe"
      >
        <div class="w-full flex-1" style="min-height: 200px">
          <VChart class="h-full w-full" :option="demandaOption" autoresize />
        </div>
        <ChartLegend :items="demandaLegend" class="mt-3" />
      </ChartCard>
    </div>
  </div>
</template>
