import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import type {
  Ocorrencia,
  ColumnKey,
  ColumnCfg,
  NotificacaoItem,
  SavedFilter,
  FilterState,
} from '@/types/ocorrencias'
import { columns, columnLabel } from '@/types/ocorrencias'
import { fetchOcorrencias, updateOcorrenciaColumn } from '@/services/ocorrenciasService'

// Store da feature "Ocorrências". Substitui o antigo composable de estado
// module-level: o estado agora é explícito, testável (cada teste cria uma
// instância limpa via `createPinia`) e resetável, e os dados vêm da camada de
// serviço (`load()`), não de um import direto de fixtures.
export const useOcorrenciasStore = defineStore('ocorrencias', () => {
  // ── Estado de carregamento ────────────────────────────────────────────────
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  // ── Board (kanban) indexado por coluna ──────────────────────────────────────
  const board = reactive(
    Object.fromEntries(columns.map((c) => [c, [] as Ocorrencia[]])) as Record<
      ColumnKey,
      Ocorrencia[]
    >,
  )

  // ── Filtros ──────────────────────────────────────────────────────────────
  const filters = reactive<FilterState>({
    prioridade: [],
    sla: [],
    tipoOcorrencia: [],
    tipoAtendimento: [],
    atendente: [],
    status: [],
    assunto: '',
  })

  // ── Notificações ───────────────────────────────────────────────────────────
  const notifications = ref<NotificacaoItem[]>([
    {
      id: 1,
      type: 'warning',
      title: 'Atenção ao SLA de autorizações',
      desc: 'Volume acima da média hoje. Priorize casos com menor tempo restante.',
      time: '10min atrás',
      unread: true,
    },
    {
      id: 2,
      type: 'info',
      title: 'Atualização de política',
      desc: 'Nova política de autorização entra em vigor em 01/04. Consulte o manual atualizado.',
      time: '1h atrás',
      unread: true,
    },
    {
      id: 3,
      type: 'danger',
      title: 'Sistema de telefonia instável',
      desc: 'Possíveis intermitências no ramal. Equipe técnica já foi acionada.',
      time: '2h atrás',
      unread: true,
    },
    {
      id: 4,
      type: 'info',
      title: 'Reunião de equipe agendada',
      desc: 'Reunião semanal de alinhamento será às 14h na sala de conferências.',
      time: '3h atrás',
      unread: false,
    },
    {
      id: 5,
      type: 'success',
      title: 'Parabéns! Meta atingida',
      desc: 'Você completou 20 atendimentos ontem. Excelente trabalho!',
      time: '1d atrás',
      unread: false,
    },
  ])

  // ── Filtros salvos (presets) ────────────────────────────────────────────────
  const savedFilters: SavedFilter[] = [
    { name: 'Prioridade alta + Vencido', apply: { prioridade: ['Alta'], sla: ['Vencido'] } },
    { name: 'Reembolsos críticos', apply: { tipoOcorrencia: ['Reembolso'], sla: ['Crítico'] } },
    { name: 'Não atribuídos', apply: { atendente: ['Não atribuídos'] } },
  ]

  // ── Configuração de colunas visíveis ─────────────────────────────────────────
  const columnConfig = ref<ColumnCfg[]>(
    columns.map((c) => ({ key: c, label: columnLabel[c], visible: true })),
  )

  // ── Ações ──────────────────────────────────────────────────────────────────
  /** Carrega as ocorrências via serviço e distribui por coluna (uma única vez). */
  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      const data = await fetchOcorrencias()
      columns.forEach((c) => {
        board[c] = []
      })
      for (const o of data) board[o.column].push(o)
      loaded.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar ocorrências'
    } finally {
      loading.value = false
    }
  }

  function passesFilter(o: Ocorrencia): boolean {
    return (
      (!filters.prioridade.length || filters.prioridade.includes(o.prioridade)) &&
      (!filters.sla.length || filters.sla.includes(o.sla)) &&
      (!filters.tipoOcorrencia.length || filters.tipoOcorrencia.includes(o.tipoOcorrencia)) &&
      (!filters.tipoAtendimento.length || filters.tipoAtendimento.includes(o.tipoAtendimento)) &&
      (!filters.atendente.length || filters.atendente.includes(o.atendente)) &&
      (!filters.status.length || filters.status.includes(o.column)) &&
      (!filters.assunto ||
        `${o.assunto} ${o.tipo}`.toLowerCase().includes(filters.assunto.toLowerCase()))
    )
  }

  function applyPreset(p: SavedFilter) {
    clearFilters()
    Object.assign(filters, p.apply)
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

  function markAllRead() {
    notifications.value.forEach((n) => (n.unread = false))
  }

  /**
   * Move um card para outra coluna, atualiza seu status e persiste via serviço.
   * Retorna `true` quando a coluna efetivamente mudou (para a UI dar feedback).
   */
  async function moveCard(id: number, toCol: ColumnKey): Promise<boolean> {
    let moved: Ocorrencia | undefined
    let fromCol: ColumnKey | undefined
    for (const k of columns) {
      const i = board[k].findIndex((x) => x.id === id)
      if (i >= 0) {
        fromCol = k
        moved = board[k].splice(i, 1)[0]
        break
      }
    }
    if (!moved) return false
    moved.column = toCol
    board[toCol].push(moved)
    if (fromCol === toCol) return false
    await updateOcorrenciaColumn(id, toCol)
    return true
  }

  function findById(id: number): Ocorrencia | undefined {
    for (const c of columns) {
      const found = board[c].find((o) => o.id === id)
      if (found) return found
    }
    return undefined
  }

  // ── Getters ──────────────────────────────────────────────────────────────
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

  const unreadCount = computed(() => notifications.value.filter((n) => n.unread).length)
  const visibleColumns = computed(() => columnConfig.value.filter((c) => c.visible))
  const allItems = computed(() => columnConfig.value.flatMap((c) => board[c.key]))
  const filteredList = computed(() => allItems.value.filter(passesFilter))

  /** Board já filtrado por coluna — usado no template em vez de `v-show`. */
  const filteredBoard = computed(
    () =>
      Object.fromEntries(columns.map((c) => [c, board[c].filter(passesFilter)])) as Record<
        ColumnKey,
        Ocorrencia[]
      >,
  )

  /** Estatísticas derivadas do conjunto filtrado (não mais hardcoded). */
  const stats = computed(() => {
    const list = filteredList.value
    return [
      { label: 'Total', value: list.length, color: '#909399' },
      {
        label: 'SLA regulatório',
        value: list.filter((o) => o.sla === 'Crítico').length,
        color: '#F56C6C',
      },
      {
        label: 'SLA interno',
        value: list.filter((o) => o.sla === 'Vencido').length,
        color: '#F56C6C',
      },
      { label: 'Atenção', value: list.filter((o) => o.sla === 'Atenção').length, color: '#E6A23C' },
      {
        label: 'Alta prioridade',
        value: list.filter((o) => o.prioridade === 'Alta').length,
        color: '#F56C6C',
      },
      {
        label: 'Não atribuídos',
        value: list.filter((o) => o.atendente === 'Não atribuídos').length,
        color: '#909399',
      },
    ]
  })

  return {
    // estado
    loading,
    error,
    loaded,
    board,
    filters,
    notifications,
    columnConfig,
    savedFilters,
    // ações
    load,
    passesFilter,
    applyPreset,
    clearFilters,
    markAllRead,
    moveCard,
    findById,
    // getters
    activeFilterCount,
    unreadCount,
    visibleColumns,
    filteredList,
    filteredBoard,
    stats,
  }
})
