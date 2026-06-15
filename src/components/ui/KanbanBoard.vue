<script setup lang="ts" generic="T extends { id: number | string }">
// Quadro Kanban compartilhado (atendente e gestor) — header com acento de cor +
// contador + sub-contagens, colunas roláveis, drop targets e slot de card.
// Slot #column-action (scoped: { col }) permite injetar botão de filtro no header.
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
defineSlots<{
  card: (props: { item: T; columnKey: string }) => unknown
  'column-action': (props: { col: KanbanColumn }) => unknown
}>()

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

const badgeText: Record<KanbanTone, string> = {
  primary: 'text-ms-on-primary',
  warning: 'text-ms-on-warning',
  teal: 'text-ms-on-teal',
  success: 'text-ms-on-success',
  danger: 'text-ms-on-danger',
  neutral: 'text-white',
}

const metaToneClass: Record<string, string> = {
  warning: 'text-ms-warning',
  danger: 'text-ms-danger',
  success: 'text-ms-success',
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
  <div v-drag-scroll class="flex items-start gap-4 overflow-x-auto pb-2">
    <div
      v-for="col in columns"
      :key="col.key"
      class="flex w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-ms-border-lighter bg-ms-surface/60 transition-colors"
      :class="dragOver === col.key ? 'ring-2 ring-ms-primary ring-offset-1' : ''"
    >
      <!-- Acento de cor no topo -->
      <div class="h-1 w-full" :class="accentBar[col.tone]" />

      <!-- Header da coluna -->
      <div class="px-3 pb-2.5 pt-3">
        <div class="flex items-center gap-1.5">
          <span class="flex-1 text-sm font-bold text-ms-text-primary">{{ col.label }}</span>
          <!-- Slot para botão de filtro (injetado pelo board pai) -->
          <slot name="column-action" :col="col" />
          <span
            class="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-2xs font-semibold"
            :class="[accentBar[col.tone], badgeText[col.tone]]"
            >{{ (groups[col.key] ?? []).length }}</span
          >
        </div>
        <div
          v-if="col.meta?.length"
          class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-2xs uppercase tracking-wide text-ms-text-secondary"
        >
          <span v-for="m in col.meta" :key="m.label">
            {{ m.label }}
            <b :class="m.tone ? metaToneClass[m.tone] : 'text-ms-text-regular'">{{ m.value }}</b>
          </span>
        </div>
      </div>

      <!-- Divisor sutil entre header e cards -->
      <div class="mx-3 border-t border-ms-border-light" />

      <!-- Cards (drop target) -->
      <div
        class="flex min-h-[120px] flex-1 flex-col gap-3 p-3"
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
          class="px-2 py-6 text-center text-xs text-ms-text-secondary"
        >
          {{ emptyText }}
        </p>
      </div>
    </div>
  </div>
</template>
