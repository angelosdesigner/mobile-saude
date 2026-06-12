<script setup lang="ts" generic="T extends { id: number | string }">
// Quadro Kanban compartilhado (atendente e gestor) — header com acento de cor +
// contador + sub-contagens, colunas roláveis, drop targets e slot de card.
// Drag-and-drop nativo opcional (emite `move`); o conteúdo do card vem do slot,
// garantindo linha visual única com a config de cada visão.
import { ref } from 'vue'
import type { KanbanColumn, KanbanTone } from './kanbanBoard'

withDefaults(
  defineProps<{
    columns: KanbanColumn[]
    groups: Record<string, T[]>
    draggable?: boolean
    emptyText?: string
  }>(),
  { draggable: false, emptyText: 'Nenhuma ocorrência' },
)

const emit = defineEmits<{ move: [id: number | string, toKey: string] }>()
defineSlots<{ card: (props: { item: T; columnKey: string }) => unknown }>()

const dragId = ref<number | string | null>(null)
const dragOver = ref<string | null>(null)

const accentBar: Record<KanbanTone, string> = {
  primary: 'bg-ms-primary',
  warning: 'bg-ms-warning',
  teal: 'bg-ms-teal',
  success: 'bg-ms-success',
  danger: 'bg-ms-danger',
  neutral: 'bg-ms-text-secondary',
}

function onDrop(key: string) {
  const id = dragId.value
  dragOver.value = null
  dragId.value = null
  if (id == null) return
  emit('move', id, key)
}
function onDragEnd() {
  dragId.value = null
  dragOver.value = null
}
</script>

<template>
  <div v-drag-scroll class="flex gap-4 overflow-x-auto pb-2">
    <div v-for="col in columns" :key="col.key" class="flex w-72 shrink-0 flex-col">
      <!-- Header da coluna (acento + título + contador + sub-contagens) -->
      <div class="overflow-hidden rounded-t-lg">
        <div class="h-1" :class="accentBar[col.tone]" />
      </div>
      <div class="rounded-b-lg border border-t-0 border-ms-border-light bg-ms-surface px-3 py-2.5">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-ms-text-primary">{{ col.label }}</span>
          <span
            class="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white"
            :class="accentBar[col.tone]"
            >{{ (groups[col.key] ?? []).length }}</span
          >
        </div>
        <div
          v-if="col.meta?.length"
          class="mt-1 flex items-center gap-3 text-[11px] text-ms-text-secondary"
        >
          <span v-for="m in col.meta" :key="m.label"
            >{{ m.label }} <b class="text-ms-text-regular">{{ m.value }}</b></span
          >
        </div>
      </div>

      <!-- Cards (drop target) -->
      <div
        class="mt-3 flex min-h-[120px] flex-1 flex-col gap-3 rounded-lg border-2 border-dashed p-1 transition-colors"
        :class="
          dragOver === col.key ? 'border-ms-primary bg-ms-primary-light/60' : 'border-transparent'
        "
        @dragover.prevent="draggable && (dragOver = col.key)"
        @dragleave="dragOver = dragOver === col.key ? null : dragOver"
        @drop="onDrop(col.key)"
      >
        <div
          v-for="item in groups[col.key] ?? []"
          :key="item.id"
          :draggable="draggable"
          :class="[
            draggable ? 'cursor-grab active:cursor-grabbing' : '',
            dragId === item.id ? 'opacity-40' : '',
          ]"
          @dragstart="draggable && (dragId = item.id)"
          @dragend="onDragEnd"
        >
          <slot name="card" :item="item" :column-key="col.key" />
        </div>

        <p
          v-if="!(groups[col.key] ?? []).length"
          class="px-2 py-6 text-center text-xs text-ms-text-placeholder"
        >
          {{ emptyText }}
        </p>
      </div>
    </div>
  </div>
</template>
