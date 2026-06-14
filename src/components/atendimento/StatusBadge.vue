<script setup lang="ts">
// StatusBadge — estado padrão de uma ocorrência/atendimento, sobre BaseBadge.
// Fonte única dos 4 estados do produto (rótulo + tom), garantindo consistência
// entre canais e telas.
import { computed } from 'vue'
import BaseBadge, { type BaseBadgeTone } from '@/components/base/BaseBadge.vue'

export type OcorrenciaStatus = 'aberto' | 'analise' | 'aguardando' | 'finalizado'

const props = defineProps<{ status: OcorrenciaStatus }>()

const meta: Record<OcorrenciaStatus, { tone: BaseBadgeTone; label: string }> = {
  aberto: { tone: 'info', label: 'Aberto' },
  analise: { tone: 'warning', label: 'Em análise' },
  aguardando: { tone: 'neutral', label: 'Aguardando usuário' },
  finalizado: { tone: 'success', label: 'Finalizado' },
}

const current = computed(() => meta[props.status])
</script>

<template>
  <BaseBadge :tone="current.tone" :label="current.label" />
</template>
