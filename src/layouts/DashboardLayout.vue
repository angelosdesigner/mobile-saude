<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import FilaFab from '@/components/fila/FilaFab.vue'
import EquipeStatusFloating from '@/components/gestor/EquipeStatusFloating.vue'
import { useProfileStore } from '@/stores/profile'
import { useSplitStore } from '@/stores/split'

const { hasQueue } = storeToRefs(useProfileStore())
const route = useRoute()

// Mostra o status das equipes em todas as telas do gestor (/gestor/*),
// independente do role selecionado no switcher — garante persistência.
const showEquipeStatus = computed(() => route.path.startsWith('/gestor'))

// ── SplitView ────────────────────────────────────────────────────────────────
// Modo embutido: a tela é renderizada dentro de um iframe (painel secundário)
// com `?embed=1` — esconde sidebar/topbar/FABs, mostrando só o conteúdo.
const isEmbed = computed(() => route.query.embed === '1')

const splitStore = useSplitStore()
const { secondary, width, isSplit, isDragging } = storeToRefs(splitStore)

// URL do painel secundário com o flag de embed preservando query existente.
const embedSrc = computed(() => {
  const p = secondary.value?.path
  if (!p) return ''
  return p.includes('?') ? `${p}&embed=1` : `${p}?embed=1`
})

function onDrop() {
  if (splitStore.dragPane) splitStore.openSplit(splitStore.dragPane)
  splitStore.endDrag()
}

// Resizer do divisor entre os painéis.
const contentRow = ref<HTMLElement>()
let resizing = false
function onResizeDown(e: PointerEvent) {
  e.preventDefault()
  resizing = true
  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', onResizeUp)
}
function onResizeMove(e: PointerEvent) {
  if (!resizing || !contentRow.value) return
  const r = contentRow.value.getBoundingClientRect()
  splitStore.setWidth(((r.right - e.clientX) / r.width) * 100)
}
function onResizeUp() {
  resizing = false
  window.removeEventListener('pointermove', onResizeMove)
  window.removeEventListener('pointerup', onResizeUp)
}
</script>

<template>
  <!-- Painel secundário (embutido no iframe): só o conteúdo, sem o shell. -->
  <div v-if="isEmbed" class="h-dvh w-full overflow-y-auto overflow-x-hidden bg-ms-bg">
    <div class="min-w-0 px-6 py-6"><slot /></div>
  </div>

  <!-- Shell completo (sidebar + topbar + conteúdo, com split opcional). -->
  <div v-else class="flex h-dvh w-full overflow-hidden bg-ms-bg">
    <AppSidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTopbar />

      <!-- Linha de conteúdo: painel principal (+ divisor + painel secundário) -->
      <div ref="contentRow" class="relative flex min-h-0 flex-1">
        <main v-drag-scroll class="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div class="min-w-0 px-6 py-6">
            <slot />
          </div>
        </main>

        <!-- Divisor redimensionável + painel secundário (split) -->
        <template v-if="isSplit && secondary">
          <div
            class="w-1.5 shrink-0 cursor-col-resize bg-ms-border transition hover:bg-ms-primary"
            role="separator"
            aria-label="Redimensionar painéis"
            @pointerdown="onResizeDown"
          />
          <section
            class="flex shrink-0 flex-col border-l border-ms-border"
            :style="{ width: `${width}%` }"
          >
            <header
              class="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-ms-border-light bg-ms-surface px-3"
            >
              <span class="truncate text-xs font-medium text-ms-text-primary">{{
                secondary.title
              }}</span>
              <button
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded text-ms-text-secondary transition hover:bg-ms-fill-light hover:text-ms-text-primary"
                aria-label="Fechar painel dividido"
                @click="splitStore.closeSplit()"
              >
                <svg
                  class="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </header>
            <iframe :src="embedSrc" class="min-h-0 flex-1 border-0" title="Painel dividido" />
          </section>
        </template>

        <!-- Drop zone: aparece ao arrastar uma aba; soltar à direita divide. -->
        <div
          v-if="isDragging"
          class="absolute inset-y-0 right-0 z-30 w-2/5 p-3"
          @dragover.prevent
          @drop.prevent="onDrop"
        >
          <div
            class="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-ms-primary bg-ms-primary/10 text-sm font-medium text-ms-primary"
          >
            Soltar aqui para dividir a tela
          </div>
        </div>
      </div>
    </div>

    <!-- Fila flutuante global — só para perfis que atendem a quente. -->
    <FilaFab v-if="hasQueue" />

    <!-- Status das equipes — fixo em todas as telas /gestor/* (arrastável). -->
    <EquipeStatusFloating v-if="showEquipeStatus" />
  </div>
</template>
