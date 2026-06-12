<script setup lang="ts">
// Indicador de canal de atendimento padronizado: bolinha colorida + nome.
// Compartilhado entre os boards do atendente e do gestor (antes cada um tinha
// sua própria lógica — atendente com ícone SVG, gestor com dot). Padrão único:
// dot na cor do canal + rótulo neutro.
const props = defineProps<{ channel: string }>()

// #25D366 é a cor de marca do WhatsApp (exceção legítima); os demais usam tokens.
function channelColor(c: string): string {
  if (/whats/i.test(c)) return '#25D366'
  if (/tele|fone|voz/i.test(c)) return 'var(--color-ms-primary)'
  if (/app/i.test(c)) return 'var(--color-ms-teal)'
  if (/chat/i.test(c)) return 'var(--color-ms-warning)'
  return 'var(--color-ms-text-secondary)' // Portal/Web e demais
}
</script>

<template>
  <span class="flex items-center gap-1.5 text-xs">
    <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: channelColor(props.channel) }" />
    <span class="text-ms-text-secondary">{{ props.channel }}</span>
  </span>
</template>
