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
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
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
    paginated?: boolean
    pageSizes?: number[]
    defaultPageSize?: number
    topScrollbar?: boolean
  }>(),
  {
    rowKey: 'id',
    expandable: true,
    selectable: true,
    actions: true,
    emptyText: 'Nenhum registro',
    countLabel: 'registros',
    paginated: true,
    pageSizes: () => [10, 20, 50, 100],
    defaultPageSize: 10,
    topScrollbar: false,
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

// Comparador para colunas com `sortBy` (valor de ordenação custom). Strings
// comparam por locale pt-BR; números, numericamente. El Plus alterna asc/desc.
function sortByColumn(c: DataListColumn) {
  return (a: T, b: T) => {
    const va = c.sortBy!(a)
    const vb = c.sortBy!(b)
    if (typeof va === 'number' && typeof vb === 'number') return va - vb
    return String(va).localeCompare(String(vb), 'pt-BR')
  }
}

// ── Paginação (1–10, 1–20, …) ───────────────────────────────────────────────
const page = ref(1)
const pageSize = ref(props.defaultPageSize)
const pagedRows = computed(() =>
  props.paginated
    ? props.rows.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
    : props.rows,
)
// Volta à 1ª página quando o conjunto muda (filtro/busca).
watch(
  () => props.rows.length,
  () => {
    page.value = 1
  },
)

const headerCellStyle = {
  background: 'var(--color-ms-fill-light)',
  color: 'var(--color-ms-text-secondary)',
  fontWeight: '600',
  fontSize: '12px',
}

// ── Top scrollbar + drag-to-scroll (horizontais, sincronizados) ─────────────
const tableWrap = ref<HTMLElement>()
const topBar = ref<HTMLElement>()
const topInner = ref<HTMLElement>()
let scrollRo: ResizeObserver | null = null
let syncLock = false

function getBodyWrapper(): HTMLElement | null {
  if (!tableWrap.value) return null
  // EP 2.x wraps table body in el-scrollbar; the scrollable el is .el-scrollbar__wrap
  return (tableWrap.value.querySelector('.el-table__body-wrapper .el-scrollbar__wrap') ??
    tableWrap.value.querySelector('.el-table__body-wrapper')) as HTMLElement | null
}

function syncInnerWidth() {
  const bw = getBodyWrapper()
  if (!bw || !topInner.value) return
  topInner.value.style.width = bw.scrollWidth + 'px'
}

function onTopScroll() {
  if (syncLock) return
  const bw = getBodyWrapper()
  if (!bw || !topBar.value) return
  syncLock = true
  bw.scrollLeft = topBar.value.scrollLeft
  syncLock = false
}

function onBodyScroll() {
  if (syncLock) return
  const bw = getBodyWrapper()
  if (!bw || !topBar.value) return
  syncLock = true
  topBar.value.scrollLeft = bw.scrollLeft
  syncLock = false
}

// ── Drag to scroll (arrastar na área da tabela desloca horizontalmente) ───────
const DRAG_IGNORE = 'button, a, input, textarea, select, [role="button"], .el-checkbox, .el-button, .el-tag'
let dragDown = false, dragMoved = false
let dragSx = 0, dragSl = 0

function onTablePointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  if ((e.target as Element).closest(DRAG_IGNORE)) return
  const bw = getBodyWrapper()
  if (!bw) return
  dragDown = true
  dragMoved = false
  dragSx = e.clientX
  dragSl = bw.scrollLeft
  window.addEventListener('pointermove', onTablePointerMove)
  window.addEventListener('pointerup', onTablePointerUp)
}

function onTablePointerMove(e: PointerEvent) {
  if (!dragDown) return
  const dx = e.clientX - dragSx
  if (!dragMoved && Math.abs(dx) < 4) return
  dragMoved = true
  document.body.style.cursor = 'grabbing'
  document.body.style.userSelect = 'none'
  const bw = getBodyWrapper()
  if (bw) bw.scrollLeft = dragSl - dx
}

function onTablePointerUp() {
  if (!dragDown) return
  dragDown = false
  window.removeEventListener('pointermove', onTablePointerMove)
  window.removeEventListener('pointerup', onTablePointerUp)
  if (dragMoved) {
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    dragMoved = false
  }
}

onMounted(() => {
  if (!props.topScrollbar) return
  nextTick(() => {
    const bw = getBodyWrapper()
    if (bw) {
      bw.addEventListener('scroll', onBodyScroll, { passive: true })
      scrollRo = new ResizeObserver(syncInnerWidth)
      scrollRo.observe(bw)
      syncInnerWidth()
    }
    tableWrap.value?.addEventListener('pointerdown', onTablePointerDown)
  })
})

onBeforeUnmount(() => {
  scrollRo?.disconnect()
  const bw = getBodyWrapper()
  if (bw) bw.removeEventListener('scroll', onBodyScroll)
  tableWrap.value?.removeEventListener('pointerdown', onTablePointerDown)
  window.removeEventListener('pointermove', onTablePointerMove)
  window.removeEventListener('pointerup', onTablePointerUp)
})
</script>

<template>
  <el-card shadow="never" body-class="!p-0" class="!border-ms-border-light">
    <!-- Top scrollbar — sincronizada com o scroll horizontal do corpo da tabela -->
    <div
      v-if="topScrollbar"
      ref="topBar"
      class="top-scrollbar-bar overflow-x-auto overflow-y-hidden"
      @scroll.passive="onTopScroll"
    >
      <div ref="topInner" style="height: 1px; min-width: 100%" />
    </div>

    <div ref="tableWrap" :class="{ 'has-top-scrollbar': topScrollbar }">
    <el-table
      :data="pagedRows"
      :row-key="rowKey"
      :header-cell-style="headerCellStyle"
      :empty-text="emptyText"
      border
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
        :sortable="c.sortBy ? true : c.sortable"
        :sort-method="c.sortBy ? sortByColumn(c) : undefined"
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
            <el-button
              text
              circle
              size="small"
              title="Visualizar"
              aria-label="Visualizar"
              @click="emit('visualizar', row)"
            >
              <AppIcon name="eye" class="h-4 w-4 text-ms-text-regular" />
            </el-button>
            <el-button
              text
              circle
              size="small"
              title="Editar"
              aria-label="Editar"
              @click="emit('editar', row)"
            >
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
    </div><!-- /tableWrap -->


    <!-- Rodapé: ações + paginação (estilo Jira) -->
    <div
      class="flex flex-wrap items-center justify-between gap-2 border-t border-ms-border-light px-4 py-2.5 text-sm text-ms-text-secondary"
    >
      <div class="flex items-center gap-3">
        <slot name="footer-actions"><span /></slot>
        <span>{{ rows.length }} {{ countLabel }}</span>
      </div>
      <el-pagination
        v-if="paginated"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="rows.length"
        size="small"
        background
        layout="sizes, prev, pager, next, jumper"
      />
    </div>
  </el-card>
</template>

<style scoped>
/* ── Top scrollbar: visualmente idêntica à barra inferior do EP ─────────────── */
.top-scrollbar-bar {
  height: 8px;
  scrollbar-width: thin;                          /* Firefox */
  scrollbar-color: var(--ms-gray-500) transparent; /* Firefox: thumb / track */
}
.top-scrollbar-bar::-webkit-scrollbar {
  height: 6px;
}
.top-scrollbar-bar::-webkit-scrollbar-track {
  background: transparent;
}
.top-scrollbar-bar::-webkit-scrollbar-thumb {
  background-color: var(--ms-gray-500);
  border-radius: 4px;
}

/* ── Oculta a barra inferior do EP quando a barra superior está ativa ────────── */
.has-top-scrollbar :deep(.el-scrollbar__bar.is-horizontal) {
  display: none !important;
}
</style>
