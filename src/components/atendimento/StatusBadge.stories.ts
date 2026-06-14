import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatusBadge from './StatusBadge.vue'

const meta: Meta<typeof StatusBadge> = {
  title: 'Atendimento/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`StatusBadge` representa os 4 estados padrão do produto (sobre `BaseBadge`).',
          '',
          '**Estados**: Aberto · Em análise · Aguardando usuário · Finalizado.',
          '',
          '**Boas práticas**: use sempre este componente para o status — garante rótulo e tom ' +
            'consistentes entre canais e telas.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['aberto', 'analise', 'aguardando', 'finalizado'] },
  },
  args: { status: 'aberto' },
  render: (args) => ({
    components: { StatusBadge },
    setup: () => ({ args }),
    template: `<StatusBadge v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Todos: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { StatusBadge },
    template: `
      <div class="flex flex-wrap gap-2">
        <StatusBadge status="aberto" />
        <StatusBadge status="analise" />
        <StatusBadge status="aguardando" />
        <StatusBadge status="finalizado" />
      </div>`,
  }),
}
