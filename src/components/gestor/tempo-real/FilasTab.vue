<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BarList from '@/components/gestor/BarList.vue'
import {
  filaMetrics,
  capacidade,
  equipeStatus,
  ocupacaoFila,
  filaScatter,
  bannerFilaWarn,
  bannerFilaInfo,
  type MetricTone,
} from '@/data/gestorFilas'
import { normalizeFila } from '@/data/gestorTaxonomia'
import { chartColors as C } from '@/plugins/echarts'

const router = useRouter()

// Drill-down: clique numa fila → listagem de ocorrências filtrada. O nome é
// normalizado pela taxonomia única (dashboard ↔ cards casam por nome canônico).
function abrirFila(label: string) {
  router.push({
    path: '/gestor/ocorrencias',
    query: { view: 'lista', fila: normalizeFila(label) },
  })
}

const metricTone: Record<MetricTone, string> = {
  default: 'text-ms-text-primary',
  danger: 'text-ms-danger',
  warning: 'text-ms-warning',
  success: 'text-ms-success',
  primary: 'text-ms-primary',
}
const dot: Record<'success' | 'primary' | 'warning', string> = {
  success: 'bg-ms-success',
  primary: 'bg-ms-primary',
  warning: 'bg-ms-warning',
}

const capacidadeOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: capacidade.max,
      center: ['50%', '72%'],
      radius: '108%',
      progress: { show: true, width: 12, itemStyle: { color: C.success } },
      axisLine: { lineStyle: { width: 12, color: [[1, 'rgba(144,147,153,0.18)']] } },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: false },
      title: { show: false },
      detail: {
        offsetCenter: [0, '-8%'],
        formatter: `{v|${capacidade.value}}{t|/${capacidade.max}}`,
        rich: {
          v: { fontSize: 28, fontWeight: 'bold', color: C.ink },
          t: { fontSize: 14, color: C.axis },
        },
      },
      data: [{ value: capacidade.value }],
    },
  ],
}))

const slaColor = (sla: number) => (sla >= 90 ? C.success : sla >= 70 ? C.warning : C.danger)

const filaScatterOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p: { value: [number, number, number, string] }) =>
      `${p.value[3]}<br/>Aguardando: ${p.value[0]} · TME ${p.value[1]}min · SLA ${p.value[2]}%`,
  },
  grid: { left: 40, right: 16, top: 16, bottom: 36 },
  xAxis: {
    type: 'value',
    name: 'Pessoas aguardando →',
    nameLocation: 'middle',
    nameGap: 24,
    nameTextStyle: { color: C.axis, fontSize: 10 },
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    name: 'TME atual (min)',
    nameTextStyle: { color: C.axis, fontSize: 10, align: 'left' },
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      type: 'scatter',
      symbolSize: (d: number[]) => 16 + d[2] / 3,
      label: {
        show: true,
        formatter: (p: { value: [number, number, number, string] }) =>
          `${p.value[3]} (SLA ${p.value[2]}%)`,
        position: 'right',
        fontSize: 10,
        color: C.axis,
      },
      data: filaScatter.map((f) => ({
        value: [f.pessoas, f.tme, f.sla, f.nome],
        itemStyle: { color: slaColor(f.sla), opacity: 0.8 },
      })),
    },
  ],
}))
</script>

<template>
  <div class="space-y-5">
    <!-- Gestão de Filas -->
    <SectionHeader
      title="Gestão de Filas"
      subtitle="Controle dos tempos de espera, ocupação e riscos operacionais."
      action-to="/gestor/ocorrencias?view=lista&stage=fila"
    />

    <!-- Métricas -->
    <div class="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
      <el-card
        v-for="m in filaMetrics"
        :key="m.label"
        shadow="never"
        body-class="!p-4"
        class="!border-ms-border-light"
      >
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          {{ m.label }}
        </div>
        <div class="mt-1 text-2xl font-bold" :class="metricTone[m.tone]">{{ m.value }}</div>
        <div class="mt-0.5 text-xs text-ms-text-secondary">{{ m.sub }}</div>
      </el-card>
    </div>

    <!-- Capacidade + ocupação + equipes -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard title="Capacidade Operacional" subtitle="atendentes logados / total">
        <div class="h-32 w-full">
          <VChart class="h-full w-full" :option="capacidadeOption" autoresize />
        </div>
        <div class="text-center">
          <div class="text-sm font-semibold text-ms-success">{{ capacidade.legend }}</div>
          <div class="text-xs text-ms-text-secondary">{{ capacidade.pausa }}</div>
        </div>
      </ChartCard>

      <ChartCard title="Ocupação por Fila" subtitle="% de uso da capacidade e TMEF · clique para detalhar">
        <BarList :items="ocupacaoFila" clickable @item-click="abrirFila" />
      </ChartCard>

      <ChartCard title="Status atual das equipes" subtitle="distribuição da operação agora">
        <div class="space-y-2.5">
          <div v-for="s in equipeStatus" :key="s.label" class="flex items-center justify-between">
            <span class="flex items-center gap-2 text-sm text-ms-text-regular">
              <span class="h-2.5 w-2.5 rounded-full" :class="dot[s.tone]" />{{ s.label }}
            </span>
            <b class="text-ms-text-primary">{{ s.value }}</b>
          </div>
        </div>
      </ChartCard>
    </div>

    <!-- Banner crítico -->
    <div
      class="flex items-center gap-2 rounded-lg border border-ms-danger/30 bg-ms-danger/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-danger">⊘</span>{{ bannerFilaWarn }}
    </div>

    <!-- Fila × TME -->
    <ChartCard
      title="Fila × TME por canal/equipe"
      subtitle="tamanho do ponto = % SLA cumprido · canto superior direito = risco iminente de SLA"
    >
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="filaScatterOption" autoresize />
      </div>
    </ChartCard>

    <!-- Banner info -->
    <div
      class="flex items-center gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-primary">◆</span>{{ bannerFilaInfo }}
    </div>
  </div>
</template>
