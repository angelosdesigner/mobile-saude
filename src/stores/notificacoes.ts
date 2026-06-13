import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import type { Notificacao, NotifCategory } from '@/types/notificacoes'
// `categorias` é string[] (e não NotifCategory[]) para casar com o v-model do
// FilterChips sem atrito de variância; os valores são chaves de NotifCategory.
import { useProfileStore } from '@/stores/profile'
import { fetchNotificacoes } from '@/services/notificacoesService'

// Store da Central de Notificações. Fonte única: alimenta o dropdown do topbar
// (recentes + contador) e a tela cheia (filtros + agrupamento). O escopo segue
// o papel atual (gestor vê 'gestor'+'todos'; atendente vê 'atendente'+'todos').
export const useNotificacoesStore = defineStore('notificacoes', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)
  const items = ref<Notificacao[]>([])

  // Filtros da tela cheia.
  const filters = reactive<{
    categorias: string[]
    setores: string[]
    atendentes: string[]
    unreadOnly: boolean
  }>({ categorias: [], setores: [], atendentes: [], unreadOnly: false })

  async function load(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      items.value = await fetchNotificacoes()
      loaded.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar notificações'
    } finally {
      loading.value = false
    }
  }

  // Notificações visíveis ao papel atual (base para tudo).
  const scoped = computed(() => {
    const isGestor = useProfileStore().isGestor
    const mine = isGestor ? 'gestor' : 'atendente'
    return items.value.filter((n) => n.audience === mine || n.audience === 'todos')
  })

  const unreadCount = computed(() => scoped.value.filter((n) => n.unread).length)

  // Recentes para o dropdown do topbar.
  const recent = computed(() => scoped.value.slice(0, 5))

  // Contagem por categoria (sobre o escopo, antes dos filtros) — chips estáveis.
  const categoryCounts = computed(() => {
    const map = {} as Record<NotifCategory, number>
    for (const n of scoped.value) map[n.category] = (map[n.category] ?? 0) + 1
    return map
  })

  const filteredList = computed(() =>
    scoped.value.filter(
      (n) =>
        (!filters.categorias.length || filters.categorias.includes(n.category)) &&
        (!filters.setores.length || (n.setor != null && filters.setores.includes(n.setor))) &&
        (!filters.atendentes.length ||
          (n.atendente != null && filters.atendentes.includes(n.atendente))) &&
        (!filters.unreadOnly || n.unread),
    ),
  )

  const activeFilterCount = computed(
    () =>
      filters.categorias.length +
      filters.setores.length +
      filters.atendentes.length +
      (filters.unreadOnly ? 1 : 0),
  )

  function clearFilters() {
    filters.categorias = []
    filters.setores = []
    filters.atendentes = []
    filters.unreadOnly = false
  }

  function markAllRead() {
    // Só marca as do escopo atual (não mexe nas do outro papel).
    const ids = new Set(scoped.value.map((n) => n.id))
    items.value.forEach((n) => {
      if (ids.has(n.id)) n.unread = false
    })
  }

  function markRead(id: number) {
    const n = items.value.find((x) => x.id === id)
    if (n) n.unread = false
  }

  return {
    loading,
    error,
    loaded,
    items,
    filters,
    load,
    scoped,
    unreadCount,
    recent,
    categoryCounts,
    filteredList,
    activeFilterCount,
    clearFilters,
    markAllRead,
    markRead,
  }
})
