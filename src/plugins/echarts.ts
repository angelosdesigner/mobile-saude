// Registro mínimo do ECharts (tree-shaking) — só os charts/componentes usados
// nos dashboards do gestor. Importado uma vez em main.ts.
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
export const chartColors = {
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  teal: '#13c2c2',
  purple: '#7c6cf2', // roxo do projeto (KPI NPS, insights de IA)
  neutral: '#909399',
  axis: '#909399',
  ink: '#303133',
  split: 'rgba(144,147,153,0.15)',
}
