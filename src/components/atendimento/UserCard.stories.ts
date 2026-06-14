import type { Meta, StoryObj } from '@storybook/vue3-vite'
import UserCard from './UserCard.vue'

const meta: Meta<typeof UserCard> = {
  title: 'Atendimento/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`UserCard` é a identidade compacta (avatar de iniciais + nome + meta) de atendente ou beneficiário.',
          '',
          '**Boas práticas**: avatar por iniciais (não depende de imagem); presença combina ponto + texto (a11y).',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    presence: { control: 'inline-radio', options: ['', 'online', 'busy', 'away', 'offline'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { name: 'Ana Silva', meta: 'Atendente · Reembolso', presence: 'online', size: 'md' },
  render: (args) => ({
    components: { UserCard },
    setup: () => ({ args }),
    template: `<div class="max-w-xs rounded-lg border border-ms-border-light bg-ms-surface p-3"><UserCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Beneficiario: Story = {
  args: { name: 'Maria Silva Santos', meta: 'WhatsApp · OC-2026-001001', presence: '' },
}
export const Presencas: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { UserCard },
    template: `
      <div class="grid max-w-md gap-3">
        <UserCard name="Ana Silva" meta="Atendente" presence="online" />
        <UserCard name="Marcelo Souza" meta="Atendente" presence="busy" />
        <UserCard name="Carla Pinto" meta="Atendente" presence="away" />
        <UserCard name="João Melo" meta="Atendente" presence="offline" />
      </div>`,
  }),
}
