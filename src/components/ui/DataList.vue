<script setup lang="ts" generic="T extends Record<string, unknown>">
// Lista de dados compartilhada — alinhada ao padrão Jira (lista):
// header cinza, seleção por checkbox (fixa), linha expansível/accordion (fixa),
// gerenciador de colunas (▥ fixo à direita: busca + checkboxes mostrar/ocultar),
// coluna "Ações" fixa (Visualizar/Editar) e rodapé com contagem.
//
// Slots:
//  - cell-<key>: conteúdo custom de uma célula (recebe { row })
//  - expand: conteúdo do accordion (recebe { row })
//  - footer-actions: área opcional no rodapé (ex.: "Criar")
import { ref, computed } from 'vue'
import ColumnManager from './ColumnManager.vue'
import type { DataListColumn } from './dataList'

const props = withDefaults(
  defineProps<{
    columns: DataListColumn[]
    rows: T[]
    rowKey?: string
    expandable?: boolean
    selectable?: boolean
    actions?: boolean
    emptyText?: string
    countLabel?: string
  }>(),
  {
    rowKey: 'id',
    expandable: true,
    selectable: true,
    actions: true,
    emptyText: 'Nenhum registro',
    countLabel: 'registros',
  },
)

const emit = defineEmits<{ visualizar: [row: T]; editar: [row: T] }>()

defineSlots<
  {
    expand?: (props: { row: T }) => unknown
    'footer-actions'?: () => unknown
  } & Record<`cell-${string}`, (props: { row: T }) => unknown>
>()

// ── Gerenciador de colunas (mostrar/ocultar) ────────────────────────────────
const visible = ref<Record<string, boolean>>(
  Object.fromEntries(props.columns.map((c) => [c.key, !c.defaultHidden])),
)

const visibleColumns = computed(() => props.columns.filter((c) => visible.value[c.key]))

const headerCellStyle = {
  background: 'var(--color-ms-fill-light)',
  color: 'var(--color-ms-text-secondary)',
  fontWeight: '600',
  fontSize: '12px',
}
</script>

<template>
  <el-card shadow="never" body-class="!p-0" class="!border-ms-border-light">
    <el-table
      :data="rows"
      :row-key="rowKey"
      :header-cell-style="headerCellStyle"
      :empty-text="emptyText"
      style="width: 100%"
    >
      <!-- Seleção (fixa à esquerda) -->
      <el-table-column v-if="selectable" type="selection" width="44" fixed="left" />

      <!-- Accordion (fixo à esquerda) -->
      <el-table-column v-if="expandable" type="expand" width="40" fixed="left">
        <template #default="{ row }">
          <div class="px-6 py-3">
            <slot name="expand" :row="row">
              <span class="text-xs text-ms-text-secondary">Sem detalhes adicionais.</span>
            </slot>
          </div>
        </template>
      </el-table-column>

      <!-- Colunas configuráveis (somente as visíveis) -->
      <el-table-column
        v-for="c in visibleColumns"
        :key="c.key"
        :prop="c.key"
        :label="c.label"
        :width="c.width"
        :min-width="c.minWidth"
        :align="c.align ?? 'left'"
        :sortable="c.sortable"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <slot :name="`cell-${c.key}`" :row="row">{{ row[c.key] }}</slot>
        </template>
      </el-table-column>

      <!-- "+" adicionar coluna (inline, após as colunas) -->
      <el-table-column width="44" align="center">
        <template #header>
          <ColumnManager v-model="visible" :columns="columns" variant="plus" />
        </template>
      </el-table-column>

      <!-- Ações (fixa à direita) -->
      <el-table-column v-if="actions" label="Ações" fixed="right" width="96" align="center">
        <template #default="{ row }">
          <div class="flex justify-center gap-1">
            <el-button text circle size="small" title="Visualizar" @click="emit('visualizar', row)">
              <AppIcon name="eye" class="h-4 w-4 text-ms-text-regular" />
            </el-button>
            <el-button text circle size="small" title="Editar" @click="emit('editar', row)">
              <AppIcon name="edit" class="h-4 w-4 text-ms-text-regular" />
            </el-button>
          </div>
        </template>
      </el-table-column>

      <!-- Configurar colunas (▥ fixo à direita) -->
      <el-table-column fixed="right" width="48" align="center">
        <template #header>
          <ColumnManager v-model="visible" :columns="columns" variant="config" />
        </template>
      </el-table-column>
    </el-table>

    <!-- Rodapé: ações + contagem (estilo Jira) -->
    <div
      class="flex items-center justify-between border-t border-ms-border-light px-4 py-2.5 text-sm text-ms-text-secondary"
    >
      <slot name="footer-actions"><span /></slot>
      <span>{{ rows.length }} {{ countLabel }}</span>
    </div>
  </el-card>
</template>
