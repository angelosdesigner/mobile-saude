<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import VChart from 'vue-echarts'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import KpiStatCard from '@/components/gestor/KpiStatCard.vue'
import BarList from '@/components/gestor/BarList.vue'
import DataList from '@/components/ui/DataList.vue'
import RecomendacoesIA from '@/components/gestor/RecomendacoesIA.vue'
import IndicadorSelector from '@/components/gestor/IndicadorSelector.vue'
import PeriodoSelector from '@/components/gestor/PeriodoSelector.vue'
import StickyPeriodo from '@/components/gestor/StickyPeriodo.vue'
import { useChartColors } from '@/plugins/echarts'
import {
  periodos,
  contexto,
  indicadores,
  tiposOcorrencia,
  evolucao,
  evolucaoMetricas,
  ocorrencias,
  ocorrenciasColumns,
  diagnostico,
  recomendacoes,
  proximaAcao,
  type EvolucaoMetrica,
  type StatusOcorrencia,
} from '@/data/gestaoPerformanceAtendente'

const route = useRoute()
const C = useChartColors()

const periodoAtivo = ref<string>((route.query.periodo as string) ?? '7d')
const metrica = ref<EvolucaoMetrica>('Demanda')

const evolucaoOption = computed(() => {
  const isDemanda = metrica.value === 'Demanda'
  const linha = isDemanda ? evolucao.demanda : evolucao.tme
  const linhaNome = isDemanda ? 'Volume' : 'TME (min)'

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 36, right: 16, top: 20, bottom: 36 },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: { color: C.axis, fontSize: 11 },
      data: [linhaNome],
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
        name: linhaNome,
        type: 'bar',
        data: linha.map((v) => ({
          value: v,
          itemStyle: {
            color: isDemanda ? C.primary : v >= 12 ? C.danger : v >= 8 ? C.warning : C.success,
            borderRadius: [3, 3, 0, 0],
          },
        })),
        barWidth: '52%',
      },
    ],
  }
})

const statusStyle: Record<StatusOcorrencia, { text: string; dot: string }> = {
  Pendente: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Resolvida: { text: 'text-ms-success', dot: 'bg-ms-success' },
  Escalada: { text: 'text-ms-danger', dot: 'bg-ms-danger/60' },
}

const tmeTone = (v: number) => (v >= 12 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
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
      <el-breadcrumb-item :to="{ path: '/gestor/gestao-performance-atendentes' }">
        Performance por Atendente
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ route.query.atendente ?? contexto.titulo }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Header de contexto — padrão de detalhe do gestor -->
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
            <span class="text-ms-text-secondary">▦</span>
            {{ route.query.atendente ?? contexto.titulo }}
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
      Performance individual · vs média da equipe
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

    <!-- 2) Distribuição por tipo -->
    <ChartCard
      title="Ocorrências por tipo"
      subtitle="Distribuição no período selecionado"
      class="mb-5"
    >
      <BarList :items="tiposOcorrencia" :threshold-legend="false" />
    </ChartCard>

    <!-- 3) Evolução de volume / TME -->
    <ChartCard
      title="Evolução por dia"
      subtitle="Volume de ocorrências e TME ao longo da semana"
      class="mb-5"
    >
      <div class="mb-2">
        <IndicadorSelector v-model="metrica" label="Indicador:" :options="evolucaoMetricas" />
      </div>
      <div class="h-52 w-full">
        <VChart class="h-full w-full" :option="evolucaoOption" autoresize />
      </div>
    </ChartCard>

    <!-- 4) Histórico de ocorrências -->
    <ChartCard
      title="Histórico de ocorrências"
      subtitle="Todas as ocorrências do período · ordene por TME ou status"
      class="mb-5"
    >
      <DataList
        :columns="ocorrenciasColumns"
        :rows="ocorrencias"
        row-key="protocolo"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="ocorrências"
      >
        <template #cell-tme="{ row }">
          <span :class="tmeTone(row.tme as number)">{{ row.tme }}min</span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex items-center gap-1.5 text-xs font-semibold" :class="statusStyle[row.status as StatusOcorrencia].text">
            <span class="h-2 w-2 rounded-full" :class="statusStyle[row.status as StatusOcorrencia].dot" />
            {{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <!-- 5) Insights da IA -->
    <RecomendacoesIA
      subtitle="Ações de redistribuição · ordenadas por impacto"
      diagnostico-titulo="Diagnóstico de performance"
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
