import type { Meta, StoryObj } from '@storybook/vue3-vite'
import EmptyState from './EmptyState.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Empty States/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`EmptyState` cobre listas/quadros sem itens, busca sem resultado e recursos não encontrados.',
          '',
          '**Boas práticas**: título curto + descrição que explica *por que* está vazio e, quando útil, ' +
            'uma ação (slot) para o próximo passo.',
          '',
          '**Anti-patterns**: tela vazia sem mensagem; "Nenhum resultado" sem contexto/ação.',
        ].join('\n'),
      },
    },
  },
  argTypes: { title: { control: 'text' }, description: { control: 'text' } },
  args: {
    title: 'Nenhuma ocorrência',
    description: 'Não há itens para os filtros aplicados.',
  },
  render: (args) => ({
    components: { EmptyState },
    setup: () => ({ args }),
    template: `<EmptyState v-bind="args" />`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithAction: Story = {
  args: { title: 'Sem ocorrências na fila', description: 'Quando algo chegar, aparece aqui.' },
  render: (args) => ({
    components: { EmptyState, BaseButton },
    setup: () => ({ args }),
    template: `<EmptyState v-bind="args"><BaseButton variant="secondary">Limpar filtros</BaseButton></EmptyState>`,
  }),
}
