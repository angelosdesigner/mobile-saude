import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import type { Ocorrencia, ColumnKey, ColumnCfg, SavedFilter, FilterState } from '@/types/ocorrencias'
import { columns, columnLabel } from '@/types/ocorrencias'
import { fetchOcorrencias, updateOcorrenciaColumn } from '@/services/ocorrenciasService'

// Tom semântico dos chips de estatística (a view mapeia para o token de cor).
export type StatTone = 'secondary' | 'danger' | 'warning' | 'primary' | 'success'

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

  // ── Filtros rápidos (chips de estatística clicáveis, multi-seleção) ─────────
  // Camada independente dos dropdowns: combinam em OR entre si e em AND com os
  // dropdowns. As chaves são as dos chips (ver getter `stats`).
  const quickFilters = ref<string[]>([])
  const quickPredicates: Record<string, (o: Ocorrencia) => boolean> = {
    'sla-reg': (o) => o.sla === 'Crítico',
    'sla-int': (o) => o.sla === 'Vencido',
    atencao: (o) => o.sla === 'Atenção',
    alta: (o) => o.prioridade === 'Alta',
    'nao-atrib': (o) => o.atendente === 'Não atribuídos',
  }

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

  /** OR entre os chips ativos; sem chips ativos, não restringe. */
  function passesQuick(o: Ocorrencia): boolean {
    if (!quickFilters.value.length) return true
    return quickFilters.value.some((k) => quickPredicates[k]?.(o))
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
    quickFilters.value = []
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
      (filters.assunto ? 1 : 0) +
      quickFilters.value.length,
  )

  const visibleColumns = computed(() => columnConfig.value.filter((c) => c.visible))
  const allItems = computed(() => columnConfig.value.flatMap((c) => board[c.key]))

  /** Conjunto após dropdowns/busca (antes dos chips) — base para as contagens. */
  const baseList = computed(() => allItems.value.filter(passesFilter))
  const filteredList = computed(() => baseList.value.filter(passesQuick))

  /** Board já filtrado por coluna — dropdowns/busca + chips rápidos. */
  const filteredBoard = computed(
    () =>
      Object.fromEntries(
        columns.map((c) => [c, board[c].filter((o) => passesFilter(o) && passesQuick(o))]),
      ) as Record<ColumnKey, Ocorrencia[]>,
  )

  /**
   * Estatísticas (chips). As contagens derivam do conjunto pós-dropdowns
   * (`baseList`), portanto NÃO mudam ao (des)marcar chips — o que dá segmentos
   * estáveis. Emite um TOM semântico (não cor) + a `key` usada como filtro.
   */
  const stats = computed(
    (): { key: string; label: string; value: number; tone: StatTone; filterable: boolean }[] => {
      const list = baseList.value
      return [
        { key: 'total', label: 'Total', value: list.length, tone: 'secondary', filterable: false },
        {
          key: 'sla-reg',
          label: 'SLA regulatório',
          value: list.filter((o) => o.sla === 'Crítico').length,
          tone: 'danger',
          filterable: true,
        },
        {
          key: 'sla-int',
          label: 'SLA interno',
          value: list.filter((o) => o.sla === 'Vencido').length,
          tone: 'danger',
          filterable: true,
        },
        {
          key: 'atencao',
          label: 'Atenção',
          value: list.filter((o) => o.sla === 'Atenção').length,
          tone: 'warning',
          filterable: true,
        },
        {
          key: 'alta',
          label: 'Alta prioridade',
          value: list.filter((o) => o.prioridade === 'Alta').length,
          tone: 'danger',
          filterable: true,
        },
        {
          key: 'nao-atrib',
          label: 'Não atribuídos',
          value: list.filter((o) => o.atendente === 'Não atribuídos').length,
          tone: 'secondary',
          filterable: true,
        },
      ]
    },
  )

  return {
    // estado
    loading,
    error,
    loaded,
    board,
    filters,
    quickFilters,
    columnConfig,
    savedFilters,
    // ações
    load,
    passesFilter,
    passesQuick,
    applyPreset,
    clearFilters,
    moveCard,
    findById,
    // getters
    activeFilterCount,
    visibleColumns,
    filteredList,
    filteredBoard,
    stats,
  }
})
