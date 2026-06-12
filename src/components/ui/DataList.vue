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
import type { DataListColumn } from './dataList'

const props = withDefaults(
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

// ── Gerenciador de colunas (mostrar/ocultar) ────────────────────────────────
const visible = ref<Record<string, boolean>>(
  Object.fromEntries(props.columns.map((c) => [c.key, !c.defaultHidden])),
)
const colSearch = ref('')

const visibleColumns = computed(() => props.columns.filter((c) => visible.value[c.key]))
const colOptions = computed(() =>
  props.columns.filter((c) => c.label.toLowerCase().includes(colSearch.value.trim().toLowerCase())),
)
const visibleCount = computed(() => props.columns.filter((c) => visible.value[c.key]).length)

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

      <!-- Ações (fixa à direita) -->
      <el-table-column label="Ações" fixed="right" width="96" align="center">
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

      <!-- Gerenciador de colunas (▥ fixo à direita) -->
      <el-table-column fixed="right" width="48" align="center">
        <template #header>
          <el-popover :width="260" trigger="click" placement="bottom-end" popper-class="!p-0">
            <template #reference>
              <button
                class="flex h-7 w-7 items-center justify-center rounded text-ms-text-secondary transition hover:bg-ms-fill-light hover:text-ms-primary"
                title="Configurar colunas"
                aria-label="Configurar colunas"
              >
                <svg
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
              <el-input v-model="colSearch" placeholder="Pesquisar colunas" size="small" clearable>
                <template #prefix>
                  <AppIcon name="search" class="h-3.5 w-3.5 text-ms-text-placeholder" />
                </template>
              </el-input>
            </div>
            <div class="max-h-64 overflow-y-auto px-3 pb-2">
              <label
                v-for="c in colOptions"
                :key="c.key"
                class="flex cursor-pointer items-center gap-2 rounded px-1 py-1.5 hover:bg-ms-fill-light"
              >
                <el-checkbox
                  v-model="visible[c.key]"
                  :disabled="c.locked"
                  size="small"
                  @click.stop
                />
                <span class="text-sm text-ms-text-primary">{{ c.label }}</span>
              </label>
              <p
                v-if="!colOptions.length"
                class="py-2 text-center text-xs text-ms-text-placeholder"
              >
                Nenhuma coluna
              </p>
            </div>
            <div
              class="border-t border-ms-border-light px-3 py-2 text-right text-[11px] text-ms-text-secondary"
            >
              {{ visibleCount }} de {{ columns.length }}
            </div>
          </el-popover>
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
