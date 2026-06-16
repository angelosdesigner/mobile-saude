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
  }>(),
  { unit: '', status: 'neutral', delta: '', deltaTone: 'neutral' },
)

const dot: Record<'ok' | 'warning' | 'danger' | 'neutral', string> = {
  ok: 'bg-ms-success',
  warning: 'bg-ms-warning',
  danger: 'bg-ms-danger',
  neutral: 'bg-ms-text-placeholder',
}
// Significado de cada cor da bolinha (tooltip explicativo · pedido G6).
const statusHint: Record<'ok' | 'warning' | 'danger' | 'neutral', string> = {
  ok: 'Saudável — dentro da meta',
  warning: 'Atenção — próximo do limite da meta',
  danger: 'Crítico — fora da meta',
  neutral: 'Informativo — sem meta definida',
}
const deltaClass: Record<'up' | 'down' | 'neutral', string> = {
  up: 'text-ms-success',
  down: 'text-ms-danger',
  neutral: 'text-ms-text-secondary',
}
</script>

<template>
  <el-card shadow="never" body-class="!p-4" class="!border-ms-border-light">
    <div class="flex items-start justify-between">
      <span class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">{{
        label
      }}</span>
      <el-tooltip :content="statusHint[status]" placement="top">
        <span
          class="mt-0.5 h-2 w-2 shrink-0 cursor-help rounded-full"
          :class="dot[status]"
          :aria-label="statusHint[status]"
        />
      </el-tooltip>
    </div>
    <div class="mt-2 flex items-baseline gap-1">
      <span class="text-2xl font-bold text-ms-text-primary">{{ value }}</span>
      <span v-if="unit" class="text-xs text-ms-text-secondary">{{ unit }}</span>
    </div>
    <div v-if="delta" class="mt-0.5 text-xs" :class="deltaClass[deltaTone]">{{ delta }}</div>
  </el-card>
</template>
