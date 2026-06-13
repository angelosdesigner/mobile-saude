<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'
import {
  demandaHora,
  heatmapSlots,
  heatmapDias,
  turnos,
  remanejamento,
  demandaTme,
  inflexao,
  bannerPerfWarn,
  bannerPerfCrit,
  bannerPerfInfo,
  type TurnoStatus,
} from '@/data/gestorPerformance'

const { comingSoon } = useActionFeedback()

const C = {
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  axis: '#909399',
  split: 'rgba(144,147,153,0.15)',
}

// Cor da barra conforme a relação volume × capacidade.
const barColor = (v: number) => {
  if (v > demandaHora.capacidade * 1.15) return C.danger
  if (v >= demandaHora.capacidade * 0.85) return C.warning
  return C.success
}

const demandaOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 30, right: 10, top: 12, bottom: 28 },
  xAxis: {
    type: 'category',
    data: demandaHora.horas,
    axisLabel: { color: C.axis, fontSize: 10, interval: 0 },
    axisLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: C.axis },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      name: 'Volume de chamados',
      type: 'bar',
      data: demandaHora.volume.map((v) => ({ value: v, itemStyle: { color: barColor(v), borderRadius: [3, 3, 0, 0] } })),
    },
    {
      name: 'Capacidade',
      type: 'line',
      step: 'middle',
      symbol: 'none',
      data: demandaHora.horas.map(() => demandaHora.capacidade),
      lineStyle: { color: '#303133', width: 2 },
      z: 5,
    },
  ],
}))

const heatColor = (v: number) => {
  if (v >= 95) return 'bg-ms-danger/80 text-white'
  if (v >= 85) return 'bg-ms-danger/50 text-ms-text-primary'
  if (v >= 75) return 'bg-ms-warning/50 text-ms-text-primary'
  if (v >= 60) return 'bg-ms-warning/25 text-ms-text-regular'
  return 'bg-ms-success/25 text-ms-text-regular'
}

const turnoStyle: Record<TurnoStatus, { card: string; dot: string; badge: string; detail: string }> = {
  atencao: {
    card: 'border-ms-warning/30 bg-ms-warning/5',
    dot: 'bg-ms-warning',
    badge: 'text-ms-warning',
    detail: 'text-ms-warning',
  },
  critico: {
    card: 'border-ms-danger/30 bg-ms-danger/5',
    dot: 'bg-ms-danger',
    badge: 'text-ms-danger',
    detail: 'text-ms-danger',
  },
  equilibrado: {
    card: 'border-ms-success/30 bg-ms-success/5',
    dot: 'bg-ms-success',
    badge: 'text-ms-success',
    detail: 'text-ms-success',
  },
}

const tmeColor = (tme: number) => (tme >= 10 ? C.danger : tme >= 7 ? C.warning : C.success)

const scatterOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: (p: { value: [number, number, string] }) =>
      `${p.value[2]}<br/>Demanda ${p.value[0]} chamados/h · TME ${p.value[1]}min`,
  },
  grid: { left: 44, right: 16, top: 16, bottom: 36 },
  xAxis: {
    type: 'value',
    name: 'Demanda (chamados/hora) →',
    nameLocation: 'middle',
    nameGap: 24,
    nameTextStyle: { color: C.axis, fontSize: 10 },
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  yAxis: {
    type: 'value',
    name: 'TME (min)',
    nameTextStyle: { color: C.axis, fontSize: 10, align: 'left' },
    axisLabel: { color: C.axis, fontSize: 10 },
    splitLine: { lineStyle: { color: C.split } },
  },
  series: [
    {
      type: 'scatter',
      symbolSize: 16,
      label: {
        show: true,
        formatter: (p: { value: [number, number, string] }) => p.value[2],
        position: 'right',
        fontSize: 10,
        color: C.axis,
      },
      data: demandaTme.map((d) => ({
        value: [d.demanda, d.tme, d.hora],
        itemStyle: { color: tmeColor(d.tme), opacity: 0.85 },
      })),
      markLine: {
        symbol: 'none',
        silent: true,
        label: {
          formatter: `inflexão ~${inflexao}/h`,
          color: C.danger,
          fontSize: 10,
        },
        lineStyle: { color: C.danger, type: 'dashed', width: 1.5 },
        data: [{ xAxis: inflexao }],
      },
    },
  ],
}))
</script>

<template>
  <div class="space-y-5">
    <SectionHeader
      title="Gestão de Performance e Capacidade"
      subtitle="Monitoramento da produtividade e dimensionamento da operação."
    />

    <!-- Demanda × capacidade / heatmap + turnos -->
    <div class="grid gap-4 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <ChartCard
          title="Demanda vs Capacidade por Hora"
          subtitle="barras = volume de chamados · linha preta = atendentes disponíveis"
        >
          <div class="h-52 w-full">
            <VChart class="h-full w-full" :option="demandaOption" autoresize />
          </div>
          <div class="mt-1 flex flex-wrap gap-3 text-[11px] text-ms-text-secondary">
            <span class="flex items-center gap-1"
              ><span class="h-2 w-2 rounded-sm bg-ms-success" />Demanda equilibrada</span
            >
            <span class="flex items-center gap-1"
              ><span class="h-2 w-2 rounded-sm bg-ms-warning" />Pressão (&gt;85% cap.)</span
            >
            <span class="flex items-center gap-1"
              ><span class="h-2 w-2 rounded-sm bg-ms-danger" />Saturado (&gt; cap.)</span
            >
            <span class="flex items-center gap-1"
              ><span class="h-0.5 w-3 bg-[#303133]" />Capacidade</span
            >
          </div>
        </ChartCard>

        <ChartCard
          title="Carga por Dia × Faixa Horária (últimos 7 dias)"
          subtitle="intensidade da carga (% ocupação)"
        >
          <div class="overflow-x-auto">
            <div class="min-w-[420px]">
              <div
                class="grid items-center gap-1 text-center text-[10px] text-ms-text-secondary"
                :style="{ gridTemplateColumns: `36px repeat(${heatmapSlots.length}, 1fr)` }"
              >
                <span />
                <span v-for="s in heatmapSlots" :key="s">{{ s }}</span>
              </div>
              <div
                v-for="row in heatmapDias"
                :key="row.dia"
                class="mt-1 grid items-center gap-1"
                :style="{ gridTemplateColumns: `36px repeat(${heatmapSlots.length}, 1fr)` }"
              >
                <span class="text-[11px] font-medium text-ms-text-regular">{{ row.dia }}</span>
                <span
                  v-for="(v, i) in row.valores"
                  :key="i"
                  class="rounded py-1.5 text-center text-[11px] font-semibold"
                  :class="heatColor(v)"
                  >{{ v }}%</span
                >
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <!-- Turnos de trabalho -->
      <ChartCard title="Turnos de Trabalho" subtitle="capacidade × carga média por turno">
        <div class="space-y-3">
          <div
            v-for="t in turnos"
            :key="t.nome"
            class="rounded-lg border p-3"
            :class="turnoStyle[t.status].card"
          >
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
                <span class="h-2.5 w-2.5 rounded-full" :class="turnoStyle[t.status].dot" />
                {{ t.nome }} ({{ t.horario }})
              </span>
              <span
                v-if="t.badge"
                class="text-[10px] font-bold uppercase tracking-wide"
                :class="turnoStyle[t.status].badge"
                >{{ t.badge }}</span
              >
            </div>
            <div class="mt-1.5 flex gap-4 text-xs text-ms-text-regular">
              <span>Atendentes: <b class="text-ms-text-primary">{{ t.atendentes }}</b></span>
              <span>Carga média: <b class="text-ms-text-primary">{{ t.cargaMedia }}</b></span>
            </div>
            <div class="mt-1.5 text-xs font-medium" :class="turnoStyle[t.status].detail">
              {{ t.sugestao }}
            </div>
            <div class="mt-0.5 text-[11px] text-ms-text-secondary">{{ t.detalhe }}</div>
          </div>

          <div class="rounded-lg border border-ms-primary/20 bg-ms-primary/5 p-3">
            <div class="text-sm font-semibold text-ms-primary">{{ remanejamento.titulo }}</div>
            <p class="mt-1 text-xs text-ms-text-regular">{{ remanejamento.texto }}</p>
            <p class="mt-1 text-xs font-semibold text-ms-primary">{{ remanejamento.impacto }}</p>
          </div>
        </div>
      </ChartCard>
    </div>

    <!-- Banner SLA reembolso -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ms-warning/30 bg-ms-warning/5 px-3 py-2.5"
    >
      <div class="flex items-start gap-2 text-sm text-ms-text-regular">
        <span class="text-ms-warning">⚠</span>
        <span>
          <b class="text-ms-text-primary">{{ bannerPerfWarn.titulo }}</b>
          <span class="block text-xs text-ms-text-secondary">{{ bannerPerfWarn.detalhe }}</span>
        </span>
      </div>
      <div class="flex gap-2">
        <el-button size="small" @click="comingSoon('Ver causa')">Ver causa</el-button>
        <el-button size="small" type="primary" @click="comingSoon('Criar ação')"
          >Criar ação</el-button
        >
      </div>
    </div>

    <!-- Banner crítico -->
    <div
      class="flex items-center gap-2 rounded-lg border border-ms-danger/30 bg-ms-danger/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-danger">⊘</span>{{ bannerPerfCrit }}
    </div>

    <!-- Dispersão demanda × TME -->
    <ChartCard
      title="Demanda × TME por hora do dia"
      subtitle="cada ponto = uma hora · ponto de inflexão revela quando o SLA degrada"
    >
      <div class="h-72 w-full">
        <VChart class="h-full w-full" :option="scatterOption" autoresize />
      </div>
    </ChartCard>

    <div
      class="flex items-center gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-primary">◆</span>{{ bannerPerfInfo }}
    </div>
  </div>
</template>
