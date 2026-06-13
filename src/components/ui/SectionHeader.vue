<script setup lang="ts">
// Cabeçalho de seção das abas do gestor (título + subtítulo + CTA "Acessar
// detalhes"). O bloco se repetia em todas as abas → componente único. O botão
// dá feedback via toast (auditoria de botões de ação).
import { useActionFeedback } from '@/composables/useActionFeedback'

const props = withDefaults(defineProps<{ title: string; subtitle?: string; action?: string }>(), {
  subtitle: undefined,
  action: 'Acessar detalhes',
})

const { comingSoon } = useActionFeedback()
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div>
      <h2 class="text-sm font-bold uppercase tracking-wide text-ms-text-primary">{{ title }}</h2>
      <p v-if="subtitle" class="text-xs text-ms-text-secondary">{{ subtitle }}</p>
    </div>
    <el-button size="small" @click="comingSoon(props.action)">{{ props.action }}</el-button>
  </div>
</template>
