import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TrendCard from './TrendCard.vue'

const meta: Meta<typeof TrendCard> = {
  title: 'Indicadores/TrendCard',
  component: TrendCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`TrendCard` combina o valor atual com um mini-gráfico de tendência (sparkline). ' +
          'Bom para mostrar evolução recente sem ocupar muito espaço.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['primary', 'success', 'warning', 'danger', 'teal'] },
    deltaTone: { control: 'inline-radio', options: ['up', 'down', 'neutral'] },
  },
  args: {
    label: 'Atendimentos / hora',
    value: 26,
    delta: '+12% vs ontem',
    deltaTone: 'up',
    tone: 'primary',
    series: [12, 15, 14, 18, 22, 20, 26],
  },
  render: (args) => ({
    components: { TrendCard },
    setup: () => ({ args }),
    template: `<div class="w-72"><TrendCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Queda: Story = {
  args: { label: 'SLA cumprido', value: '88%', delta: '-4% na semana', deltaTone: 'down', tone: 'danger', series: [96, 95, 94, 92, 90, 89, 88] },
}
