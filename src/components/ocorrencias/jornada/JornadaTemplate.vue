<script setup lang="ts">
// Disparo de template ativo (ex.: "Contato ativo via Chat") — cartão laranja com
// autor acima, ícone de envio, chips de canal e linhas de detalhe em 2 colunas.
import AppIcon from '@/components/ui/AppIcon.vue'
import JornadaLabel from './JornadaLabel.vue'
import JornadaRows from './JornadaRows.vue'
import JornadaTags from './JornadaTags.vue'
import type { JornadaRow } from '@/data/ocorrenciaJornada'

defineProps<{ author: string; title: string; time: string; tags: string[]; rows: JornadaRow[] }>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="flex flex-col items-end">
    <JornadaLabel :text="author" align="right" />
    <div class="w-full max-w-[460px] rounded-xl border border-ms-warning/50 bg-ms-warning/8 p-4">
      <div class="flex items-center gap-3">
        <span
          class="flex h-7 w-7 items-center justify-center rounded-full border border-ms-border-light text-ms-text-secondary"
        >
          <AppIcon name="chevron-down" class="h-4 w-4" />
        </span>
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-ms-warning/20 text-ms-warning"
        >
          <AppIcon name="chevrons-right" class="h-4 w-4" />
        </span>
        <div class="min-w-0">
          <div class="text-sm font-bold text-ms-text-primary">{{ title }}</div>
          <div class="text-2xs text-ms-text-secondary">{{ time }}</div>
        </div>
        <JornadaTags :tags="tags" class="ml-auto" />
      </div>
      <JornadaRows :rows="rows" :cols="2" align="left" class="mt-3" />
    </div>
  </div>
</template>
