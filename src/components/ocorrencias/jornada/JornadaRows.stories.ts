import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaRows from './JornadaRows.vue'

const meta: Meta<typeof JornadaRows> = {
  title: 'Ocorrências/Jornada/Primitivos/Rows',
  component: JornadaRows,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '`JornadaRows` — lista de linhas "Rótulo: valor" (rótulo cinza, valor em negrito); o padrão de informação mais repetido da timeline.',
          '- `cols=2` → duas colunas com **divisor vertical central**',
          '- valores com ` · ` (ex.: "protocolo · data") ganham um divisor vertical entre os segmentos',
          '- `align` centra (eventos/pílulas) ou alinha à esquerda (sistema/template)',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    cols: { control: 'inline-radio', options: [1, 2] },
    align: { control: 'inline-radio', options: ['left', 'center'] },
  },
  args: {
    cols: 1,
    align: 'left',
    rows: [
      { label: 'Protocolo', value: '999999999920260312909202  ·  23/02/2026 16:00' },
      { label: 'Canal de início', value: 'Painel de atendimento' },
      { label: 'Mudança de status', value: 'Novo → Em atendimento' },
    ],
  },
  render: (args) => ({
    components: { JornadaRows },
    setup: () => ({ args }),
    template: `<div class="w-[440px] max-w-full rounded-xl bg-ms-fill-light p-4"><JornadaRows v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const UmaColuna: Story = {}

export const DuasColunas: Story = {
  args: {
    cols: 2,
    rows: [
      { label: 'Solicitante', value: 'Maria Silva Santos' },
      { label: 'Tipo de ocorrência', value: 'Reembolso' },
      { label: 'Assunto', value: 'Solicitação' },
      { label: 'Funcionalidade', value: 'Solicitação de reembolso' },
    ],
  },
}
