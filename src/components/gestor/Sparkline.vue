<script setup lang="ts">
// Sparkline leve (SVG inline, sem ECharts) — mini-tendência para os cards de
// métrica do gestor. Calmo por padrão: linha fina + área de baixa opacidade.
// Cor via token (theme-aware). Área opcional.
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Série de valores (>= 2 pontos). */
    points: number[]
    /** Cor da linha/área (token ou hex). */
    color?: string
    /** Altura renderizada (px). */
    height?: number
    /** Desenha a área sob a linha. */
    fill?: boolean
  }>(),
  { color: 'var(--color-ms-primary)', height: 30, fill: true },
)

// viewBox fixo; o SVG estica em largura (preserveAspectRatio=none). A linha usa
// vector-effect p/ manter espessura constante independente do esticamento.
const W = 100
const H = 32

const d = computed(() => {
  const pts = props.points
  if (!pts || pts.length < 2) return { line: '', area: '' }
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const span = max - min || 1
  const stepX = W / (pts.length - 1)
  const coords = pts.map((v, i) => {
    const x = i * stepX
    const y = H - 2 - ((v - min) / span) * (H - 4)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const line = `M${coords.join(' L')}`
  const area = `${line} L${W},${H} L0,${H} Z`
  return { line, area }
})
</script>

<template>
  <svg
    viewBox="0 0 100 32"
    :height="height"
    width="100%"
    preserveAspectRatio="none"
    class="block"
    aria-hidden="true"
  >
    <path v-if="fill" :d="d.area" :fill="color" fill-opacity="0.1" stroke="none" />
    <path
      :d="d.line"
      fill="none"
      :stroke="color"
      stroke-width="1.5"
      vector-effect="non-scaling-stroke"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>
</template>
