<script setup lang="ts">
// Lista de barras horizontais de porcentagem (ocupação por fila/atendente).
// O tom da barra é derivado do valor (faixas <70% / 70-89% / ≥90% crítico),
// salvo quando `tone` é informado explicitamente.
//
// `thresholdLegend` e `rankHint` são opcionais e centralizam aqui (fonte única)
// a legenda de limiares e o rodapé "Pior/Melhor" — antes duplicados nas telas.
import RankHint from '@/components/gestor/RankHint.vue'

interface BarItem {
  label: string
  value: number // 0–100
  caption?: string // ex.: "92% (20min)" / "95% (34)"
  avatar?: string // iniciais opcionais
}

withDefaults(defineProps<{ items: BarItem[]; thresholdLegend?: boolean; rankHint?: boolean }>(), {
  thresholdLegend: false,
  rankHint: false,
})

function tone(v: number): string {
  if (v >= 90) return 'bg-ms-danger'
  if (v >= 70) return 'bg-ms-warning'
  return 'bg-ms-success'
}
</script>

<template>
  <div class="space-y-2.5">
    <div v-for="it in items" :key="it.label" class="flex items-center gap-3">
      <span
        v-if="it.avatar"
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ms-primary-light text-2xs font-semibold text-ms-primary"
        >{{ it.avatar }}</span
      >
      <span class="w-28 shrink-0 truncate text-xs text-ms-text-regular">{{ it.label }}</span>
      <div class="h-2 flex-1 overflow-hidden rounded-full bg-ms-fill-light">
        <div
          class="h-full rounded-full"
          :class="tone(it.value)"
          :style="{ width: `${Math.min(100, it.value)}%` }"
        />
      </div>
      <span class="w-20 shrink-0 text-right text-xs font-medium text-ms-text-primary">{{
        it.caption ?? `${it.value}%`
      }}</span>
    </div>

    <!-- Legenda de limiares (bolinha + rótulo) — padrão do produto. -->
    <div
      v-if="thresholdLegend"
      class="flex flex-wrap items-center justify-center gap-3 pt-1 text-2xs text-ms-text-secondary"
    >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-success" />&lt;70%</span
      >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-warning" />70–89%</span
      >
      <span class="flex items-center gap-1"
        ><span class="h-2 w-2 rounded-full bg-ms-danger" />≥90% crítico</span
      >
    </div>

    <!-- Rodapé de ranking (pior → melhor). -->
    <div v-if="rankHint" class="border-t border-ms-border-lighter pt-2">
      <RankHint />
    </div>
  </div>
</template>
