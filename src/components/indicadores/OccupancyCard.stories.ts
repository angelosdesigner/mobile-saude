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

/** Por fila — com legenda de limiares (bolinhas). */
export const PorFilaComLegenda: Story = { args: { legend: true } }

/** Por atendente — itens com avatar + % e quantidade · rodapé "Pior/Melhor". */
export const PorAtendente: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { OccupancyCard },
    setup: () => ({
      items: [
        { label: 'Fernanda Paz', value: 95, caption: '95% (34)', avatar: 'FP' },
        { label: 'Paula Reis', value: 78, caption: '78% (27)', avatar: 'PR' },
        { label: 'Carlos Lima', value: 72, caption: '72% (21)', avatar: 'CL' },
        { label: 'Ana Souza', value: 60, caption: '60% (18)', avatar: 'AS' },
        { label: 'João Melo', value: 58, caption: '58% (15)', avatar: 'JM' },
      ],
    }),
    template: `
      <div class="w-96">
        <OccupancyCard title="Ocupação por Atendente" subtitle="% de uso da capacidade" :items="items" rank rank-hint />
      </div>`,
  }),
}
