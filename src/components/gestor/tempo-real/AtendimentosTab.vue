<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import IndicadoresGerais from '@/components/gestor/IndicadoresGerais.vue'
import {
  canalDistribuicao,
  ocupacaoCanal,
  tmeCanal,
  automatizado,
  bannerAutomatizado,
  indicadoresGerais,
  fluxosMaisAcessados,
  setoresBotEficiente,
  fluxosMaiorAbandono,
  fluxosMaiorAbandonoResumo,
  insightsAutomatizado,
} from '@/data/gestorAtendimentos'
import { useChartColors } from '@/plugins/echarts'
import { canalCor, normalizeCanal } from '@/data/gestorTaxonomia'

const C = useChartColors()
const router = useRouter()

// Drill-down (indicador → registro): clique numa fatia/barra de canal → lista de
// Ocorrências filtrada por aquele canal (Protocolo → jornada).
function abrirCanal(params: { name?: string }) {
  if (params?.name)
    router.push({
      path: '/gestor/ocorrencias',
      query: { view: 'lista', canal: normalizeCanal(params.name) },
    })
}
function abrirAutomacao() {
  router.push('/gestor/automacao-bot')
}

const canalOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [
    {
      type: 'pie',
      radius: ['62%', '88%'],
      label: { show: false },
      data: canalDistribuicao.map((c) => ({
        value: c.value,
        name: c.name,
        itemStyle: { color: canalCor(c.name, C) },
      })),
    },
  ],
}))

const ocupacaoOption = computed(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}%` },
  grid: { left: 32, right: 8, top: 12, bottom: 24 },
  xAxis: {
    type: 'category',
    data: ocupacaoCanal.map((o) => o.label),
    axisLabel: { color: C.axis, fontSize: 10, interval: 0 },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLabel: { color: C.axis, formatter: '{value}%' },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      type: 'bar',
      data: ocupacaoCanal.map((o) => ({
        value: o.value,
        itemStyle: {
          color: o.value >= 90 ? C.danger : o.value >= 70 ? C.warning : C.success,
          borderRadius: [4, 4, 0, 0],
        },
      })),
      barWidth: '46%',
    },
  ],
}))

// Cor (arco/texto) por severidade do TME — padrão do card Capacidade Operacional.
const toneColor: Record<'danger' | 'warning' | 'success', string> = {
  danger: C.danger,
  warning: C.warning,
  success: C.success,
}
const toneText: Record<'danger' | 'warning' | 'success', string> = {
  danger: 'text-ms-danger',
  warning: 'text-ms-warning',
  success: 'text-ms-success',
}
// Barras decorativas neutralizadas (redesign minimalista): o fill não carrega
// mais a severidade — ela já aparece no número/rótulo ao lado.
const toneBar = 'bg-ms-text-placeholder'

// Gauge semicircular (180→0), igual ao "Capacidade Operacional": número central
// + unidade pequena; arco colorido pela severidade do TME.
const tmeOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: tmeCanal.max,
      center: ['50%', '72%'],
      radius: '108%',
      progress: { show: true, width: 12, itemStyle: { color: toneColor[tmeCanal.statusTone] } },
      axisLine: { lineStyle: { width: 12, color: [[1, 'rgba(144,147,153,0.18)']] } },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: {
        offsetCenter: [0, '-8%'],
        formatter: `{v|${tmeCanal.value}}{t| min}`,
        rich: {
          v: { fontSize: 28, fontWeight: 'bold', color: C.ink },
          t: { fontSize: 14, color: C.axis },
        },
      },
      data: [{ value: tmeCanal.value }],
    },
  ],
}))

// Fluxos mais acessados — barras verticais (BOT = primary/azul).
const fluxosOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 30, right: 8, top: 24, bottom: 40 },
  xAxis: {
    type: 'category',
    data: fluxosMaisAcessados.itens.map((i) => i.label),
    axisLabel: { color: C.axis, fontSize: 10, interval: 0, width: 70, overflow: 'break' },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: { type: 'value', axisLabel: { color: C.axis }, splitLine: { lineStyle: { color: C.split } } },
  series: [
    {
      type: 'bar',
      data: fluxosMaisAcessados.itens.map((i) => i.value),
      barWidth: '46%',
      itemStyle: { color: C.primary, borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', color: C.ink, fontSize: 11, fontWeight: 700 },
    },
  ],
}))

// Fluxos com maior abandono — barras verticais coloridas por severidade.
const abandonoBotOption = computed(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}%` },
  grid: { left: 30, right: 8, top: 24, bottom: 48 },
  xAxis: {
    type: 'category',
    data: fluxosMaiorAbandono.map((i) => i.label),
    axisLabel: { color: C.axis, fontSize: 10, interval: 0, width: 64, overflow: 'break' },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: C.axis, formatter: '{value}%' },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      type: 'bar',
      barWidth: '46%',
      data: fluxosMaiorAbandono.map((i) => ({
        value: i.value,
        itemStyle: {
          color: i.tone === 'danger' ? C.danger : i.tone === 'warning' ? C.warning : C.success,
          borderRadius: [4, 4, 0, 0],
        },
      })),
      label: { show: true, position: 'top', formatter: '{c}%', color: C.ink, fontSize: 11, fontWeight: 700 },
    },
  ],
}))

// Eficiência do BOT (resolutividade — BAIXO é ruim): só o extremo abaixo da meta
// recebe realce; o resto fica neutro. A barra é decorativa → fill neutro.
const eficienteBar = () => 'bg-ms-text-placeholder'
const eficienteText = (v: number) =>
  v < setoresBotEficiente.meta ? 'text-ms-danger font-medium' : 'text-ms-text-regular'

// Cards de automação (redesign minimalista): barra decorativa neutra e número
// grande sempre neutro — a leitura de valor não precisa de cor de fundo.
const autoBar = 'bg-ms-text-placeholder'
const autoValue = 'text-ms-text-primary'
</script>

<template>
  <div class="space-y-5">
    <!-- Indicadores gerais -->
    <IndicadoresGerais :items="indicadoresGerais" />

    <!-- Atendimento em tempo real por canal -->
    <SectionHeader
      title="Atendimento em tempo real por canal"
      action-to="/gestor/operacao-canal"
    />

    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="Distribuição de Atendimentos por Canal"
        subtitle="Total: 118 atendimentos ativos · clique numa fatia para detalhar"
      >
        <div class="relative h-40 w-full">
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
        <div class="mt-2 space-y-1 text-xs">
          <div v-for="c in canalDistribuicao" :key="c.name" class="flex justify-between">
            <span class="text-ms-text-regular">{{ c.name }}</span>
            <span class="font-medium text-ms-text-primary">{{ c.pct }} · {{ c.value }}</span>
          </div>
          <div class="mt-1 flex justify-between border-t border-ms-border-lighter pt-1">
            <span class="text-ms-text-secondary">Reabertura</span>
            <span class="font-medium text-ms-danger">8% · 12 casos</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">SLA Conformidade</span>
            <span class="font-medium text-ms-text-primary">96%</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Ocupação por Canal vs Capacidade"
        subtitle="% de uso da capacidade operacional · clique numa barra para detalhar"
      >
        <div class="h-44 w-full">
          <VChart
            class="h-full w-full cursor-pointer"
            :option="ocupacaoOption"
            autoresize
            @click="abrirCanal"
          />
        </div>
        <div class="mt-auto flex flex-wrap items-center justify-center gap-3 pt-3 text-2xs text-ms-text-secondary">
          <span class="flex items-center gap-1"
            ><span class="h-2 w-2 rounded-full bg-ms-success" />&lt; 70% saudável</span
          >
          <span class="flex items-center gap-1"
            ><span class="h-2 w-2 rounded-full bg-ms-warning" />70–89% atenção</span
          >
          <span class="flex items-center gap-1"
            ><span class="h-2 w-2 rounded-full bg-ms-danger" />&gt; 90% crítico</span
          >
        </div>
      </ChartCard>

      <ChartCard
        title="TME por Canal"
        subtitle="tempo médio de espera"
        :to="{ path: '/gestor/indicadores', query: { ind: 'tme' } }"
      >
        <div class="h-32 w-full">
          <VChart class="h-full w-full" :option="tmeOption" autoresize />
        </div>
        <div class="text-center">
          <div class="text-sm font-semibold" :class="toneText[tmeCanal.statusTone]">
            {{ tmeCanal.status }}
          </div>
          <div class="text-xs text-ms-text-secondary">{{ tmeCanal.sub }}</div>
        </div>
        <!-- Detalhamento por canal -->
        <div class="mt-auto space-y-2 border-t border-ms-border-lighter pt-3">
          <div v-for="b in tmeCanal.bars" :key="b.label" class="flex items-center gap-2">
            <span class="w-24 shrink-0 truncate text-xs text-ms-text-regular">{{ b.label }}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-ms-fill-light">
              <div
                class="h-full rounded-full"
                :class="toneBar"
                :style="{ width: `${(b.value / tmeCanal.max) * 100}%` }"
              />
            </div>
            <span class="w-12 shrink-0 text-right text-xs font-medium text-ms-text-primary"
              >{{ b.value }}min</span
            >
          </div>
        </div>
      </ChartCard>
    </div>

    <!-- Atendimento automatizado -->
    <SectionHeader
      title="Atendimento automatizado"
      class="pt-1"
      action-to="/gestor/automacao-bot"
    />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card
        v-for="m in automatizado"
        :key="m.label"
        shadow="never"
        body-class="!p-4"
        class="cursor-pointer !border-ms-border-light transition hover:shadow-md"
        @click="abrirAutomacao"
      >
        <div class="text-xs text-ms-text-secondary">{{ m.label }}</div>
        <div class="mt-1 text-2xl font-bold" :class="autoValue">{{ m.value }}</div>
        <div v-if="m.delta" class="text-2xs text-ms-text-secondary">{{ m.delta }}</div>
        <div v-if="m.pct !== null" class="mt-2 h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
          <div
            class="h-full rounded-full"
            :class="autoBar"
            :style="{ width: `${m.pct}%` }"
          />
        </div>
      </el-card>
    </div>

    <!-- Detalhamento dos fluxos do BOT -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="Fluxos Mais Acessados"
        subtitle="sessões ativas (média 24h)"
        to="/gestor/automacao-bot"
      >
        <div class="h-44 w-full">
          <VChart class="h-full w-full" :option="fluxosOption" autoresize />
        </div>
        <div class="mt-auto border-t border-ms-border-lighter pt-2 text-2xs text-ms-text-secondary">
          Total: {{ fluxosMaisAcessados.totalSessoes }} sessões · Atendimentos/dia (média):
          {{ fluxosMaisAcessados.atendimentosDia }}
          <div class="mt-0.5 font-medium text-ms-text-regular">{{ fluxosMaisAcessados.delta }}</div>
        </div>
      </ChartCard>

      <ChartCard
        title="Setores mais eficientes no automatizado"
        subtitle="% resolvidos sem transbordo"
        to="/gestor/automacao-bot"
      >
        <div class="space-y-2.5">
          <div v-for="s in setoresBotEficiente.itens" :key="s.label">
            <div class="flex items-center justify-between text-xs">
              <span class="truncate pr-2 text-ms-text-regular">{{ s.label }}</span>
              <span class="font-medium" :class="eficienteText(s.value)">{{ s.value }}%</span>
            </div>
            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
              <div
                class="h-full rounded-full"
                :class="eficienteBar()"
                :style="{ width: `${s.value}%` }"
              />
            </div>
          </div>
        </div>
        <div class="mt-auto border-t border-ms-border-lighter pt-2 text-2xs text-ms-text-secondary">
          Meta de eficiência ≥ {{ setoresBotEficiente.meta }}%
          <div class="mt-0.5">{{ setoresBotEficiente.resumo }}</div>
        </div>
      </ChartCard>

      <ChartCard
        title="Fluxos com Maior Taxa de Abandono"
        subtitle="% de abandono no atendimento automatizado"
        to="/gestor/automacao-bot"
      >
        <div class="h-44 w-full">
          <VChart class="h-full w-full" :option="abandonoBotOption" autoresize />
        </div>
        <div class="mt-auto border-t border-ms-border-lighter pt-2 text-2xs">
          <div class="font-medium text-ms-danger">{{ fluxosMaiorAbandonoResumo.gargalo }}</div>
          <div class="mt-0.5 text-ms-text-secondary">{{ fluxosMaiorAbandonoResumo.acao }}</div>
        </div>
      </ChartCard>
    </div>

    <!-- Insights da automação -->
    <div class="space-y-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-4 py-3">
      <p v-for="(ins, i) in insightsAutomatizado" :key="i" class="text-sm text-ms-text-regular">
        <span class="font-semibold text-ms-text-primary">Insight:</span> {{ ins }}
      </p>
    </div>

    <div
      class="flex items-center gap-2 rounded-lg border border-ms-border-light bg-ms-surface px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-warning">⚠</span>
      {{ bannerAutomatizado }}
    </div>
  </div>
</template>
