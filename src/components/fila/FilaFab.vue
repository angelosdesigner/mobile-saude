<script setup lang="ts">
import FilaPanel from './FilaPanel.vue'
import { filaStats } from '@/data/fila'
</script>

<template>
  <!-- Widget mini-fila: fixo no canto inferior esquerdo, abre FilaPanel ao clicar. -->
  <el-popover
    trigger="click"
    placement="top-start"
    :width="400"
    popper-class="!p-0"
    :show-arrow="false"
  >
    <template #reference>
      <button
        class="fixed bottom-6 left-6 z-30 w-[268px] cursor-pointer rounded-2xl border border-ms-border-light bg-ms-surface p-3 text-left shadow-xl transition hover:shadow-2xl"
        title="Fila de atendimento"
      >
        <!-- Linha 1: ícone + título + badge -->
        <div class="flex items-center gap-2">
          <svg
            class="h-4 w-4 shrink-0 text-ms-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
          <span class="flex-1 text-xs font-semibold text-ms-text-primary">Fila de Atendimento</span>
          <span
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-ms-danger px-1 text-2xs font-semibold text-white"
            >{{ filaStats.total }}</span
          >
          <svg
            class="h-3.5 w-3.5 shrink-0 text-ms-text-secondary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </div>

        <!-- Linha 2: 3 métricas rápidas -->
        <div class="mt-2 flex items-center justify-between text-2xs text-ms-text-secondary">
          <span>
            Aguardando <b class="font-bold text-ms-text-primary">{{ filaStats.total }}</b>
          </span>
          <span>
            TMEF <b class="font-bold text-ms-warning">{{ filaStats.tmef }}</b>
          </span>
          <span class="flex items-center gap-1">
            <span class="h-1.5 w-1.5 rounded-full bg-ms-warning" />
            Abandono <b class="font-bold text-ms-danger">{{ filaStats.abandono }}</b>
          </span>
        </div>
      </button>
    </template>

    <FilaPanel />
  </el-popover>
</template>
