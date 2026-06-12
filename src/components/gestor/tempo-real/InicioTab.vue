<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import MetricCard from '@/components/gestor/MetricCard.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import BarList from '@/components/gestor/BarList.vue'
import {
  kpiGauges,
  metricTiles,
  andamento,
  ocupacaoFila,
  ocupacaoAtendente,
  canalDistribuicao,
  abandonoFluxo,
  demandaCapacidade,
  segmentosCriticos,
  type SegmentoCritico,
} from '@/data/gestorTempoReal'

// Paleta para os gráficos (hex de marca — neutra entre temas; eixos em cinza).
const C = {
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  teal: '#13c2c2',
  axis: '#909399',
  split: 'rgba(144,147,153,0.15)',
}

const ringColor: Record<KpiTone, string> = {
  primary: C.primary,
  success: C.success,
  purple: '#7c6cf2',
}
type KpiTone = 'primary' | 'success' | 'purple'

const andamentoTone: Record<'primary' | 'warning' | 'teal', string> = {
  primary: 'border-ms-primary/30 bg-ms-primary/5 text-ms-primary',
  warning: 'border-ms-warning/30 bg-ms-warning/5 text-ms-warning',
  teal: 'border-ms-teal/30 bg-ms-teal/5 text-ms-teal',
}

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
  legend: { bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { color: C.axis, fontSize: 11 } },
  grid: { left: 32, right: 8, top: 12, bottom: 32 },
  xAxis: {
    type: 'category',
    data: abandonoFluxo.fluxos,
    axisLabel: { color: C.axis, fontSize: 10, interval: 0 },
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
    <div>
      <h2 class="text-base font-bold text-ms-text-primary">Resumo Executivo da Operação</h2>
      <p class="text-sm text-ms-text-secondary">
        Visão consolidada dos indicadores mais importantes da central de atendimento.
      </p>
    </div>

    <!-- KPIs (anéis) + Chamadas na fila -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card
        v-for="k in kpiGauges"
        :key="k.label"
        shadow="never"
        body-class="!p-4"
        class="!border-ms-border-light"
      >
        <div class="flex items-center gap-4">
          <div
            class="relative h-16 w-16 shrink-0 rounded-full"
            :style="{
              background: `conic-gradient(${ringColor[k.tone]} ${k.value}%, var(--color-ms-fill-light) 0)`,
            }"
          >
            <div
              class="absolute inset-[6px] flex items-center justify-center rounded-full bg-ms-surface text-sm font-bold text-ms-text-primary"
            >
              {{ k.display }}
            </div>
          </div>
          <div class="min-w-0">
            <div class="text-[11px] font-semibold uppercase tracking-wide text-ms-text-secondary">
              {{ k.label }}
            </div>
            <div
              class="mt-1 text-xs"
              :class="k.deltaTone === 'down' ? 'text-ms-danger' : 'text-ms-success'"
            >
              {{ k.delta }}
            </div>
            <div class="text-[11px] text-ms-text-placeholder">{{ k.meta }}</div>
          </div>
        </div>
      </el-card>

      <el-card shadow="never" body-class="!p-4" class="!border-ms-border-light">
        <div class="text-[11px] font-semibold uppercase tracking-wide text-ms-text-secondary">
          Status atual das equipes
        </div>
        <div class="mt-3 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-ms-text-regular"
              ><span class="h-2 w-2 rounded-full bg-ms-success" />Disponível</span
            >
            <b class="text-ms-text-primary">5</b>
          </div>
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-ms-text-regular"
              ><span class="h-2 w-2 rounded-full bg-ms-primary" />Em atendimento</span
            >
            <b class="text-ms-text-primary">14</b>
          </div>
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-ms-text-regular"
              ><span class="h-2 w-2 rounded-full bg-ms-warning" />Ocupados</span
            >
            <b class="text-ms-text-primary">4</b>
          </div>
        </div>
      </el-card>
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
      />
    </div>

    <!-- Andamento + ocupações -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard title="Atendimentos em andamento" subtitle="Visão instantânea dos ativos agora">
        <div class="space-y-2">
          <div
            v-for="a in andamento"
            :key="a.label"
            class="flex items-center justify-between rounded-lg border px-3 py-2"
            :class="andamentoTone[a.tone]"
          >
            <span class="text-xs font-semibold uppercase">{{ a.label }}</span>
            <span class="text-xl font-bold">{{ a.value }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Ocupação por fila" subtitle="% de uso da capacidade e TMEF">
        <BarList :items="ocupacaoFila" />
      </ChartCard>

      <ChartCard title="Ocupação por atendente" subtitle="% de uso da capacidade">
        <BarList :items="ocupacaoAtendente" />
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
            <span class="text-[11px] text-ms-text-secondary">ativos</span>
          </div>
        </div>
        <div class="mt-2 space-y-1 text-xs">
          <div v-for="c in canalDistribuicao" :key="c.name" class="flex justify-between">
            <span class="text-ms-text-regular">{{ c.name }}</span>
            <span class="font-medium text-ms-text-primary">{{ c.pct }} · {{ c.value }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Abandono por fluxo — BOT vs Humano"
        subtitle="% de abandono em cada canal por fluxo"
      >
        <div class="h-52 w-full">
          <VChart class="h-full w-full" :option="abandonoOption" autoresize />
        </div>
      </ChartCard>

      <ChartCard
        title="Demanda × Capacidade"
        subtitle="Distribuição ao longo do dia · pico 14h-16h"
      >
        <div class="h-52 w-full">
          <VChart class="h-full w-full" :option="demandaOption" autoresize />
        </div>
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
