<script setup lang="ts">
// Lista de barras de porcentagem no formato "empilhado": rótulo + valor numa
// linha, barra fina logo abaixo. Cor da barra via `barClass` (token Tailwind);
// escala via `max` (valor que corresponde a 100% da largura).
// `clickable`: ativa cursor-pointer + highlight de hover + emite `item-click`.
import { computed } from 'vue'

type Row = { label: string; value: number }

const props = withDefaults(
  defineProps<{ items: Row[]; barClass?: string; max?: number; clickable?: boolean }>(),
  { barClass: 'bg-ms-primary', max: undefined, clickable: false },
)

const emit = defineEmits<{ (e: 'item-click', item: Row): void }>()

const ceil = computed(() => props.max ?? Math.max(...props.items.map((i) => i.value), 1))
const width = (v: number) => Math.min(100, (v / ceil.value) * 100)
</script>

<template>
  <div class="space-y-2.5">
    <div
      v-for="it in items"
      :key="it.label"
      :class="clickable ? 'cursor-pointer rounded px-1 py-0.5 hover:bg-ms-fill-light' : ''"
      @click="clickable ? emit('item-click', it) : undefined"
    >
      <div class="flex items-center justify-between text-xs">
        <span
          class="truncate pr-2"
          :class="clickable ? 'text-ms-primary hover:underline' : 'text-ms-text-regular'"
          >{{ it.label }}</span
        >
        <span class="font-medium text-ms-text-primary">{{ it.value }}%</span>
      </div>
      <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
        <div class="h-full rounded-full" :class="barClass" :style="{ width: `${width(it.value)}%` }" />
      </div>
    </div>
  </div>
</template>
