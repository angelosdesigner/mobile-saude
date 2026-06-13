<script setup lang="ts">
// Cartão de métrica do dashboard do gestor: rótulo, valor e variação opcional.
withDefaults(
  defineProps<{
    label: string
    value: string | number
    delta?: string
    deltaTone?: 'up' | 'down' | 'neutral'
  }>(),
  { delta: '', deltaTone: 'neutral' },
)

const deltaClass: Record<'up' | 'down' | 'neutral', string> = {
  up: 'text-ms-success',
  down: 'text-ms-danger',
  neutral: 'text-ms-text-secondary',
}
</script>

<template>
  <el-card shadow="never" body-class="!p-4" class="!border-ms-border-light">
    <div class="text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
      {{ label }}
    </div>
    <div class="mt-1 text-2xl font-bold text-ms-text-primary">{{ value }}</div>
    <div v-if="delta" class="mt-0.5 text-xs" :class="deltaClass[deltaTone]">{{ delta }}</div>
  </el-card>
</template>
