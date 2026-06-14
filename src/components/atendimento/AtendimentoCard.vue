<script setup lang="ts">
// AtendimentoCard — atendimento humano em andamento. Mostra beneficiário,
// atendente, tempo e estado de SLA. Composto sobre BaseCard + SlaBadge + ChannelTag.
import BaseCard from '@/components/base/BaseCard.vue'
import SlaBadge, { type SlaState } from './SlaBadge.vue'
import ChannelTag from '@/components/ui/ChannelTag.vue'

withDefaults(
  defineProps<{
    name: string
    atendente: string
    tempo: string
    sla: SlaState
    channel: string
    interactive?: boolean
  }>(),
  { interactive: false },
)

defineEmits<{ click: [] }>()
</script>

<template>
  <BaseCard :interactive="interactive" @click="$emit('click')">
    <div class="flex items-start justify-between gap-2">
      <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{ name }}</span>
      <SlaBadge :state="sla" />
    </div>
    <div class="mt-2 space-y-0.5 text-xs text-ms-text-regular">
      <div>
        Atendente: <span class="text-ms-text-secondary">{{ atendente }}</span>
      </div>
      <div>
        Tempo: <span class="text-ms-text-secondary">{{ tempo }}</span>
      </div>
    </div>
    <template #footer>
      <ChannelTag :channel="channel" />
    </template>
  </BaseCard>
</template>
