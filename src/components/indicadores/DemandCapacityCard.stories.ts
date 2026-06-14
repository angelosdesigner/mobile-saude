import type { Meta, StoryObj } from '@storybook/vue3-vite'
import DemandCapacityCard from './DemandCapacityCard.vue'

const meta: Meta<typeof DemandCapacityCard> = {
  title: 'Indicadores/DemandCapacityCard',
  component: DemandCapacityCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`DemandCapacityCard` compara demanda (barras) e capacidade (linha) por hora. ' +
          'A cor da barra sinaliza a pressão sobre a capacidade.',
      },
    },
  },
  args: {
    title: 'Demanda vs Capacidade por Hora',
    subtitle: 'barras = volume · linha = atendentes disponíveis',
    capacidade: 14,
    horas: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h'],
    demanda: [8, 12, 16, 20, 22, 18, 24, 32, 28, 22, 16],
  },
  render: (args) => ({
    components: { DemandCapacityCard },
    setup: () => ({ args }),
    template: `<div class="max-w-2xl"><DemandCapacityCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
