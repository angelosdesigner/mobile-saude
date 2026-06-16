import type { Meta, StoryObj } from '@storybook/vue3-vite'
import JornadaAnexo from './JornadaAnexo.vue'

const meta: Meta<typeof JornadaAnexo> = {
  title: 'Ocorrências/Jornada/Primitivos/Anexo',
  component: JornadaAnexo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`JornadaAnexo` — cartão de arquivo anexado (ícone + nome + tamanho opcional + baixar). Aparece em balões de mensagem e em eventos de sistema.',
      },
    },
  },
  args: { name: 'Formulario_Reembolso.pdf' },
  render: (args) => ({
    components: { JornadaAnexo },
    setup: () => ({ args }),
    template: `<div class="w-[440px] max-w-full rounded-xl bg-ms-fill-light p-3"><JornadaAnexo v-bind="args" /></div>`,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const SemTamanho: Story = {}
export const ComTamanho: Story = { args: { name: 'reembolsoaprovado_.pdf', size: '0.3mb' } }
