<script setup lang="ts">
// Notificação enviada ao beneficiário (PUSH / E-mail / WhatsApp) — cartão
// tracejado à direita com ícone de sino e os parágrafos do conteúdo.
import AppIcon from '@/components/ui/AppIcon.vue'
import JornadaTime from './JornadaTime.vue'

defineProps<{ channel: string; paragraphs: string[]; time: string }>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="flex flex-col items-end">
    <div class="w-full max-w-[460px] rounded-xl border border-dashed border-ms-border p-4">
      <div class="flex items-center gap-3">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-ms-warning/20 text-ms-warning"
        >
          <AppIcon name="bell" class="h-4 w-4" />
        </span>
        <span class="text-sm font-semibold text-ms-text-primary">Notificação via {{ channel }}</span>
      </div>
      <div
        class="mt-3 space-y-3 rounded-lg border border-ms-border-light bg-ms-fill-light/60 px-3 py-2 text-sm text-ms-text-secondary"
      >
        <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
      </div>
    </div>
    <JornadaTime :time="time" align="right" />
  </div>
</template>
