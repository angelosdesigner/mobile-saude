import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseSelect from './BaseSelect.vue'

const filas = [
  { label: 'Reembolso', value: 'reembolso' },
  { label: 'Autorização', value: 'autorizacao' },
  { label: 'Financeiro', value: 'financeiro' },
  { label: 'Dúvidas Administrativas', value: 'duvidas' },
]

const meta: Meta<typeof BaseSelect> = {
  title: 'Components/Selects/BaseSelect',
  component: BaseSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseSelect` é o seletor do Design System sobre o Element Plus.',
          '',
          '**Casos de uso**: filtros (fila, canal, atendente), escolha de status.',
          '',
          '**Boas práticas**: forneça `label`; em multi-seleção use `multiple` (já vem com tags colapsadas).',
          '',
          '**Anti-patterns**: usar `<el-select>` direto; listas longas sem busca.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
    multiple: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Fila', placeholder: 'Selecione a fila', options: filas, multiple: false },
  render: (args) => ({
    components: { BaseSelect },
    setup: () => ({ args }),
    template: `<div class="max-w-xs"><BaseSelect v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Multiple: Story = { args: { label: 'Filas', multiple: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Error: Story = { args: { error: 'Selecione ao menos uma fila.' } }
