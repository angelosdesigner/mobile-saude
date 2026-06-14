<script setup lang="ts">
// ChatCard — item de conversa (inbox): identidade + prévia da última mensagem +
// horário + não lidas. Composto sobre BaseCard + UserCard + ChannelTag.
import BaseCard from '@/components/base/BaseCard.vue'
import UserCard from './UserCard.vue'
import ChannelTag from '@/components/ui/ChannelTag.vue'

withDefaults(
  defineProps<{
    name: string
    channel: string
    lastMessage: string
    time: string
    unread?: number
    interactive?: boolean
  }>(),
  { unread: 0, interactive: true },
)

defineEmits<{ click: [] }>()
</script>

<template>
  <BaseCard :interactive="interactive" @click="$emit('click')">
    <div class="flex items-start justify-between gap-2">
      <UserCard :name="name" size="sm" />
      <div class="flex flex-col items-end gap-1">
        <span class="text-2xs text-ms-text-secondary">{{ time }}</span>
        <span
          v-if="unread > 0"
          class="flex h-4 min-w-4 items-center justify-center rounded-full bg-ms-primary px-1 text-2xs font-semibold text-ms-on-primary"
          :aria-label="`${unread} não lidas`"
          >{{ unread }}</span
        >
      </div>
    </div>
    <p class="mt-2 line-clamp-2 text-xs text-ms-text-regular">{{ lastMessage }}</p>
    <template #footer>
      <ChannelTag :channel="channel" />
    </template>
  </BaseCard>
</template>
