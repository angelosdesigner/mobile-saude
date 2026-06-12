import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  GestorCard,
  GestorStage,
  StatusPill,
  GestorStat,
  StageHeader,
} from '@/types/gestorOcorrencias'
import { stages } from '@/types/gestorOcorrencias'
import { fetchGestorBoard } from '@/services/gestorService'

// Store da tela operacional do gestor (Ocorrências · modo Quadro).
export const useGestorOcorrenciasStore = defineStore('gestorOcorrencias', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const cards = ref<GestorCard[]>([])
  const statusPills = ref<StatusPill[]>([])
  const stats = ref<GestorStat[]>([])
  const headers = ref<StageHeader[]>([])
  const search = ref('')

  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      const data = await fetchGestorBoard()
      cards.value = data.cards
      statusPills.value = data.statusPills
      stats.value = data.stats
      headers.value = data.headers
      loaded.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar o board'
    } finally {
      loading.value = false
    }
  }

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return cards.value
    return cards.value.filter(
      (c) =>
        c.beneficiary.toLowerCase().includes(q) ||
        (c.atendente ?? '').toLowerCase().includes(q) ||
        (c.fluxo ?? c.filaTipo ?? '').toLowerCase().includes(q),
    )
  })

  /** Cards agrupados por estágio (respeitando a busca). */
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

  return {
    loading,
    error,
    loaded,
    cards,
    statusPills,
    stats,
    headers,
    search,
    load,
    filtered,
    board,
    headerByStage,
  }
})
