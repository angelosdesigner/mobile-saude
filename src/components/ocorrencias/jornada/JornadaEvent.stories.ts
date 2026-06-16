import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaEvent from './JornadaEvent.vue'

const P = '999999999920260312909202'

const meta: Meta<typeof JornadaEvent> = {
  title: 'Ocorrências/Jornada/Event',
  component: JornadaEvent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`JornadaEvent` — cabeçalho de evento da jornada. `tone`:',
          '- **success** → início/abertura (verde, com trilho lateral)',
          '- **danger** → fim/encerramento (vermelho, com trilho lateral)',
          '- **neutral** → criação/finalização/detalhes (cinza, sem trilho)',
          '',
          'No Figma os eventos ficam **centralizados** (`align="center"`); a exceção é a "Anotação interna" de detalhes, que vai à direita.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['success', 'danger', 'neutral'] },
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    cols: { control: 'inline-radio', options: [1, 2] },
  },
  args: {
    tone: 'success',
    icon: 'file-text',
    title: 'Início do atendimento - Juliana Santos',
    align: 'center',
    cols: 1,
    rows: [
      { label: 'Protocolo', value: `${P}  ·  23/02/2026 16:00` },
      { label: 'Canal de início', value: 'Painel de atendimento' },
      { label: 'Mudança de status', value: 'Novo → Em atendimento' },
    ],
  },
  render: (args) => ({
    components: { JornadaEvent },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaEvent v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {}

export const Danger: Story = {
  args: {
    tone: 'danger',
    title: 'Fim do atendimento',
    rows: [
      { label: 'Protocolo', value: `${P}  ·  23/02/2026 às 16:15` },
      { label: 'Tempo de duração', value: '5 minutos' },
      { label: 'SLA restante', value: '48h' },
    ],
  },
}

export const NeutralCriacao: Story = {
  args: {
    tone: 'neutral',
    title: 'Criação da ocorrência',
    meta: '23/02/2026 às 09:06',
    cols: 2,
    rows: [
      { label: 'Protocolo', value: P },
      { label: 'Solicitante', value: 'Maria Silva Santos' },
      { label: 'Tipo de ocorrência', value: 'Reembolso' },
      { label: 'Assunto', value: 'Solicitação' },
    ],
  },
}

export const NeutralFinalizada: Story = {
  args: {
    tone: 'neutral',
    title: 'Ocorrência finalizada',
    meta: '25/02/2026 às 16:40',
    cols: 2,
    rows: [
      { label: 'Protocolo', value: P },
      { label: 'Foi resolvido?', value: 'Sim' },
      { label: 'Cumpriu o SLA?', value: 'Sim' },
    ],
  },
}
