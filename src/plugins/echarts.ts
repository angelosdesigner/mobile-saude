// Registro mínimo do ECharts (tree-shaking) — só os charts/componentes usados
// nos dashboards do gestor. Importado uma vez em main.ts.
import { reactive, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart, GaugeChart, ScatterChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
  MarkLineComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  GaugeChart,
  ScatterChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
  MarkLineComponent,
])

// Paleta única dos gráficos (antes duplicada como `const C = {…}` em cada aba).
// ECharts exige cores literais (não lê CSS vars), então estes hex espelham os
// tokens `--color-ms-*`. `axis`/`neutral` = cinza dos eixos; `ink` = linha de
// referência (capacidade) / textos fortes; `split` = linhas de grade.
// As cores semânticas (primary/danger/…) servem nos dois temas; só os neutros
// dependentes de contraste (ink/axis/split) mudam no dark — ver useChartColors.
export const chartColors = {
  primary: '#4a90ff',
  success: '#58c26d',
  warning: '#e4a53a',
  danger: '#ef6a6a',
  teal: '#13c2c2',
  purple: '#7c6cf2', // roxo do projeto (KPI NPS, insights de IA)
  neutral: '#909399',
  axis: '#909399',
  ink: '#1f2937', // text-primary
  split: 'rgba(144,147,153,0.15)',
}

// Sobrescritas para o tema escuro: o ECharts não lê CSS vars, então espelhamos
// aqui os MESMOS tokens soft já calibrados em src/style.css (--ms-*-soft e
// --ms-dark-text-*), p/ os gráficos baterem com a UI (badges/dots) no escuro.
// `ink` (#303133) era o caso crítico — sumia no fundo escuro.
const chartColorsDark = {
  axis: '#a3a6ad', // --ms-dark-text-secondary
  ink: '#e5eaf3', // --ms-dark-text-primary
  split: 'rgba(144,147,153,0.24)',
  primary: '#5a93e6', // --ms-blue-soft
  success: '#5aab68', // --ms-green-soft
  warning: '#d99a45', // --ms-amber-soft
  danger: '#d96d6d', // --ms-red-soft
  teal: '#2aa3a3', // --ms-teal-soft
  purple: '#8478d6', // espelha --ms-purple-soft (token UI --color-ms-purple)
}

/**
 * Paleta reativa ao tema para os gráficos. Use no lugar de `chartColors` dentro
 * dos componentes: `const C = useChartColors()`. Como as opções do ECharts são
 * `computed`, elas recalculam ao alternar claro/escuro. Só os neutros mudam;
 * as cores semânticas permanecem. Deve ser chamado em `setup()`.
 */
export function useChartColors() {
  const { isDark } = storeToRefs(useThemeStore())
  const c = reactive({ ...chartColors })
  watchEffect(() => {
    Object.assign(c, chartColors, isDark.value ? chartColorsDark : {})
  })
  return c
}
