<script setup lang="ts">
// Marcador de data (pílula central com linhas laterais) que separa os dias da
// jornada.
defineOptions({ inheritAttrs: false })
defineProps<{ date: string }>()
</script>

<template>
  <div class="flex items-center gap-3 py-1">
    <span class="h-px flex-1 bg-ms-border-light" />
    <span
      class="rounded-full bg-ms-fill-light px-3 py-1 text-2xs font-semibold text-ms-text-secondary"
      >{{ date }}</span
    >
    <span class="h-px flex-1 bg-ms-border-light" />
  </div>
</template>
