<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import IndicadoresGerais from '@/components/gestor/IndicadoresGerais.vue'
import StackedBarList from '@/components/gestor/StackedBarList.vue'
import ChartLegend from '@/components/ui/ChartLegend.vue'
import {
  porCanal,
  porFluxoBot,
  porFilaHumana,
  comparativo,
  abandonoScatter,
  bannerAbandono,
  indicadoresGerais,
} from '@/data/gestorAbandonos'
import { abandonoFluxo } from '@/data/gestorTempoReal'
import { useChartColors } from '@/plugins/echarts'
import { canalCor, normalizeCanal, normalizeFila } from '@/data/gestorTaxonomia'

const C = useChartColors()
const router = useRouter()

// ── Drill-down ────────────────────────────────────────────────────────────────
// Padrão 3 níveis: indicador/gráfico → assunto (fila) + etapa → protocolo/jornada.
// `etapa` é o stage da ocorrência: 'automatizado' | 'fila' | 'humano'.
function abrirEtapa(stage: 'automatizado' | 'fila', fila?: string) {
  const query: Record<string, string> = { view: 'lista', stage }
  if (fila) query.fila = normalizeFila(fila)
  router.push({ path: '/gestor/ocorrencias', query })
}
function abrirFila(fila: string) {
  router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', fila: normalizeFila(fila) } })
}
function abrirCanal(params: { name?: string }) {
  if (params?.name)
    router.push({
      path: '/gestor/ocorrencias',
      query: { view: 'lista', canal: normalizeCanal(params.name) },
    })
}

// Clique num item "No automatizado": extrai a fila do label ("Fila → Etapa").
function abrirBotItem(item: { label: string }) {
  const fila = item.label.split('→')[0].trim()
  abrirEtapa('automatizado', fila)
}
// Clique num item "Em espera": label é diretamente o nome da fila.
function abrirEsperaItem(item: { label: string }) {
  abrirEtapa('fila', item.label)
}
// Clique num ponto do scatter (por assunto) → Ocorrências da fila.
function abrirScatter(params: { value?: unknown }) {
  const v = params?.value as [number, number, number, string] | undefined
  if (v && v[3]) abrirFila(v[3])
}

// ── Gráficos ──────────────────────────────────────────────────────────────────
const canalOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}' },
  series: [
    {
      type: 'pie',
      radius: ['62%', '86%'],
      label: { show: false },
      data: porCanal.itens.map((i) => ({
        value: i.value,
        name: i.name,
        itemStyle: { color: canalCor(i.name, C) },
      })),
    },
  ],
}))

// Abandono por etapa — Automatizado × Humano (barras agrupadas por assunto).
// Legenda em HTML p/ não sobrepor os rótulos do eixo X.
const fluxoBotHumanoOption = computed(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}%` },
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
      itemStyle: { color: C.primary, borderRadius: [3, 3, 0, 0] },
    },
    {
      name: 'Humano',
      type: 'bar',
      data: abandonoFluxo.emEspera,
      itemStyle: { color: C.warning, borderRadius: [3, 3, 0, 0] },
    },
  ],
}))
const fluxoBotHumanoLegend = computed(() => [
  { label: 'Automatizado', color: C.primary },
  { label: 'Humano',       color: C.warning },
])

const abandonoScatterOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p: { value: [number, number, number, string] }) =>
      `${p.value[3]}<br/>Automatizado ${p.value[0]}% · Humano ${p.value[1]}% · vol ${p.value[2]}`,
  },
  grid: { left: 44, right: 16, top: 16, bottom: 36 },
  xAxis: {
    type: 'value',
    name: 'Abandono no automatizado (%) →',
    nameLocation: 'middle',
    nameGap: 24,
    nameTextStyle: { color: C.axis, fontSize: 10 },
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    name: 'Abandono humano (%)',
    nameTextStyle: { color: C.axis, fontSize: 10, align: 'left' },
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      type: 'scatter',
      symbolSize: (d: number[]) => 14 + d[2] / 3,
      label: {
        show: true,
        formatter: (p: { value: [number, number, number, string] }) =>
          `${p.value[3]} (${p.value[2]})`,
        position: 'right',
        fontSize: 10,
        color: C.axis,
      },
      data: abandonoScatter.map((a) => ({
        value: [a.bot, a.humana, a.volume, a.nome],
        itemStyle: {
          color: a.tone === 'danger' ? C.danger : a.tone === 'warning' ? C.warning : C.success,
          opacity: 0.8,
        },
      })),
    },
  ],
}))

const ringStyle = (pct: number, color: string) => ({
  background: `conic-gradient(${color} ${pct}%, var(--color-ms-fill-light) 0)`,
})
</script>

<template>
  <div class="space-y-5">
    <!-- Indicadores gerais -->
    <IndicadoresGerais :items="indicadoresGerais" />

    <SectionHeader
      title="Onde o atendimento foi abandonado"
      subtitle="Etapa da jornada em que o beneficiário desistiu · por assunto e por canal."
      action-to="/gestor/abandonos-detalhe"
    />

    <!-- Linha 1: Por Canal · No automatizado · Em espera na fila -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard title="Por Canal" :subtitle="`Total: ${porCanal.total} abandonos`">
        <div class="relative h-36 w-full">
          <VChart
            class="h-full w-full cursor-pointer"
            :option="canalOption"
            autoresize
            @click="abrirCanal"
          />
          <div
            class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span class="text-xl font-bold text-ms-text-primary">{{ porCanal.taxa }}</span>
            <span class="text-2xs text-ms-text-secondary">{{ porCanal.total }}</span>
          </div>
        </div>
        <div class="mt-2 space-y-1 text-xs">
          <div v-for="i in porCanal.itens" :key="i.name" class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-ms-text-regular">
              <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: canalCor(i.name, C) }" />{{
                i.name
              }}
            </span>
            <span class="font-medium text-ms-text-primary">{{ i.pct }} · {{ i.value }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="No atendimento automatizado"
        subtitle="Etapa do fluxo onde o beneficiário desistiu · clique para abrir os protocolos"
      >
        <StackedBarList
          :items="porFluxoBot"
          :max="20"
          bar-class="bg-ms-primary"
          clickable
          @item-click="abrirBotItem"
        />
      </ChartCard>

      <ChartCard
        title="Em espera na fila"
        subtitle="% dos beneficiários que aguardavam e desistiram antes do atendimento · clique para abrir"
      >
        <StackedBarList
          :items="porFilaHumana"
          :max="40"
          bar-class="bg-ms-warning"
          clickable
          @item-click="abrirEsperaItem"
        />
      </ChartCard>
    </div>

    <!-- Linha 2: Comparativo por etapa · Abandono por assunto (barras) -->
    <div class="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Comparativo: abandono por etapa da jornada"
        :subtitle="`Distribuição dos ${comparativo.total} casos de abandono`"
      >
        <div class="flex items-center justify-center gap-6 py-2">
          <div class="text-center">
            <div
              class="relative mx-auto h-20 w-20 rounded-full"
              :style="ringStyle(comparativo.automatizado.pct, C.primary)"
            >
              <div
                class="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-ms-surface"
              >
                <span class="text-2xs font-semibold uppercase text-ms-text-secondary"
                  >Automat. {{ comparativo.automatizado.pct }}%</span
                >
                <span class="text-xl font-bold text-ms-primary">{{ comparativo.automatizado.casos }}</span>
              </div>
            </div>
            <p class="mt-1 text-2xs text-ms-text-secondary">No automatizado</p>
          </div>
          <span class="text-sm font-medium text-ms-text-secondary">VS</span>
          <div class="text-center">
            <div
              class="relative mx-auto h-20 w-20 rounded-full"
              :style="ringStyle(comparativo.emEspera.pct, C.warning)"
            >
              <div
                class="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-ms-surface"
              >
                <span class="text-2xs font-semibold uppercase text-ms-text-secondary"
                  >Em espera {{ comparativo.emEspera.pct }}%</span
                >
                <span class="text-xl font-bold text-ms-warning">{{ comparativo.emEspera.casos }}</span>
              </div>
            </div>
            <p class="mt-1 text-2xs text-ms-text-secondary">Em espera</p>
          </div>
        </div>
        <div class="mt-auto space-y-1 border-t border-ms-border-lighter pt-2 text-xs">
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">Proporção</span>
            <span class="font-semibold text-ms-text-primary">{{ comparativo.mult }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">TME desistência médio</span>
            <span class="text-ms-text-primary"
              >Automat. {{ comparativo.tmeAutomatizado }} · Em espera {{ comparativo.tmeEmEspera }}</span
            >
          </div>
          <div class="flex justify-between gap-4">
            <span class="shrink-0 text-ms-text-secondary">Insight</span>
            <span class="text-right font-medium text-ms-warning">{{ comparativo.insight }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Abandono por assunto — Automatizado × Humano"
        subtitle="% de abandono em cada etapa por assunto"
      >
        <div class="w-full flex-1" style="min-height: 200px">
          <VChart class="h-full w-full" :option="fluxoBotHumanoOption" autoresize />
        </div>
        <ChartLegend :items="fluxoBotHumanoLegend" class="mt-3" />
      </ChartCard>
    </div>

    <!-- Scatter diagnóstico (por assunto) -->
    <ChartCard
      title="Automatizado × Humano por assunto"
      subtitle="tamanho do ponto = volume do assunto · matriz de diagnóstico da jornada · clique para abrir"
    >
      <div class="h-72 w-full">
        <VChart
          class="h-full w-full cursor-pointer"
          :option="abandonoScatterOption"
          autoresize
          @click="abrirScatter"
        />
      </div>
    </ChartCard>

    <div
      class="flex items-center gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-primary">◆</span>{{ bannerAbandono }}
    </div>
  </div>
</template>
