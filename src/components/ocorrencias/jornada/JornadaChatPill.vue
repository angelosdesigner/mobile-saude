<script setup lang="ts">
// Pílula arredondada de início/fim de conversa (contorno cinza, com trilho
// lateral). Ícone de telefone quando o título menciona "telefone", senão balão.
import AppIcon from '@/components/ui/AppIcon.vue'
import JornadaRows from './JornadaRows.vue'
import type { JornadaRow } from '@/data/ocorrenciaJornada'

const props = defineProps<{
  variant: 'start' | 'end'
  title: string
  time: string
  rows?: JornadaRow[]
}>()

defineOptions({ inheritAttrs: false })

const icon = props.title.toLowerCase().includes('telefone') ? 'phone' : 'message-circle'
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="h-px flex-1 bg-ms-border-light" />
    <div
      class="w-full max-w-[440px] shrink-0 rounded-3xl border border-ms-border-light bg-ms-surface px-6 py-3"
    >
      <div class="flex items-center justify-center gap-2">
        <AppIcon :name="icon as any" class="h-4 w-4 text-ms-success" />
        <span class="text-sm font-bold text-ms-text-primary">{{ title }}</span>
        <span class="text-2xs text-ms-text-secondary">{{ time }}</span>
      </div>
      <JornadaRows v-if="rows?.length" :rows="rows" align="center" class="mt-1" />
    </div>
    <span class="h-px flex-1 bg-ms-border-light" />
  </div>
</template>
