<script setup lang="ts">
// Estado vazio reutilizável (lista/board sem itens, recurso não encontrado…).
// Slot default opcional para uma ação (ex.: botão "Voltar").
withDefaults(defineProps<{ title: string; description?: string }>(), { description: '' })
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-16 text-center">
    <svg
      class="h-10 w-10 text-ms-text-placeholder"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path
        d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5z"
      />
    </svg>
    <p class="font-medium text-ms-text-regular">{{ title }}</p>
    <p v-if="description" class="-mt-2 text-sm text-ms-text-secondary">{{ description }}</p>
    <slot />
  </div>
</template>
