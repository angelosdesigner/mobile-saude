import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { chartColors } from '@/plugins/echarts'

// Tokens SEMÂNTICOS (--color-ms-*) renderizados a partir das próprias utilitárias
// — o catálogo reflete exatamente o que o app usa, e vira no tema (light/dark).
const text = [
  { name: 'ms-text-primary', cls: 'text-ms-text-primary' },
  { name: 'ms-text-regular', cls: 'text-ms-text-regular' },
  { name: 'ms-text-secondary', cls: 'text-ms-text-secondary' },
  { name: 'ms-text-placeholder', cls: 'text-ms-text-placeholder' },
]
const fills = [
  { name: 'ms-primary', cls: 'bg-ms-primary' },
  { name: 'ms-primary-light', cls: 'bg-ms-primary-light' },
  { name: 'ms-success', cls: 'bg-ms-success' },
  { name: 'ms-warning', cls: 'bg-ms-warning' },
  { name: 'ms-danger', cls: 'bg-ms-danger' },
  { name: 'ms-teal', cls: 'bg-ms-teal' },
]
const surfaces = [
  { name: 'ms-surface', cls: 'bg-ms-surface' },
  { name: 'ms-bg', cls: 'bg-ms-bg' },
  { name: 'ms-fill-light', cls: 'bg-ms-fill-light' },
  { name: 'ms-border', cls: 'bg-ms-border' },
  { name: 'ms-border-light', cls: 'bg-ms-border-light' },
  { name: 'ms-border-lighter', cls: 'bg-ms-border-lighter' },
]
const onColors = [
  { name: 'on-primary', fill: 'bg-ms-primary', text: 'text-ms-on-primary' },
  { name: 'on-success', fill: 'bg-ms-success', text: 'text-ms-on-success' },
  { name: 'on-warning', fill: 'bg-ms-warning', text: 'text-ms-on-warning' },
  { name: 'on-danger', fill: 'bg-ms-danger', text: 'text-ms-on-danger' },
  { name: 'on-teal', fill: 'bg-ms-teal', text: 'text-ms-on-teal' },
]
const chart = Object.entries(chartColors)

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Tokens de cor em 2 camadas: primitivos (`--ms-*`) → semânticos (`--color-ms-*`). ' +
          'Use a barra de temas (canto superior) para conferir claro e escuro. ' +
          '`on-warning` é escuro de propósito (branco sobre âmbar reprova WCAG AA).',
      },
    },
  },
  render: () => ({
    setup: () => ({ text, fills, surfaces, onColors, chart }),
    template: `
      <div class="space-y-6">
        <section>
          <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Texto</h3>
          <div class="flex flex-wrap gap-3">
            <div v-for="t in text" :key="t.name" class="rounded-lg border border-ms-border-light bg-ms-surface px-4 py-3">
              <span class="text-lg font-semibold" :class="t.cls">Aa</span>
              <div class="mt-1 text-2xs text-ms-text-secondary">{{ t.name }}</div>
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Marca e semânticas</h3>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div v-for="c in fills" :key="c.name" class="overflow-hidden rounded-lg border border-ms-border-light">
              <div class="h-12" :class="c.cls" />
              <div class="bg-ms-surface px-2 py-1.5 text-2xs text-ms-text-secondary">{{ c.name }}</div>
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Superfícies e bordas</h3>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div v-for="c in surfaces" :key="c.name" class="overflow-hidden rounded-lg border border-ms-border-light">
              <div class="h-12 border-b border-ms-border-light" :class="c.cls" />
              <div class="bg-ms-surface px-2 py-1.5 text-2xs text-ms-text-secondary">{{ c.name }}</div>
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">On-color (texto sobre preenchimento)</h3>
          <div class="flex flex-wrap gap-3">
            <div v-for="o in onColors" :key="o.name" class="flex h-12 w-28 flex-col items-center justify-center rounded-lg" :class="o.fill">
              <span class="text-sm font-bold" :class="o.text">Aa 24</span>
              <span class="text-2xs" :class="o.text">{{ o.name }}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 class="mb-2 text-sm font-semibold text-ms-text-regular">Paleta dos gráficos (ECharts)</h3>
          <div class="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            <div v-for="c in chart" :key="c[0]" class="overflow-hidden rounded-lg border border-ms-border-light">
              <div class="h-12" :style="{ backgroundColor: c[1] }" />
              <div class="bg-ms-surface px-2 py-1.5 text-2xs text-ms-text-secondary">{{ c[0] }}</div>
            </div>
          </div>
        </section>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Palette: Story = {}
