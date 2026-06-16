import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaBubble from './JornadaBubble.vue'

const meta: Meta<typeof JornadaBubble> = {
  title: 'Ocorrências/Jornada/Bubble',
  component: JornadaBubble,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`JornadaBubble` — balão de mensagem do chat (estilo WhatsApp, encolhe ao conteúdo até ~70%).',
          '- `side="left"` → beneficiário (cinza, à esquerda)',
          '- `side="right"` → atendente/BOT (azul, à direita)',
          '',
          'Suporta segundo parágrafo (`text2`), quick-replies, anexo de arquivo e imagem com selo.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['left', 'right'] },
  },
  args: {
    side: 'right',
    author: 'Juliana Santos',
    text: 'Olá Maria! Recebi sua solicitação. Verifiquei que a imagem da nota fiscal está com baixa resolução. Poderia enviar uma foto mais nítida?',
    time: '23/02/2026 às 16:10',
  },
  render: (args) => ({
    components: { JornadaBubble },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaBubble v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Atendente: Story = {}

export const Beneficiario: Story = {
  args: { side: 'left', author: 'Maria Silva Santos', text: 'Oi! Segue a foto em melhor qualidade' },
}

export const Bot: Story = {
  args: {
    side: 'right',
    author: 'BOT',
    text: 'Identificamos que você tem uma ocorrência em aberto, protocolo 0010020030040050.',
    text2: 'Você gostaria de falar sobre esta ocorrência ou outro assunto?',
    quickReplies: ['Essa ocorrência', 'Outro assunto'],
    time: '27/02/2026 às 10:04',
  },
}

export const Anexo: Story = {
  args: {
    side: 'left',
    author: 'Maria Silva Santos',
    attachment: { name: 'Formulario_Reembolso.pdf' },
    image: { badge: 'Alta qualidade' },
    text: undefined,
  },
}
