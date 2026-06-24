<script setup lang="ts">
// SUBABA 5 · QUALIDADE E EXPERIÊNCIA — percepção do beneficiário.
// KPIs de experiência + evolução NPS/CSAT/CES (90d) + painel de reabertura +
// gap de resolutividade + insights.
import { computed } from 'vue'
import VChart from 'vue-echarts'
import KpiStatCard from '@/components/gestor/KpiStatCard.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import GapResolutividade from './GapResolutividade.vue'
import { useChartColors } from '@/plugins/echarts'
import {
  qualidadeKpis,
  evolucaoExperiencia,
  reabertura,
  gapResolutividade,
} from '@/data/gestaoPerformancePainel'

const C = useChartColors()

const evolucaoOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: {
    bottom: 0,
    icon: 'roundRect',
    itemWidth: 14,
    itemHeight: 3,
    textStyle: { color: C.axis, fontSize: 11 },
    data: ['NPS', 'CSAT', 'CES'],
  },
  grid: { left: 36, right: 40, top: 12, bottom: 36 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: evolucaoExperiencia.dias,
    axisLabel: { color: C.axis, fontSize: 10 },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: [
    { type: 'value', min: 40, max: 100, axisLabel: { color: C.axis, fontSize: 10 }, splitLine: { lineStyle: { color: C.split } } },
    { type: 'value', min: 0, max: 5, axisLabel: { color: C.axis, fontSize: 10 }, splitLine: { show: false } },
  ],
  series: [
    { name: 'NPS', type: 'line', smooth: true, showSymbol: false, data: evolucaoExperiencia.nps, lineStyle: { width: 2 }, itemStyle: { color: C.primary } },
    { name: 'CSAT', type: 'line', yAxisIndex: 1, smooth: true, showSymbol: false, data: evolucaoExperiencia.csat, lineStyle: { width: 2 }, itemStyle: { color: C.success } },
    { name: 'CES', type: 'line', yAxisIndex: 1, smooth: true, showSymbol: false, data: evolucaoExperiencia.ces, lineStyle: { width: 2 }, itemStyle: { color: C.purple } },
  ],
}))
</script>

<template>
  <div class="space-y-5">
    <SectionHeader
      title="Experiência do beneficiário"
      subtitle="NPS, CSAT, CES e reabertura · percepção vs operação"
      action-to="/gestor/qualidade-detalhe"
    />

    <!-- KPIs de experiência -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiStatCard
        v-for="k in qualidadeKpis"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
      />
    </div>

    <!-- Evolução + Reabertura -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="Evolução — NPS · CSAT · CES"
        subtitle="últimos 90 dias · NPS em 0–100, CSAT e CES em 0–5"
        class="lg:col-span-2"
      >
        <div class="h-64 w-full">
          <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
        </div>
      </ChartCard>

      <ChartCard title="Reabertura" subtitle="taxa, tendência e principais motivos">
        <div class="flex items-end justify-between">
          <div>
            <p class="text-3xl font-bold text-ms-text-primary">{{ reabertura.taxa }}</p>
            <p class="text-2xs text-ms-text-secondary">taxa de reabertura</p>
          </div>
          <span
            class="rounded-full bg-ms-danger/10 px-2 py-0.5 text-2xs font-semibold text-ms-danger"
            >{{ reabertura.tendencia }}</span
          >
        </div>
        <div class="mt-4 space-y-2.5">
          <p class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">Principais motivos</p>
          <div v-for="m in reabertura.motivos" :key="m.motivo">
            <div class="mb-1 flex items-baseline justify-between gap-2">
              <span class="truncate text-2xs text-ms-text-regular">{{ m.motivo }}</span>
              <span class="shrink-0 text-2xs font-semibold text-ms-text-primary">{{ m.pct }}%</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
              <div class="h-full rounded-full bg-ms-text-placeholder" :style="{ width: `${m.pct}%` }" />
            </div>
          </div>
        </div>
      </ChartCard>
    </div>

    <!-- Gap de resolutividade (operacional vs percebida) -->
    <ChartCard
      title="Qualidade operacional vs percebida"
      subtitle="o que o sistema resolve vs o que o beneficiário confirma"
    >
      <GapResolutividade
        :sistema="gapResolutividade.sistema"
        :beneficiario="gapResolutividade.beneficiario"
        :gap="gapResolutividade.gap"
        :nota="gapResolutividade.nota"
      />
    </ChartCard>
  </div>
</template>
