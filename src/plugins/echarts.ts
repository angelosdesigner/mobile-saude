// Registro mínimo do ECharts (tree-shaking) — só os charts/componentes usados
// nos dashboards do gestor. Importado uma vez em main.ts.
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart, GaugeChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  GaugeChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  GraphicComponent,
])
