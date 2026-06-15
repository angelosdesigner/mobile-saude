<script setup lang="ts">
// KpiRingCard — card de KPI padrão do dashboard: anel à esquerda (com o número
// no centro) + infos à direita (título · performance · meta). Conteúdo
// centralizado verticalmente. O anel usa tokens (theme-aware: soft no dark).
import { computed } from 'vue'

export type KpiRingTone = 'primary' | 'success' | 'purple' | 'danger' | 'warning'
export type KpiRingDeltaTone = 'up' | 'down' | 'danger' | 'neutral'

const props = withDefaults(
  defineProps<{
    /** Preenchimento do anel (0–100). */
    value: number
    /** Número exibido no centro do anel ("78%", "4.6", "6,4%"). */
    display: string
    /** Título (rótulo do indicador). */
    label: string
    /** Variação ("↑ 1% hoje"). */
    delta?: string
    deltaTone?: KpiRingDeltaTone
    /** Linha de meta/contexto ("Meta: 80%"). */
    meta?: string
    /** Cor do anel. */
    tone?: KpiRingTone
    clickable?: boolean
    /** Legenda opcional (bolinha + rótulo) abaixo das infos. */
    legend?: { label: string; tone: KpiRingTone }[]
  }>(),
  { delta: '', deltaTone: 'up', meta: '', tone: 'primary', clickable: false, legend: undefined },
)

defineEmits<{ click: [] }>()

const ringVar: Record<KpiRingTone, string> = {
  primary: 'var(--color-ms-primary)',
  success: 'var(--color-ms-success)',
  danger: 'var(--color-ms-danger)',
  warning: 'var(--color-ms-warning)',
  purple: 'var(--color-ms-purple)',
}
const deltaClass: Record<KpiRingDeltaTone, string> = {
  up: 'text-ms-success',
  down: 'text-ms-danger',
  danger: 'text-ms-danger',
  neutral: 'text-ms-text-secondary',
}

const ringStyle = computed(() => ({
  background: `conic-gradient(${ringVar[props.tone]} ${Math.min(100, Math.max(0, props.value))}%, var(--color-ms-fill-light) 0)`,
}))
const dCls = computed(() => deltaClass[props.deltaTone])
</script>

<template>
  <el-card
    shadow="never"
    body-class="!flex !h-full !items-center !p-4"
    class="!h-full !border-ms-border-light"
    :class="clickable ? 'cursor-pointer transition hover:shadow-md' : ''"
    @click="clickable && $emit('click')"
  >
    <div class="flex w-full items-center gap-4">
      <div class="relative h-16 w-16 shrink-0 rounded-full" :style="ringStyle">
        <div
          class="absolute inset-[6px] flex items-center justify-center rounded-full bg-ms-surface text-sm font-bold text-ms-text-primary"
        >
          {{ display }}
        </div>
      </div>
      <div class="min-w-0">
        <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          {{ label }}
        </div>
        <div v-if="delta" class="mt-1 text-xs" :class="dCls">{{ delta }}</div>
        <div v-if="meta" class="text-2xs text-ms-text-secondary">{{ meta }}</div>
        <div v-if="legend" class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          <span
            v-for="l in legend"
            :key="l.label"
            class="flex items-center gap-1 text-2xs text-ms-text-secondary"
          >
            <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: ringVar[l.tone] }" />{{
              l.label
            }}
          </span>
        </div>
      </div>
    </div>
  </el-card>
</template>
