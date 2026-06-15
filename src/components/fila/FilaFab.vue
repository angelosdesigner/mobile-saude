<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import FilaPanel from './FilaPanel.vue'
import { filaStats, type FilaItem } from '@/data/fila'

const router = useRouter()
const open = ref(false)

// Minimizado = só um ícone flutuante; restaura ao clicar. A escolha persiste
// (o widget remonta a cada navegação de rota).
const MIN_KEY = 'ms.fab.fila.min'
const minimized = ref(false)
function setMinimized(v: boolean) {
  minimized.value = v
  if (v) open.value = false
  try {
    localStorage.setItem(MIN_KEY, v ? '1' : '0')
  } catch {
    /* ignore */
  }
}

// ── Drag (mesmo padrão do EquipeStatusFloating) ──────────────────────────────
const el = ref<HTMLElement>()
const pos = ref<{ left: number; top: number } | null>(null)
let dragging = false
let sx = 0, sy = 0, sl = 0, st = 0

function clamp(left: number, top: number) {
  const r = el.value!.getBoundingClientRect()
  return {
    left: Math.max(8, Math.min(left, window.innerWidth - r.width - 8)),
    top: Math.max(8, Math.min(top, window.innerHeight - r.height - 8)),
  }
}
function onDown(e: PointerEvent) {
  e.preventDefault()
  const r = el.value!.getBoundingClientRect()
  if (!pos.value) pos.value = { left: r.left, top: r.top }
  dragging = true
  sx = e.clientX; sy = e.clientY
  sl = pos.value.left; st = pos.value.top
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
function onMove(e: PointerEvent) {
  if (!dragging) return
  pos.value = clamp(sl + (e.clientX - sx), st + (e.clientY - sy))
}
function onUp() {
  dragging = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
}
function onResize() {
  if (pos.value) pos.value = clamp(pos.value.left, pos.value.top)
}
onMounted(() => {
  window.addEventListener('resize', onResize)
  try {
    if (localStorage.getItem(MIN_KEY) === '1') minimized.value = true
  } catch {
    /* ignore */
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
})

// ── Navegação ao selecionar card ─────────────────────────────────────────────
function onCardSelect(item: FilaItem) {
  open.value = false
  router.push(`/ocorrencias/${item.id}`)
}
</script>

<template>
  <div
    ref="el"
    class="fixed z-30"
    :style="pos ? { left: pos.left + 'px', top: pos.top + 'px' } : { left: '24px', bottom: '24px' }"
  >
    <!-- ── Minimizado (só ícone) ────────────────────────────────────────── -->
    <button
      v-if="minimized"
      class="relative flex h-12 w-12 items-center justify-center rounded-full border border-ms-border-light bg-ms-surface text-ms-primary shadow-xl transition hover:shadow-2xl"
      title="Mostrar fila de atendimento"
      aria-label="Mostrar fila de atendimento"
      @click="setMinimized(false)"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
      <span class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ms-danger px-1 text-[10px] font-semibold text-white">
        {{ filaStats.total }}
      </span>
    </button>

    <!-- ── Painel aberto ─────────────────────────────────────────────────── -->
    <div
      v-else-if="open"
      class="w-[400px] overflow-hidden rounded-2xl border border-ms-border-light bg-ms-surface shadow-xl"
    >
      <!-- Header: alça de arrasto + ícone + título + fechar -->
      <div class="flex items-center gap-2 border-b border-ms-border-light px-4 py-3">
        <button
          class="mt-0.5 flex h-6 w-5 shrink-0 cursor-grab items-center justify-center text-ms-text-placeholder transition hover:text-ms-text-secondary active:cursor-grabbing"
          style="touch-action: none"
          title="Arraste para mover"
          @pointerdown="onDown"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
          </svg>
        </button>
        <svg
          class="h-4 w-4 shrink-0 text-ms-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
        <div class="flex-1 text-sm font-semibold text-ms-text-primary">Fila de Atendimento</div>
        <button
          class="shrink-0 rounded-md p-1 text-ms-text-secondary transition hover:bg-ms-fill-light hover:text-ms-text-primary"
          title="Minimizar"
          aria-label="Minimizar"
          @click="setMinimized(true)"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M5 12h14" />
          </svg>
        </button>
        <button
          class="shrink-0 rounded-md p-1 text-ms-text-secondary transition hover:bg-ms-fill-light hover:text-ms-text-primary"
          title="Fechar"
          aria-label="Fechar"
          @click="open = false"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <FilaPanel @select="onCardSelect" />
    </div>

    <!-- ── Widget fechado ─────────────────────────────────────────────────── -->
    <button
      v-else
      class="w-[268px] cursor-pointer rounded-2xl border border-ms-border-light bg-ms-surface p-3 text-left shadow-xl transition hover:shadow-2xl"
      title="Fila de atendimento"
      @click="open = true"
    >
      <!-- Linha 1: alça + ícone + título + badge + chevron -->
      <div class="flex items-center gap-2">
        <span
          class="-ml-1 flex h-5 w-4 shrink-0 cursor-grab items-center justify-center text-ms-text-placeholder transition hover:text-ms-text-secondary active:cursor-grabbing"
          style="touch-action: none"
          title="Arraste para mover"
          @pointerdown.stop="onDown"
          @click.stop
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
          </svg>
        </span>
        <svg
          class="h-4 w-4 shrink-0 text-ms-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
        <span class="flex-1 text-xs font-semibold text-ms-text-primary">Fila de Atendimento</span>
        <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-ms-danger px-1 text-2xs font-semibold text-white">
          {{ filaStats.total }}
        </span>
        <span
          role="button"
          tabindex="0"
          class="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded text-ms-text-secondary transition hover:bg-ms-fill-light hover:text-ms-text-primary"
          title="Minimizar"
          aria-label="Minimizar"
          @click.stop="setMinimized(true)"
          @keydown.enter.stop="setMinimized(true)"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M5 12h14" />
          </svg>
        </span>
        <svg
          class="h-3.5 w-3.5 shrink-0 text-ms-text-secondary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </div>

      <!-- Linha 2: 3 métricas -->
      <div class="mt-2 flex items-center justify-between text-2xs text-ms-text-secondary">
        <span>Aguardando <b class="font-bold text-ms-text-primary">{{ filaStats.total }}</b></span>
        <span>TMEF <b class="font-bold text-ms-warning">{{ filaStats.tmef }}</b></span>
        <span class="flex items-center gap-1">
          <span class="h-1.5 w-1.5 rounded-full bg-ms-warning" />
          Abandono <b class="font-bold text-ms-danger">{{ filaStats.abandono }}</b>
        </span>
      </div>
    </button>
  </div>
</template>
