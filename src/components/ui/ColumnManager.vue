<script setup lang="ts">
// Gerenciador de colunas (mostrar/ocultar) — popover com busca + checkboxes,
// estilo Jira. Usado em dois gatilhos no DataList: "+" (adicionar coluna, inline)
// e "▥" (configurar colunas, fixo). Compartilham o mesmo estado via v-model.
import { ref, computed } from 'vue'
import type { DataListColumn } from './dataList'

const props = defineProps<{ columns: DataListColumn[]; variant: 'plus' | 'config' }>()
const visible = defineModel<Record<string, boolean>>({ required: true })

const search = ref('')
const options = computed(() =>
  props.columns.filter((c) => c.label.toLowerCase().includes(search.value.trim().toLowerCase())),
)
const count = computed(() => props.columns.filter((c) => visible.value[c.key]).length)
</script>

<template>
  <el-popover :width="260" trigger="click" placement="bottom-end" popper-class="!p-0">
    <template #reference>
      <button
        class="flex h-7 w-7 items-center justify-center rounded text-ms-text-secondary transition hover:bg-ms-fill-light hover:text-ms-primary"
        :title="variant === 'plus' ? 'Adicionar coluna' : 'Configurar colunas'"
        :aria-label="variant === 'plus' ? 'Adicionar coluna' : 'Configurar colunas'"
      >
        <AppIcon v-if="variant === 'plus'" name="plus" class="h-4 w-4" />
        <svg
          v-else
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16M15 4v16" />
        </svg>
      </button>
    </template>

    <div class="px-3 pb-1 pt-3 text-sm font-semibold text-ms-primary">Colunas</div>
    <div class="px-3 pb-2">
      <el-input v-model="search" placeholder="Pesquisar colunas" size="small" clearable>
        <template #prefix>
          <AppIcon name="search" class="h-3.5 w-3.5 text-ms-text-placeholder" />
        </template>
      </el-input>
    </div>
    <div class="max-h-64 overflow-y-auto px-3 pb-2">
      <label
        v-for="c in options"
        :key="c.key"
        class="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 hover:bg-ms-fill-light"
      >
        <el-checkbox v-model="visible[c.key]" :disabled="c.locked" size="small" @click.stop />
        <span class="text-sm text-ms-text-primary">{{ c.label }}</span>
      </label>
      <p v-if="!options.length" class="py-2 text-center text-xs text-ms-text-secondary">
        Nenhuma coluna
      </p>
    </div>
    <div
      class="border-t border-ms-border-light px-3 py-2 text-right text-2xs text-ms-text-secondary"
    >
      {{ count }} de {{ columns.length }}
    </div>
  </el-popover>
</template>
