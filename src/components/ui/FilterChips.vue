<script setup lang="ts">
// Chips de estatística clicáveis com multi-seleção (filtros rápidos). Componente
// único compartilhado entre o painel do atendente e o do gestor — a mesma linha
// visual, alimentada por dados diferentes. v-model = chaves ativas (string[]).
import type { ChipTone, FilterChip } from './filterChips'

defineProps<{ chips: FilterChip[] }>()
const active = defineModel<string[]>({ default: () => [] })

// Cor do "dot" (estado neutro) e do chip ativo (preenchido) por tom semântico.
const dot: Record<ChipTone, string> = {
  neutral: 'bg-ms-text-placeholder',
  primary: 'bg-ms-primary',
  warning: 'bg-ms-warning',
  success: 'bg-ms-success',
  danger: 'bg-ms-danger',
  teal: 'bg-ms-teal',
}
const activeRing: Record<ChipTone, string> = {
  neutral: 'border-ms-text-secondary bg-ms-fill-light',
  primary: 'border-ms-primary bg-ms-primary/10',
  warning: 'border-ms-warning bg-ms-warning/10',
  success: 'border-ms-success bg-ms-success/10',
  danger: 'border-ms-danger bg-ms-danger/10',
  teal: 'border-ms-teal bg-ms-teal/10',
}

function toggle(chip: FilterChip) {
  if (chip.filterable === false) {
    active.value = []
    return
  }
  active.value = active.value.includes(chip.key)
    ? active.value.filter((k) => k !== chip.key)
    : [...active.value, chip.key]
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <button
      v-for="chip in chips"
      :key="chip.key"
      type="button"
      class="flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition"
      :class="
        active.includes(chip.key)
          ? activeRing[chip.tone]
          : 'border-ms-border-light bg-ms-surface hover:border-ms-border'
      "
      :aria-pressed="active.includes(chip.key)"
      @click="toggle(chip)"
    >
      <span class="h-1.5 w-1.5 rounded-full" :class="dot[chip.tone]" />
      <span class="text-ms-text-regular">{{ chip.label }}:</span>
      <span class="font-semibold text-ms-text-primary">{{ chip.value }}</span>
    </button>
  </div>
</template>
