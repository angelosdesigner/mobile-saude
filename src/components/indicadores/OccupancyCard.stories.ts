import type { Meta, StoryObj } from '@storybook/vue3-vite'
import OccupancyCard from './OccupancyCard.vue'

const meta: Meta<typeof OccupancyCard> = {
  title: 'Indicadores/OccupancyCard',
  component: OccupancyCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`OccupancyCard` mostra ocupação por fila/atendente (% de uso da capacidade). ' +
          'O tom da barra é derivado do valor (<70% ok · 70–89% atenção · ≥90% crítico).',
      },
    },
  },
  args: {
    title: 'Ocupação por Fila',
    subtitle: '% de uso da capacidade e TMEF',
    items: [
      { label: 'Financeiro (Boleto)', value: 92, caption: '92% (20min)' },
      { label: 'Reembolso', value: 90, caption: '90% (15min)' },
      { label: 'Dúvidas Adm.', value: 84, caption: '84% (10min)' },
      { label: 'Autorizações', value: 45, caption: '45% (5min)' },
    ],
  },
  render: (args) => ({
    components: { OccupancyCard },
    setup: () => ({ args }),
    template: `<div class="w-96"><OccupancyCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
