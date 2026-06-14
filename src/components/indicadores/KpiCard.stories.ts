import type { Meta, StoryObj } from '@storybook/vue3-vite'
import KpiCard from './KpiCard.vue'

const meta: Meta<typeof KpiCard> = {
  title: 'Indicadores/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`KpiCard` é o indicador numérico (rótulo + valor + variação), sobre `BaseCard`.',
          '',
          '**Boas práticas**: `deltaTone` reflete a leitura (up = bom, down = ruim) — não só a direção. ' +
            'Para evolução use `TrendCard`.',
        ].join('\n'),
      },
    },
  },
  argTypes: { deltaTone: { control: 'inline-radio', options: ['up', 'down', 'neutral'] } },
  args: { label: 'Atendimentos', value: 31, delta: '+4 hoje', deltaTone: 'up', hint: 'Meta: 28' },
  render: (args) => ({
    components: { KpiCard },
    setup: () => ({ args }),
    template: `<div class="w-56"><KpiCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Grade: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { KpiCard },
    template: `
      <div class="grid max-w-2xl grid-cols-2 gap-4">
        <KpiCard label="Atendimentos" :value="31" delta="+4 hoje" deltaTone="up" />
        <KpiCard label="TMA" value="14min" delta="↑ 1.2min" deltaTone="down" />
        <KpiCard label="TME" value="12min" delta="↓ 1min" deltaTone="up" />
        <KpiCard label="Abandono" value="14,6%" delta="↑ 0,3%" deltaTone="down" />
      </div>`,
  }),
}
