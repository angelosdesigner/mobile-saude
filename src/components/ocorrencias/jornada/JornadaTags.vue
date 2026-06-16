<script setup lang="ts">
// Chips de canal (WhatsApp / Push / E-mail) — contorno verde, usados no card de
// template ativo. Extraído por se repetir entre as instâncias de template.
defineProps<{ tags: string[] }>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span
      v-for="t in tags"
      :key="t"
      class="rounded-md border border-ms-success/50 px-2 py-0.5 text-2xs font-medium text-ms-success"
      >{{ t }}</span
    >
  </div>
</template>
