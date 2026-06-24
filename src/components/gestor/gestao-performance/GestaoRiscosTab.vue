<script setup lang="ts">
// SUBABA 2 · GESTÃO DE RISCOS — atuação preventiva (tela mais importante).
// Risk Center: 4 cards de risco regulatório + ranking Top 10 ocorrências críticas.
import { useRouter } from 'vue-router'
import ChartCard from '@/components/gestor/ChartCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import DataList from '@/components/ui/DataList.vue'
import {
  riskCards,
  top10Criticas,
  top10Columns,
  type RiscoNivel,
  type RiscoOcorrencia,
} from '@/data/gestaoPerformancePainel'

const router = useRouter()
// Drill-down: cada card de risco abre o Risk Center com o tipo pré-selecionado.
function abrirRisco(chave: string) {
  router.push({ path: '/gestor/risco-detalhe', query: { risco: chave } })
}

// Minimalista: card neutro + um dot de severidade como único acento; rótulo do
// nível colorido só em Crítico/Alto. Sem barra de topo nem borda colorida.
const nivelDot: Record<RiscoNivel, string> = {
  CRÍTICO: 'bg-ms-danger',
  ALTO: 'bg-ms-danger',
  MODERADO: 'bg-ms-warning',
  BAIXO: 'bg-ms-text-placeholder',
}
const nivelText: Record<RiscoNivel, string> = {
  CRÍTICO: 'text-ms-danger',
  ALTO: 'text-ms-danger',
  MODERADO: 'text-ms-warning',
  BAIXO: 'text-ms-text-secondary',
}

// Métricas: cor só em danger/warning (sinal real); sucesso/neutro ficam em tinta.
const metricTone: Record<string, string> = {
  danger: 'text-ms-danger font-semibold',
  warning: 'text-ms-warning font-semibold',
  success: 'text-ms-text-primary font-medium',
  neutral: 'text-ms-text-regular',
}

const riscoDot: Record<RiscoOcorrencia, string> = {
  Crítico: 'bg-ms-danger',
  Alto: 'bg-ms-warning',
  Moderado: 'bg-ms-text-placeholder',
  Baixo: 'bg-ms-text-placeholder',
}
const riscoText: Record<RiscoOcorrencia, string> = {
  Crítico: 'text-ms-danger font-semibold',
  Alto: 'text-ms-warning font-semibold',
  Moderado: 'text-ms-text-regular',
  Baixo: 'text-ms-text-secondary',
}
const vencTone = (h: number) =>
  h <= 6 ? 'text-ms-danger font-semibold' : h <= 24 ? 'text-ms-text-regular' : 'text-ms-text-regular'
</script>

<template>
  <div class="space-y-5">
    <!-- Risk Center -->
    <div>
      <SectionHeader
        title="Risk Center"
        subtitle="Riscos regulatórios priorizados · intervir antes do vencimento ANS"
        action-to="/gestor/risco-detalhe"
        class="mb-3"
      />
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <el-card
          v-for="r in riskCards"
          :key="r.chave"
          shadow="never"
          body-class="!p-4"
          class="flex cursor-pointer flex-col overflow-hidden !border-ms-border-light transition hover:shadow-md"
          role="button"
          :tabindex="0"
          @click="abrirRisco(r.chave)"
          @keydown.enter="abrirRisco(r.chave)"
        >
          <div class="mb-2 flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full" :class="nivelDot[r.nivel]" />
            <span class="text-2xs font-bold uppercase tracking-wide" :class="nivelText[r.nivel]">{{ r.nivel }}</span>
          </div>
          <p class="text-sm font-bold leading-snug text-ms-text-primary">{{ r.titulo }}</p>
          <p class="mt-1 text-2xs leading-relaxed text-ms-text-secondary">{{ r.descricao }}</p>

          <dl class="mt-3 space-y-2 border-t border-ms-border-light pt-3">
            <div v-for="m in r.metricas" :key="m.label" class="flex items-center justify-between gap-2">
              <dt class="text-2xs text-ms-text-secondary">{{ m.label }}</dt>
              <dd class="text-xs" :class="metricTone[m.tone ?? 'neutral']">{{ m.value }}</dd>
            </div>
          </dl>
        </el-card>
      </div>
    </div>

    <!-- Top 10 ocorrências mais críticas -->
    <ChartCard
      title="Top 10 ocorrências mais críticas"
      subtitle="Maior risco regulatório ativo · ordenadas por proximidade do vencimento"
    >
      <DataList
        :columns="top10Columns"
        :rows="top10Criticas"
        row-key="protocolo"
        :selectable="false"
        :expandable="false"
        :actions="false"
        count-label="ocorrências"
      >
        <template #cell-vencimento="{ row }">
          <span :class="vencTone(row.vencHoras as number)">{{ row.vencimento }}</span>
        </template>
        <template #cell-risco="{ row }">
          <span class="inline-flex items-center gap-1.5 text-xs" :class="riscoText[row.risco as RiscoOcorrencia]">
            <span class="h-2 w-2 rounded-full" :class="riscoDot[row.risco as RiscoOcorrencia]" />{{ row.risco }}
          </span>
        </template>
      </DataList>
    </ChartCard>
  </div>
</template>
