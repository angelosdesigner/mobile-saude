import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaChatPill from './JornadaChatPill.vue'

const meta: Meta<typeof JornadaChatPill> = {
  title: 'Ocorrências/Jornada/ChatPill',
  component: JornadaChatPill,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaChatPill` — pílula arredondada de **início/fim de conversa** (contorno cinza, com trilho lateral, centralizada). O ícone vira telefone quando o título menciona "telefone", senão é o balão de chat.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['start', 'end'] },
  },
  args: {
    variant: 'start',
    title: 'Início de conversa via chat',
    time: '23/02/2026 às 16:10',
    rows: [
      { label: 'Canal', value: 'WhatsApp' },
      { label: 'Ação de origem', value: 'Resposta de template' },
      { label: 'Iniciado por', value: 'Maria Santos Silva' },
    ],
  },
  render: (args) => ({
    components: { JornadaChatPill },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaChatPill v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Inicio: Story = {}

export const Fim: Story = {
  args: {
    variant: 'end',
    title: 'Fim da conversa via chat',
    time: '23/02/2026 às 16:15 (5min)',
    rows: [{ label: 'Encerrado por', value: 'Atendente - Juliana Santos' }],
  },
}

export const Telefone: Story = {
  args: {
    variant: 'start',
    title: 'Início de contato via telefone',
    time: '25/02/2026 às 16:15',
    rows: [{ label: 'Iniciado por', value: 'Beneficiário - Maria Santos Silva' }],
  },
}
