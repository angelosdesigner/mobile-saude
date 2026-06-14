import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseRadio, { type BaseRadioOption } from './BaseRadio.vue'

const periodos: BaseRadioOption[] = [
  { label: 'Hoje', value: 'hoje' },
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: 'Trimestre', value: 'trimestre' },
]

const meta: Meta<typeof BaseRadio> = {
  title: 'Components/Radios/BaseRadio',
  component: BaseRadio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseRadio` é um grupo de opções **exclusivas** (uma escolha entre poucas).',
          '',
          '**Casos de uso**: período (Hoje/7d/30d), modo de visualização, perfil.',
          '',
          '**Boas práticas**: 2–5 opções; rótulo de grupo (`legend`) para acessibilidade. ' +
            'Muitas opções → use `BaseSelect`. `button` para alternadores segmentados.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
    button: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Período', options: periodos, button: false },
  render: (args) => ({
    components: { BaseRadio },
    setup: () => ({ args }),
    template: `<BaseRadio v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Segmented: Story = { args: { button: true, label: 'Modo de visualização', options: [
  { label: 'Quadro', value: 'quadro' },
  { label: 'Lista', value: 'lista' },
] } }
