<script setup lang="ts">
// RankHint — rodapé que indica a direção de um ranking (pior → melhor).
// Átomo reutilizável (BarList, rankings da Equipe…) para não duplicar o texto.
</script>

<template>
  <div class="flex items-center justify-between text-2xs">
    <span class="text-ms-danger">↓ Pior</span>
    <span class="text-ms-success">Melhor ↑</span>
  </div>
</template>
