<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useOcorrenciasStore } from '@/stores/ocorrencias'
import { columns, columnLabel } from '@/types/ocorrencias'

// Dashboard do gestor: visão agregada sobre os MESMOS dados que os atendentes
// produzem (reaproveita o store de ocorrências). Ponto de partida real — as
// telas de Jornadas/Relatórios do Figma entram a seguir.
const store = useOcorrenciasStore()
const { stats, loading } = storeToRefs(store)

onMounted(() => store.load())

const porColuna = computed(() =>
  columns.map((c) => ({ key: c, label: columnLabel[c], total: store.board[c].length })),
)
const maxColuna = computed(() => Math.max(1, ...porColuna.value.map((c) => c.total)))
</script>

<template>
  <DashboardLayout>
    <div class="mb-5">
      <h1 class="text-2xl font-bold text-ms-text-primary">Visão do gestor</h1>
      <p class="mt-1 text-sm text-ms-text-secondary">
        Panorama agregado dos atendimentos da equipe.
      </p>
    </div>

    <div v-loading="loading">
      <!-- Cartões de métrica (derivados do estado real) -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <el-card
          v-for="s in stats"
          :key="s.label"
          shadow="never"
          body-class="!p-4"
          class="!border-ms-border-light"
        >
          <div class="text-2xl font-bold" :style="{ color: s.color }">{{ s.value }}</div>
          <div class="mt-1 text-xs text-ms-text-secondary">{{ s.label }}</div>
        </el-card>
      </div>

      <!-- Distribuição por coluna do quadro -->
      <el-card shadow="never" class="mt-5 !border-ms-border-light">
        <div class="mb-4 text-sm font-bold uppercase text-ms-text-primary">
          Ocorrências por etapa
        </div>
        <div class="space-y-3">
          <div v-for="c in porColuna" :key="c.key" class="flex items-center gap-3">
            <span class="w-40 shrink-0 text-sm text-ms-text-regular">{{ c.label }}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-ms-fill-light">
              <div
                class="h-full rounded-full bg-ms-primary transition-[width]"
                :style="{ width: `${(c.total / maxColuna) * 100}%` }"
              />
            </div>
            <span class="w-8 shrink-0 text-right text-sm font-semibold text-ms-text-primary">{{
              c.total
            }}</span>
          </div>
        </div>
      </el-card>

      <p class="mt-4 rounded-lg bg-ms-fill-light p-3 text-xs text-ms-text-secondary">
        Jornadas e Relatórios do gestor chegam em breve — esta visão será expandida com as telas
        correspondentes do Figma.
      </p>
    </div>
  </DashboardLayout>
</template>
