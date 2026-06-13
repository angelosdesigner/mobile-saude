<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import KanbanBoard from '@/components/ui/KanbanBoard.vue'
import KanbanCard from '@/components/ui/KanbanCard.vue'
import ChannelTag from '@/components/ui/ChannelTag.vue'
import type { KanbanColumn } from '@/components/ui/kanbanBoard'
import { useGestorOcorrenciasStore } from '@/stores/gestorOcorrencias'
import { stages, type PillTone, type SlaState } from '@/types/gestorOcorrencias'

const store = useGestorOcorrenciasStore()
const { board, headerByStage } = storeToRefs(store)

// Colunas do quadro (header padronizado pelo KanbanBoard); sub-contagens reais.
const columns = computed<KanbanColumn[]>(() =>
  stages.map((s) => ({
    key: s.key,
    label: s.label,
    tone: s.tone,
    meta: [
      { label: 'TOTAL', value: headerByStage.value[s.key]?.total ?? 0 },
      {
        label: headerByStage.value[s.key]?.metaLabel ?? '',
        value: headerByStage.value[s.key]?.metaValue ?? '',
      },
    ],
  })),
)

const pillClass: Record<PillTone, string> = {
  primary: 'bg-ms-primary-light text-ms-primary',
  info: 'bg-ms-fill-light text-ms-text-secondary',
  warning: 'bg-ms-warning/10 text-ms-warning',
  success: 'bg-ms-success/10 text-ms-success',
}
const slaClass: Record<SlaState, string> = {
  Dentro: 'text-ms-success',
  Atenção: 'text-ms-warning',
  Limite: 'text-ms-warning',
  Estourou: 'text-ms-danger',
}
const slaDot: Record<SlaState, string> = {
  Dentro: 'bg-ms-success',
  Atenção: 'bg-ms-warning',
  Limite: 'bg-ms-warning',
  Estourou: 'bg-ms-danger',
}
</script>

<template>
  <KanbanBoard :columns="columns" :groups="board">
    <template #card="{ item }">
      <KanbanCard :highlight="item.destaque || item.risco">
        <!-- Título + indicador por estágio -->
        <div class="flex items-start justify-between gap-2">
          <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{
            item.beneficiary
          }}</span>
          <span
            v-if="item.stage === 'fila' && item.pill"
            class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
            :class="pillClass[item.pill.tone]"
            >{{ item.pill.label }}</span
          >
          <span
            v-else-if="item.stage === 'humano' && item.sla"
            class="flex shrink-0 items-center gap-1 text-[11px] font-medium"
            :class="slaClass[item.sla]"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="slaDot[item.sla]" />{{ item.sla }}
          </span>
          <span
            v-else-if="item.stage === 'concluido'"
            class="shrink-0 text-[11px] text-ms-text-secondary"
            >Concluído {{ item.concluidoHora }}</span
          >
        </div>

        <!-- Corpo por estágio -->
        <div class="mt-2 space-y-0.5 text-xs text-ms-text-regular">
          <template v-if="item.stage === 'automatizado'">
            <div>
              Fluxo: <span class="text-ms-text-secondary">{{ item.fluxo }}</span>
            </div>
            <div
              v-if="item.flag"
              class="mt-1 inline-block rounded bg-ms-fill-light px-1.5 py-0.5 text-[11px] text-ms-text-secondary"
            >
              {{ item.flag }}
            </div>
          </template>
          <template v-else-if="item.stage === 'fila'">
            <div>
              Fila: <span class="text-ms-text-secondary">{{ item.filaTipo }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                >Posição: <b class="text-ms-text-primary">{{ item.posicao }}º</b></span
              >
              <span class="text-ms-text-placeholder">·</span>
              <span class="text-ms-warning">{{ item.espera }}</span>
            </div>
          </template>
          <template v-else-if="item.stage === 'humano'">
            <div>
              Atendente: <span class="text-ms-text-secondary">{{ item.atendente }}</span>
            </div>
            <div>
              Tempo: <span class="text-ms-text-secondary">{{ item.tempoAtendimento }}</span>
            </div>
          </template>
          <template v-else>
            <div>
              Atendente: <span class="text-ms-text-secondary">{{ item.atendente }}</span>
            </div>
            <div>
              Total: <span class="text-ms-text-secondary">{{ item.total }}</span>
            </div>
          </template>
        </div>

        <!-- Risco -->
        <div
          v-if="item.risco"
          class="mt-2 inline-flex items-center rounded border border-ms-danger px-1.5 py-0.5 text-[11px] font-medium uppercase text-ms-danger"
        >
          Risco jurídico
        </div>

        <!-- Rodapé: canal -->
        <template #footer>
          <ChannelTag :channel="item.channel" />
        </template>
      </KanbanCard>
    </template>
  </KanbanBoard>
</template>
