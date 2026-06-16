import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaForm from './JornadaForm.vue'

const item = [
  { label: 'CPF ou CNPJ', value: '07805206708' },
  { label: 'Cidade', value: 'Brasília' },
  { label: 'Data da despesa', value: '12/02/2026' },
  { label: 'Valor da despesa', value: '400,90' },
]

const meta: Meta<typeof JornadaForm> = {
  title: 'Ocorrências/Jornada/Form',
  component: JornadaForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaForm` — "Envio do formulário" (beneficiário, à esquerda). Espelha fielmente o componente do Figma `8453:29730` ("Vários formulários resumidos"): seção "Tipo de Reembolso" com N `FormularioResumido` + seção "Complemento" → "Dados para pagamento". Largura nativa do design (430px).',
      },
    },
  },
  args: {
    title: 'Envio do formulário',
    itemsTitle: 'Tipo de Reembolso',
    items: [item, item, item],
    complementoTitle: 'Complemento',
    pagamentoTitle: 'Dados para pagamento',
    pagamento: [
      { label: 'Forma de depósito', value: 'PIX' },
      { label: 'Nome do favorecido', value: 'Everson' },
      { label: 'Tipo da chave PIX', value: 'E-mail' },
      { label: 'Chave PIX', value: '123' },
    ],
  },
  render: (args) => ({
    components: { JornadaForm },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaForm v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
