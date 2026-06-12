<script setup lang="ts">
// Casca visual compartilhada dos cards do Kanban (atendente e gestor). Garante
// uma linha visual única — border/padding/sombra/rodapé — enquanto o conteúdo
// (campos por papel) vem dos slots. Estilo minimalista herdado do board do gestor.
withDefaults(
  defineProps<{
    highlight?: boolean
    clickable?: boolean
  }>(),
  { highlight: false, clickable: false },
)

const emit = defineEmits<{ click: [] }>()
defineSlots<{ default: () => unknown; footer?: () => unknown }>()
</script>

<template>
  <div
    class="rounded-lg border bg-ms-surface p-3 shadow-sm transition hover:shadow-md"
    :class="[
      highlight ? 'border-ms-danger' : 'border-ms-border-light',
      clickable ? 'cursor-pointer' : '',
    ]"
    @click="clickable && emit('click')"
  >
    <slot />
    <div
      v-if="$slots.footer"
      class="mt-2 flex items-center justify-between border-t border-ms-border-lighter pt-2 text-xs"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
