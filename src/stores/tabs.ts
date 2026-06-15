import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

// Store das abas da navbar (SplitView · Fase 1). Cada aba = uma tela aberta
// (uma aba por `path`, guardando o último `fullPath` p/ navegar). O store já é
// "split-ready": a Fase 2 (painéis lado a lado) entra como uma camada acima
// desta lista, sem reescrever a base.
export interface AppTab {
  /** Identidade da aba = route.path (uma aba por tela). */
  id: string
  title: string
  /** Última URL completa (com query) para navegação. */
  fullPath: string
  closable: boolean
}

const STORAGE_KEY = 'ms.tabs'

// Painel secundário (iframe `?embed=1`): não persiste abas, p/ não poluir o
// estado compartilhado da instância principal.
const inIframe = typeof window !== 'undefined' && window.self !== window.top

function load(): AppTab[] {
  if (inIframe) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<AppTab[]>(load())
  const activeId = ref<string>('')

  watch(
    tabs,
    () => {
      if (inIframe) return
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs.value))
      } catch {
        /* ignore */
      }
    },
    { deep: true },
  )

  const activeIndex = computed(() => tabs.value.findIndex((t) => t.id === activeId.value))

  // Sincroniza a aba com a rota atual (chamado pelo router.afterEach): cria a
  // aba se não existir, atualiza a URL/título, e a torna ativa.
  function syncFromRoute(route: RouteLocationNormalized) {
    const id = route.path
    const title = (route.meta.title as string) || 'Tela'
    const fullPath = route.fullPath
    const existing = tabs.value.find((t) => t.id === id)
    if (existing) {
      existing.fullPath = fullPath
      existing.title = title
    } else {
      tabs.value.push({ id, title, fullPath, closable: true })
    }
    activeId.value = id
  }

  // Fecha uma aba. Retorna o `fullPath` para onde navegar (quando a aba ativa
  // é fechada), ou null quando não há navegação a fazer.
  function closeTab(id: string): string | null {
    const idx = tabs.value.findIndex((t) => t.id === id)
    if (idx < 0) return null
    const wasActive = activeId.value === id
    tabs.value.splice(idx, 1)
    if (!wasActive) return null
    const next = tabs.value[idx] ?? tabs.value[idx - 1] ?? null
    activeId.value = next?.id ?? ''
    return next?.fullPath ?? null
  }

  return { tabs, activeId, activeIndex, syncFromRoute, closeTab }
})
