<script setup lang="ts">
// Cabeçalho de seção das abas do gestor (título + subtítulo + CTA "Acessar
// detalhes"). O bloco se repetia em todas as abas → componente único.
// Se `actionTo` for informado, o CTA navega para a rota (drill-down); senão,
// dá feedback via toast (auditoria de botões de ação).
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useActionFeedback } from '@/composables/useActionFeedback'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    action?: string
    /** Rota de destino do CTA. Quando ausente, o botão só dá feedback (toast). */
    actionTo?: RouteLocationRaw
    showAction?: boolean
  }>(),
  {
    subtitle: undefined,
    action: 'Detalhes',
    actionTo: undefined,
    showAction: true,
  },
)

const router = useRouter()
const { comingSoon } = useActionFeedback()

function onAction() {
  if (props.actionTo) router.push(props.actionTo)
  else comingSoon(props.action)
}
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div>
      <h2 class="text-sm font-bold uppercase tracking-wide text-ms-text-primary">{{ title }}</h2>
      <p v-if="subtitle" class="text-xs text-ms-text-secondary">{{ subtitle }}</p>
    </div>
    <el-button v-if="showAction" size="small" @click="onAction">{{ props.action }}</el-button>
  </div>
</template>
