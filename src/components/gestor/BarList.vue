<script setup lang="ts">
// Lista de barras horizontais de porcentagem (ocupação por fila/atendente).
// O tom da barra é derivado do valor (faixas <70% / 70-89% / ≥90% crítico),
// salvo quando `tone` é informado explicitamente.
interface BarItem {
  label: string
  value: number // 0–100
  caption?: string // ex.: "92% (20min)"
  avatar?: string // iniciais opcionais
}

const props = defineProps<{ items: BarItem[] }>()

function tone(v: number): string {
  if (v >= 90) return 'bg-ms-danger'
  if (v >= 70) return 'bg-ms-warning'
  return 'bg-ms-success'
}
void props
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
  </div>
</template>
