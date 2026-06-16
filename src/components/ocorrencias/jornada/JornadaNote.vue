<script setup lang="ts">
// Anotação interna/pública — cartão tracejado à direita, com autor acima.
// `variant='publica'` usa ícone/borda em azul; `interna` em cinza.
// `recording=true` mostra as linhas de Gravação/Transcrição da chamada.
import AppIcon from '@/components/ui/AppIcon.vue'
import JornadaLabel from './JornadaLabel.vue'
import JornadaTime from './JornadaTime.vue'
import { useActionFeedback } from '@/composables/useActionFeedback'

defineProps<{
  variant: 'interna' | 'publica'
  author?: string
  text?: string
  time?: string
  recording?: boolean
}>()

defineOptions({ inheritAttrs: false })

const { comingSoon } = useActionFeedback()
</script>

<template>
  <div class="flex flex-col items-end">
    <JornadaLabel v-if="author" :text="author" align="right" />
    <div
      class="w-full max-w-[460px] rounded-xl border border-dashed p-4"
      :class="variant === 'publica' ? 'border-ms-primary/40' : 'border-ms-border'"
    >
      <div class="flex items-center gap-3">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          :class="
            variant === 'publica'
              ? 'bg-ms-primary/10 text-ms-primary'
              : 'bg-ms-fill-light text-ms-text-secondary'
          "
        >
          <AppIcon name="edit" class="h-4 w-4" />
        </span>
        <span class="text-sm font-semibold text-ms-text-primary"
          >Anotação {{ variant === 'publica' ? 'pública' : 'interna' }}</span
        >
      </div>

      <!-- Gravação/transcrição da chamada -->
      <div v-if="recording" class="mt-3 space-y-2">
        <div
          v-for="rec in ['Gravação da chamada', 'Transcrição da chamada']"
          :key="rec"
          class="flex items-center gap-3 rounded-lg bg-ms-fill-light px-3 py-2 text-sm"
        >
          <span class="flex-1 text-ms-text-primary">{{ rec }}</span>
          <button type="button" class="flex items-center gap-1 text-ms-primary" @click="comingSoon(rec)">
            <AppIcon name="play" class="h-3.5 w-3.5" /> Reproduzir
          </button>
          <button
            type="button"
            class="flex items-center gap-1 text-ms-text-secondary"
            @click="comingSoon(`Baixar ${rec.toLowerCase()}`)"
          >
            <AppIcon name="download" class="h-3.5 w-3.5" /> Baixar
          </button>
        </div>
      </div>

      <div
        v-else-if="text"
        class="mt-3 rounded-lg border border-ms-border-light bg-ms-fill-light/60 px-3 py-2 text-sm text-ms-text-secondary"
      >
        {{ text }}
      </div>
    </div>
    <JornadaTime :time="time" align="right" />
  </div>
</template>
