import type { Meta, StoryObj } from '@storybook/vue3-vite'
import KanbanCard from './KanbanCard.vue'
import ChannelTag from './ChannelTag.vue'
import BaseTag from '@/components/base/BaseTag.vue'

const meta: Meta<typeof KanbanCard> = {
  title: 'Atendimento/KanbanCard',
  component: KanbanCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`KanbanCard` é a casca minimalista dos cards do quadro (atendente e gestor): ' +
            'conteúdo via slot default + rodapé. `highlight` realça (ex.: risco); `clickable` abre o detalhe.',
          '',
          '**Boas práticas**: mesma linha visual nos dois papéis; o conteúdo (campos) muda por contexto.',
        ].join('\n'),
      },
    },
  },
  args: { highlight: false, clickable: false },
  render: (args) => ({
    components: { KanbanCard, ChannelTag, BaseTag },
    setup: () => ({ args }),
    template: `
      <div class="w-72">
        <KanbanCard v-bind="args">
          <div class="flex items-start justify-between gap-2">
            <span class="text-sm font-semibold text-ms-text-primary">Maria Silva</span>
            <BaseTag type="primary" size="small">Chatbot</BaseTag>
          </div>
          <div class="mt-2 text-xs text-ms-text-regular">Fluxo: <span class="text-ms-text-secondary">Reembolso</span></div>
          <template #footer><ChannelTag channel="WhatsApp" /></template>
        </KanbanCard>
      </div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Risco: Story = { args: { highlight: true } }
export const Clicavel: Story = { args: { clickable: true } }
