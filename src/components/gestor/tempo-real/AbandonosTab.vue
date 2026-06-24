<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import IndicadoresGerais from '@/components/gestor/IndicadoresGerais.vue'
import DataList from '@/components/ui/DataList.vue'
import type { DataListColumn } from '@/components/ui/dataList'
import {
  porCanal,
  porFluxoBot,
  comparativo,
  abandonoScatter,
  bannerAbandono,
  indicadoresGerais,
  filasAbandono,
  type AbandonoStatus,
} from '@/data/gestorAbandonos'
import { useChartColors } from '@/plugins/echarts'
import { canalCor, normalizeCanal, normalizeFila } from '@/data/gestorTaxonomia'

const C = useChartColors()
const router = useRouter()

// Drill-down (3 níveis): indicador/gráfico → fila (agrupador) → Ocorrências
// filtradas (registro/protocolo → jornada). Reusa a lista canônica de Ocorrências.
function abrirFila(fila: string) {
  router.push({ path: '/gestor/ocorrencias', query: { view: 'lista', fila: normalizeFila(fila) } })
}
function abrirCanal(params: { name?: string }) {
  if (params?.name)
    router.push({
      path: '/gestor/ocorrencias',
      query: { view: 'lista', canal: normalizeCanal(params.name) },
    })
}
// Clique num ponto do scatter (cada ponto = uma fila) → Ocorrências da fila.
function abrirScatter(params: { value?: unknown }) {
  const v = params?.value as [number, number, number, string] | undefined
  if (v && v[3]) abrirFila(v[3])
}

// ── Tabela "Filas de abandono" (agrupador) ───────────────────────────────────
const statusOrder: Record<AbandonoStatus, number> = { OK: 0, Médio: 1, Alto: 2, Crítico: 3 }
const filaColumns: DataListColumn[] = [
  { key: 'fila', label: 'Fila', minWidth: 200, sortable: true },
  { key: 'abandonos', label: 'Abandonos', align: 'right', width: 120, sortable: true },
  { key: 'bot', label: 'Aband. BOT', align: 'right', width: 120, sortBy: (r) => r.bot as number },
  { key: 'humana', label: 'Aband. humana', align: 'right', width: 140, sortBy: (r) => r.humana as number },
  { key: 'origem', label: 'Origem', width: 110 },
  { key: 'status', label: 'Status', width: 120, sortBy: (r) => statusOrder[r.status as AbandonoStatus] },
]
const statusTone: Record<AbandonoStatus, { text: string; dot: string }> = {
  Crítico: { text: 'text-ms-danger', dot: 'bg-ms-danger' },
  Alto: { text: 'text-ms-warning', dot: 'bg-ms-warning' },
  Médio: { text: 'text-ms-warning', dot: 'bg-ms-warning/60' },
  OK: { text: 'text-ms-success', dot: 'bg-ms-success' },
}
const origemTone: Record<'BOT' | 'Humano' | 'Misto', string> = {
  BOT: 'text-ms-primary',
  Humano: 'text-ms-success',
  Misto: 'text-ms-text-secondary',
}
const botTone = (v: number) => (v >= 10 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')
const humanaTone = (v: number) => (v >= 10 ? 'text-ms-danger font-medium' : 'text-ms-text-regular')

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
        itemStyle: { color: canalCor(i.name, C) },
      })),
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
    <!-- Indicadores gerais -->
    <IndicadoresGerais :items="indicadoresGerais" />

    <SectionHeader
      title="Gestão de Abandono"
      subtitle="Monitoramento das desistências e identificação de pontos críticos da jornada."
      action-to="/gestor/abandonos-detalhe"
    />

    <!-- Filas de abandono (agrupador) — total · % no BOT · % no humano (sem volume).
         Clique numa fila para abrir os protocolos que compõem o número. -->
    <ChartCard
      title="Filas de abandono"
      subtitle="Onde o beneficiário desiste · por fila · clique numa fila para abrir os protocolos"
    >
      <DataList
        :columns="filaColumns"
        :rows="filasAbandono"
        row-key="fila"
        :selectable="false"
        :expandable="false"
        :actions="false"
        :paginated="false"
        count-label="filas"
      >
        <template #cell-fila="{ row }">
          <button
            class="text-left text-sm font-medium text-ms-primary hover:underline"
            @click="abrirFila(row.fila)"
          >
            {{ row.fila }}
          </button>
        </template>
        <template #cell-bot="{ row }">
          <span class="font-medium" :class="botTone(row.bot)">{{ row.bot }}%</span>
        </template>
        <template #cell-humana="{ row }">
          <span class="font-medium" :class="humanaTone(row.humana)">{{ row.humana }}%</span>
        </template>
        <template #cell-origem="{ row }">
          <span class="text-xs font-semibold" :class="origemTone[row.origem]">{{ row.origem }}</span>
        </template>
        <template #cell-status="{ row }">
          <span
            class="flex items-center gap-1.5 text-xs font-semibold"
            :class="statusTone[row.status].text"
          >
            <span class="h-2 w-2 rounded-full" :class="statusTone[row.status].dot" />{{ row.status }}
          </span>
        </template>
      </DataList>
    </ChartCard>

    <!-- Por canal / comparativo / etapas no BOT -->
    <div class="grid gap-4 lg:grid-cols-3">
      <ChartCard
        title="Por Canal"
        :subtitle="`Total: ${porCanal.total} abandonos · clique numa fatia para detalhar`"
      >
        <div class="relative h-36 w-full">
          <VChart
            class="h-full w-full cursor-pointer"
            :option="canalOption"
            autoresize
            @click="abrirCanal"
          />
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
              <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: canalCor(i.name, C) }" />{{
                i.name
              }}
            </span>
            <span class="font-medium text-ms-text-primary">{{ i.pct }} · {{ i.value }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Comparativo: Abandono BOT vs Humano"
        :subtitle="`Distribuição dos ${comparativo.total} casos de abandono`"
      >
        <div class="flex items-center justify-center gap-6 py-2">
          <div class="text-center">
            <div
              class="relative mx-auto h-20 w-20 rounded-full"
              :style="ringStyle(comparativo.bot.pct, C.primary)"
            >
              <div
                class="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-ms-surface"
              >
                <span class="text-2xs font-semibold uppercase text-ms-text-secondary"
                  >BOT {{ comparativo.bot.pct }}%</span
                >
                <span class="text-xl font-bold text-ms-primary">{{ comparativo.bot.casos }}</span>
              </div>
            </div>
          </div>
          <span class="text-sm font-medium text-ms-text-secondary">VS</span>
          <div class="text-center">
            <div
              class="relative mx-auto h-20 w-20 rounded-full"
              :style="ringStyle(comparativo.humano.pct, C.success)"
            >
              <div
                class="absolute inset-[6px] flex flex-col items-center justify-center rounded-full bg-ms-surface"
              >
                <span class="text-2xs font-semibold uppercase text-ms-text-secondary"
                  >Humano {{ comparativo.humano.pct }}%</span
                >
                <span class="text-xl font-bold text-ms-success">{{ comparativo.humano.casos }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto space-y-1 border-t border-ms-border-lighter pt-2 text-xs">
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">Humano abandona</span>
            <span class="font-semibold text-ms-text-primary">{{ comparativo.mult }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">TME desistência médio</span>
            <span class="text-ms-text-primary"
              >BOT {{ comparativo.tmeBot }} · Humano {{ comparativo.tmeHumano }}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-ms-text-secondary">Insight</span>
            <span class="text-ms-text-primary">{{ comparativo.insight }}</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Etapas de abandono no BOT" subtitle="etapa do fluxo onde o cliente desiste">
        <div class="space-y-2.5">
          <div v-for="f in porFluxoBot" :key="f.label">
            <div class="flex items-center justify-between text-xs">
              <span class="truncate pr-2 text-ms-text-regular">{{ f.label }}</span>
              <span class="font-medium text-ms-text-primary">{{ f.value }}%</span>
            </div>
            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
              <div
                class="h-full rounded-full bg-ms-text-placeholder"
                :style="{ width: `${f.value * 5}%` }"
              />
            </div>
          </div>
        </div>
      </ChartCard>
    </div>

    <!-- Scatter diagnóstico (por fila) -->
    <ChartCard
      title="Filas de abandono — BOT × Humano"
      subtitle="tamanho do ponto = volume da fila · clique num ponto para abrir a fila"
    >
      <div class="h-72 w-full">
        <VChart
          class="h-full w-full cursor-pointer"
          :option="abandonoScatterOption"
          autoresize
          @click="abrirScatter"
        />
      </div>
    </ChartCard>

    <div
      class="flex items-center gap-2 rounded-lg border border-ms-primary/20 bg-ms-primary/5 px-3 py-2.5 text-sm text-ms-text-regular"
    >
      <span class="text-ms-primary">◆</span>{{ bannerAbandono }}
    </div>
  </div>
</template>
