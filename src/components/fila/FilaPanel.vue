<script setup lang="ts">
import { ref, computed } from 'vue'
import { filaItems, filaStats, type FilaItem } from '@/data/fila'
import FilaCard from './FilaCard.vue'

const emit = defineEmits<{ select: [item: FilaItem] }>()

const search = ref('')
const items = computed(() =>
  filaItems.filter((i) => i.name.toLowerCase().includes(search.value.toLowerCase())),
)
</script>

<template>
  <div class="flex max-h-[72vh] w-[400px] flex-col">
    <!-- Cabeçalho -->
    <div class="flex items-center gap-2 px-4 pb-3 pt-4">
      <h3 class="flex-1 text-base font-bold text-ms-text-primary">Fila de Atendimento</h3>
      <span
        class="flex h-5 min-w-5 items-center justify-center rounded-full bg-ms-danger px-1.5 text-2xs font-semibold text-white"
        >{{ items.length }}</span
      >
    </div>

    <!-- Busca -->
    <div class="px-4">
      <el-input v-model="search" placeholder="Buscar por beneficiário ou protocolo" clearable>
        <template #prefix>
          <AppIcon name="search" class="h-4 w-4 text-ms-text-placeholder" />
        </template>
      </el-input>
    </div>

    <!-- Stats chips -->
    <div class="flex items-center gap-2 overflow-x-auto px-4 py-3">
      <span
        class="flex shrink-0 items-center gap-1 rounded-full border border-ms-border-light px-3 py-1 text-xs text-ms-text-regular"
      >
        Total: <b class="ml-0.5 text-ms-text-primary">{{ filaStats.total }}</b>
      </span>
      <span
        class="flex shrink-0 items-center gap-1.5 rounded-full border border-ms-border-light px-3 py-1 text-xs text-ms-text-regular"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-ms-warning" />
        Abandono: <b class="text-ms-text-primary">{{ filaStats.abandono }}</b>
      </span>
      <span
        class="flex shrink-0 items-center gap-1 rounded-full border border-ms-border-light px-3 py-1 text-xs text-ms-text-regular"
      >
        TMEF: <b class="ml-0.5 text-ms-warning">{{ filaStats.tmef }}</b>
      </span>
    </div>

    <!-- Divisor -->
    <div class="mx-4 border-t border-ms-border-lighter" />

    <!-- Lista -->
    <div class="flex-1 space-y-2 overflow-y-auto px-4 pb-4 pt-3">
      <FilaCard v-for="item in items" :key="item.id" :item="item" @select="emit('select', $event)" />
      <p v-if="!items.length" class="py-6 text-center text-xs text-ms-text-secondary">
        Nenhum atendimento encontrado
      </p>
    </div>
  </div>
</template>
