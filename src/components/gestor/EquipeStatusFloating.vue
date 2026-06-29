<script setup lang="ts">
// Ação flutuante GLOBAL do gestor: "Status atual das Equipes". Fechado = widget
// compacto (barra segmentada + 3 stats); aberto = quick panel com filtros por
// equipe e canal, breakdown por equipe e CTA para a aba Equipe.
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  equipeStatusResumo,
  equipePorCanal,
  equipePorEquipe,
  type EquipeStatusTone,
} from '@/data/gestorEquipeStatus'

const router = useRouter()
const open = ref(false)

// Minimizado = só um ícone flutuante; restaura ao clicar. A escolha persiste
// (o widget remonta a cada navegação de rota).
const MIN_KEY = 'ms.fab.equipe.min'
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

// ── Drag (alça do widget + ícone minimizado) ────────────────────────────────
// A posição persiste; o ícone minimizado também é arrastável (distingue
// clique de arraste por um limiar de movimento).
const POS_KEY = 'ms.fab.equipe.pos'
const el = ref<HTMLElement>()
const pos = ref<{ left: number; top: number } | null>(null)
let dragging = false
let moved = false
let fromBubble = false
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
function savePos() {
  try {
    if (pos.value) localStorage.setItem(POS_KEY, JSON.stringify(pos.value))
  } catch {
    /* ignore */
  }
}
function onDown(e: PointerEvent, bubble = false) {
  e.preventDefault()
  const r = el.value!.getBoundingClientRect()
  if (!pos.value) pos.value = { left: r.left, top: r.top }
  dragging = true
  moved = false
  fromBubble = bubble
  sx = e.clientX
  sy = e.clientY
  sl = pos.value.left
  st = pos.value.top
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
function onMove(e: PointerEvent) {
  if (!dragging) return
  if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 4) moved = true
  pos.value = clamp(sl + (e.clientX - sx), st + (e.clientY - sy))
}
function onUp() {
  dragging = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  if (moved) savePos()
  // Clique no ícone minimizado (sem arrastar) restaura o widget.
  else if (fromBubble) setMinimized(false)
  fromBubble = false
}
function onResize() {
  if (pos.value) pos.value = clamp(pos.value.left, pos.value.top)
}
onMounted(() => {
  window.addEventListener('resize', onResize)
  try {
    if (localStorage.getItem(MIN_KEY) === '1') minimized.value = true
    const p = localStorage.getItem(POS_KEY)
    if (p) pos.value = JSON.parse(p)
  } catch {
    /* ignore */
  }
  // Garante que a posição salva caiba na viewport atual: a janela pode ter
  // diminuído (ou a posição ter sido salva fora) desde o último uso — sem isto
  // o widget renderiza fora da tela e parece ter "sumido". Persiste o ajuste.
  nextTick(() => {
    if (pos.value && el.value) {
      pos.value = clamp(pos.value.left, pos.value.top)
      savePos()
    }
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
})

// ── Cores por tom ────────────────────────────────────────────────────────────
const bgTone: Record<EquipeStatusTone, string> = {
  success: 'bg-ms-success',
  primary: 'bg-ms-primary',
  danger: 'bg-ms-danger',
}
const textTone: Record<EquipeStatusTone, string> = {
  success: 'text-ms-success',
  primary: 'text-ms-primary',
  danger: 'text-ms-danger',
}

// ── Filtros ──────────────────────────────────────────────────────────────────
const selectedEquipe = ref<string>('Todas')
const selectedCanal = ref<string>('Todos')

const equipeOpcoes = ['Todas', ...equipePorEquipe.map((e) => e.equipe)]
const canalOpcoes = ['Todos', ...equipePorCanal.map((c) => c.canal)]

const filteredEquipes = computed(() =>
  selectedEquipe.value === 'Todas'
    ? equipePorEquipe
    : equipePorEquipe.filter((e) => e.equipe === selectedEquipe.value),
)

const filteredCanais = computed(() =>
  selectedCanal.value === 'Todos'
    ? equipePorCanal
    : equipePorCanal.filter((c) => c.canal === selectedCanal.value),
)

// Stats reativos aos filtros de equipe
const statsAtivos = computed(() => ({
  disponivel: filteredEquipes.value.reduce((a, r) => a + r.disponivel, 0),
  atendimento: filteredEquipes.value.reduce((a, r) => a + r.atendimento, 0),
  ocupado: filteredEquipes.value.reduce((a, r) => a + r.ocupado, 0),
}))

const statusLines = computed(() => [
  { label: 'Disponível', short: 'Disp.', value: statsAtivos.value.disponivel, tone: 'success' as EquipeStatusTone },
  { label: 'Em atendimento', short: 'Atend.', value: statsAtivos.value.atendimento, tone: 'primary' as EquipeStatusTone },
  { label: 'Ocupado / Pausa', short: 'Ocup.', value: statsAtivos.value.ocupado, tone: 'danger' as EquipeStatusTone },
])

const totalAtivo = computed(() => statsAtivos.value.disponivel + statsAtivos.value.atendimento + statsAtivos.value.ocupado || 1)
const pct = (v: number) => `${Math.round((v / totalAtivo.value) * 100)}%`

// Widget fechado usa sempre o total geral
const totalGeral = equipeStatusResumo.disponiveis + equipeStatusResumo.emAtendimento + equipeStatusResumo.ocupadosPausa || 1
const pctGeral = (v: number) => `${Math.round((v / totalGeral) * 100)}%`

const widgetLines = [
  { short: 'Disp.', value: equipeStatusResumo.disponiveis, tone: 'success' as EquipeStatusTone },
  { short: 'Atend.', value: equipeStatusResumo.emAtendimento, tone: 'primary' as EquipeStatusTone },
  { short: 'Ocup.', value: equipeStatusResumo.ocupadosPausa, tone: 'danger' as EquipeStatusTone },
]

function verEquipe() {
  open.value = false
  router.push({ path: '/gestor/tempo-real', query: { tab: 'equipe' } })
}
</script>

<template>
  <div
    ref="el"
    class="fixed z-40"
    :style="
      pos
        ? { left: pos.left + 'px', top: pos.top + 'px' }
        : { right: '24px', bottom: '24px' }
    "
  >
    <!-- ── Minimizado: só o ícone (mesmo padrão do FilaFab) ─────────────── -->
    <button
      v-if="minimized"
      class="relative flex h-12 w-12 cursor-grab items-center justify-center rounded-full border border-ms-border-light bg-ms-surface text-ms-primary shadow-xl transition hover:shadow-2xl active:cursor-grabbing"
      style="touch-action: none"
      title="Arraste para mover · clique para abrir o status das equipes"
      aria-label="Mostrar status das equipes"
      @pointerdown="onDown($event, true)"
      @keydown.enter="setMinimized(false)"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <span class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ms-primary px-1 text-[10px] font-semibold text-white">{{ equipeStatusResumo.totalAgentes }}</span>
    </button>

    <!-- ── Quick panel (aberto) ─────────────────────────────────────────── -->
    <div
      v-else-if="open"
      class="w-[360px] overflow-hidden rounded-2xl border border-ms-border-light bg-ms-surface shadow-xl"
    >
      <!-- Header (arrastável pela alça) -->
      <div class="flex items-start gap-2 border-b border-ms-border-light px-4 py-3">
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
        <div class="min-w-0 flex-1">
          <div class="text-sm font-semibold text-ms-text-primary">Status atual das Equipes</div>
          <div class="text-2xs text-ms-text-secondary">
            {{ equipeStatusResumo.totalAgentes }} agentes · Atualizado {{ equipeStatusResumo.atualizado }}
          </div>
        </div>
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

      <!-- Filtros -->
      <div class="border-b border-ms-border-light px-4 py-3 space-y-2.5">
        <!-- Filtrar por equipe -->
        <div>
          <div class="mb-1.5 text-2xs text-ms-text-secondary">Filtrar por equipe</div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="eq in equipeOpcoes"
              :key="eq"
              class="rounded-full border px-2.5 py-0.5 text-2xs font-medium transition"
              :class="
                selectedEquipe === eq
                  ? 'border-ms-primary bg-ms-primary text-white'
                  : 'border-ms-border-light bg-ms-surface text-ms-text-secondary hover:border-ms-primary hover:text-ms-primary'
              "
              @click="selectedEquipe = eq"
            >
              {{ eq }}
            </button>
          </div>
        </div>

        <!-- Filtrar por canal -->
        <div>
          <div class="mb-1.5 text-2xs text-ms-text-secondary">Filtrar por canal</div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="cn in canalOpcoes"
              :key="cn"
              class="rounded-full border px-2.5 py-0.5 text-2xs font-medium transition"
              :class="
                selectedCanal === cn
                  ? 'border-ms-primary bg-ms-primary text-white'
                  : 'border-ms-border-light bg-ms-surface text-ms-text-secondary hover:border-ms-primary hover:text-ms-primary'
              "
              @click="selectedCanal = cn"
            >
              {{ cn }}
            </button>
          </div>
        </div>
      </div>

      <div class="max-h-[55vh] overflow-y-auto px-4 py-3">
        <!-- Resumo (3 mini-cards) -->
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="l in statusLines"
            :key="l.label"
            class="rounded-lg bg-ms-fill-light px-2 py-2 text-center"
          >
            <div class="text-lg font-bold" :class="textTone[l.tone]">{{ l.value }}</div>
            <div class="text-2xs leading-tight text-ms-text-secondary">{{ l.label }}</div>
          </div>
        </div>

        <!-- Barra segmentada -->
        <div class="mt-3 flex h-2 overflow-hidden rounded-full">
          <span
            v-for="l in statusLines"
            :key="l.label"
            :class="bgTone[l.tone]"
            :style="{ width: pct(l.value) }"
          />
        </div>

        <!-- Por equipe -->
        <div class="mt-4 mb-1 text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          Por equipe
        </div>
        <div class="space-y-1">
          <div class="flex items-center text-2xs text-ms-text-placeholder">
            <span class="flex-1">Equipe</span>
            <span class="w-10 text-right text-ms-success">Disp.</span>
            <span class="w-10 text-right text-ms-primary">Atend.</span>
            <span class="w-10 text-right text-ms-danger">Ocup.</span>
          </div>
          <div
            v-for="e in filteredEquipes"
            :key="e.equipe"
            class="flex items-center border-t border-ms-border-lighter py-1 text-xs"
          >
            <span class="flex-1 text-ms-text-regular">{{ e.equipe }}</span>
            <span class="w-10 text-right font-medium text-ms-success">{{ e.disponivel }}</span>
            <span class="w-10 text-right font-medium text-ms-primary">{{ e.atendimento }}</span>
            <span class="w-10 text-right font-medium text-ms-danger">{{ e.ocupado }}</span>
          </div>
        </div>

        <!-- Por canal -->
        <div class="mt-4 mb-1 text-2xs font-semibold uppercase tracking-wide text-ms-text-secondary">
          Por canal de atendimento
        </div>
        <div class="space-y-2">
          <div v-for="c in filteredCanais" :key="c.canal">
            <div class="flex items-center justify-between text-xs">
              <span class="text-ms-text-regular">{{ c.canal }}</span>
              <span class="font-medium text-ms-text-primary">{{ c.atendentes }} · {{ c.pct }}%</span>
            </div>
            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-ms-fill-light">
              <div class="h-full rounded-full bg-ms-primary" :style="{ width: `${c.pct}%` }" />
            </div>
          </div>
        </div>

        <el-button class="!mt-4 w-full" size="small" @click="verEquipe">
          Ver desempenho da equipe →
        </el-button>
      </div>
    </div>

    <!-- ── Widget (fechado) ─────────────────────────────────────────────── -->
    <button
      v-else
      class="w-[280px] cursor-pointer rounded-2xl border border-ms-border-light bg-ms-surface p-3 text-left shadow-xl transition hover:shadow-2xl"
      title="Abrir status das equipes"
      @click="open = true"
    >
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
        <span class="flex-1 text-xs font-semibold text-ms-text-primary">Status atual das Equipes</span>
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
        <svg class="h-4 w-4 text-ms-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 15 6-6 6 6" />
        </svg>
      </div>

      <!-- Barra segmentada -->
      <div class="mt-2.5 flex h-2 overflow-hidden rounded-full">
        <span
          v-for="l in widgetLines"
          :key="l.short"
          :class="bgTone[l.tone]"
          :style="{ width: pctGeral(l.value) }"
        />
      </div>

      <!-- 3 stats -->
      <div class="mt-2 flex items-center justify-between">
        <span v-for="l in widgetLines" :key="l.short" class="flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full" :class="bgTone[l.tone]" />
          <span class="text-2xs text-ms-text-secondary">{{ l.short }}</span>
          <span class="text-2xs font-bold text-ms-text-primary">{{ l.value }}</span>
        </span>
      </div>
    </button>
  </div>
</template>
