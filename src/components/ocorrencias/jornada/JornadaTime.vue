<script setup lang="ts">
// Rodapé de horário (cinza, 12px) — reaproveitado por todos os cards. `author`
// adiciona o nome após um ponto separador (eventos de sistema). `align` posiciona
// à esquerda/direita conforme o lado do card.
defineProps<{ time?: string; author?: string; align?: 'left' | 'right' }>()
</script>

<template>
  <div
    v-if="time || author"
    class="mt-1 flex items-center gap-2 px-1 text-2xs text-ms-text-secondary"
    :class="align === 'right' ? 'justify-end' : ''"
  >
    <span v-if="time">{{ time }}</span>
    <template v-if="author">
      <span class="h-1 w-1 rounded-full bg-ms-border" />
      <span>{{ author }}</span>
    </template>
  </div>
</template>
