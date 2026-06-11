<script setup lang="ts">
// Logo "Mobile Saúde": anel em gradiente (aproxima o espiral do design).
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <div
    class="relative grid shrink-0 place-items-center rounded-full"
    :style="{
      width: size + 'px',
      height: size + 'px',
      background:
        'conic-gradient(from 210deg, #6366F1, #409EFF, #22D3EE, #818CF8, #6366F1)',
    }"
  >
    <div
      class="rounded-full bg-white"
      :style="{ width: size * 0.4 + 'px', height: size * 0.4 + 'px' }"
    />
    <div
      class="absolute rounded-full"
      :style="{
        width: size * 0.18 + 'px',
        height: size * 0.18 + 'px',
        background: '#4F46E5',
      }"
    />
  </div>
</template>
