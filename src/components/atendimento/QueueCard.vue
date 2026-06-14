<script setup lang="ts">
// QueueCard — item de fila (aguardando atendimento humano). Mostra posição,
// espera e canal. Composto sobre BaseCard + BaseTag + ChannelTag.
import BaseCard from '@/components/base/BaseCard.vue'
import BaseTag, { type BaseTagType } from '@/components/base/BaseTag.vue'
import ChannelTag from '@/components/ui/ChannelTag.vue'

withDefaults(
  defineProps<{
    name: string
    fila: string
    posicao: number
    espera: string
    channel: string
    /** Origem (Chatbot/URA/App…). */
    tag?: string
    tagType?: BaseTagType
    /** Realce (ex.: prioridade/risco). */
    highlight?: boolean
    interactive?: boolean
  }>(),
  { tag: '', tagType: 'info', highlight: false, interactive: false },
)

defineEmits<{ click: [] }>()
</script>

<template>
  <BaseCard
    :interactive="interactive"
    :tone="highlight ? 'danger' : 'default'"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between gap-2">
      <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{ name }}</span>
      <BaseTag v-if="tag" :type="tagType" size="small">{{ tag }}</BaseTag>
    </div>
    <div class="mt-2 space-y-0.5 text-xs text-ms-text-regular">
      <div>
        Fila: <span class="text-ms-text-secondary">{{ fila }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span>Posição: <b class="text-ms-text-primary">{{ posicao }}º</b></span>
        <span class="text-ms-text-placeholder">·</span>
        <span class="text-ms-warning">{{ espera }}</span>
      </div>
    </div>
    <template #footer>
      <ChannelTag :channel="channel" />
    </template>
  </BaseCard>
</template>
