<script setup lang="ts">
// Logo "Mobile Saúde": quadrado arredondado índigo com círculos concêntricos.
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>

<template>
  <div
    class="grid shrink-0 place-items-center"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderRadius: size * 0.28 + 'px',
      background: 'linear-gradient(140deg, #4F46E5 0%, #4338CA 60%, #2563EB 100%)',
    }"
  >
    <svg :width="size * 0.66" :height="size * 0.66" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#22D3EE" />
      <circle cx="12" cy="12" r="7.5" fill="#ffffff" />
      <circle cx="12" cy="12" r="5" fill="#409EFF" />
      <circle cx="12" cy="12" r="2.2" fill="#1E3A8A" />
    </svg>
  </div>
</template>
