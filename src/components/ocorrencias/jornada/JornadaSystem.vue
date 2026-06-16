<script setup lang="ts">
// Evento de sistema (cartão cinza): Transferência, Início de atendimento,
// Encaminhamento, Fim da ocorrência (vinculada)... Ícone + título, linhas
// chave/valor, anexo opcional e rodapé com horário + autor.
// No Figma esses cards ficam à DIREITA (ação do atendente/setor) — daí o
// default `right`. `center` fica disponível p/ exceções.
import AppIcon from '@/components/ui/AppIcon.vue'
import JornadaRows from './JornadaRows.vue'
import JornadaAnexo from './JornadaAnexo.vue'
import JornadaTime from './JornadaTime.vue'
import type { JornadaRow } from '@/data/ocorrenciaJornada'

withDefaults(
  defineProps<{
    icon: string
    title: string
    rows: JornadaRow[]
    time: string
    author?: string
    attachment?: { name: string; size: string }
    align?: 'left' | 'center' | 'right'
  }>(),
  { align: 'right' },
)

defineOptions({ inheritAttrs: false })
</script>

<template>
  <div class="flex" :class="align === 'right' ? 'justify-end' : 'justify-center'">
    <div
      class="w-full rounded-xl bg-ms-fill-light px-5 py-4"
      :class="align === 'right' ? 'max-w-[460px]' : 'max-w-[440px]'"
    >
    <div class="flex items-center gap-2 text-ms-text-primary">
      <span
        class="flex h-7 w-7 items-center justify-center rounded-full bg-ms-surface text-ms-text-secondary"
      >
        <AppIcon :name="icon as any" class="h-4 w-4" />
      </span>
      <span class="text-sm font-bold">{{ title }}</span>
    </div>
    <JornadaRows :rows="rows" align="left" class="mt-2" />
    <JornadaAnexo
      v-if="attachment"
      :name="attachment.name"
      :size="attachment.size"
      class="mt-3"
    />
      <JornadaTime :time="time" :author="author" align="left" />
    </div>
  </div>
</template>
