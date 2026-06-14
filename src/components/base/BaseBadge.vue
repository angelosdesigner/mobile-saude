<script setup lang="ts">
// BaseBadge — indicador de STATUS do Design System. Acessibilidade: nunca
// comunica só por cor — combina ponto (ou ícone) + rótulo + cor tonalizada.
// Base para os estados do produto (Aberto, Em análise, Aguardando usuário,
// Finalizado) e para o SLA.
import { computed } from 'vue'

export type BaseBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    tone?: BaseBadgeTone
    /** Rótulo textual (obrigatório para acessibilidade). */
    label: string
  }>(),
  { tone: 'neutral' },
)

// Fundo tonalizado (/10) + texto/dot na cor do tom.
const toneClass: Record<BaseBadgeTone, string> = {
  neutral: 'bg-ms-fill-light text-ms-text-secondary',
  info: 'bg-ms-primary/10 text-ms-primary',
  success: 'bg-ms-success/10 text-ms-success',
  warning: 'bg-ms-warning/10 text-ms-warning',
  danger: 'bg-ms-danger/10 text-ms-danger',
}
const dotClass: Record<BaseBadgeTone, string> = {
  neutral: 'bg-ms-text-placeholder',
  info: 'bg-ms-primary',
  success: 'bg-ms-success',
  warning: 'bg-ms-warning',
  danger: 'bg-ms-danger',
}

const cls = computed(() => toneClass[props.tone])
const dot = computed(() => dotClass[props.tone])

defineSlots<{
  /** Ícone opcional à esquerda; sem ele, mostra o ponto colorido. */
  icon?(): unknown
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-2xs font-medium"
    :class="cls"
  >
    <slot name="icon">
      <span class="h-1.5 w-1.5 rounded-full" :class="dot" />
    </slot>
    {{ label }}
  </span>
</template>
