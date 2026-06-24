<script setup lang="ts">
// Container titulado para gráficos/conteúdo do dashboard. O gráfico vai no slot.
// O corpo é uma coluna que preenche a altura do card (quando a linha estica),
// então conteúdos podem se ancorar no rodapé (mt-auto / flex-1) — ex.: legendas.
// `to` (opcional) adiciona um link "Ver detalhes →" no header (drill-down) p/
// gráficos diagnósticos sem clique item-a-item.
import type { RouteLocationRaw } from 'vue-router'

withDefaults(defineProps<{ title: string; subtitle?: string; to?: RouteLocationRaw }>(), {
  subtitle: '',
  to: undefined,
})
</script>

<template>
  <el-card
    shadow="never"
    body-class="!flex !h-full !flex-col !p-4"
    class="!h-full !border-ms-border-light"
  >
    <div class="mb-3 flex items-start justify-between gap-2">
      <div class="min-w-0">
        <div class="text-xs font-bold uppercase tracking-wide text-ms-text-primary">{{ title }}</div>
        <div v-if="subtitle" class="mt-0.5 text-2xs text-ms-text-secondary">{{ subtitle }}</div>
      </div>
      <router-link
        v-if="to"
        :to="to"
        class="shrink-0 whitespace-nowrap text-2xs font-medium text-ms-primary no-underline hover:underline"
        >Ver detalhes →</router-link
      >
    </div>
    <div class="flex flex-1 flex-col">
      <slot />
    </div>
  </el-card>
</template>
