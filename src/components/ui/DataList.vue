<script setup lang="ts" generic="T extends Record<string, unknown>">
// Lista de dados compartilhada — alinhada visualmente ao padrão Jira (lista):
// header cinza discreto, seleção por checkbox, linhas densas, linha expansível
// (accordion), coluna "Ações" fixa à direita (Visualizar/Editar) e rodapé com
// contagem. Usada por atendente e gestor — só muda a config de colunas/conteúdo,
// garantindo linha visual única nas duas visões.
//
// Slots:
//  - cell-<key>: conteúdo custom de uma célula (recebe { row })
//  - expand: conteúdo do accordion (recebe { row })
//  - toolbar / footer-actions: áreas opcionais (ex.: "Criar")
import type { DataListColumn } from './dataList'

withDefaults(
  defineProps<{
    columns: DataListColumn[]
    rows: T[]
    rowKey?: string
    expandable?: boolean
    selectable?: boolean
    emptyText?: string
    countLabel?: string
  }>(),
  {
    rowKey: 'id',
    expandable: true,
    selectable: true,
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

// Header cinza no estilo Jira.
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
      <!-- Seleção -->
      <el-table-column v-if="selectable" type="selection" width="44" />

      <!-- Accordion -->
      <el-table-column v-if="expandable" type="expand" width="40">
        <template #default="{ row }">
          <div class="px-6 py-3">
            <slot name="expand" :row="row">
              <span class="text-xs text-ms-text-secondary">Sem detalhes adicionais.</span>
            </slot>
          </div>
        </template>
      </el-table-column>

      <!-- Colunas configuráveis -->
      <el-table-column
        v-for="c in columns"
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

      <!-- Ações fixas -->
      <el-table-column label="Ações" fixed="right" width="100" align="center">
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
