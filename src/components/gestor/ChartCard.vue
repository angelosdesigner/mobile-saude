<script setup lang="ts">
// Container titulado para gráficos/conteúdo do dashboard. O gráfico vai no slot.
// O corpo é uma coluna que preenche a altura do card (quando a linha estica),
// então conteúdos podem se ancorar no rodapé (mt-auto / flex-1) — ex.: legendas.
withDefaults(defineProps<{ title: string; subtitle?: string }>(), { subtitle: '' })
</script>

<template>
  <el-card
    shadow="never"
    body-class="!flex !h-full !flex-col !p-4"
    class="!h-full !border-ms-border-light"
  >
    <div class="mb-3">
      <div class="text-xs font-bold uppercase tracking-wide text-ms-text-primary">{{ title }}</div>
      <div v-if="subtitle" class="mt-0.5 text-2xs text-ms-text-secondary">{{ subtitle }}</div>
    </div>
    <div class="flex flex-1 flex-col">
      <slot />
    </div>
  </el-card>
</template>
