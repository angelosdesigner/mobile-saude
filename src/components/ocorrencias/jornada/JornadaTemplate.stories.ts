import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaTemplate from './JornadaTemplate.vue'

const meta: Meta<typeof JornadaTemplate> = {
  title: 'Ocorrências/Jornada/Template',
  component: JornadaTemplate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaTemplate` — disparo de template ativo (ex.: "Contato ativo via Chat"). Cartão laranja à direita, com autor acima, ícone de envio, chips de canal e linhas de detalhe em 2 colunas.',
      },
    },
  },
  args: {
    author: 'Juliana Santos',
    title: 'Contato ativo via Chat',
    time: '29/02/2026 às 11:20',
    tags: ['WhatsApp', 'Push', 'E-mail'],
    rows: [
      { label: 'Template', value: 'Solicitação de Documentação' },
      { label: 'Origem', value: 'Painel de atendimento' },
      { label: 'Destinatário', value: 'Maria Silva Santos' },
      { label: 'Canal de envio', value: 'Painel de atendimento / API' },
    ],
  },
  render: (args) => ({
    components: { JornadaTemplate },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaTemplate v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
