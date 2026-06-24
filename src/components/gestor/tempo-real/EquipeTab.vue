<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BarList from '@/components/gestor/BarList.vue'
import {
  equipeMetrics,
  eficiencia,
  rankings,
  equipeScatter,
  bannerEquipe,
  type EquipeTone,
} from '@/data/gestorEquipe'
import { useChartColors } from '@/plugins/echarts'

const router = useRouter()
const C = useChartColors()

// Drill-down: clique num atendente do ranking → ocorrências filtradas por ele.
function abrirAtendente(nome: string) {
  router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', atendente: nome } })
}
// Métricas agregadas da equipe → tela analítica de Desempenho da Equipe.
function abrirEquipeDetalhe() {
  router.push('/gestor/equipe-detalhe')
}
// Clique num ponto do scatter (cada ponto = um atendente) → ocorrências dele.
function abrirAtendenteScatter(params: { value?: unknown }) {
  const v = params?.value as [number, number, string, number] | undefined
  if (v && v[2]) abrirAtendente(v[2])
}

// Número das métricas (redesign minimalista): só o extremo ruim mantém realce;
// o estado positivo fica neutro.
const metricTone: Record<EquipeTone, string> = {
  success: 'text-ms-text-primary',
  danger: 'text-ms-danger',
}

const toneColor = computed<Record<'danger' | 'warning' | 'neutral' | 'success', string>>(() => ({
  danger: C.danger,
  warning: C.warning,
  neutral: C.neutral,
  success: C.success,
}))

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
        itemStyle: { color: toneColor.value[e.tone], opacity: 0.85 },
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
      action-to="/gestor/equipe-detalhe"
    />

    <!-- Métricas (alinhadas à esquerda, padrão da aba Gestão de filas) -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <el-card
        v-for="m in equipeMetrics"
        :key="m.label"
        shadow="never"
        body-class="!p-4"
        class="cursor-pointer !border-ms-border-light transition hover:shadow-md"
        @click="abrirEquipeDetalhe"
      >
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          {{ m.label }}
        </div>
        <div class="mt-1 text-2xl font-bold" :class="metricTone[m.tone]">{{ m.value }}</div>
        <div class="mt-0.5 text-xs text-ms-text-secondary">{{ m.sub }}</div>
      </el-card>
    </div>
    <div class="-mt-2 text-sm font-semibold text-ms-text-primary">
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
        <BarList
          :items="r.itens"
          :max="r.max"
          rank
          rank-hint
          clickable
          @item-click="abrirAtendente"
        />
      </ChartCard>
    </div>

    <!-- Dispersão ocupação × CSAT -->
    <ChartCard
      title="Ocupação × CSAT por atendente"
      subtitle="tamanho do ponto = reaberturas · clique num ponto para abrir o atendente"
    >
      <div class="h-72 w-full">
        <VChart
          class="h-full w-full cursor-pointer"
          :option="scatterOption"
          autoresize
          @click="abrirAtendenteScatter"
        />
      </div>
    </ChartCard>

    <div
      class="flex items-center gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-primary">◆</span>{{ bannerEquipe }}
    </div>
  </div>
</template>
