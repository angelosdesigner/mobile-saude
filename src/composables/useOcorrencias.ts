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
  status: [] as string[], // chaves de coluna (usado pelos filtros avançados)
  assunto: '' as string,
})

export interface NotificacaoItem {
  id: number
  type: 'warning' | 'info' | 'danger' | 'success'
  title: string
  desc: string
  time: string
  unread: boolean
}

const notifications = ref<NotificacaoItem[]>([
  { id: 1, type: 'warning', title: 'Atenção ao SLA de autorizações', desc: 'Volume acima da média hoje. Priorize casos com menor tempo restante.', time: '10min atrás', unread: true },
  { id: 2, type: 'info', title: 'Atualização de política', desc: 'Nova política de autorização entra em vigor em 01/04. Consulte o manual atualizado.', time: '1h atrás', unread: true },
  { id: 3, type: 'danger', title: 'Sistema de telefonia instável', desc: 'Possíveis intermitências no ramal. Equipe técnica já foi acionada.', time: '2h atrás', unread: true },
  { id: 4, type: 'info', title: 'Reunião de equipe agendada', desc: 'Reunião semanal de alinhamento será às 14h na sala de conferências.', time: '3h atrás', unread: false },
  { id: 5, type: 'success', title: 'Parabéns! Meta atingida', desc: 'Você completou 20 atendimentos ontem. Excelente trabalho!', time: '1d atrás', unread: false },
])

// Filtros salvos (presets).
export interface SavedFilter {
  name: string
  apply: Partial<Record<'prioridade' | 'sla' | 'tipoOcorrencia' | 'tipoAtendimento' | 'atendente', string[]>>
}
const savedFilters: SavedFilter[] = [
  { name: 'Prioridade alta + Vencido', apply: { prioridade: ['Alta'], sla: ['Vencido'] } },
  { name: 'Reembolsos críticos', apply: { tipoOcorrencia: ['Reembolso'], sla: ['Crítico'] } },
  { name: 'Não atribuídos', apply: { atendente: ['Não atribuídos'] } },
]

const columnConfig = ref<ColumnCfg[]>(
  allColumns.map((c) => ({ key: c, label: columnLabel[c], visible: true })),
)

export function useOcorrencias() {
  const passesFilter = (o: Ocorrencia) =>
    (!filters.prioridade.length || filters.prioridade.includes(o.prioridade)) &&
    (!filters.sla.length || filters.sla.includes(o.sla)) &&
    (!filters.tipoOcorrencia.length || filters.tipoOcorrencia.includes(o.tipoOcorrencia)) &&
    (!filters.tipoAtendimento.length || filters.tipoAtendimento.includes(o.tipoAtendimento)) &&
    (!filters.atendente.length || filters.atendente.includes(o.atendente)) &&
    (!filters.status.length || filters.status.includes(o.column)) &&
    (!filters.assunto || `${o.assunto} ${o.tipo}`.toLowerCase().includes(filters.assunto.toLowerCase()))

  const activeFilterCount = computed(
    () =>
      filters.prioridade.length +
      filters.sla.length +
      filters.tipoOcorrencia.length +
      filters.tipoAtendimento.length +
      filters.atendente.length +
      filters.status.length +
      (filters.assunto ? 1 : 0),
  )

  function applyPreset(p: SavedFilter) {
    clearFilters()
    Object.assign(filters, p.apply)
  }

  function markAllRead() {
    notifications.value.forEach((n) => (n.unread = false))
  }
  const unreadCount = computed(() => notifications.value.filter((n) => n.unread).length)

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
    filters.status = []
    filters.assunto = ''
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
    notifications,
    unreadCount,
    markAllRead,
    savedFilters,
    applyPreset,
  }
}
