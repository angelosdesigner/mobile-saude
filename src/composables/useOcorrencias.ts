import { reactive, ref, computed } from 'vue'
import {
  ocorrencias as seed,
  columns as allColumns,
  type Ocorrencia,
  type ColumnKey,
} from '@/data/ocorrencias'

// Rótulo "humano" de cada coluna (usado no Configurar colunas e nas mensagens).
export const columnLabel: Record<ColumnKey, string> = {
  NOVO: 'Novo',
  'EM ATENDIMENTO': 'Em atendimento',
  'EM ESPERA': 'Em espera',
  ENCAMINHAMENTOS: 'Encaminhamentos',
  'CONCLUÍDOS NO DIA': 'Concluídos no dia',
}

export interface ColumnCfg {
  key: ColumnKey
  label: string
  visible: boolean
}

// Estado compartilhado (module-level → persiste entre Board/Lista e troca de view).
const board = reactive(
  Object.fromEntries(
    allColumns.map((c) => [c, seed.filter((o) => o.column === c).map((o) => ({ ...o }))]),
  ) as Record<ColumnKey, Ocorrencia[]>,
)

const filters = reactive({
  prioridade: [] as string[],
  sla: [] as string[],
  tipoOcorrencia: [] as string[],
  tipoAtendimento: [] as string[],
  atendente: [] as string[],
})

const columnConfig = ref<ColumnCfg[]>(
  allColumns.map((c) => ({ key: c, label: columnLabel[c], visible: true })),
)

export function useOcorrencias() {
  const passesFilter = (o: Ocorrencia) =>
    (!filters.prioridade.length || filters.prioridade.includes(o.prioridade)) &&
    (!filters.sla.length || filters.sla.includes(o.sla)) &&
    (!filters.tipoOcorrencia.length || filters.tipoOcorrencia.includes(o.tipoOcorrencia)) &&
    (!filters.tipoAtendimento.length || filters.tipoAtendimento.includes(o.tipoAtendimento)) &&
    (!filters.atendente.length || filters.atendente.includes(o.atendente))

  const activeFilterCount = computed(
    () =>
      filters.prioridade.length +
      filters.sla.length +
      filters.tipoOcorrencia.length +
      filters.tipoAtendimento.length +
      filters.atendente.length,
  )

  const visibleColumns = computed(() => columnConfig.value.filter((c) => c.visible))

  const allItems = computed(() => columnConfig.value.flatMap((c) => board[c.key]))
  const filteredList = computed(() => allItems.value.filter(passesFilter))

  const visibleCount = (col: ColumnKey) => board[col].filter(passesFilter).length

  // Drag-and-drop: ao soltar um card numa coluna, atualiza seu status (coluna).
  function onColumnChange(col: ColumnKey, evt: { added?: { element: Ocorrencia } }) {
    if (evt.added) evt.added.element.column = col
  }

  function clearFilters() {
    filters.prioridade = []
    filters.sla = []
    filters.tipoOcorrencia = []
    filters.tipoAtendimento = []
    filters.atendente = []
  }

  return {
    board,
    filters,
    columnConfig,
    passesFilter,
    activeFilterCount,
    visibleColumns,
    filteredList,
    visibleCount,
    onColumnChange,
    clearFilters,
  }
}
