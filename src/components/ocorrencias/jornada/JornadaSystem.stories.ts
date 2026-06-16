import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaSystem from './JornadaSystem.vue'

const meta: Meta<typeof JornadaSystem> = {
  title: 'Ocorrências/Jornada/System',
  component: JornadaSystem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaSystem` — evento de sistema (Transferência, Início de atendimento, Encaminhamento, Fim da ocorrência...). Cartão cinza com ícone + título, linhas chave/valor, anexo opcional e rodapé com horário + autor. No Figma fica à **direita** (default `align="right"`).',
      },
    },
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
  },
  args: {
    icon: 'chevrons-right',
    title: 'Transferência',
    time: '25/02/2026 às 16:18',
    align: 'right',
    rows: [
      { label: 'Transferido por', value: 'URA' },
      { label: 'Mudança de atendente', value: 'URA → Pedro José' },
      { label: 'Mudança de status', value: 'Em atendimento automatizado → Em atendimento' },
    ],
  },
  render: (args) => ({
    components: { JornadaSystem },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaSystem v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Transferencia: Story = {}

export const Encaminhamento: Story = {
  args: {
    icon: 'chevrons-right',
    title: 'Encaminhamento de atendimento',
    time: '23/02/2026 às 16:15',
    author: 'Juliana Santos',
    rows: [
      { label: 'Encaminhamento realizado por', value: 'Juliana Santos' },
      { label: 'Setor de origem', value: 'Atendimento' },
      { label: 'Setor de destino', value: 'Financeiro' },
    ],
  },
}

export const FimDaOcorrencia: Story = {
  args: {
    icon: 'file-text',
    title: 'Fim da ocorrência',
    time: '29/02/2026 às 11:20',
    attachment: { name: 'reembolsoaprovado_.pdf', size: '0.3mb' },
    rows: [
      { label: 'Atendimento alterado por', value: 'Juliana Santos' },
      { label: 'Status atribuído', value: 'Concluído' },
      { label: 'Motivo do encerramento', value: 'Pedido aprovado' },
    ],
  },
}
