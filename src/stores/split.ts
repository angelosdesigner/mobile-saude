import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// SplitView · Fase 2 — segundo painel (lado a lado) aberto ao arrastar uma aba.
// O painel secundário é renderizado como um iframe embutido (`?embed=1`), uma
// view independente — evita o conflito de "duas rotas ativas" do vue-router.
export interface SplitPane {
  path: string
  title: string
}

// Instância rodando dentro de um iframe (o painel secundário): não persiste
// nem reabre split, p/ não recursar nem poluir o estado compartilhado.
const inIframe = typeof window !== 'undefined' && window.self !== window.top

const KEY = 'ms.split'
function load(): { secondary: SplitPane | null; width: number } {
  if (inIframe) return { secondary: null, width: 50 }
  try {
    const r = JSON.parse(localStorage.getItem(KEY) || '{}')
    return { secondary: r.secondary ?? null, width: typeof r.width === 'number' ? r.width : 50 }
  } catch {
    return { secondary: null, width: 50 }
  }
}

export const useSplitStore = defineStore('split', () => {
  const init = load()
  const secondary = ref<SplitPane | null>(init.secondary)
  /** Largura do painel secundário (direita), em % da área de conteúdo. */
  const width = ref<number>(init.width)
  /** Aba sendo arrastada (não persiste) — controla o drop zone. */
  const dragPane = ref<SplitPane | null>(null)

  const isSplit = computed(() => secondary.value !== null)
  const isDragging = computed(() => dragPane.value !== null)

  watch(
    [secondary, width],
    () => {
      if (inIframe) return
      try {
        localStorage.setItem(KEY, JSON.stringify({ secondary: secondary.value, width: width.value }))
      } catch {
        /* ignore */
      }
    },
    { deep: true },
  )

  function openSplit(p: SplitPane) {
    if (p?.path) secondary.value = { ...p }
  }
  function closeSplit() {
    secondary.value = null
  }
  function startDrag(p: SplitPane) {
    dragPane.value = { ...p }
  }
  function endDrag() {
    dragPane.value = null
  }
  function setWidth(pct: number) {
    width.value = Math.min(75, Math.max(25, pct))
  }

  return {
    secondary,
    width,
    dragPane,
    isSplit,
    isDragging,
    openSplit,
    closeSplit,
    startDrag,
    endDrag,
    setWidth,
  }
})
