<script setup lang="ts">
import type { FilaItem } from '@/data/fila'

const props = defineProps<{ item: FilaItem }>()
const emit = defineEmits<{ select: [item: FilaItem] }>()
</script>

<template>
  <button
    class="block w-full rounded-xl border p-3 text-left transition hover:border-ms-primary/40 hover:shadow-sm"
    :class="
      item.active
        ? 'border-ms-success bg-ms-success/5'
        : 'border-ms-border-light bg-ms-surface'
    "
    @click="emit('select', props.item)"
  >
    <!-- Linha 1: nome + unread + hora -->
    <div class="flex items-start justify-between gap-2">
      <span class="text-sm font-semibold leading-snug text-ms-text-primary">{{ item.name }}</span>
      <div class="flex shrink-0 items-center gap-1.5">
        <span
          v-if="item.unread"
          class="flex h-5 min-w-5 items-center justify-center rounded-full bg-ms-success px-1 text-2xs font-semibold text-white"
        >{{ item.unread }}</span>
        <span class="text-xs text-ms-text-secondary">{{ item.time }}</span>
      </div>
    </div>

    <!-- Linha 2: última mensagem (oculta linha de categoria/subtipo/canal) -->
    <p class="mt-1.5 line-clamp-1 text-xs italic text-ms-text-secondary">"{{ item.message }}"</p>
  </button>
</template>
