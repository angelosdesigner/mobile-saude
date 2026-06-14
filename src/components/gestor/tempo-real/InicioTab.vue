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
  segmentosCriticos,
  type SegmentoCritico,
  type CardTarget,
} from '@/data/gestorTempoReal'
import { chartColors as C } from '@/plugins/echarts'

const router = useRouter()

// Redireciona o usuário conforme o alvo do card (indicador ou atendimentos).
function goTarget(t: CardTarget) {
  if (t.type === 'indicador') router.push({ path: '/gestor/indicadores', query: { ind: t.ind } })
  else router.push({ path: '/gestor/tempo-real', query: { tab: 'atendimentos', filtro: t.filtro } })
}

function goAtendimentos(filtro: string) {
  router.push({ path: '/gestor/tempo-real', query: { tab: 'atendimentos', filtro } })
}

const andamentoTone: Record<'primary' | 'warning' | 'teal', string> = {
  primary: 'border-ms-primary/30 bg-ms-primary/5 text-ms-primary',
  warning: 'border-ms-warning/30 bg-ms-warning/5 text-ms-warning',
  teal: 'border-ms-teal/30 bg-ms-teal/5 text-ms-teal',
}

// Número formatado em pt-BR (vírgula decimal) para o card "Chamadas na fila".
const ptNum = (n: number) => String(n).replace('.', ',')

// Legendas (bolinha + nome) reutilizando ChartLegend; cores = série do gráfico.
const canalColors = [C.danger, C.primary, C.warning]
const canalLegend = computed(() =>
  canalDistribuicao.map((c, i) => ({
    label: c.name,
    color: canalColors[i] ?? C.axis,
    value: `${c.pct} (${c.value})`,
  })),
)
const abandonoLegend = [
  { label: 'BOT', color: C.primary },
  { label: 'Humano', color: C.danger },
]
const demandaLegend = [
  { label: 'Saudável', color: C.success },
  { label: 'Tensionado', color: C.warning },
  { label: 'Acima da capacidade', color: C.danger },
]

const canalOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [
    {
      type: 'pie',
      radius: ['62%', '88%'],
      avoidLabelOverlap: false,
      label: { show: false },
      data: [
        {
          value: canalDistribuicao[0].value,
          name: canalDistribuicao[0].name,
          itemStyle: { color: C.danger },
        },
        {
          value: canalDistribuicao[1].value,
          name: canalDistribuicao[1].name,
          itemStyle: { color: C.primary },
        },
        {
          value: canalDistribuicao[2].value,
          name: canalDistribuicao[2].name,
          itemStyle: { color: C.warning },
        },
      ],
    },
  ],
}))

const abandonoOption = computed(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}%` },
  // Legenda BOT/Humano renderizada em HTML (ChartLegend) no rodapé do card —
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
      name: 'BOT',
      type: 'bar',
      data: abandonoFluxo.bot,
      itemStyle: { color: C.primary, borderRadius: [3, 3, 0, 0] },
    },
    {
      name: 'Humano',
      type: 'bar',
      data: abandonoFluxo.humano,
      itemStyle: { color: C.danger, borderRadius: [3, 3, 0, 0] },
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
    },
  ],
}))

const statusTone: Record<SegmentoCritico['status'], string> = {
  OK: 'text-ms-success',
  ALERTA: 'text-ms-warning',
  CRÍTICO: 'text-ms-danger',
}
</script>

<template>
  <div class="space-y-5">
    <!-- Resumo executivo -->
    <SectionHeader
      title="Resumo Executivo da Operação"
      subtitle="Visão consolidada dos indicadores mais importantes da central de atendimento."
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
      <!-- Chamadas na fila — taxa de abandono, mesmo padrão dos demais. -->
      <KpiRingCard
        :value="chamadasNaFila.abandono"
        :display="`${ptNum(chamadasNaFila.abandono)}%`"
        label="Chamadas na fila"
        :delta="`${chamadasNaFila.delta}${chamadasNaFila.critico ? ' (crítico)' : ''}`"
        delta-tone="danger"
        :meta="`Atendidas: ${ptNum(chamadasNaFila.atendidas)}%`"
        tone="danger"
        clickable
        @click="goAtendimentos('fila')"
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
        class="cursor-pointer transition hover:shadow-md"
        @click="goTarget(m.target)"
      />
    </div>

    <!-- Andamento + ocupações -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard title="Atendimentos em andamento" subtitle="Visão instantânea dos ativos agora">
        <div class="space-y-2">
          <div
            v-for="a in andamento"
            :key="a.label"
            class="flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 transition hover:brightness-95"
            :class="andamentoTone[a.tone]"
            @click="goAtendimentos(a.filtro)"
          >
            <span class="text-xs font-semibold uppercase">{{ a.label }}</span>
            <span class="text-xl font-bold">{{ a.value }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Ocupação por fila" subtitle="% de uso da capacidade e TMEF">
        <BarList :items="ocupacaoFila" threshold-legend />
      </ChartCard>

      <ChartCard title="Ocupação por atendente" subtitle="% de uso da capacidade">
        <BarList :items="ocupacaoAtendente" rank-hint />
      </ChartCard>
    </div>

    <!-- Gráficos -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="Distribuição de atendimentos por canal"
        subtitle="Total: 118 atendimentos ativos"
      >
        <div class="relative h-44 w-full">
          <VChart class="h-full w-full" :option="canalOption" autoresize />
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
            <span class="font-medium text-ms-success">{{ canalResumo.slaConformidade }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Abandono por fluxo — BOT vs Humano"
        subtitle="% de abandono em cada canal por fluxo"
      >
        <div class="w-full flex-1" style="min-height: 200px">
          <VChart class="h-full w-full" :option="abandonoOption" autoresize />
        </div>
        <ChartLegend :items="abandonoLegend" class="mt-3" />
      </ChartCard>

      <ChartCard
        title="Demanda × Capacidade"
        subtitle="Distribuição ao longo do dia · pico 14h-16h"
      >
        <div class="w-full flex-1" style="min-height: 200px">
          <VChart class="h-full w-full" :option="demandaOption" autoresize />
        </div>
        <ChartLegend :items="demandaLegend" class="mt-3" />
      </ChartCard>
    </div>

    <!-- Segmentos críticos -->
    <ChartCard
      title="Segmentos críticos · Canal × Fila × Turno"
      subtitle="Cruzamento de volume, SLA e TME por segmento operacional"
    >
      <el-table :data="segmentosCriticos" stripe size="small" style="width: 100%">
        <el-table-column prop="canal" label="Canal" />
        <el-table-column prop="fila" label="Fila" />
        <el-table-column prop="turno" label="Turno" />
        <el-table-column prop="volume" label="Vol. atendido" align="right" />
        <el-table-column label="Abandonados" align="right">
          <template #default="{ row }">
            <span class="text-ms-danger">{{ row.abandonados }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="atendDisp" label="Atend. disp." align="center" />
        <el-table-column label="SLA" align="right">
          <template #default="{ row }">
            <span
              :class="
                row.sla < 70
                  ? 'text-ms-danger'
                  : row.sla < 90
                    ? 'text-ms-warning'
                    : 'text-ms-success'
              "
              >{{ row.sla }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="tme" label="TME" align="right" />
        <el-table-column label="Status">
          <template #default="{ row }">
            <span
              class="text-xs font-semibold"
              :class="statusTone[row.status as SegmentoCritico['status']]"
              >{{ row.status }}</span
            >
          </template>
        </el-table-column>
      </el-table>
    </ChartCard>
  </div>
</template>
