import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ChatCard from './ChatCard.vue'

const meta: Meta<typeof ChatCard> = {
  title: 'Atendimento/ChatCard',
  component: ChatCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`ChatCard` é um item de conversa (inbox): identidade + prévia da última mensagem + ' +
            'horário + não lidas. Composto sobre `BaseCard` + `UserCard` + `ChannelTag`.',
          '',
          '**Boas práticas**: contador de não lidas com `aria-label`; clicável por padrão (abre a conversa).',
        ].join('\n'),
      },
    },
  },
  args: {
    name: 'Maria Silva',
    channel: 'WhatsApp',
    lastMessage: 'Enviei os documentos do reembolso, podem verificar?',
    time: '14:58',
    unread: 3,
  },
  render: (args) => ({
    components: { ChatCard },
    setup: () => ({ args }),
    template: `<div class="w-80"><ChatCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const SemNaoLidas: Story = {
  args: { name: 'João Pereira', channel: 'Telefone', lastMessage: 'Obrigado pelo atendimento!', time: '13:20', unread: 0 },
}
