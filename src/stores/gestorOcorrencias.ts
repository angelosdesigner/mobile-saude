import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GestorCard, GestorStage, StatusPill, StageHeader } from '@/types/gestorOcorrencias'
import { stages } from '@/types/gestorOcorrencias'
import { normalizeFila, normalizeCanal } from '@/data/gestorTaxonomia'
import { fetchGestorBoard } from '@/services/gestorService'
import type { ChipTone } from '@/components/ui/filterChips'

// Chip de estatística do gestor (clicável, multi-seleção como filtro rápido).
interface GestorChipStat {
  key: string
  label: string
  value: number
  tone: ChipTone
  filterable: boolean
}

// "12min" → 12; sem valor → 0. Usado nos predicados de TME.
function minutes(s?: string): number {
  return s ? (parseInt(s, 10) || 0) : 0
}

// Predicados dos chips, derivados dos campos REAIS dos cards (não dos números
// agregados do Figma) — assim a contagem do chip bate com o que o filtro mostra.
// `total` não filtra: limpa a seleção.
const chipDefs: { key: string; label: string; tone: ChipTone; pred: (c: GestorCard) => boolean }[] =
  [
    { key: 'pendentes', label: 'Pendentes do setor', tone: 'warning', pred: (c) => c.stage === 'fila' },
    {
      key: 'tme10',
      label: 'TME acima de 10min',
      tone: 'warning',
      pred: (c) => minutes(c.espera ?? c.tempoAtendimento) > 10,
    },
    {
      key: 'ocup70',
      label: 'Ocupação acima de 70%',
      tone: 'warning',
      pred: (c) => c.stage === 'humano',
    },
    { key: 'alta', label: 'Alta prioridade', tone: 'danger', pred: (c) => c.risco === true },
    {
      key: 'aguardando',
      label: 'Aguardando resposta',
      tone: 'primary',
      pred: (c) => c.stage === 'automatizado',
    },
    {
      key: 'concluido',
      label: 'Concluídos no dia',
      tone: 'success',
      pred: (c) => c.stage === 'concluido',
    },
  ]

// Store da tela operacional do gestor (Ocorrências · modo Quadro).
export const useGestorOcorrenciasStore = defineStore('gestorOcorrencias', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const cards = ref<GestorCard[]>([])
  const statusPills = ref<StatusPill[]>([])
  const headers = ref<StageHeader[]>([])
  const search = ref('')
  // Filtros rápidos (chips) — combinam em OR entre si, em AND com a busca.
  const quickFilters = ref<string[]>([])

  // Filtros de contexto vindos do drill-down (query params do dashboard):
  // canal/fila/atendente/estágio. Cada um combina em AND com os demais.
  interface ContextFilters {
    canal?: string
    fila?: string
    atendente?: string
    stage?: GestorStage
  }
  const contextFilters = ref<ContextFilters>({})

  /** Define os filtros de contexto (drill-down). `undefined` limpa o campo. */
  function setContext(ctx: ContextFilters) {
    contextFilters.value = {
      canal: ctx.canal || undefined,
      fila: ctx.fila || undefined,
      atendente: ctx.atendente || undefined,
      stage: ctx.stage || undefined,
    }
  }

  /** Limpa todos os filtros de contexto. */
  function clearContext() {
    contextFilters.value = {}
  }

  /** Há algum filtro de contexto ativo? */
  const hasContext = computed(() => Object.values(contextFilters.value).some(Boolean))

  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      const data = await fetchGestorBoard()
      cards.value = data.cards
      statusPills.value = data.statusPills
      headers.value = data.headers
      loaded.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar o board'
    } finally {
      loading.value = false
    }
  }

  /** Cards após a busca textual (base para as contagens dos chips). */
  const searched = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return cards.value
    return cards.value.filter(
      (c) =>
        c.beneficiary.toLowerCase().includes(q) ||
        (c.atendente ?? '').toLowerCase().includes(q) ||
        (c.fluxo ?? c.filaTipo ?? '').toLowerCase().includes(q),
    )
  })

  function passesQuick(c: GestorCard): boolean {
    if (!quickFilters.value.length) return true
    return quickFilters.value.some((k) => chipDefs.find((d) => d.key === k)?.pred(c))
  }

  function passesContext(c: GestorCard): boolean {
    const f = contextFilters.value
    // Canal normalizado: "Chat/WhatsApp" casa cards com channel 'Chat' ou 'WhatsApp'.
    if (f.canal && normalizeCanal(c.channel) !== normalizeCanal(f.canal)) return false
    if (f.stage && c.stage !== f.stage) return false
    if (f.atendente && c.atendente !== f.atendente) return false
    // "Fila" casa tanto o tipo de fila quanto o fluxo (Reembolso, Autorização…),
    // pois um mesmo assunto aparece como `fluxo` no BOT e `filaTipo` na fila.
    // Normaliza os dois lados (taxonomia única) para tolerar variações de grafia.
    if (f.fila) {
      const alvo = normalizeFila(f.fila)
      if (normalizeFila(c.filaTipo ?? '') !== alvo && normalizeFila(c.fluxo ?? '') !== alvo)
        return false
    }
    return true
  }

  /** Busca + chips rápidos + contexto (drill-down) — usado na lista e no board. */
  const filtered = computed(() => searched.value.filter(passesQuick).filter(passesContext))

  /** Cards agrupados por estágio (busca + chips). */
  const board = computed(
    () =>
      Object.fromEntries(
        stages.map((s) => [s.key, filtered.value.filter((c) => c.stage === s.key)]),
      ) as Record<GestorStage, GestorCard[]>,
  )

  const headerByStage = computed(
    () =>
      Object.fromEntries(headers.value.map((h) => [h.key, h])) as Record<GestorStage, StageHeader>,
  )

  /** Chips: "Total" (limpa) + um por predicado, com contagem sobre `searched`. */
  const stats = computed<GestorChipStat[]>(() => {
    const list = searched.value
    return [
      { key: 'total', label: 'Total', value: list.length, tone: 'neutral', filterable: false },
      ...chipDefs.map((d) => ({
        key: d.key,
        label: d.label,
        value: list.filter(d.pred).length,
        tone: d.tone,
        filterable: true,
      })),
    ]
  })

  /** Move um card para outro estágio. Retorna false se nenhuma mudança ocorreu. */
  function moveCard(id: number | string, toStage: GestorStage): boolean {
    const card = cards.value.find((c) => c.id === id)
    if (!card || card.stage === toStage) return false
    card.stage = toStage
    return true
  }

  return {
    loading,
    error,
    loaded,
    cards,
    statusPills,
    headers,
    search,
    quickFilters,
    contextFilters,
    hasContext,
    setContext,
    clearContext,
    load,
    passesQuick,
    filtered,
    board,
    headerByStage,
    stats,
    moveCard,
  }
})
