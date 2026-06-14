<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import RankHint from '@/components/gestor/RankHint.vue'
import {
  equipeMetrics,
  eficiencia,
  rankings,
  equipeScatter,
  bannerEquipe,
  type EquipeTone,
} from '@/data/gestorEquipe'
import { chartColors as C } from '@/plugins/echarts'

const metricTone: Record<EquipeTone, string> = {
  success: 'text-ms-success',
  danger: 'text-ms-danger',
}

// Cor por posição no ranking (pior → melhor): 1º crítico, último saudável.
const rankColors = ['bg-ms-danger', 'bg-ms-warning', 'bg-ms-border', 'bg-ms-border', 'bg-ms-success']
const rankText = ['text-ms-danger', 'text-ms-warning', 'text-ms-text-regular', 'text-ms-text-regular', 'text-ms-success']
const rankBadge = [
  'bg-ms-danger text-ms-on-danger',
  'bg-ms-warning text-ms-on-warning',
  'bg-ms-fill-light text-ms-text-secondary',
  'bg-ms-fill-light text-ms-text-secondary',
  'bg-ms-success text-ms-on-success',
]

const toneColor: Record<'danger' | 'warning' | 'neutral' | 'success', string> = {
  danger: C.danger,
  warning: C.warning,
  neutral: C.neutral,
  success: C.success,
}

const scatterOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p: { value: [number, number, string, number] }) =>
      `${p.value[2]}<br/>Ocupação ${p.value[0]}% · CSAT ${p.value[1]} · ${p.value[3]} reab.`,
  },
  grid: { left: 44, right: 16, top: 16, bottom: 36 },
  xAxis: {
    type: 'value',
    name: 'Ocupação (%) →',
    nameLocation: 'middle',
    nameGap: 24,
    nameTextStyle: { color: C.axis, fontSize: 10 },
    min: 50,
    max: 100,
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    name: 'CSAT (1-5)',
    nameTextStyle: { color: C.axis, fontSize: 10, align: 'left' },
    min: 3.5,
    max: 5,
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      type: 'scatter',
      symbolSize: (d: number[]) => 14 + d[3] * 3,
      label: {
        show: true,
        formatter: (p: { value: [number, number, string, number] }) =>
          `${p.value[2]} (${p.value[3]} reab.)`,
        position: 'right',
        fontSize: 10,
        color: C.axis,
      },
      data: equipeScatter.map((e) => ({
        value: [e.ocupacao, e.csat, e.nome, e.reab],
        itemStyle: { color: toneColor[e.tone], opacity: 0.85 },
      })),
      markArea: {
        silent: true,
        data: [
          [
            { itemStyle: { color: 'rgba(103,194,58,0.08)' }, coord: [50, 4.5] },
            { coord: [72, 5] },
          ],
          [
            { itemStyle: { color: 'rgba(245,108,108,0.08)' }, coord: [78, 3.5] },
            { coord: [100, 4.3] },
          ],
        ],
      },
    },
  ],
}))
</script>

<template>
  <div class="space-y-5">
    <SectionHeader
      title="Desempenho da Equipe"
      subtitle="Monitore produtividade, ocupação, qualidade do atendimento e indicadores individuais para identificar oportunidades de melhoria e riscos operacionais."
    />

    <!-- Métricas -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card
        v-for="m in equipeMetrics"
        :key="m.label"
        shadow="never"
        body-class="!p-4"
        class="!border-ms-border-light text-center"
      >
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          {{ m.label }}
        </div>
        <div class="mt-1 text-3xl font-bold" :class="metricTone[m.tone]">{{ m.value }}</div>
        <div class="mt-0.5 text-xs text-ms-text-secondary">{{ m.sub }}</div>
      </el-card>
    </div>
    <div class="-mt-2 text-sm font-semibold text-ms-success">
      Eficiência operacional: {{ eficiencia }}%
    </div>

    <!-- Rankings -->
    <div>
      <h3 class="text-sm font-semibold text-ms-text-primary">
        Rankings — atendentes com maior necessidade de atenção
      </h3>
      <p class="text-xs text-ms-text-secondary">Ordenado do pior para o melhor em cada métrica</p>
    </div>
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard v-for="r in rankings" :key="r.titulo" :title="r.titulo" :subtitle="r.subtitulo">
        <div class="space-y-3">
          <div v-for="(it, i) in r.itens" :key="it.nome" class="flex items-center gap-2.5">
            <span
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-2xs font-bold"
              :class="rankBadge[i]"
              >{{ i + 1 }}</span
            >
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline justify-between gap-2">
                <span class="truncate text-sm text-ms-text-regular">{{ it.nome }}</span>
                <span class="text-sm font-bold" :class="rankText[i]">{{ it.display }}</span>
              </div>
              <div v-if="it.sub" class="text-2xs text-ms-text-secondary">{{ it.sub }}</div>
              <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
                <div
                  class="h-full rounded-full"
                  :class="rankColors[i]"
                  :style="{ width: `${(it.valor / r.max) * 100}%` }"
                />
              </div>
            </div>
          </div>
          <div class="border-t border-ms-border-lighter pt-2">
            <RankHint />
          </div>
        </div>
      </ChartCard>
    </div>

    <!-- Dispersão ocupação × CSAT -->
    <ChartCard
      title="Ocupação × CSAT por atendente"
      subtitle="tamanho do ponto = reaberturas · áreas coloridas = zonas de risco"
    >
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="scatterOption" autoresize />
      </div>
    </ChartCard>

    <div
      class="flex items-center gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-primary">◆</span>{{ bannerEquipe }}
    </div>
  </div>
</template>
