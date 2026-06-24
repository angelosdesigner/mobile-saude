import type { Meta, StoryObj } from '@storybook/vue3-vite'
import KpiRingCard from './KpiRingCard.vue'

const meta: Meta<typeof KpiRingCard> = {
  title: 'Indicadores/KpiRingCard',
  component: KpiRingCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`KpiRingCard` é o card de KPI padrão: anel à esquerda (com o número no centro) + ' +
            'infos à direita (título · performance · meta). Conteúdo centralizado; anel via tokens ' +
            '(theme-aware — soft no dark).',
          '',
          '**Boas práticas**: `value` é o preenchimento do anel (0–100); `display` é o texto central ' +
            '(pode diferir, ex.: NPS "4.6"). `deltaTone` reflete a leitura (up=bom, down/danger=ruim).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    tone: { control: 'select', options: ['primary', 'success', 'purple', 'danger', 'warning'] },
    deltaTone: { control: 'inline-radio', options: ['up', 'down', 'danger', 'neutral'] },
  },
  args: {
    value: 78,
    display: '78%',
    label: 'Fix Call Resolution',
    delta: '↑ 1% hoje',
    deltaTone: 'up',
    meta: 'Meta: 80%',
    tone: 'primary',
  },
  render: (args) => ({
    components: { KpiRingCard },
    setup: () => ({ args }),
    template: `<div class="w-72"><KpiRingCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Os 4 KPIs do Resumo Executivo no mesmo padrão. */
export const ResumoExecutivo: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { KpiRingCard },
    template: `
      <div class="grid max-w-3xl gap-4 sm:grid-cols-2">
        <KpiRingCard :value="78" display="78%" label="Fix Call Resolution" delta="↑ 1% hoje" delta-tone="up" meta="Meta: 80%" tone="primary" />
        <KpiRingCard :value="82" display="82%" label="Resolução de Chamados" delta="↑ 3% hoje" delta-tone="up" meta="Meta: 90%" tone="success" />
        <KpiRingCard :value="92" display="4.6" label="NPS / Satisfação" delta="↓ 0.1 hoje" delta-tone="down" meta="Meta: 5.0" tone="purple" />
        <KpiRingCard :value="6.4" display="6,4%" label="Chamadas abandonadas" delta="↑ 1,1% hoje (crítico)" delta-tone="danger" meta="Atendidas: 93,6%" tone="danger" />
      </div>`,
  }),
}
