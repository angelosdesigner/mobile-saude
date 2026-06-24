<script setup lang="ts">
// SUBABA 1 · VISÃO GERAL — saúde executiva da operação (leitura < 10s).
// KPIs executivos + tendência de saúde (30d) + gap de resolutividade.
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import KpiStatCard from '@/components/gestor/KpiStatCard.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import GapResolutividade from './GapResolutividade.vue'
import { useChartColors } from '@/plugins/echarts'
import { kpisExecutivos, saudeOperacao, gapResolutividade } from '@/data/gestaoPerformancePainel'

const router = useRouter()
const C = useChartColors()

const saudeOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: {
    bottom: 0,
    icon: 'roundRect',
    itemWidth: 14,
    itemHeight: 3,
    textStyle: { color: C.axis, fontSize: 11 },
    data: ['Backlog', 'Volume', 'SLA %'],
  },
  grid: { left: 36, right: 40, top: 12, bottom: 36 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: saudeOperacao.dias,
    axisLabel: { color: C.axis, fontSize: 10, interval: 4, formatter: (v: string) => `d${v}` },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: [
    {
      type: 'value',
      axisLabel: { color: C.axis, fontSize: 10 },
      splitLine: { lineStyle: { color: C.split } },
    },
    {
      type: 'value',
      min: 60,
      max: 100,
      axisLabel: { color: C.axis, fontSize: 10, formatter: '{value}%' },
      splitLine: { show: false },
    },
  ],
  series: [
    { name: 'Backlog', type: 'line', smooth: true, showSymbol: false, data: saudeOperacao.backlog, lineStyle: { width: 2 }, itemStyle: { color: C.primary } },
    { name: 'Volume', type: 'line', smooth: true, showSymbol: false, data: saudeOperacao.volume, lineStyle: { width: 2 }, itemStyle: { color: C.warning } },
    { name: 'SLA %', type: 'line', yAxisIndex: 1, smooth: true, showSymbol: false, data: saudeOperacao.sla, lineStyle: { width: 2 }, itemStyle: { color: C.success } },
  ],
}))
</script>

<template>
  <div class="space-y-5">
    <!-- KPIs executivos -->
    <div>
      <div class="mb-2 text-2xs font-bold uppercase tracking-wide text-ms-text-secondary">
        Indicadores executivos · vs período anterior
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiStatCard
          v-for="k in kpisExecutivos"
          :key="k.label"
          :label="k.label"
          :value="k.value"
          :unit="k.unit"
          :status="k.status"
          :delta="k.delta"
          :delta-tone="k.deltaTone"
          :clickable="!!k.to"
          @click="k.to && router.push(k.to)"
        />
      </div>
    </div>

    <!-- Saúde + Qualidade lado a lado -->
    <div class="grid gap-4 lg:grid-cols-5">
      <ChartCard
        title="Saúde da Operação"
        subtitle="Backlog · Volume · SLA — últimos 30 dias"
        class="lg:col-span-3"
      >
        <div class="h-64 w-full">
          <VChart class="h-full w-full" :option="saudeOption" autoresize />
        </div>
      </ChartCard>

      <ChartCard
        title="Qualidade da Operação"
        subtitle="Resolutividade do sistema vs confirmada pelo beneficiário"
        class="lg:col-span-2"
      >
        <GapResolutividade
          :sistema="gapResolutividade.sistema"
          :beneficiario="gapResolutividade.beneficiario"
          :gap="gapResolutividade.gap"
          :nota="gapResolutividade.nota"
        />
      </ChartCard>
    </div>
  </div>
</template>
