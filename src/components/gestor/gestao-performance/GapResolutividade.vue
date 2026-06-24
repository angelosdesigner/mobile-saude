<script setup lang="ts">
// Componente visual de destaque do GAP DE RESOLUTIVIDADE: resolutividade do
// sistema vs confirmada pelo beneficiário, com o gap em evidência. Aparece na
// Visão Geral e em Qualidade e Experiência → componente compartilhado.
defineProps<{
  sistema: number
  beneficiario: number
  gap: number
  nota?: string
}>()
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Barras comparativas -->
    <div class="space-y-3">
      <div>
        <div class="mb-1 flex items-baseline justify-between">
          <span class="text-xs text-ms-text-regular">Resolvido pelo sistema</span>
          <span class="text-base font-bold text-ms-text-primary">{{ sistema }}%</span>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-ms-fill-light">
          <div class="h-full rounded-full bg-ms-text-secondary" :style="{ width: `${sistema}%` }" />
        </div>
      </div>
      <div>
        <div class="mb-1 flex items-baseline justify-between">
          <span class="text-xs text-ms-text-regular">Confirmado pelo beneficiário</span>
          <span class="text-base font-bold text-ms-text-primary">{{ beneficiario }}%</span>
        </div>
        <div class="h-3 overflow-hidden rounded-full bg-ms-fill-light">
          <div class="h-full rounded-full bg-ms-text-placeholder" :style="{ width: `${beneficiario}%` }" />
        </div>
      </div>
    </div>

    <!-- Gap em destaque -->
    <div class="mt-4 rounded-lg border border-ms-warning/40 bg-ms-warning/5 p-3">
      <div class="flex items-end gap-3">
        <div class="leading-none">
          <span class="text-3xl font-bold text-ms-warning">{{ gap }}</span>
          <span class="ml-1 text-sm font-medium text-ms-warning">p.p.</span>
        </div>
        <div class="pb-0.5">
          <p class="text-2xs font-bold uppercase tracking-wide text-ms-warning">Gap de resolutividade</p>
          <p v-if="nota" class="mt-0.5 text-2xs leading-snug text-ms-text-secondary">{{ nota }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
