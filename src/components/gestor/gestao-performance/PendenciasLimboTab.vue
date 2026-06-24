<script setup lang="ts">
// SUBABA 4 · PENDÊNCIAS E LIMBO — identificar tickets esquecidos.
// KPIs do limbo + distribuição por categoria + mapa de responsabilidade +
// visão por setor + insights.
import { useRouter } from 'vue-router'
import KpiStatCard from '@/components/gestor/KpiStatCard.vue'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import DataList from '@/components/ui/DataList.vue'
import {
  limboKpis,
  limboDistribuicao,
  limboResponsaveis,
  limboSetores,
  limboColumns,
} from '@/data/gestaoPerformancePainel'

const router = useRouter()
// Drill-down: cada categoria abre o detalhe do limbo já filtrado.
function abrirLimbo(cat: string) {
  router.push({ path: '/gestor/limbo-detalhe', query: { cat } })
}

// Minimalista: barras em tom único neutro; cor só no valor da categoria crítica.
const catTone: Record<string, { bar: string; text: string }> = {
  danger: { bar: 'bg-ms-text-placeholder', text: 'text-ms-danger' },
  warning: { bar: 'bg-ms-text-placeholder', text: 'text-ms-text-primary' },
  neutral: { bar: 'bg-ms-text-placeholder', text: 'text-ms-text-regular' },
}
const maxCat = Math.max(...limboDistribuicao.map((c) => c.valor))

// Avatares e barras neutros — a ordem do ranking já comunica a concentração.
const respTone: Record<string, { avatar: string; bar: string }> = {
  danger: { avatar: 'bg-ms-fill-light text-ms-text-secondary', bar: 'bg-ms-text-placeholder' },
  warning: { avatar: 'bg-ms-fill-light text-ms-text-secondary', bar: 'bg-ms-text-placeholder' },
  success: { avatar: 'bg-ms-fill-light text-ms-text-secondary', bar: 'bg-ms-text-placeholder' },
}
const maxResp = Math.max(...limboResponsaveis.map((r) => r.quantidade))

// Só o volume realmente alto (>=20) recebe cor.
const pendTone = (n: number) =>
  n >= 20 ? 'text-ms-danger font-semibold' : 'text-ms-text-regular'
</script>

<template>
  <div class="space-y-5">
    <!-- KPIs do limbo -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <KpiStatCard
        v-for="k in limboKpis"
        :key="k.label"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :status="k.status"
        :delta="k.delta"
        :delta-tone="k.deltaTone"
      />
    </div>

    <!-- Distribuição por categoria + Mapa de responsabilidade -->
    <div class="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Distribuição por categoria"
        subtitle="Onde os tickets estão congelados"
      >
        <div class="space-y-4">
          <button
            v-for="c in limboDistribuicao"
            :key="c.categoria"
            type="button"
            class="-mx-2 block w-[calc(100%+1rem)] rounded-md px-2 py-1 text-left transition hover:bg-ms-fill-light"
            @click="abrirLimbo(c.cat)"
          >
            <div class="mb-1 flex items-baseline justify-between gap-2">
              <span class="text-xs text-ms-text-regular">{{ c.categoria }}</span>
              <span class="text-sm font-bold" :class="catTone[c.tone].text"
                >{{ c.valor }} <span class="text-2xs font-normal text-ms-text-secondary">· {{ c.pct }}% do limbo</span></span
              >
            </div>
            <div class="h-2.5 overflow-hidden rounded-full bg-ms-fill-light">
              <div class="h-full rounded-full" :class="catTone[c.tone].bar" :style="{ width: `${(c.valor / maxCat) * 100}%` }" />
            </div>
            <p class="mt-1 text-2xs text-ms-text-secondary">{{ c.descricao }}</p>
          </button>
        </div>
      </ChartCard>

      <ChartCard
        title="Mapa de responsabilidade"
        subtitle="Quem detém o maior volume parado (gaveta)"
      >
        <ul class="space-y-3">
          <li v-for="r in limboResponsaveis" :key="r.atendente" class="flex items-center gap-3">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-2xs font-bold"
              :class="respTone[r.tone].avatar"
              >{{ r.avatar }}</span
            >
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline justify-between gap-2">
                <span class="truncate text-xs font-medium text-ms-text-primary">{{ r.atendente }}</span>
                <span class="shrink-0 text-2xs text-ms-text-secondary">aging {{ r.aging }}</span>
              </div>
              <div class="mt-1 flex items-center gap-2">
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-ms-fill-light">
                  <div
                    class="h-full rounded-full"
                    :class="respTone[r.tone].bar"
                    :style="{ width: `${(r.quantidade / maxResp) * 100}%` }"
                  />
                </div>
                <span class="w-16 shrink-0 text-right text-xs font-semibold text-ms-text-primary"
                  >{{ r.quantidade }} tickets</span
                >
              </div>
            </div>
          </li>
        </ul>
      </ChartCard>
    </div>

    <!-- Visão por setor -->
    <div>
      <SectionHeader
        title="Visão por setor"
        subtitle="Onde o gargalo de retorno está concentrado · quem é o responsável crítico"
        action-to="/gestor/limbo-detalhe"
        class="mb-3"
      />
      <ChartCard title="Pendências por setor" subtitle="setor · pendências · aging · responsável crítico">
        <DataList
          :columns="limboColumns"
          :rows="limboSetores"
          row-key="setor"
          :selectable="false"
          :expandable="false"
          :actions="false"
          count-label="setores"
        >
          <template #cell-pendencias="{ row }">
            <span :class="pendTone(row.pendencias as number)">{{ row.pendencias }}</span>
          </template>
        </DataList>
      </ChartCard>
    </div>
  </div>
</template>
