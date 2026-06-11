<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Container flutuante arrastável. Posição inicial: rodapé central, 40px do fundo.
// Arrasta-se pela alça (grip); os botões internos continuam clicáveis.
const el = ref<HTMLElement>()
const pos = ref<{ left: number; top: number } | null>(null)

let dragging = false
let sx = 0
let sy = 0
let sl = 0
let st = 0

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
  // Na primeira interação, "fixa" a posição atual (vinda do CSS) em left/top.
  if (!pos.value) pos.value = { left: r.left, top: r.top }
  dragging = true
  sx = e.clientX
  sy = e.clientY
  sl = pos.value.left
  st = pos.value.top
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

onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
})
</script>

<template>
  <div
    ref="el"
    class="fixed z-30 flex items-center gap-2"
    :style="
      pos
        ? { left: pos.left + 'px', top: pos.top + 'px' }
        : { left: '50%', bottom: '40px', transform: 'translateX(-50%)' }
    "
  >
    <!-- Alça de arrastar -->
    <button
      class="flex h-12 w-6 cursor-grab items-center justify-center rounded-xl bg-white text-ms-text-placeholder shadow-lg transition hover:text-ms-text-secondary active:cursor-grabbing"
      style="touch-action: none"
      title="Arraste para mover"
      @pointerdown="onDown"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    </button>

    <slot />
  </div>
</template>
