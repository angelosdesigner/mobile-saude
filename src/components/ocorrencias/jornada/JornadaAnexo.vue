<script setup lang="ts">
// Cartão de arquivo anexado (ícone + nome + tamanho opcional + baixar) — aparece
// em balões de mensagem e em eventos de sistema. Fundo branco sobre o card pai.
import AppIcon from '@/components/ui/AppIcon.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'

defineProps<{ name: string; size?: string }>()

const { comingSoon } = useActionFeedback()
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-lg border border-ms-border-light bg-ms-surface px-3 py-2"
  >
    <AppIcon name="file-text" class="h-5 w-5 shrink-0 text-ms-text-secondary" />
    <span class="flex-1 truncate text-sm text-ms-text-primary">{{ name }}</span>
    <span v-if="size" class="text-2xs text-ms-text-secondary">{{ size }}</span>
    <button
      type="button"
      aria-label="Baixar anexo"
      class="text-ms-text-secondary transition hover:text-ms-primary"
      @click="comingSoon('Baixar anexo')"
    >
      <AppIcon name="download" class="h-4 w-4" />
    </button>
  </div>
</template>
