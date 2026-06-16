import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaNote from './JornadaNote.vue'

const meta: Meta<typeof JornadaNote> = {
  title: 'Ocorrências/Jornada/Note',
  component: JornadaNote,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`JornadaNote` — anotação do atendente (cartão tracejado à direita, com autor acima).',
          '- `variant="interna"` → ícone/borda em cinza',
          '- `variant="publica"` → ícone/borda em azul',
          '',
          '`recording=true` substitui o texto pelas linhas de Gravação/Transcrição da chamada.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['interna', 'publica'] },
    recording: { control: 'boolean' },
  },
  args: {
    variant: 'interna',
    author: 'Juliana Santos',
    text: 'Ocorrência assumida para análise. Verificando documentação anexada e consultando tabela de procedimentos cobertos pelo plano Premium Plus.',
    time: '23/02/2026 às 16:00',
    recording: false,
  },
  render: (args) => ({
    components: { JornadaNote },
    setup: () => ({ args }),
    template: `<div class="w-[640px] max-w-full"><JornadaNote v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Interna: Story = {}

export const Publica: Story = {
  args: {
    variant: 'publica',
    text: 'Análise inicial do reembolso realizada com sucesso. Encaminhando para o time financeiro.',
  },
}

export const Gravacao: Story = {
  args: { variant: 'interna', author: 'Sistema', recording: true, text: undefined, time: '25/02/2026 às 16:38' },
}
