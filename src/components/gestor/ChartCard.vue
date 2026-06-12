<script setup lang="ts">
// Container titulado para gráficos/conteúdo do dashboard. O gráfico vai no slot.
withDefaults(defineProps<{ title: string; subtitle?: string }>(), { subtitle: '' })
</script>

<template>
  <el-card shadow="never" body-class="!p-4" class="!border-ms-border-light">
    <div class="mb-3">
      <div class="text-xs font-bold uppercase tracking-wide text-ms-text-primary">{{ title }}</div>
      <div v-if="subtitle" class="mt-0.5 text-[11px] text-ms-text-secondary">{{ subtitle }}</div>
    </div>
    <slot />
  </el-card>
</template>
