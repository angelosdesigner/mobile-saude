<script setup lang="ts">
// Cartão de métrica do dashboard do gestor: rótulo, valor, variação e uma
// mini-tendência (sparkline) opcional — cara de "cockpit" analítico, sem cor
// chamativa. `trend` ausente mantém o card simples (retrocompatível).
import Sparkline from '@/components/gestor/Sparkline.vue'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    delta?: string
    deltaTone?: 'up' | 'down' | 'neutral'
    /** Série da mini-tendência (sparkline). Ausente = card simples. */
    trend?: number[]
    /** Cor da sparkline (token). Default = primário. */
    trendColor?: string
  }>(),
  { delta: '', deltaTone: 'neutral', trend: undefined, trendColor: 'var(--color-ms-primary)' },
)

// Minimalista: só a piora (down) recebe cor; melhora/estável ficam neutras.
const deltaClass: Record<'up' | 'down' | 'neutral', string> = {
  up: 'text-ms-text-secondary',
  down: 'text-ms-danger',
  neutral: 'text-ms-text-secondary',
}
</script>

<template>
  <el-card shadow="never" body-class="!flex !h-full !flex-col !p-4" class="!h-full !border-ms-border-light">
    <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
      {{ label }}
    </div>
    <div class="mt-1 flex items-baseline gap-2">
      <span class="text-2xl font-bold text-ms-text-primary">{{ value }}</span>
      <span v-if="delta" class="text-xs" :class="deltaClass[deltaTone]">{{ delta }}</span>
    </div>
    <Sparkline
      v-if="trend && trend.length"
      :points="trend"
      :color="trendColor"
      :height="30"
      class="mt-auto pt-3"
    />
  </el-card>
</template>
