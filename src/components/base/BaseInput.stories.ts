import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseInput from './BaseInput.vue'

const meta: Meta<typeof BaseInput> = {
  title: 'Components/Inputs/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`BaseInput` é o campo de texto do Design System sobre o Element Plus.',
          '',
          '**Casos de uso**: busca, formulários, filtros de texto.',
          '',
          '**Boas práticas**',
          '- Sempre forneça `label` (associado ao campo) — não use só `placeholder` como rótulo.',
          '- Em erro, use a mensagem (`error="..."`) — anunciada via `role="alert"`; não comunique só pela borda.',
          '',
          '**Anti-patterns**: placeholder como label; erro sinalizado apenas por cor.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    type: { control: 'select', options: ['text', 'password', 'textarea', 'number', 'email', 'tel'] },
    size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
  args: {
    label: 'Protocolo',
    placeholder: 'Buscar protocolo',
    type: 'text',
    size: 'default',
    disabled: false,
    clearable: true,
  },
  render: (args) => ({
    components: { BaseInput },
    setup: () => ({ args }),
    template: `<div class="max-w-sm"><BaseInput v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: { label: 'E-mail', placeholder: 'nome@dominio.com', hint: 'Usamos para notificações do atendimento.' },
}

export const Error: Story = {
  args: { label: 'CPF', placeholder: '000.000.000-00', error: 'CPF inválido — verifique os dígitos.' },
}

export const Disabled: Story = {
  args: { label: 'Protocolo', placeholder: 'Buscar protocolo', disabled: true },
}
