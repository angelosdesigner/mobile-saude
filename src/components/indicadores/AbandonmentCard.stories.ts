import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AbandonmentCard from './AbandonmentCard.vue'

const meta: Meta<typeof AbandonmentCard> = {
  title: 'Indicadores/AbandonmentCard',
  component: AbandonmentCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`AbandonmentCard` mostra abandono por canal (rosca + total ao centro + lista). ' +
          'A legenda combina cor + nome + valor (não depende só de cor).',
      },
    },
  },
  args: {
    title: 'Abandono por Canal',
    subtitle: 'Total de desistências',
    centerValue: '14,6%',
    centerLabel: '23 abandonos',
    items: [
      { name: 'Chat/WhatsApp', value: 15, color: '#f56c6c', pct: '8.2%' },
      { name: 'Telefone/Voz', value: 6, color: '#e6a23c', pct: '4.1%' },
      { name: 'Balcão/Presencial', value: 2, color: '#7c6cf2', pct: '2.3%' },
    ],
  },
  render: (args) => ({
    components: { AbandonmentCard },
    setup: () => ({ args }),
    template: `<div class="w-80"><AbandonmentCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
