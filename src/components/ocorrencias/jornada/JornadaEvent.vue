<script setup lang="ts">
// Cabeçalho de evento da jornada. `tone`:
//  • success → início/abertura (borda + fundo verde)
//  • danger  → fim/encerramento (borda + fundo vermelho)
//  • neutral → criação/finalização/detalhes (cartão cinza)
// `align`:
//  • center (padrão) → centralizado com trilho lateral (mensagem do sistema)
//  • left/right → bloco alinhado em 75% (largura padrão de componente), sem
//    trilho — usado quando o evento pertence ao beneficiário (esquerda) ou ao
//    atendente (direita).
import AppIcon from '@/components/ui/AppIcon.vue'
import JornadaRows from './JornadaRows.vue'
import type { JornadaRow } from '@/data/ocorrenciaJornada'

const props = withDefaults(
  defineProps<{
    tone: 'success' | 'danger' | 'neutral'
    icon: string
    title: string
    meta?: string
    rows: JornadaRow[]
    cols?: 1 | 2
    align?: 'left' | 'center' | 'right'
  }>(),
  { align: 'center' },
)

defineOptions({ inheritAttrs: false })

function toneClass() {
  if (props.tone === 'success') return 'border border-ms-success/40 bg-ms-success/8'
  if (props.tone === 'danger') return 'border border-ms-danger/40 bg-ms-danger/8'
  return 'bg-ms-fill-light'
}
</script>

<template>
  <div
    class="flex items-center gap-3"
    :class="
      align === 'center'
        ? tone === 'neutral'
          ? 'justify-center'
          : ''
        : align === 'right'
          ? 'justify-end'
          : 'justify-start'
    "
  >
    <!-- Trilho lateral (só no modo centralizado e colorido) -->
    <span v-if="align === 'center' && tone !== 'neutral'" class="h-px flex-1 bg-ms-border-light" />

    <div
      class="w-full shrink-0 rounded-xl px-5 py-3"
      :class="[toneClass(), align === 'center' ? 'max-w-[440px]' : 'max-w-[460px]']"
    >
      <div
        class="flex items-center gap-2 text-ms-text-primary"
        :class="align === 'center' ? 'justify-center' : ''"
      >
        <AppIcon
          v-if="tone !== 'neutral'"
          :name="icon as any"
          class="h-4 w-4 text-ms-text-secondary"
        />
        <span class="text-sm font-bold">{{ title }}</span>
      </div>
      <div v-if="rows.length" class="mt-2 border-t border-ms-border-light/70 pt-2">
        <p
          v-if="meta"
          class="mb-1 text-2xs text-ms-text-secondary"
          :class="align === 'center' ? 'text-center' : ''"
        >
          {{ meta }}
        </p>
        <JornadaRows :rows="rows" :cols="cols" :align="align === 'center' ? 'center' : 'left'" />
      </div>
    </div>

    <span v-if="align === 'center' && tone !== 'neutral'" class="h-px flex-1 bg-ms-border-light" />
  </div>
</template>
