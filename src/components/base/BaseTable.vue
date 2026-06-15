<script setup lang="ts">
// BaseTable — tabela do Design System (sobre el-table). Wrapper enxuto, com
// colunas tipadas e slot por célula (`#cell-<prop>`). Para a lista rica estilo
// Jira (seleção, accordion, gerenciador de colunas) use o DataList.
import EmptyState from '@/components/ui/EmptyState.vue'

export interface BaseTableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

withDefaults(
  defineProps<{
    columns: BaseTableColumn[]
    data: Record<string, unknown>[]
    rowKey?: string
    stripe?: boolean
    border?: boolean
    emptyText?: string
  }>(),
  { rowKey: 'id', stripe: false, border: false, emptyText: 'Nenhum registro' },
)
</script>

<template>
  <el-table
    :data="data"
    :row-key="rowKey"
    :stripe="stripe"
    :border="border"
    header-cell-class-name="ms-th"
    class="w-full"
  >
    <el-table-column
      v-for="col in columns"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label"
      :width="col.width"
      :min-width="col.minWidth"
      :align="col.align ?? 'left'"
      :sortable="col.sortable"
    >
      <template v-if="$slots[`cell-${col.prop}`]" #default="scope">
        <slot :name="`cell-${col.prop}`" :row="scope.row" :value="scope.row[col.prop]" />
      </template>
    </el-table-column>

    <template #empty>
      <EmptyState :title="emptyText" />
    </template>
  </el-table>
</template>

<style scoped>
/* Cabeçalho cinza alinhado ao padrão de listas do produto (tokens). */
.el-table :deep(.ms-th) {
  background-color: var(--color-ms-fill-light);
  color: var(--color-ms-text-secondary);
  font-weight: 600;
}
</style>
