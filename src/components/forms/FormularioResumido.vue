<script setup lang="ts">
// "Formulário resumido" — espelho do componente do Figma `2635:25501`
// (usado dentro de "Vários formulários resumidos" `8453:29730`). É um resumo
// numerado de um formulário enviado: número + linha vertical + campos
// (rótulo sobre valor, separados por divisores) + seta de detalhe à direita.
//
// Componente genérico/reutilizável (origem em outra tela) — não depende da
// jornada; recebe os campos por prop.
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps<{ numero: number; campos: { label: string; value: string }[] }>()
</script>

<template>
  <div class="flex items-stretch gap-2 rounded-lg px-2 py-1">
    <span
      class="w-[17px] shrink-0 self-center text-right text-sm font-bold leading-5 text-ms-text-regular"
      >{{ numero }}</span
    >
    <span class="w-px shrink-0 bg-ms-border-light" />
    <div class="flex min-w-0 flex-1 flex-col gap-2.5 p-2">
      <template v-for="(c, i) in campos" :key="i">
        <div class="flex flex-col gap-0.5">
          <p class="text-xs leading-4 text-ms-text-regular">{{ c.label }}</p>
          <p class="text-sm font-medium leading-5 text-ms-text-primary">{{ c.value }}</p>
        </div>
        <span v-if="i < campos.length - 1" class="h-px w-full bg-ms-border-light" />
      </template>
    </div>
    <AppIcon name="chevron-right" class="h-3.5 w-3.5 shrink-0 self-center text-ms-text-secondary" />
  </div>
</template>
