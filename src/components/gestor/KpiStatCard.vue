<script setup lang="ts">
// Card de KPI das telas de detalhe do gestor (Figma "INDICADORES DO CANAL"):
// rótulo + bolinha de status (canto sup. dir.) + valor grande + unidade.
// Estilo enxuto (sem anel), distinto do KpiRingCard do dashboard.
withDefaults(
  defineProps<{
    label: string
    value: string | number
    unit?: string
    /** Cor da bolinha de status. */
    status?: 'ok' | 'warning' | 'danger' | 'neutral'
    /** Variação opcional ("↓ 0.3min vs ontem"). */
    delta?: string
    deltaTone?: 'up' | 'down' | 'neutral'
    /** Torna o card clicável (drill-down); emite `click`. */
    clickable?: boolean
  }>(),
  { unit: '', status: 'neutral', delta: '', deltaTone: 'neutral', clickable: false },
)

defineEmits<{ click: [] }>()

// Minimalista (estilo Jira): a bolinha só aparece para sinalizar PROBLEMA
// (atenção/crítico). "OK" e "informativo" não recebem cor — ausência de alerta
// já comunica saúde, reduzindo o ruído cromático.
const dot: Record<string, string> = {
  warning: 'bg-ms-warning',
  danger: 'bg-ms-danger',
}
const statusHint: Record<string, string> = {
  warning: 'Atenção — próximo do limite da meta',
  danger: 'Crítico — fora da meta',
}
const showDot = (s: string): s is 'warning' | 'danger' => s === 'warning' || s === 'danger'
// Só a PIORA recebe cor (down = vermelho). Melhora e estável ficam neutras.
const deltaClass: Record<'up' | 'down' | 'neutral', string> = {
  up: 'text-ms-text-secondary',
  down: 'text-ms-danger',
  neutral: 'text-ms-text-secondary',
}
</script>

<template>
  <el-card
    shadow="never"
    body-class="!p-4"
    class="!border-ms-border-light"
    :class="clickable ? 'cursor-pointer transition hover:shadow-md' : ''"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="clickable && $emit('click')"
    @keydown.enter="clickable && $emit('click')"
  >
    <div class="flex items-start justify-between">
      <span class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">{{
        label
      }}</span>
      <span
        v-if="showDot(status)"
        class="mt-0.5 h-2 w-2 shrink-0 cursor-help rounded-full"
        :class="dot[status]"
        :title="statusHint[status]"
        :aria-label="statusHint[status]"
      />
    </div>
    <div class="mt-2 flex items-baseline gap-1">
      <span class="text-2xl font-bold text-ms-text-primary">{{ value }}</span>
      <span v-if="unit" class="text-xs text-ms-text-secondary">{{ unit }}</span>
    </div>
    <div v-if="delta" class="mt-0.5 text-xs" :class="deltaClass[deltaTone]">{{ delta }}</div>
  </el-card>
</template>
