<script setup lang="ts">
// Balão de mensagem do chat. `side='left'` = cliente (cinza, à esquerda);
// `side='right'` = atendente/BOT (azul, à direita). Suporta segundo parágrafo
// (`text2`), quick-replies, anexo de arquivo e imagem com selo.
import AppIcon from '@/components/ui/AppIcon.vue'
import JornadaLabel from './JornadaLabel.vue'
import JornadaAnexo from './JornadaAnexo.vue'
import JornadaTime from './JornadaTime.vue'

defineProps<{
  side: 'left' | 'right'
  author?: string
  text?: string
  text2?: string
  time: string
  quickReplies?: string[]
  attachment?: { name: string }
  image?: { badge?: string }
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="flex flex-col" :class="side === 'right' ? 'items-end' : 'items-start'">
    <JornadaLabel v-if="author" :text="author" :align="side === 'right' ? 'right' : 'left'" />

    <!-- Anexo (cartão de arquivo + imagem opcional) -->
    <div v-if="attachment" class="max-w-[70%] rounded-2xl bg-ms-fill-light p-2">
      <JornadaAnexo :name="attachment.name" />
      <div
        v-if="image"
        class="relative mt-2 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-ms-border-light/60"
      >
        <AppIcon name="file" class="h-10 w-10 text-ms-text-placeholder" />
        <span
          v-if="image.badge"
          class="absolute right-2 top-2 rounded-md bg-ms-success px-2 py-0.5 text-2xs font-semibold text-ms-on-success"
          >{{ image.badge }}</span
        >
      </div>
    </div>

    <!-- Texto -->
    <div
      v-else
      class="max-w-[70%] space-y-2 rounded-2xl px-4 py-2 text-sm"
      :class="
        side === 'right' ? 'bg-ms-primary text-ms-on-primary' : 'bg-ms-fill-light text-ms-text-primary'
      "
    >
      <p v-if="text">{{ text }}</p>
      <p v-if="text2">{{ text2 }}</p>
    </div>

    <!-- Quick replies -->
    <div v-if="quickReplies?.length" class="mt-2 flex flex-wrap justify-end gap-2">
      <span
        v-for="q in quickReplies"
        :key="q"
        class="rounded-full border border-ms-primary/50 px-3 py-1 text-xs font-medium text-ms-primary"
        >{{ q }}</span
      >
    </div>

    <JornadaTime :time="time" :align="side === 'right' ? 'right' : 'left'" />
  </div>
</template>
