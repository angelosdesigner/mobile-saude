<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGestorOcorrenciasStore } from '@/stores/gestorOcorrencias'
import { stages, type StageTone, type PillTone, type SlaState } from '@/types/gestorOcorrencias'

const store = useGestorOcorrenciasStore()
const { board, headerByStage } = storeToRefs(store)

// Mapas tom → classe (strings completas para o Tailwind detectar na compilação).
const accentBar: Record<StageTone, string> = {
  primary: 'bg-ms-primary',
  warning: 'bg-ms-warning',
  teal: 'bg-ms-teal',
  success: 'bg-ms-success',
}
const badgeBg: Record<StageTone, string> = {
  primary: 'bg-ms-primary',
  warning: 'bg-ms-warning',
  teal: 'bg-ms-teal',
  success: 'bg-ms-success',
}

const pillClass: Record<PillTone, string> = {
  primary: 'bg-ms-primary-light text-ms-primary',
  info: 'bg-ms-fill-light text-ms-text-secondary',
  warning: 'bg-[#FDF6EC] text-ms-warning',
  success: 'bg-[#F0F9EB] text-ms-success',
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

const channelColor = (c: string) => (/whats/i.test(c) ? '#25D366' : '#909399')
</script>

<template>
  <div v-drag-scroll class="flex gap-4 overflow-x-auto pb-2">
    <div v-for="s in stages" :key="s.key" class="flex w-[300px] shrink-0 flex-col">
      <!-- Acento + header da coluna -->
      <div class="overflow-hidden rounded-t-lg">
        <div class="h-1" :class="accentBar[s.tone]" />
      </div>
      <div class="rounded-b-lg border border-t-0 border-ms-border-light bg-white px-3 py-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-ms-text-primary">{{ s.label }}</span>
            <span
              class="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white"
              :class="badgeBg[s.tone]"
              >{{ board[s.key].length }}</span
            >
          </div>
          <AppIcon name="chevron-down" class="h-4 w-4 text-ms-text-placeholder" />
        </div>
        <div class="mt-1 flex items-center gap-3 text-[11px] text-ms-text-secondary">
          <span
            >TOTAL <b class="text-ms-text-regular">{{ headerByStage[s.key]?.total }}</b></span
          >
          <span
            >{{ headerByStage[s.key]?.metaLabel }}
            <b class="text-ms-text-regular">{{ headerByStage[s.key]?.metaValue }}</b></span
          >
        </div>
      </div>

      <!-- Cards -->
      <div class="mt-3 flex flex-1 flex-col gap-3">
        <div
          v-for="c in board[s.key]"
          :key="c.id"
          class="rounded-lg border bg-white p-3 shadow-sm transition hover:shadow-md"
          :class="c.destaque ? 'border-ms-danger' : 'border-ms-border-light'"
        >
          <!-- Linha do título -->
          <div class="flex items-start justify-between gap-2">
            <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{
              c.beneficiary
            }}</span>

            <!-- Automatizado: nada / Fila: pílula / Humano: SLA / Concluído: hora -->
            <span
              v-if="c.stage === 'fila' && c.pill"
              class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
              :class="pillClass[c.pill.tone]"
              >{{ c.pill.label }}</span
            >
            <span
              v-else-if="c.stage === 'humano' && c.sla"
              class="flex shrink-0 items-center gap-1 text-[11px] font-medium"
              :class="slaClass[c.sla]"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="slaDot[c.sla]" />{{ c.sla }}
            </span>
            <span
              v-else-if="c.stage === 'concluido'"
              class="shrink-0 text-[11px] text-ms-text-secondary"
              >Concluído {{ c.concluidoHora }}</span
            >
          </div>

          <!-- Corpo por estágio -->
          <div class="mt-2 space-y-0.5 text-xs text-ms-text-regular">
            <template v-if="c.stage === 'automatizado'">
              <div>
                Fluxo: <span class="text-ms-text-secondary">{{ c.fluxo }}</span>
              </div>
              <div
                v-if="c.flag"
                class="mt-1 inline-block rounded bg-ms-fill-light px-1.5 py-0.5 text-[11px] text-ms-text-secondary"
              >
                {{ c.flag }}
              </div>
            </template>

            <template v-else-if="c.stage === 'fila'">
              <div>
                Fila: <span class="text-ms-text-secondary">{{ c.filaTipo }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  >Posição: <b class="text-ms-text-primary">{{ c.posicao }}º</b></span
                >
                <span class="text-ms-text-placeholder">·</span>
                <span class="text-ms-warning">{{ c.espera }}</span>
              </div>
            </template>

            <template v-else-if="c.stage === 'humano'">
              <div>
                Atendente: <span class="text-ms-text-secondary">{{ c.atendente }}</span>
              </div>
              <div>
                Tempo: <span class="text-ms-text-secondary">{{ c.tempoAtendimento }}</span>
              </div>
            </template>

            <template v-else>
              <div>
                Atendente: <span class="text-ms-text-secondary">{{ c.atendente }}</span>
              </div>
              <div>
                Total: <span class="text-ms-text-secondary">{{ c.total }}</span>
              </div>
            </template>
          </div>

          <!-- Risco (automatizado) -->
          <div
            v-if="c.risco"
            class="mt-2 inline-flex items-center rounded border border-ms-danger px-1.5 py-0.5 text-[10px] font-medium uppercase text-ms-danger"
          >
            Risco jurídico
          </div>

          <!-- Rodapé: canal -->
          <div
            class="mt-2 flex items-center gap-1.5 border-t border-ms-border-lighter pt-2 text-xs"
          >
            <span
              class="h-2 w-2 rounded-full"
              :style="{ backgroundColor: channelColor(c.channel) }"
            />
            <span class="text-ms-text-secondary">{{ c.channel }}</span>
          </div>
        </div>

        <p
          v-if="!board[s.key].length"
          class="px-2 py-6 text-center text-xs text-ms-text-placeholder"
        >
          Nenhuma ocorrência
        </p>
      </div>
    </div>
  </div>
</template>
