<script setup lang="ts">
import FilaPanel from './FilaPanel.vue'
import { filaStats } from '@/data/fila'
</script>

<template>
  <!-- Fila flutuante global: botão fixo no canto inferior + painel. -->
  <el-popover
    trigger="click"
    placement="top-end"
    :width="412"
    popper-class="!p-0"
    :show-arrow="false"
  >
    <template #reference>
      <button
        class="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-ms-primary text-white shadow-lg transition hover:bg-[#337ecc]"
        title="Minha fila de atendimentos"
      >
        <svg
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path
            d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
          />
        </svg>
        <span
          class="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-ms-danger px-1 text-xs font-semibold"
          >{{ filaStats.total }}</span
        >
      </button>
    </template>
    <FilaPanel />
  </el-popover>
</template>
