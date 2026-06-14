import type { Meta, StoryObj } from '@storybook/vue3-vite'
import QueueCard from './QueueCard.vue'

const meta: Meta<typeof QueueCard> = {
  title: 'Atendimento/QueueCard',
  component: QueueCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`QueueCard` representa um item de **fila** (aguardando atendimento humano): posição, ' +
            'espera e canal. Composto sobre `BaseCard` + `BaseTag` + `ChannelTag`.',
          '',
          '**Boas práticas**: `highlight` para prioridade/risco; `interactive` quando abre o detalhe.',
        ].join('\n'),
      },
    },
  },
  args: {
    name: 'Carlos Lima',
    fila: 'Reembolso',
    posicao: 1,
    espera: '12min',
    channel: 'Chat',
    tag: 'Chatbot',
    tagType: 'primary',
    highlight: false,
    interactive: false,
  },
  render: (args) => ({
    components: { QueueCard },
    setup: () => ({ args }),
    template: `<div class="w-72"><QueueCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Prioridade: Story = {
  args: { name: 'Patrícia Souza', tag: 'App', tagType: 'success', posicao: 2, espera: '18min', channel: 'App', highlight: true },
}
