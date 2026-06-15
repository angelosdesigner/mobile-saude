<script setup lang="ts">
// Indicador de prioridade estilo Jira (compartilhado entre lista e kanban):
// alta → chevron para cima (vermelho), média → traço (âmbar),
// baixa → chevron para baixo (azul). Sempre com tooltip; rótulo opcional.
import type { Prioridade } from '@/types/gestorOcorrencias'

withDefaults(defineProps<{ prioridade: Prioridade; showLabel?: boolean }>(), {
  showLabel: false,
})

const corClass: Record<Prioridade, string> = {
  Alta: 'text-ms-danger',
  Média: 'text-ms-warning',
  Baixa: 'text-ms-primary',
}
</script>

<template>
  <el-tooltip :content="`Prioridade: ${prioridade}`" placement="top">
    <span class="inline-flex items-center gap-1" :class="corClass[prioridade]">
      <!-- Alta: chevron para cima -->
      <svg
        v-if="prioridade === 'Alta'"
        class="h-3.5 w-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
      <!-- Média: traço -->
      <svg
        v-else-if="prioridade === 'Média'"
        class="h-3.5 w-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      >
        <path d="M5 12h14" />
      </svg>
      <!-- Baixa: chevron para baixo -->
      <svg
        v-else
        class="h-3.5 w-3.5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
      <span v-if="showLabel" class="text-xs font-medium">{{ prioridade }}</span>
    </span>
  </el-tooltip>
</template>
