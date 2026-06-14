import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseCheckbox from './BaseCheckbox.vue'

const meta: Meta<typeof BaseCheckbox> = {
  title: 'Components/Checkboxes/BaseCheckbox',
  component: BaseCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseCheckbox` é um toggle booleano com rótulo associado (clicar no texto alterna).',
          '',
          '**Casos de uso**: aceite de termos, opções independentes, "selecionar todos".',
          '',
          '**Boas práticas**: rótulo claro e específico; para escolha exclusiva use `BaseRadio`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Mostrar apenas não atribuídos', disabled: false, size: 'default' },
  render: (args) => ({
    components: { BaseCheckbox },
    setup: () => ({ args }),
    template: `<BaseCheckbox v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
