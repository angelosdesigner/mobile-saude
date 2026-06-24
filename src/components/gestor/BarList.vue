<script setup lang="ts">
// Lista de barras horizontais de porcentagem (ocupação por fila/atendente).
// O tom da barra é derivado do valor (faixas <70% / 70-89% / ≥90% crítico),
// salvo quando `tone` é informado explicitamente.
//
// `thresholdLegend` e `rankHint` são opcionais e centralizam aqui (fonte única)
// a legenda de limiares e o rodapé "Pior/Melhor" — antes duplicados nas telas.
import RankHint from '@/components/gestor/RankHint.vue'
import type { BarItem } from '@/components/gestor/barList'

const props = withDefaults(
  defineProps<{
    items: BarItem[]
    thresholdLegend?: boolean
    rankHint?: boolean
    /** Mostra a posição no ranking (1, 2, 3…) no lugar do avatar/iniciais. */
    rank?: boolean
    /** Torna cada linha clicável (drill-down); emite `item-click` com o label. */
    clickable?: boolean
    /** Valor que corresponde a 100% da barra (métricas não-%: reabertura, CSAT). */
    max?: number
  }>(),
  { thresholdLegend: false, rankHint: false, rank: false, clickable: false, max: 100 },
)

const emit = defineEmits<{ 'item-click': [label: string] }>()

// Minimalista: barra neutra por padrão; só o crítico (≥90% ou tom danger) colore.
const toneClass: Record<'success' | 'warning' | 'danger' | 'neutral', string> = {
  success: 'bg-ms-text-placeholder',
  warning: 'bg-ms-text-placeholder',
  danger: 'bg-ms-danger',
  neutral: 'bg-ms-text-placeholder',
}

// Cor da barra: explícita (it.tone) ou derivada do valor (só ≥90% é crítico).
function barClass(it: BarItem): string {
  if (it.tone) return toneClass[it.tone]
  return it.value >= 90 ? 'bg-ms-danger' : 'bg-ms-text-placeholder'
}
const barWidth = (v: number) => Math.min(100, (v / props.max) * 100)
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="space-y-2.5">
      <div
        v-for="(it, idx) in items"
        :key="it.label"
        class="flex items-center gap-3"
        :class="clickable ? '-mx-2 cursor-pointer rounded-md px-2 py-0.5 transition hover:bg-ms-fill-light' : ''"
        :role="clickable ? 'button' : undefined"
        :tabindex="clickable ? 0 : undefined"
        @click="clickable && emit('item-click', it.label)"
        @keydown.enter="clickable && emit('item-click', it.label)"
      >
        <span
          v-if="rank || it.avatar"
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ms-primary-light text-2xs font-semibold text-ms-primary"
          >{{ rank ? idx + 1 : it.avatar }}</span
        >
        <span class="w-28 shrink-0 truncate text-xs text-ms-text-regular">{{ it.label }}</span>
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-ms-fill-light">
          <div
            class="h-full rounded-full"
            :class="barClass(it)"
            :style="{ width: `${barWidth(it.value)}%` }"
          />
        </div>
        <span class="w-20 shrink-0 text-right text-xs font-medium text-ms-text-primary">{{
          it.caption ?? `${it.value}%`
        }}</span>
      </div>
    </div>

    <!-- Legenda de limiares (bolinha + rótulo) — ancorada no rodapé do card. -->
    <div
      v-if="thresholdLegend"
      class="mt-auto flex flex-wrap items-center justify-center gap-3 pt-3 text-2xs text-ms-text-secondary"
    >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-text-placeholder" />&lt;70%</span
      >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-text-placeholder" />70–89%</span
      >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-danger" />≥90% crítico</span
      >
    </div>

    <!-- Rodapé de ranking (pior → melhor) — ancorado no rodapé do card. -->
    <div v-if="rankHint" class="mt-auto border-t border-ms-border-lighter pt-2">
      <RankHint />
    </div>
  </div>
</template>
