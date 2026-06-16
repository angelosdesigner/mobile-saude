<script setup lang="ts">
// Barra fixa (sticky) com o seletor de período no topo das telas de detalhe do
// gestor. Permanece visível e alinhada à direita ao rolar a tela — o usuário
// pode trocar o período de qualquer ponto do scroll (heurística de Nielsen:
// visibilidade do estado + controle do usuário). Fica FORA do card de cabeçalho
// (que tem overflow-hidden) e sangra até as bordas do conteúdo (-mx-6 -mt-6)
// para grudar no topo do contêiner de rolagem do DashboardLayout.
</script>

<template>
  <div
    class="sticky top-0 z-20 -mx-6 -mt-6 mb-4 flex items-center justify-end gap-2 border-b border-ms-border-light bg-ms-bg/85 px-6 py-2.5 backdrop-blur"
  >
    <span class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">Período:</span>
    <slot />
  </div>
</template>
