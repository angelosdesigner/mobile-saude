<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import KpiStatCard from '@/components/gestor/KpiStatCard.vue'
import RecomendacoesIA from '@/components/gestor/RecomendacoesIA.vue'
import IndicadorSelector from '@/components/gestor/IndicadorSelector.vue'
import PeriodoSelector from '@/components/gestor/PeriodoSelector.vue'
import StickyPeriodo from '@/components/gestor/StickyPeriodo.vue'
import DataList from '@/components/ui/DataList.vue'
import { useChartColors } from '@/plugins/echarts'
import {
  periodos,
  contexto,
  indicadores,
  atendentesTabela,
  atendentesColumns,
  evolucao,
  evolucaoMetricas,
  correlacao,
  correlacaoColumns,
  comoInterpretar,
  diagnostico,
  recomendacoes,
  proximaAcao,
  type EvolucaoMetrica,
  type PerfStatus,
} from '@/data/gestaoPerformanceAtendentes'

const router = useRouter()
const C = useChartColors()

const periodoAtivo = ref<string>('7d')
const metrica = ref<EvolucaoMetrica>('Volume')

const statusTone: Record<PerfStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}

const tmeTone = (v: number) => (v >= 12 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')

const slaTone = (v: string) => {
  const n = parseInt(v)
  return n < 85 ? 'text-ms-danger font-medium' : 'text-ms-text-regular'
}

function goToAtendente(row: Record<string, unknown>) {
  router.push({
    path: '/gestor/gestao-performance-atendente',
    query: { atendente: row.nome as string, periodo: periodoAtivo.value },
  })
}

const evolucaoOption = computed(() => {
  const isVol = metrica.value === 'Volume'
  const isTme = metrica.value === 'TME'
  const dados = isVol ? evolucao.volume : isTme ? evolucao.tme : evolucao.sla
  const nome = metrica.value

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 36, right: 16, top: 20, bottom: 36 },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: [nome],
    },
    xAxis: {
      type: 'category',
      data: evolucao.dias,
      axisLabel: { color: C.axis, fontSize: 10 },
      axisLine: { lineStyle: { color: C.split } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: C.axis, fontSize: 10 },
      splitLine: { lineStyle: { color: C.split } },
    },
    series: [
      {
        name: nome,
        type: 'bar',
        data: dados.map((v, i) => ({
          value: v,
          itemStyle: {
            color: isVol
              ? i === evolucao.picoIdx
                ? C.danger
                : C.primary
              : isTme
                ? v >= 12
                  ? C.danger
                  : v >= 8
                    ? C.warning
                    : C.success
                : v < 85
                  ? C.danger
                  : v < 90
                    ? C.warning
                    : C.success,
            borderRadius: [3, 3, 0, 0],
          },
        })),
        barWidth: '52%',
        ...(isVol
          ? {
              markLine: {
                symbol: 'none',
                silent: true,
                data: [
                  {
                    xAxis: evolucao.dias[evolucao.picoIdx],
                    lineStyle: { color: C.danger, type: 'solid', width: 1.5 },
                    label: {
                      formatter: evolucao.picoLabel,
                      color: C.danger,
                      position: 'insideEndTop',
                      fontSize: 10,
                    },
                  },
                ],
              },
            }
          : {}),
      },
    ],
  }
})
</script>

<template>
  <DashboardLayout>
    <StickyPeriodo>
      <PeriodoSelector v-model="periodoAtivo" :options="periodos" />
    </StickyPeriodo>

    <!-- Breadcrumb -->
    <el-breadcrumb separator="/" class="mb-2">
      <el-breadcrumb-item :to="{ path: '/gestor/tempo-real' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/gestor/gestao-performance' }">
        Gestão e Performance
      </el-breadcrumb-item>
      <el-breadcrumb-item>Performance por Atendente</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Header de contexto -->
    <el-card shadow="never" body-class="!p-5" class="mb-5 overflow-hidden !border-ms-border-light">
      <div class="-mx-5 -mt-5 mb-4 h-1 bg-ms-warning" />
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 text-xs">
            <span class="flex items-center gap-1.5 font-bold uppercase tracking-wide text-ms-warning">
              <span class="h-2 w-2 rounded-full bg-ms-warning" />{{ contexto.badge }}
            </span>
            <span class="text-ms-text-secondary">· {{ contexto.resumo }}</span>
          </div>
          <h1 class="mt-2 flex items-center gap-2 text-2xl font-bold text-ms-text-primary">
            <span class="text-ms-text-secondary">▦</span>{{ contexto.titulo }}
          </h1>
          <p class="mt-1 text-sm text-ms-text-secondary">{{ contexto.subtitulo }}</p>
        </div>
      </div>
    </el-card>

    <!-- 1) Indicadores gerais -->
    <div class="mb-1 text-xs font-bold uppercase tracking-wide text-ms-text-secondary">
      Indicadores gerais · {{ periodoAtivo }}
    </div>
    <p class="mb-3 text-xs text-ms-text-secondary">
      Performance consolidada da equipe · vs período anterior e metas
    </p>
    <div class="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiStatCard
        v-for="k in indicadores"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
      />
    </div>

    <!-- 2) Tabela de atendentes -->
    <ChartCard
      title="Atendentes"
      subtitle="Performance individual · ordene por criticidade · clique em Visualizar para ver o detalhe"
      class="mb-5"
    >
      <DataList
        :columns="atendentesColumns"
        :rows="atendentesTabela"
        row-key="nome"
        :selectable="false"
        :expandable="false"
        :actions="true"
        count-label="atendentes"
        @visualizar="goToAtendente"
      >
        <template #cell-tme="{ row }">
          <span class="font-medium" :class="tmeTone(row.tme as number)">{{ row.tme }}min</span>
        </template>
        <template #cell-sla="{ row }">
          <span class="font-medium" :class="slaTone(row.sla as string)">{{ row.sla }}</span>
        </template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span
            class="flex items-center gap-1.5 text-xs font-semibold"
            :class="statusTone[row.status as PerfStatus].text"
          >
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as PerfStatus].dot" />
            {{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <!-- 3) Evolução por dia -->
    <ChartCard
      title="Evolução por dia"
      subtitle="Volume de ocorrências, TME médio e SLA ao longo do período"
      class="mb-5"
    >
      <div class="mb-2">
        <IndicadorSelector v-model="metrica" label="Indicador:" :options="evolucaoMetricas" />
      </div>
      <div class="h-64 w-full">
        <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
      </div>
    </ChartCard>

    <!-- 4) Correlação operacional -->
    <ChartCard
      title="Correlação operacional"
      subtitle="Atendente × Tipo predominante × TME × Pendentes × Gargalo"
      class="mb-3"
    >
      <DataList
        :columns="correlacaoColumns"
        :rows="correlacao"
        row-key="atendente"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="atendentes"
      >
        <template #cell-tme="{ row }">
          <span class="font-medium" :class="tmeTone(row.tme as number)">{{ row.tme }}min</span>
        </template>
        <template #cell-sla="{ row }">
          <span class="font-medium" :class="slaTone(row.sla as string)">{{ row.sla }}</span>
        </template>
        <template #cell-gargalo="{ row }">
          <span class="text-xs text-ms-text-regular">{{ row.gargalo }}</span>
        </template>
        <template #cell-status="{ row }">
          <span
            class="flex items-center gap-1.5 text-xs font-semibold"
            :class="statusTone[row.status as PerfStatus].text"
          >
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status as PerfStatus].dot" />
            {{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <div class="mb-5 flex items-start gap-2 rounded-lg border border-ms-border-light bg-ms-surface px-3 py-2.5">
      <span class="mt-0.5 text-ms-text-secondary">ℹ</span>
      <div class="text-xs text-ms-text-regular">
        <span class="font-semibold text-ms-text-primary">Como interpretar</span>
        <p class="mt-0.5 leading-relaxed">{{ comoInterpretar }}</p>
      </div>
    </div>

    <!-- 5) Insights da IA -->
    <RecomendacoesIA
      subtitle="Ações de redistribuição · ordenadas por impacto"
      diagnostico-titulo="Diagnóstico de performance da equipe"
      :confianca="diagnostico.confianca"
      :texto="diagnostico.texto"
      :recomendacoes="recomendacoes"
    />

    <!-- Rodapé -->
    <div class="mt-4 flex items-center justify-between text-xs">
      <router-link
        :to="{ path: '/gestor/gestao-performance' }"
        class="text-ms-primary no-underline hover:underline"
      >
        ← Voltar a Gestão e Performance
      </router-link>
      <span class="text-ms-text-secondary">
        Próxima ação prioritária:
        <span class="font-medium text-ms-warning">{{ proximaAcao }} →</span>
      </span>
    </div>
  </DashboardLayout>
</template>
