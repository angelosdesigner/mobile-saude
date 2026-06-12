<script setup lang="ts" generic="T extends Record<string, unknown>">
// Lista de dados compartilhada (estilo Jira/Zendesk): linha densa, colunas
// configuráveis, linha expansível (accordion) e coluna "Ações" fixa à direita
// com Visualizar/Editar. Usada por atendente e gestor — só muda a config de
// colunas/conteúdo, garantindo linha visual única nas duas visões.
//
// Slots:
//  - cell-<key>: conteúdo custom de uma célula (recebe { row })
//  - expand: conteúdo do accordion (recebe { row })
//  - empty: estado vazio
import type { DataListColumn } from './dataList'

withDefaults(
  defineProps<{
    columns: DataListColumn[]
    rows: T[]
    rowKey?: string
    expandable?: boolean
    emptyText?: string
  }>(),
  { rowKey: 'id', expandable: true, emptyText: 'Nenhum registro' },
)

const emit = defineEmits<{ visualizar: [row: T]; editar: [row: T] }>()

// Slots tipados com o genérico para os consumidores receberem `row: T`.
defineSlots<
  {
    expand?: (props: { row: T }) => unknown
    empty?: () => unknown
  } & Record<`cell-${string}`, (props: { row: T }) => unknown>
>()
</script>

<template>
  <el-card shadow="never" body-class="!p-0" class="!border-ms-border-light">
    <el-table :data="rows" :row-key="rowKey" stripe :empty-text="emptyText" style="width: 100%">
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
      <el-table-column label="Ações" fixed="right" width="110" align="center">
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
  </el-card>
</template>
