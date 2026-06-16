<script setup lang="ts">
// Rótulo pequeno acima de um card da timeline — reaproveitado para o nome do
// autor (acima de balões/anotações/templates) e para títulos como
// "Resposta de pesquisa" / "Envio do formulário".
defineProps<{ text: string; align?: 'left' | 'right' }>()
</script>

<template>
  <span
    class="mb-1 block px-1 text-xs text-ms-text-secondary"
    :class="align === 'right' ? 'text-right' : 'text-left'"
    >{{ text }}</span
  >
</template>
