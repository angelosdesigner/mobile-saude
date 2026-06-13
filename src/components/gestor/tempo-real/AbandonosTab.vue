<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import {
  porCanal,
  porFluxoBot,
  porFilaHumana,
  abandonoFluxo,
  comparativo,
  abandonoScatter,
  bannerAbandono,
} from '@/data/gestorAbandonos'
import { chartColors as C } from '@/plugins/echarts'

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
        itemStyle: { color: i.color },
      })),
    },
  ],
}))

const abandonoFluxoOption = computed(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}%` },
  legend: { bottom: 0, itemWidth: 10, itemHeight: 10, textStyle: { color: C.axis, fontSize: 11 } },
  grid: { left: 30, right: 8, top: 12, bottom: 32 },
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
      itemStyle: { color: C.warning, borderRadius: [3, 3, 0, 0] },
    },
    {
      name: 'Humano',
      type: 'bar',
      data: abandonoFluxo.humano,
      itemStyle: { color: C.danger, borderRadius: [3, 3, 0, 0] },
    },
  ],
}))

const abandonoScatterOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p: { value: [number, number, number, string] }) =>
      `${p.value[3]}<br/>BOT ${p.value[0]}% · Humana ${p.value[1]}% · vol ${p.value[2]}`,
  },
  grid: { left: 44, right: 16, top: 16, bottom: 36 },
  xAxis: {
    type: 'value',
    name: 'Taxa de Abandono no BOT (%) →',
    nameLocation: 'middle',
    nameGap: 24,
    nameTextStyle: { color: C.axis, fontSize: 10 },
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    name: 'Abandono na Fila Humana (%)',
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
    <SectionHeader
      title="Gestão de Abandono"
      subtitle="Monitoramento das desistências e identificação de pontos críticos da jornada."
    />

    <!-- Por canal / fluxo bot / fila humana -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard title="Por Canal" :subtitle="`Total: ${porCanal.total} abandonos`">
        <div class="relative h-36 w-full">
          <VChart class="h-full w-full" :option="canalOption" autoresize />
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
              <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: i.color }" />{{
                i.name
              }}
            </span>
            <span class="font-medium text-ms-text-primary">{{ i.pct }} · {{ i.value }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Por fluxo (BOT)" subtitle="etapa onde o cliente desiste">
        <div class="space-y-2.5">
          <div v-for="f in porFluxoBot" :key="f.label">
            <div class="flex items-center justify-between text-xs">
              <span class="truncate pr-2 text-ms-text-regular">{{ f.label }}</span>
              <span class="font-medium text-ms-warning">{{ f.value }}%</span>
            </div>
            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
              <div
                class="h-full rounded-full bg-ms-warning"
                :style="{ width: `${f.value * 5}%` }"
              />
            </div>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Por fila humana" subtitle="% de abandono na fila">
        <div class="space-y-2.5">
          <div v-for="f in porFilaHumana" :key="f.label">
            <div class="flex items-center justify-between text-xs">
              <span class="truncate pr-2 text-ms-text-regular">{{ f.label }}</span>
              <span class="font-medium text-ms-danger">{{ f.value }}%</span>
            </div>
            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
              <div class="h-full rounded-full bg-ms-danger" :style="{ width: `${f.value * 2}%` }" />
            </div>
          </div>
        </div>
      </ChartCard>
    </div>

    <!-- Comparativo + fluxo -->
    <div class="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Comparativo: Abandono BOT vs Humano"
        :subtitle="`Distribuição dos ${comparativo.total} casos de abandono`"
      >
        <div class="flex items-center justify-center gap-6 py-2">
          <div class="text-center">
            <div
              class="relative mx-auto h-20 w-20 rounded-full"
              :style="ringStyle(comparativo.bot.pct, C.warning)"
            >
              <div
                class="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-ms-surface"
              >
                <span class="text-2xs font-semibold uppercase text-ms-text-secondary"
                  >BOT {{ comparativo.bot.pct }}%</span
                >
                <span class="text-xl font-bold text-ms-warning">{{ comparativo.bot.casos }}</span>
              </div>
            </div>
          </div>
          <span class="text-sm font-medium text-ms-text-secondary">VS</span>
          <div class="text-center">
            <div
              class="relative mx-auto h-20 w-20 rounded-full"
              :style="ringStyle(comparativo.humano.pct, C.danger)"
            >
              <div
                class="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-ms-surface"
              >
                <span class="text-2xs font-semibold uppercase text-ms-text-secondary"
                  >Humano {{ comparativo.humano.pct }}%</span
                >
                <span class="text-xl font-bold text-ms-danger">{{ comparativo.humano.casos }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-1 border-t border-ms-border-lighter pt-2 text-xs">
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">Humano abandona</span>
            <span class="font-semibold text-ms-danger">{{ comparativo.mult }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">TME desistência médio</span>
            <span class="text-ms-text-primary"
              >BOT {{ comparativo.tmeBot }} · Humano {{ comparativo.tmeHumano }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">Insight</span>
            <span class="text-ms-success">{{ comparativo.insight }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Abandono por Fluxo — BOT vs Humano"
        subtitle="% de abandono em cada canal por fluxo"
      >
        <div class="h-56 w-full">
          <VChart class="h-full w-full" :option="abandonoFluxoOption" autoresize />
        </div>
      </ChartCard>
    </div>

    <!-- Scatter diagnóstico -->
    <ChartCard
      title="Abandono BOT × Humano por fluxo"
      subtitle="tamanho do ponto = volume do fluxo · matriz de diagnóstico da jornada"
    >
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="abandonoScatterOption" autoresize />
      </div>
    </ChartCard>

    <div
      class="flex items-center gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-primary">◆</span>{{ bannerAbandono }}
    </div>
  </div>
</template>
