import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AtendimentoCard from './AtendimentoCard.vue'

const meta: Meta<typeof AtendimentoCard> = {
  title: 'Atendimento/AtendimentoCard',
  component: AtendimentoCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`AtendimentoCard` representa um atendimento humano **em andamento**: beneficiário, ' +
            'atendente, tempo e SLA. Composto sobre `BaseCard` + `SlaBadge` + `ChannelTag`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    sla: { control: 'inline-radio', options: ['Dentro', 'Atenção', 'Limite', 'Estourou'] },
  },
  args: {
    name: 'Ana Costa',
    atendente: 'Ana Silva',
    tempo: '12min',
    sla: 'Dentro',
    channel: 'WhatsApp',
    interactive: false,
  },
  render: (args) => ({
    components: { AtendimentoCard },
    setup: () => ({ args }),
    template: `<div class="w-72"><AtendimentoCard v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const SlaEstourado: Story = {
  args: { name: 'Helena Almeida', atendente: 'Ana Souza', tempo: '31min', sla: 'Estourou', channel: 'Telefone' },
}
